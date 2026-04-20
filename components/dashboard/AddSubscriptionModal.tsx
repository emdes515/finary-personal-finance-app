'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Loader2, CreditCard, Landmark } from 'lucide-react'
import { useFinaryStore } from '@/lib/store'
import { Subscription } from '@/lib/types'
import AISuggestionSkeleton from './AISuggestionSkeleton'

interface AddSubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  editSubscription?: Subscription
}

const POPULAR_SERVICES = [
  { name: 'Netflix', icon: '📺', category: 'Entertainment' },
  { name: 'Spotify', icon: '🎵', category: 'Entertainment' },
  { name: 'YouTube', icon: '🎥', category: 'Entertainment' },
  { name: 'Disney+', icon: '🏰', category: 'Entertainment' },
  { name: 'HBO Max', icon: '🎬', category: 'Entertainment' },
  { name: 'GitHub', icon: '💻', category: 'Education' },
  { name: 'ChatGPT', icon: '🤖', category: 'Education' },
  { name: 'Adobe', icon: '🎨', category: 'Shopping' },
  { name: 'Amazon Prime', icon: '📦', category: 'Shopping' },
  { name: 'Apple One', icon: '🍎', category: 'Entertainment' },
]

export default function AddSubscriptionModal({ isOpen, onClose, editSubscription }: AddSubscriptionModalProps) {
  const addSubscription = useFinaryStore((state) => state.addSubscription)
  const updateSubscription = useFinaryStore((state) => state.updateSubscription)

  const [name, setName] = useState('')
  const [cost, setCost] = useState('')
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [category, setCategory] = useState('Entertainment')
  const [nextBillingDate, setNextBillingDate] = useState(new Date().toISOString().split('T')[0])
  const [isFixed, setIsFixed] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null)
  const [selectedIcon, setSelectedIcon] = useState('💳')

  const resetForm = () => {
    setName('')
    setCost('')
    setBillingCycle('monthly')
    setCategory('Entertainment')
    setNextBillingDate(new Date().toISOString().split('T')[0])
    setIsFixed(false)
    setAiSuggestion(null)
    setSelectedIcon('💳')
  }

  useEffect(() => {
    if (editSubscription) {
      setName(editSubscription.name)
      setCost(editSubscription.cost.toString())
      setBillingCycle(editSubscription.billingCycle)
      setCategory(editSubscription.category)
      setNextBillingDate(editSubscription.nextBillingDate)
      setIsFixed(editSubscription.isFixed)
      setSelectedIcon(editSubscription.icon || '💳')
    } else {
      resetForm()
    }
  }, [editSubscription, isOpen])

  const handleServiceSelect = (service: typeof POPULAR_SERVICES[0]) => {
    setName(service.name)
    setCategory(service.category)
    setSelectedIcon(service.icon)
  }

  const handleAiSuggest = async () => {
    if (!name) {
      alert("Please enter a name first (e.g. Netflix).")
      return
    }
    
    setIsGenerating(true)
    setAiSuggestion(null)
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [{ 
            role: 'user', 
            content: `I want to add a recurring payment for "${name}". Suggest the typical cost and billing cycle. Format: [cost] | [billing_cycle: monthly/yearly] | [short advice]` 
          }],
        }),
      })

      if (!response.ok) throw new Error('Failed')
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let result = ''
      while (reader) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')
        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.choices[0].delta.content) {
                result += data.choices[0].delta.content
                setAiSuggestion(result)
              }
            } catch(e) {}
          }
        }
      }
      
      const parts = result.split('|')
      const costMatch = parts[0].match(/\d+(\.\d+)?/)
      if (costMatch) setCost(costMatch[0])
      
      if (parts[1]) {
        const cycle = parts[1].toLowerCase().trim()
        if (cycle.includes('yearly')) setBillingCycle('yearly')
        else setBillingCycle('monthly')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      name,
      cost: parseFloat(cost),
      billingCycle,
      category,
      nextBillingDate,
      isFixed,
      icon: selectedIcon
    }

    if (editSubscription) {
      updateSubscription(editSubscription.id, data)
    } else {
      addSubscription(data)
    }
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-bg/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-lg bg-surface border border-border rounded-[32px] overflow-hidden shadow-2xl shadow-accent/10 flex flex-col max-h-[90vh]"
          >
            <div className="p-8 overflow-y-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-display font-bold">
                  {editSubscription ? 'Edit Payment' : 'Add Recurring Payment'}
                </h2>
                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-text-muted">
                  <X size={24} />
                </button>
              </div>

              {!editSubscription && !isFixed && (
                <div className="mb-8">
                  <label className="text-xs font-bold text-text-faint uppercase tracking-widest mb-3 block">Popular Services</label>
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {POPULAR_SERVICES.map(service => (
                      <button
                        key={service.name}
                        type="button"
                        onClick={() => handleServiceSelect(service)}
                        className={`px-4 py-2 rounded-xl border whitespace-nowrap transition-all flex items-center gap-2 ${
                          name === service.name ? 'bg-accent border-accent text-white shadow-lg shadow-accent/20' : 'bg-surface-2 border-border text-text-muted hover:border-accent/40'
                        }`}
                      >
                        <span>{service.icon}</span>
                        <span className="text-xs font-bold">{service.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="flex p-1 bg-surface-2 rounded-2xl border border-border">
                  <button
                    type="button"
                    onClick={() => setIsFixed(false)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                      !isFixed ? 'bg-accent text-white shadow-md' : 'text-text-muted hover:text-text'
                    }`}
                  >
                    <CreditCard size={18} />
                    Subscription
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFixed(true)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                      isFixed ? 'bg-accent text-white shadow-md' : 'text-text-muted hover:text-text'
                    }`}
                  >
                    <Landmark size={18} />
                    Fixed Cost
                  </button>
                </div>

                <div className="space-y-2">
                   <div className="flex items-center justify-between">
                     <label className="text-xs font-bold text-text-faint uppercase tracking-widest">Name</label>
                     <button
                       type="button"
                       onClick={handleAiSuggest}
                       disabled={isGenerating}
                       className="text-xs font-bold text-accent flex items-center gap-1 hover:brightness-125 transition-all"
                     >
                       {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                       AI Suggest Price
                     </button>
                   </div>
                   <div className="flex gap-3">
                     <div className="w-14 h-14 bg-surface-2 border border-border rounded-2xl flex items-center justify-center text-2xl shrink-0">
                        {selectedIcon}
                     </div>
                     <input 
                       type="text" 
                       required
                       value={name}
                       onChange={(e) => setName(e.target.value)}
                       placeholder={isFixed ? "E.g. Rent, Electricity" : "E.g. Netflix, Spotify"}
                       className="w-full h-14 bg-surface-2 border border-border rounded-2xl px-4 text-sm font-medium focus:border-accent outline-none transition-colors"
                     />
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-bold text-text-faint uppercase tracking-widest">Amount / Cost</label>
                   <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-display font-bold text-text-muted">$</span>
                      <input 
                        type="number" 
                        step="0.01"
                        required
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-surface-2 border border-border rounded-2xl py-6 pl-12 pr-6 text-3xl font-display font-bold focus:border-accent focus:ring-0 outline-none transition-colors"
                      />
                   </div>
                </div>

                {isGenerating && <AISuggestionSkeleton />}
                
                {!isGenerating && aiSuggestion && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-accent/5 border border-accent/20 rounded-2xl p-4 text-xs italic text-text-muted"
                  >
                    <div className="flex items-center gap-2 mb-1 text-accent font-bold not-italic">
                      <Sparkles size={14} />
                      AI Insight
                    </div>
                    {aiSuggestion.split('|')[2] || aiSuggestion}
                  </motion.div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-text-faint uppercase tracking-widest">Billing Cycle</label>
                     <select 
                       value={billingCycle}
                       onChange={(e) => setBillingCycle(e.target.value as any)}
                       className="w-full h-14 bg-surface-2 border border-border rounded-2xl px-4 text-sm font-medium focus:border-accent outline-none transition-colors appearance-none"
                     >
                       <option value="monthly">Monthly</option>
                       <option value="yearly">Yearly</option>
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-text-faint uppercase tracking-widest">Next Due Date</label>
                     <input 
                       type="date" 
                       required
                       value={nextBillingDate}
                       onChange={(e) => setNextBillingDate(e.target.value)}
                       className="w-full h-14 bg-surface-2 border border-border rounded-2xl px-4 text-sm font-medium focus:border-accent outline-none transition-colors"
                     />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-5 bg-accent text-white font-bold rounded-2xl shadow-glow hover:brightness-110 active:scale-95 transition-all text-lg mt-4"
                >
                  {editSubscription ? 'Save Changes' : 'Add Payment'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
