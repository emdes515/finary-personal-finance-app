'use client'

import { useMemo, useState } from 'react'
import { useFinaryStore } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, AlertTriangle, TrendingDown, Trash2 } from 'lucide-react'
import AddBudgetModal from '@/components/dashboard/AddBudgetModal'
import ConfirmationModal from '@/components/ui/ConfirmationModal'

export default function BudgetsPage() {
  const { transactions, budgets, addBudget, deleteBudget, currentMonth } = useFinaryStore()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [budgetToDelete, setBudgetToDelete] = useState<string | null>(null)

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-').map(Number)
    const date = new Date(year, month - 1, 1)
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }
  
  const budgetData = useMemo(() => {
    const safeBudgets = Array.isArray(budgets) ? budgets : []
    const safeTransactions = Array.isArray(transactions) ? transactions : []

    return safeBudgets
      .filter(b => b && b.month === currentMonth)
      .map(budget => {
        const spent = safeTransactions
          .filter(t => t && t.category === budget.category && t.date && t.date.startsWith(currentMonth) && t.type === 'expense')
          .reduce((acc, t) => acc + t.amount, 0)
        
        const percent = budget.limit > 0 ? Math.min((spent / budget.limit) * 100, 100) : 0
        const remaining = budget.limit - spent
        
        return { ...budget, spent, percent, remaining }
      })
  }, [budgets, transactions, currentMonth])

  return (
    <div className="space-y-8">
      <AddBudgetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      <ConfirmationModal
        isOpen={!!budgetToDelete}
        onClose={() => setBudgetToDelete(null)}
        onConfirm={() => budgetToDelete && deleteBudget(budgetToDelete)}
        title="Delete Budget"
        message="Are you sure you want to delete this budget? This will not delete your transactions."
      />

      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-display font-bold">{formatMonth(currentMonth)} Budgets</h2>
         <button 
           onClick={() => setIsModalOpen(true)}
           className="bg-accent/10 text-accent border border-accent/20 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-accent hover:text-white transition-all"
         >
            <Plus size={18} />
            New Budget
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {budgetData.map((b) => (
          <motion.div 
            key={b.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`bg-surface border p-8 rounded-[32px] relative overflow-hidden group ${
              b.percent > 100 ? 'border-red/50 shadow-lg shadow-red/5' : b.percent > 85 ? 'border-yellow/50' : 'border-border'
            }`}
          >
             <button
               onClick={() => setBudgetToDelete(b.id)}
               className="absolute top-6 right-6 p-2 text-text-faint hover:text-red hover:bg-red/10 rounded-xl transition-all opacity-0 group-hover:opacity-100 z-20"
             >
               <Trash2 size={18} />
             </button>

             {b.percent > 85 && (
               <motion.div 
                 animate={{ opacity: [0.1, 0.3, 0.1] }}
                 transition={{ duration: 2, repeat: Infinity }}
                 className={`absolute inset-0 ${b.percent > 100 ? 'bg-red' : 'bg-yellow'}`}
               />
             )}
             
             <div className="relative z-10">
                <div className="flex items-center justify-between mb-6 pr-8">
                   <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-surface-2 border border-border flex items-center justify-center text-2xl">
                        {b.category === 'Food' ? '🍕' : 
                         b.category === 'Housing' ? '🏠' : 
                         b.category === 'Transport' ? '🚗' : 
                         b.category === 'Shopping' ? '🛍️' : 
                         b.category === 'Entertainment' ? '🎬' : 
                         b.category === 'Health' ? '🏥' : '💰'}
                      </div>
                      <h3 className="text-xl font-display font-bold">{b.category}</h3>
                   </div>
                   <div className="text-right">
                      <div className="text-xs text-text-faint font-bold uppercase tracking-widest">Limit</div>
                      <div className="font-display font-bold text-xl">${b.limit.toLocaleString()}</div>
                   </div>
                </div>

                <div className="flex justify-between text-sm mb-2">
                   <span className="text-text-muted">
                     <span className="font-bold text-text">${b.spent.toLocaleString()}</span> spent
                   </span>
                   <span className="font-bold">{b.percent.toFixed(1)}%</span>
                </div>

                <div className="h-4 bg-surface-2 rounded-full overflow-hidden border border-border">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${b.percent}%` }}
                     transition={{ duration: 1, ease: 'easeOut' }}
                     className={`h-full transition-colors ${
                       b.percent > 100 ? 'bg-red' : b.percent > 85 ? 'bg-yellow' : 'bg-accent'
                     }`}
                   />
                </div>

                <div className="mt-6 p-4 rounded-2xl bg-surface-2 border border-border flex items-start gap-3">
                   {b.percent > 85 ? (
                     <AlertTriangle size={18} className={b.percent > 100 ? 'text-red' : 'text-yellow'} />
                   ) : (
                     <TrendingDown size={18} className="text-accent" />
                   )}
                   <div className="text-xs leading-relaxed">
                      {b.remaining > 0 ? (
                        <>
                          <span className="font-bold">⚠️ Only ${b.remaining.toLocaleString()} remaining.</span><br/>
                          <span className="text-text-faint">You have 12 days left this month. skip 2 restaurant meals to stay on track.</span>
                        </>
                      ) : (
                        <>
                          <span className="font-bold text-red">🚨 Budget Exceeded by ${Math.abs(b.remaining).toLocaleString()}.</span><br/>
                          <span className="text-text-faint">Consider adjusting other categories to compensate this month.</span>
                        </>
                      )}
                   </div>
                </div>
             </div>
          </motion.div>
        ))}

        {budgetData.length === 0 && (
           <div className="lg:col-span-2 flex flex-col items-center justify-center py-20 px-4 bg-surface/50 border border-dashed border-border rounded-[48px] text-center">
              <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center text-4xl mb-6 shadow-glow shadow-accent/5">
                🎯
              </div>
              <h3 className="text-2xl font-display font-bold mb-3">Master Your Spending</h3>
              <p className="text-text-muted mb-8 max-w-sm mx-auto leading-relaxed font-medium">
                Set monthly limits for categories like Food, Shopping or Housing to take control of your money.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="px-8 py-4 bg-accent text-white font-bold rounded-2xl shadow-glow hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Plus size={20} />
                  Create Your First Budget
                </button>
                <button 
                  onClick={() => {
                    const sampleBudgets = [
                      { category: 'Food', limit: 800, month: currentMonth },
                      { category: 'Housing', limit: 1200, month: currentMonth },
                      { category: 'Transport', limit: 300, month: currentMonth },
                      { category: 'Entertainment', limit: 200, month: currentMonth }
                    ]
                    sampleBudgets.forEach(b => addBudget(b))
                  }}
                  className="px-8 py-4 bg-surface-2 text-text hover:bg-surface-3 font-bold rounded-2xl border border-border transition-all active:scale-95"
                >
                  Add Sample Budgets
                </button>
              </div>
           </div>
        )}
      </div>
    </div>
  )
}
