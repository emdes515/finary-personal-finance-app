'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Search, Plus } from 'lucide-react'
import { useFinaryStore } from '@/lib/store'
import { Transaction } from '@/lib/types'

const CATEGORIES = [
  { name: 'Food', emoji: '🍕' },
  { name: 'Housing', emoji: '🏠' },
  { name: 'Transport', emoji: '🚗' },
  { name: 'Shopping', emoji: '🛒' },
  { name: 'Health', emoji: '💊' },
  { name: 'Gaming', emoji: '🎮' },
  { name: 'Work', emoji: '💼' },
  { name: 'Education', emoji: '📚' },
]

interface AddTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  editTransaction?: Transaction
}

export default function AddTransactionModal({ isOpen, onClose, editTransaction }: AddTransactionModalProps) {
  const addTransaction = useFinaryStore((state) => state.addTransaction)
  const updateTransaction = useFinaryStore((state) => state.updateTransaction)

  const [type, setType] = useState<'expense' | 'income'>('expense')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Food')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const resetForm = () => {
    setType('expense')
    setAmount('')
    setDescription('')
    setCategory('Food')
    setDate(new Date().toISOString().split('T')[0])
  }

  useEffect(() => {
    if (editTransaction) {
      setType(editTransaction.type)
      setAmount(editTransaction.amount.toString())
      setDescription(editTransaction.description)
      setCategory(editTransaction.category)
      setDate(editTransaction.date)
    } else {
      resetForm()
    }
  }, [editTransaction, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      type,
      amount: parseFloat(amount),
      description,
      category,
      date,
    }

    if (editTransaction) {
      updateTransaction(editTransaction.id, data)
    } else {
      addTransaction(data)
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
                  {editTransaction ? 'Edit Transaction' : 'Add Transaction'}
                </h2>
                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-text-muted">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Type Toggle */}
                <div className="flex p-1 bg-surface-2 rounded-2xl border border-border">
                  <button
                    type="button"
                    onClick={() => setType('expense')}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                      type === 'expense' ? 'bg-red text-white shadow-lg' : 'text-text-muted hover:text-text'
                    }`}
                  >
                    💸 Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('income')}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                      type === 'income' ? 'bg-green text-white shadow-lg' : 'text-text-muted hover:text-text'
                    }`}
                  >
                    💰 Income
                  </button>
                </div>

                {/* Amount Input */}
                <div className="space-y-2">
                   <label className="text-xs font-bold text-text-faint uppercase tracking-widest">Amount</label>
                   <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-display font-bold text-text-muted">$</span>
                      <input 
                        type="number" 
                        step="0.01"
                        required
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-surface-2 border border-border rounded-2xl py-6 pl-12 pr-6 text-3xl font-display font-bold focus:border-accent focus:ring-0 outline-none transition-colors"
                      />
                   </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                   <label className="text-xs font-bold text-text-faint uppercase tracking-widest">Description</label>
                   <input 
                     type="text" 
                     required
                     value={description}
                     onChange={(e) => setDescription(e.target.value)}
                     placeholder="What was this for?"
                     className="w-full bg-surface-2 border border-border rounded-2xl p-4 text-sm font-medium focus:border-accent outline-none transition-colors"
                   />
                </div>

                {/* Category Picker */}
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

                {/* Date */}
                <div className="space-y-2">
                   <label className="text-xs font-bold text-text-faint uppercase tracking-widest">Date</label>
                   <input 
                     type="date" 
                     required
                     value={date}
                     onChange={(e) => setDate(e.target.value)}
                     className="w-full bg-surface-2 border border-border rounded-2xl p-4 text-sm font-medium focus:border-accent outline-none transition-colors"
                   />
                </div>

                <button 
                  type="submit"
                  className="w-full py-5 bg-accent text-white font-bold rounded-2xl shadow-glow hover:brightness-110 active:scale-95 transition-all text-lg mt-4"
                >
                  {editTransaction ? 'Save Changes' : 'Add Transaction'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
