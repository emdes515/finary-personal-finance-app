'use client'

import { useMemo, useState } from 'react'
import { useFinaryStore } from '@/lib/store'
import { motion } from 'framer-motion'
import { Plus, Target, Calendar, TrendingUp, Trash2 } from 'lucide-react'
import AddGoalModal from '@/components/dashboard/AddGoalModal'
import ConfirmationModal from '@/components/ui/ConfirmationModal'

export default function GoalsPage() {
  const goals = useFinaryStore((state) => state.goals)
  const addGoal = useFinaryStore((state) => state.addGoal)
  const deleteGoal = useFinaryStore((state) => state.deleteGoal)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null)

  return (
    <div className="space-y-8">
      <AddGoalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      <ConfirmationModal
        isOpen={!!goalToDelete}
        onClose={() => setGoalToDelete(null)}
        onConfirm={() => goalToDelete && deleteGoal(goalToDelete)}
        title="Delete Goal"
        message="Are you sure you want to delete this goal? This action cannot be undone."
      />

      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-display font-bold">Financial Goals</h2>
         <button 
           onClick={() => setIsModalOpen(true)}
           className="bg-accent/10 text-accent border border-accent/20 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-accent hover:text-white transition-all"
         >
            <Plus size={18} />
            New Goal
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {goals.map((g) => {
          const percent = (g.currentAmount / g.targetAmount) * 100
          const remaining = g.targetAmount - g.currentAmount
          const monthsLeft = 3 // Simple mock
          const monthlySave = Math.ceil(remaining / monthsLeft)

          return (
            <motion.div 
              key={g.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface border border-border p-8 rounded-[32px] hover:border-accent/40 transition-all group relative"
            >
               <button
                 onClick={() => setGoalToDelete(g.id)}
                 className="absolute top-6 right-6 p-2 text-text-faint hover:text-red hover:bg-red/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
               >
                 <Trash2 size={18} />
               </button>

               <div className="flex items-center justify-between mb-8 pr-8">
                  <div className="flex items-center gap-4">
                     <div className="w-16 h-16 rounded-3xl bg-surface-2 border border-border flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform">
                        {g.emoji}
                     </div>
                     <div>
                        <h3 className="text-xl font-display font-bold">{g.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-text-faint font-bold uppercase tracking-widest mt-1">
                           <Calendar size={12} />
                           Target: {new Date(g.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                     </div>
                  </div>
                  <div className="text-right">
                     <div className="text-3xl font-display font-bold text-accent">{Math.round(percent)}%</div>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                     <span className="text-text-muted">
                        <span className="font-bold text-text">${g.currentAmount.toLocaleString()}</span> saved of ${g.targetAmount.toLocaleString()}
                     </span>
                  </div>

                  <div className="h-4 bg-surface-2 rounded-full overflow-hidden border border-border p-1">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                        className="h-full bg-accent rounded-full shadow-[0_0_10px_rgba(124,58,237,0.5)]"
                     />
                  </div>
               </div>

               <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-surface-2 border border-border">
                     <div className="text-[10px] text-text-faint font-bold uppercase tracking-widest mb-1">Monthly Target</div>
                     <div className="text-lg font-display font-bold">${monthlySave.toLocaleString()}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-accent-dim border border-accent/20">
                     <div className="text-[10px] text-accent font-bold uppercase tracking-widest mb-1">AI Status</div>
                     <div className="text-sm font-bold flex items-center gap-2">
                        <TrendingUp size={14} />
                        Ahead of schedule!
                     </div>
                  </div>
               </div>
            </motion.div>
          )
        })}

        {goals.length === 0 && (
          <div className="lg:col-span-2 py-20 bg-surface border border-dashed border-border rounded-[32px] text-center">
             <div className="text-4xl mb-4">🏆</div>
             <h3 className="text-xl font-display font-bold mb-2">No goals created</h3>
             <p className="text-text-muted mb-6">Set financial targets like vacations, emergency funds or big purchases.</p>
             <button 
               onClick={() => addGoal({ 
                 name: 'Emergency Fund', 
                 targetAmount: 5000, 
                 currentAmount: 1200, 
                 deadline: '2026-12-31', 
                 emoji: '🛡️' 
               })}
               className="px-6 py-3 bg-accent text-white font-bold rounded-2xl shadow-glow"
             >
                Create First Goal
             </button>
          </div>
        )}
      </div>
    </div>
  )
}
