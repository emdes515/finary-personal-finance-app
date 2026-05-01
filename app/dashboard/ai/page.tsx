'use client'

import { useState, useRef, useEffect } from 'react'
import { useFinaryStore } from '@/lib/store'
import { useAI } from '@/hooks/useAI'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, User, Bot, Loader2 } from 'lucide-react'
import { calculateKPIs } from '@/lib/calculations'

export default function AIAssistantPage() {
  const { transactions, budgets, goals, currentMonth } = useFinaryStore()
  
  const { sendMessage, loading } = useAI()
  const [input, setInput] = useState('')

  const [messages, setMessages] = useState<any[]>([
    { 
      role: 'assistant', 
      content: "Hi! I'm your Finary AI assistant. I have access to your transaction history and goals. Ask me anything about your finances!" 
    }
  ])

  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async (text: string = input) => {
    if (!text.trim() || loading) return

    const userMessage = { role: 'user', content: text }
    setMessages(prev => [...prev, userMessage])
    setInput('')

    const financialContext = {
      summary: calculateKPIs(transactions, currentMonth),
      recentTransactions: transactions.slice(0, 10),
      budgets,
      goals
    }

    let assistantMessage = { role: 'assistant', content: '' }
    setMessages(prev => [...prev, assistantMessage])

    await sendMessage(
      [...messages, userMessage],
      financialContext,
      (chunk) => {
        setMessages(prev => {
          const last = prev[prev.length - 1]
          const others = prev.slice(0, -1)
          return [...others, { ...last, content: last.content + chunk }]
        })
      }
    )
  }

  const QUICK_QUESTIONS = [
    "How much did I spend on food this month?",
    "Am I on track with my budgets?",
    "Where can I save more money?",
    "Analyze my spending patterns"
  ]

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] md:h-[calc(100vh-160px)] bg-surface border border-border rounded-[32px] overflow-hidden">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-border bg-surface-2 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-glow">
               <Bot className="text-white" size={24} />
            </div>
            <div>
               <h2 className="font-display font-bold">Finary AI</h2>
               <div className="text-[10px] text-accent font-bold uppercase tracking-widest">Powered by NVIDIA Nemotron</div>
            </div>
         </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth">
         <AnimatePresence>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                   <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-accent' : 'bg-surface-3'}`}>
                      {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                   </div>
                   <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                     m.role === 'user' 
                       ? 'bg-accent text-white rounded-tr-none' 
                       : 'bg-surface-2 border border-border rounded-tl-none'
                   }`}>
                      {m.content ? m.content : (
                        loading && i === messages.length - 1 && (
                          <div className="flex flex-col gap-3 min-w-[200px] py-1">
                             <div className="h-3 bg-accent/10 rounded-full w-full animate-pulse relative overflow-hidden">
                                <motion.div 
                                  className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent"
                                  animate={{ x: ['-100%', '100%'] }}
                                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                />
                             </div>
                             <div className="h-3 bg-accent/10 rounded-full w-5/6 animate-pulse relative overflow-hidden">
                                <motion.div 
                                  className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent"
                                  animate={{ x: ['-100%', '100%'] }}
                                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.2 }}
                                />
                             </div>
                             <div className="h-3 bg-accent/10 rounded-full w-4/6 animate-pulse relative overflow-hidden">
                                <motion.div 
                                  className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent"
                                  animate={{ x: ['-100%', '100%'] }}
                                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.4 }}
                                />
                             </div>
                          </div>
                        )
                      )}
                   </div>
                </div>
              </motion.div>
            ))}
         </AnimatePresence>
      </div>

      {/* Quick Actions */}
      <div className="px-6 py-4 border-t border-border bg-surface-2/50 overflow-x-auto">
         <div className="flex gap-2 whitespace-nowrap">
            {QUICK_QUESTIONS.map(q => (
              <button 
                key={q}
                onClick={() => handleSend(q)}
                className="px-4 py-2 bg-surface-2 border border-border hover:border-accent/50 rounded-full text-xs font-bold transition-all whitespace-nowrap"
              >
                {q}
              </button>
            ))}
         </div>
      </div>

      {/* Input */}
      <div className="p-6 border-t border-border bg-surface-2">
         <form 
           onSubmit={(e) => { e.preventDefault(); handleSend(); }}
           className="relative"
         >
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your finances..."
              className="w-full bg-bg border border-border rounded-2xl py-4 pl-6 pr-14 text-sm focus:border-accent outline-none transition-all shadow-inner"
            />
            <button 
              type="submit"
              disabled={loading || !input.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-accent text-white rounded-xl flex items-center justify-center hover:brightness-110 disabled:opacity-50 disabled:grayscale transition-all"
            >
               {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            </button>
         </form>
      </div>
    </div>
  )
}
