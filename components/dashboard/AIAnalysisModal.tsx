'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Loader2, Download, Share2, AlertCircle } from 'lucide-react'
import { useAI } from '@/hooks/useAI'
import { useFinaryStore } from '@/lib/store'
import ReactMarkdown from 'react-markdown'

interface AIAnalysisModalProps {
  isOpen: boolean
  onClose: () => void
  type?: 'general' | 'depth' | 'category'
  context?: any
}

export default function AIAnalysisModal({ isOpen, onClose, type = 'general', context }: AIAnalysisModalProps) {
  const { sendMessage, loading } = useAI()
  const { transactions, currentMonth, budgets, goals, settings } = useFinaryStore()
  const [analysis, setAnalysis] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [hasAttempted, setHasAttempted] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleGenerate = useCallback(async () => {
    setAnalysis('')
    setError(null)
    setHasAttempted(true)
    
    const financialContext = {
      summary: {
        currentMonth,
        transactionCount: transactions.length,
        totalExpenses: transactions.filter(t => t.date.startsWith(currentMonth) && t.type === 'expense').reduce((acc, t) => acc + t.amount, 0),
        totalIncome: transactions.filter(t => t.date.startsWith(currentMonth) && t.type === 'income').reduce((acc, t) => acc + t.amount, 0),
      },
      recentTransactions: transactions.slice(0, 50),
      budgets: budgets.filter(b => b.month === currentMonth),
      goals: goals,
      ...context
    }

    let prompt = ''
    if (type === 'depth') {
      prompt = "Provide a deep, comprehensive analysis of my financial situation. Look for hidden patterns, suggest advanced optimization strategies, and evaluate my progress towards goals. Be very detailed."
    } else if (type === 'category') {
      prompt = `Analyze my spending patterns in the following categories: ${context?.categories?.join(', ') || 'all categories'}. Identify where I'm overspending and provide a 3-step action plan.`
    } else {
      prompt = "Give me a quick overview of my finances this month. What's the biggest thing I should notice? Give me 3 actionable tips."
    }

    try {
      await sendMessage(
        [{ role: 'user', content: prompt }],
        financialContext,
        (chunk) => setAnalysis(prev => prev + chunk)
      )
    } catch (err: any) {
      setError(err.message || 'Failed to generate analysis')
    }
  }, [currentMonth, transactions, budgets, goals, context, type, sendMessage])

  useEffect(() => {
    if (isOpen && !analysis && !hasAttempted && !loading && !error) {
      handleGenerate()
    }
  }, [isOpen, analysis, hasAttempted, loading, error, handleGenerate])

  useEffect(() => {
    if (!isOpen) {
      setHasAttempted(false)
      setAnalysis('')
      setError(null)
    }
  }, [isOpen])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [analysis])

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
            className="relative w-full max-w-2xl bg-surface border border-border rounded-[32px] overflow-hidden shadow-2xl shadow-accent/10 flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-8 border-b border-border flex items-center justify-between bg-surface/50 backdrop-blur-sm sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold">AI Financial Analysis</h2>
                  <p className="text-xs text-text-faint font-bold uppercase tracking-wider">{type} Analysis</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-text-muted transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div 
              ref={scrollRef}
              className="p-8 overflow-y-auto flex-1 prose prose-invert prose-p:text-text-muted prose-headings:text-text prose-strong:text-accent max-w-none custom-scrollbar"
            >
              {error && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center text-error mb-4">
                    <AlertCircle size={32} />
                  </div>
                  <p className="text-lg font-medium text-text mb-2">Analysis Failed</p>
                  <p className="text-sm text-text-muted max-w-md mx-auto">{error}</p>
                </div>
              )}

              {!analysis && !error && loading && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Loader2 size={48} className="text-accent animate-spin mb-4" />
                  <p className="text-lg font-medium text-text-muted">Finary is analyzing your data...</p>
                  <p className="text-sm text-text-faint">This usually takes a few seconds</p>
                </div>
              )}
              
              {analysis && (
                <div className="space-y-4">
                  <ReactMarkdown>{analysis}</ReactMarkdown>
                  {loading && (
                    <motion.div 
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="w-2 h-4 bg-accent inline-block ml-1"
                    />
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border bg-surface-2/50 flex items-center justify-between">
              <div className="flex gap-2">
                <button className="p-3 rounded-xl bg-surface-3 border border-border text-text-muted hover:text-text transition-colors">
                  <Download size={18} />
                </button>
                <button className="p-3 rounded-xl bg-surface-3 border border-border text-text-muted hover:text-text transition-colors">
                  <Share2 size={18} />
                </button>
              </div>
              <button 
                onClick={handleGenerate}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-accent text-white font-bold rounded-xl hover:brightness-110 disabled:opacity-50 transition-all"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                {error ? 'Try Again' : 'Regenerate'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
