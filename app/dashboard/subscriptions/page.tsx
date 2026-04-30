'use client'

import { useState } from 'react'
import { useFinaryStore } from '@/lib/store'
import { motion } from 'framer-motion'
import { Plus, Repeat, Calendar, CreditCard, Trash2 } from 'lucide-react'
import AddSubscriptionModal from '@/components/dashboard/AddSubscriptionModal'
import ConfirmationModal from '@/components/ui/ConfirmationModal'

export default function SubscriptionsPage() {
  const subscriptions = useFinaryStore((state) => state.subscriptions)
  const addSubscription = useFinaryStore((state) => state.addSubscription)
  const deleteSubscription = useFinaryStore((state) => state.deleteSubscription)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [subToDelete, setSubToDelete] = useState<string | null>(null)

  const totalMonthlyCost = subscriptions.reduce((acc, sub) => {
    return acc + (sub.billingCycle === 'monthly' ? sub.cost : sub.cost / 12)
  }, 0)

  return (
    <div className="space-y-8">
      <AddSubscriptionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      <ConfirmationModal
        isOpen={!!subToDelete}
        onClose={() => setSubToDelete(null)}
        onConfirm={() => subToDelete && deleteSubscription(subToDelete)}
        title="Delete Subscription"
        message="Are you sure you want to delete this subscription?"
      />

      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-display font-bold">Subscriptions & Fixed Costs</h2>
         <button 
           onClick={() => setIsModalOpen(true)}
           className="bg-accent/10 text-accent border border-accent/20 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-accent hover:text-white transition-all"
         >
            <Plus size={18} />
            Add Subscription
         </button>
      </div>

      {subscriptions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-surface border border-border rounded-[32px] flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center text-accent">
              <CreditCard size={24} />
            </div>
            <div>
              <div className="text-xs text-text-faint font-bold uppercase tracking-widest">Total Monthly Cost</div>
              <div className="text-2xl font-display font-bold">${totalMonthlyCost.toFixed(2)}</div>
            </div>
          </div>
          <div className="p-6 bg-surface border border-border rounded-[32px] flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue/20 flex items-center justify-center text-blue">
              <Repeat size={24} />
            </div>
            <div>
              <div className="text-xs text-text-faint font-bold uppercase tracking-widest">Active Subscriptions</div>
              <div className="text-2xl font-display font-bold">{subscriptions.length}</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {subscriptions.map((s) => (
          <motion.div 
            key={s.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface border border-border p-6 rounded-[32px] hover:border-accent/40 transition-all group relative"
          >
             <button
               onClick={() => setSubToDelete(s.id)}
               className="absolute top-6 right-6 p-2 text-text-faint hover:text-red hover:bg-red/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
             >
               <Trash2 size={18} />
             </button>

             <div className="flex items-center gap-4 mb-6 pr-8">
                <div className="w-12 h-12 rounded-2xl bg-surface-2 border border-border flex items-center justify-center text-xl font-bold uppercase">
                   {s.name.charAt(0)}
                </div>
                <div>
                   <h3 className="text-lg font-display font-bold">{s.name}</h3>
                   <div className="text-xs text-text-muted">{s.category}</div>
                </div>
             </div>

             <div className="flex items-end justify-between mb-4">
                <div className="text-3xl font-display font-bold">${s.cost.toFixed(2)}</div>
                <div className="text-xs font-bold uppercase tracking-widest text-text-faint mb-1">
                   / {s.billingCycle === 'monthly' ? 'mo' : 'yr'}
                </div>
             </div>

             <div className="p-3 bg-surface-2 rounded-xl border border-border flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-text-muted">
                   <Calendar size={14} />
                   Next billing:
                </div>
                <span className="font-bold">{new Date(s.nextBillingDate).toLocaleDateString()}</span>
             </div>
          </motion.div>
        ))}

        {subscriptions.length === 0 && (
          <div className="lg:col-span-3 flex flex-col items-center justify-center py-20 px-4 bg-surface/50 border border-dashed border-border rounded-[48px] text-center">
             <div className="w-24 h-24 bg-blue/10 rounded-full flex items-center justify-center text-4xl mb-6 shadow-glow shadow-blue/5">
                🔁
             </div>
             <h3 className="text-2xl font-display font-bold mb-3">Track Recurring Costs</h3>
             <p className="text-text-muted mb-8 max-w-sm mx-auto leading-relaxed font-medium">
                Keep an eye on Netflix, Spotify, Gym, and other recurring payments so you&apos;re never surprised by a bill.
             </p>
             <div className="flex flex-wrap items-center justify-center gap-4">
               <button 
                 onClick={() => setIsModalOpen(true)}
                 className="px-8 py-4 bg-accent text-white font-bold rounded-2xl shadow-glow hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
               >
                  <Plus size={20} />
                  Add Subscription
               </button>
               <button 
                 onClick={() => {
                   const samples = [
                     { name: 'Netflix', cost: 15.99, billingCycle: 'monthly', category: 'Entertainment', isFixed: true },
                     { name: 'Spotify', cost: 9.99, billingCycle: 'monthly', category: 'Entertainment', isFixed: true },
                     { name: 'ChatGPT Plus', cost: 20.00, billingCycle: 'monthly', category: 'Subscriptions', isFixed: true },
                     { name: 'Gym', cost: 45.00, billingCycle: 'monthly', category: 'Health', isFixed: true }
                   ] as const
                   samples.forEach(s => addSubscription({
                     ...s,
                     nextBillingDate: new Date().toISOString().split('T')[0]
                   }))
                 }}
                 className="px-8 py-4 bg-surface-2 text-text hover:bg-surface-3 font-bold rounded-2xl border border-border transition-all active:scale-95"
               >
                  Add Sample Data
               </button>
             </div>
          </div>
        )}
      </div>
    </div>
  )
}