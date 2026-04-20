'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Loader2 } from 'lucide-react'
import { useFinaryStore } from '@/lib/store'
import { Budget } from '@/lib/types'
import AISuggestionSkeleton from './AISuggestionSkeleton'

const CATEGORIES = [
  { name: 'Food', emoji: '🍕' },
  { name: 'Housing', emoji: '🏠' },
  { name: 'Transport', emoji: '🚗' },
  { name: 'Shopping', emoji: '🛒' },
  { name: 'Health', emoji: '💊' },
  { name: 'Gaming', emoji: '🎮' },
  { name: 'Education', emoji: '📚' },
  { name: 'Entertainment', emoji: '🍿' },
]

interface AddBudgetModalProps {
  isOpen: boolean
  onClose: () => void
  editBudget?: Budget
}

export default function AddBudgetModal({ isOpen, onClose, editBudget }: AddBudgetModalProps) {
  const addBudget = useFinaryStore((state) => state.addBudget)
  const updateBudget = useFinaryStore((state) => state.updateBudget)
  const transactions = useFinaryStore((state) => state.transactions)

  const [category, setCategory] = useState('Food')
  const [limit, setLimit] = useState('')
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7))
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null)

  const resetForm = () => {
    setCategory('Food')
    setLimit('')
    setMonth(new Date().toISOString().slice(0, 7))
    setAiSuggestion(null)
  }

  useEffect(() => {
    if (editBudget) {
      setCategory(editBudget.category)
      setLimit(editBudget.limit.toString())
      setMonth(editBudget.month)
    } else {
      resetForm()
    }
  }, [editBudget, isOpen])

  const handleAiSuggest = async () => {
    setIsGenerating(true)
    setAiSuggestion(null)
    try {
      const safeTransactions = Array.isArray(transactions) ? transactions : []
      const financialContext = {
        transactions: safeTransactions.slice(0, 100),
        category: category
      }
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [{ 
            role: 'user', 
            content: `Analyze my spending in "${category}" and suggest a realistic monthly budget limit. Explain why in 2 short sentences and provide the number. format: [number] | [explanation]` 
          }],
          financialContext
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
      const numberMatch = parts[0].match(/\d+/)
      if (numberMatch) {
        setLimit(numberMatch[0])
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
      category,
      limit: parseFloat(limit),
      month,
    }

    if (editBudget) {
      updateBudget(editBudget.id, data)
    } else {
      addBudget(data)
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
            className="relative w-full max-w-lg bg-surface border border-border rounded-[32px] overflow-hidden shadow-2xl shadow-accent/10"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-display font-bold">
                  {editBudget ? 'Edit Budget' : 'Add Budget'}
                </h2>
                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-text-muted">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-text-faint uppercase tracking-widest">Category</label>
                   <div className="grid grid-cols-4 gap-2">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.name}
                          type="button"
                          onClick={() => setCategory(cat.name)}
                          className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                            category === cat.name 
                              ? 'bg-accent/10 border-accent text-accent shadow-sm' 
                              : 'bg-surface-2 border-border text-text-muted hover:border-border-hover'
                          }`}
                        >
                          <span className="text-xl mb-1">{cat.emoji}</span>
                          <span className="text-[10px] font-bold uppercase">{cat.name}</span>
                        </button>
                      ))}
                   </div>
                </div>

                <div className="space-y-2">
                   <div className="flex items-center justify-between">
                     <label className="text-xs font-bold text-text-faint uppercase tracking-widest">Limit</label>
                     <button
                       type="button"
                       onClick={handleAiSuggest}
                       disabled={isGenerating}
                       className="text-xs font-bold text-accent flex items-center gap-1 hover:brightness-125 transition-all"
                     >
                       {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                       AI Suggest
                     </button>
                   </div>
                   <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-display font-bold text-text-muted">$</span>
                      <input 
                        type="number" 
                        step="0.01"
                        required
                        value={limit}
                        onChange={(e) => setLimit(e.target.value)}
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
                      AI Analysis
                    </div>
                    {aiSuggestion.split('|')[1] || aiSuggestion}
                  </motion.div>
                )}

                <div className="space-y-2">
                   <label className="text-xs font-bold text-text-faint uppercase tracking-widest">Month</label>
                   <input 
                     type="month" 
                     required
                     value={month}
                     onChange={(e) => setMonth(e.target.value)}
                     className="w-full bg-surface-2 border border-border rounded-2xl p-4 text-sm font-medium focus:border-accent outline-none transition-colors"
                   />
                </div>

                <button 
                  type="submit"
                  className="w-full py-5 bg-accent text-white font-bold rounded-2xl shadow-glow hover:brightness-110 active:scale-95 transition-all text-lg mt-4"
                >
                  {editBudget ? 'Save Changes' : 'Create Budget'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
