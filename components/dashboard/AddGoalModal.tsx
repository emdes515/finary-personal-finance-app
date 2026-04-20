'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Loader2 } from 'lucide-react'
import { useFinaryStore } from '@/lib/store'
import { Goal } from '@/lib/types'
import AISuggestionSkeleton from './AISuggestionSkeleton'

interface AddGoalModalProps {
  isOpen: boolean
  onClose: () => void
  editGoal?: Goal
}

const EMOJIS = ['💰', '🚗', '🏠', '✈️', '💍', '🎓', '🏖️', '💻', '🚲', '⌚', '🎮', '📱', '📺', '🎸', '👟', '🍕', '☕', '🛠️', '🏥', '🌱']

export default function AddGoalModal({ isOpen, onClose, editGoal }: AddGoalModalProps) {
  const addGoal = useFinaryStore((state) => state.addGoal)
  const updateGoal = useFinaryStore((state) => state.updateGoal)
  const transactions = useFinaryStore((state) => state.transactions)

  const [name, setName] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [currentAmount, setCurrentAmount] = useState('0')
  const [deadline, setDeadline] = useState(new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
  const [emoji, setEmoji] = useState('💰')
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const resetForm = () => {
    setName('')
    setTargetAmount('')
    setCurrentAmount('0')
    setDeadline(new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
    setEmoji('💰')
    setAiSuggestion(null)
    setShowEmojiPicker(false)
  }

  useEffect(() => {
    if (editGoal) {
      setName(editGoal.name)
      setTargetAmount(editGoal.targetAmount.toString())
      setCurrentAmount(editGoal.currentAmount.toString())
      setDeadline(editGoal.deadline)
      setEmoji(editGoal.emoji)
    } else {
      resetForm()
    }
  }, [editGoal, isOpen])

  const handleAiSuggest = async () => {
    if (!name) {
      alert("Please enter a goal name first.");
      return;
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
            content: `I want to save for "${name}". Based on standard prices and financial logic, suggest a target amount and a timeline. Format: [amount] | [short advice]` 
          }],
          financialContext: { transactions: transactions.slice(0, 50) }
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
        setTargetAmount(numberMatch[0])
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
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount),
      deadline,
      emoji,
    }

    if (editGoal) {
      updateGoal(editGoal.id, data)
    } else {
      addGoal(data)
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
                  {editGoal ? 'Edit Goal' : 'Add Goal'}
                </h2>
                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-text-muted">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="flex gap-4 items-end">
                  <div className="space-y-2 relative">
                     <label className="text-xs font-bold text-text-faint uppercase tracking-widest">Icon</label>
                     <button
                       type="button"
                       onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                       className="w-14 h-14 bg-surface-2 border border-border rounded-2xl flex items-center justify-center text-2xl hover:border-accent transition-colors"
                     >
                       {emoji}
                     </button>
                     
                     {showEmojiPicker && (
                       <div className="absolute top-full left-0 mt-2 p-3 bg-surface-3 border border-border rounded-2xl shadow-2xl z-30 grid grid-cols-5 gap-2 w-48">
                         {EMOJIS.map(e => (
                           <button
                             key={e}
                             type="button"
                             onClick={() => {
                               setEmoji(e)
                               setShowEmojiPicker(false)
                             }}
                             className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg transition-all"
                           >
                             {e}
                           </button>
                         ))}
                       </div>
                     )}
                  </div>
                  <div className="space-y-2 flex-1">
                     <label className="text-xs font-bold text-text-faint uppercase tracking-widest">Name</label>
                     <input 
                       type="text" 
                       required
                       value={name}
                       onChange={(e) => setName(e.target.value)}
                       placeholder="E.g. New Car"
                       className="w-full h-14 bg-surface-2 border border-border rounded-2xl px-4 text-sm font-medium focus:border-accent outline-none transition-colors"
                     />
                  </div>
                </div>

                <div className="space-y-2">
                   <div className="flex items-center justify-between">
                     <label className="text-xs font-bold text-text-faint uppercase tracking-widest">Target Amount</label>
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
                        value={targetAmount}
                        onChange={(e) => setTargetAmount(e.target.value)}
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
                      AI Planning
                    </div>
                    {aiSuggestion.split('|')[1] || aiSuggestion}
                  </motion.div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-text-faint uppercase tracking-widest">Current</label>
                     <input 
                       type="number" 
                       step="0.01"
                       required
                       value={currentAmount}
                       onChange={(e) => setCurrentAmount(e.target.value)}
                       className="w-full bg-surface-2 border border-border rounded-2xl p-4 text-sm font-medium focus:border-accent outline-none transition-colors"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-text-faint uppercase tracking-widest">Deadline</label>
                     <input 
                       type="date" 
                       required
                       value={deadline}
                       onChange={(e) => setDeadline(e.target.value)}
                       className="w-full bg-surface-2 border border-border rounded-2xl p-4 text-sm font-medium focus:border-accent outline-none transition-colors"
                     />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-5 bg-accent text-white font-bold rounded-2xl shadow-glow hover:brightness-110 active:scale-95 transition-all text-lg mt-4"
                >
                  {editGoal ? 'Save Changes' : 'Create Goal'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
