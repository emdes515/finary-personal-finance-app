'use client'

import { useFinaryStore } from '@/lib/store'
import { calculateBudgets } from '@/lib/calculations'
import { Bell, AlertTriangle, TrendingUp, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AlertsPage() {
  const { transactions, budgets, subscriptions, currentMonth } = useFinaryStore()
  
  const budgetStatus = calculateBudgets(transactions, budgets, currentMonth)
  
  const alerts = [
    ...budgetStatus
      .filter(b => b.percentage >= 85)
      .map(b => ({
        id: `budget-${b.id}`,
        type: b.percentage >= 100 ? 'danger' : 'warning',
        icon: AlertTriangle,
        title: b.percentage >= 100 ? 'Budget Exceeded' : 'Budget Warning',
        message: `You have spent ${b.percentage.toFixed(1)}% of your ${b.category} budget.`,
        date: 'Current Month'
      })),
    ...subscriptions.map(s => {
      const nextDate = new Date(s.nextBillingDate)
      const today = new Date()
      const diffDays = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      
      if (diffDays <= 7 && diffDays >= 0) {
        return {
          id: `sub-${s.id}`,
          type: 'info',
          icon: Calendar,
          title: 'Upcoming Subscription',
          message: `${s.name} ($${s.cost}) is due in ${diffDays} days.`,
          date: s.nextBillingDate
        }
      }
      return null
    }).filter(Boolean) as any[]
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Alerts & Notifications</h1>
          <p className="text-text-muted">Stay on top of your finances with real-time updates.</p>
        </div>
        <div className="bg-accent/10 p-3 rounded-2xl border border-accent/20">
          <Bell className="text-accent" />
        </div>
      </div>

      <div className="grid gap-4">
        {alerts.length === 0 ? (
          <div className="bg-surface border border-border rounded-3xl p-12 text-center">
            <div className="w-16 h-16 bg-surface-2 rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
              <Bell className="text-text-faint" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">No active alerts</h3>
            <p className="text-text-muted">Everything looks good! We&apos;ll notify you if anything needs attention.</p>
          </div>
        ) : (
          alerts.map((alert, i) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              key={alert.id}
              className={`p-6 rounded-3xl border flex items-start gap-4 transition-all hover:scale-[1.01] ${
                alert.type === 'danger' 
                  ? 'bg-red-dim border-red/20' 
                  : alert.type === 'warning'
                  ? 'bg-yellow/5 border-yellow/20'
                  : 'bg-accent-dim border-accent/20'
              }`}
            >
              <div className={`p-3 rounded-2xl ${
                alert.type === 'danger' 
                  ? 'bg-red/10 text-red' 
                  : alert.type === 'warning'
                  ? 'bg-yellow/10 text-yellow'
                  : 'bg-accent/10 text-accent'
              }`}>
                <alert.icon size={24} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-lg">{alert.title}</h3>
                  <span className="text-xs font-bold uppercase tracking-wider text-text-faint">{alert.date}</span>
                </div>
                <p className="text-text-muted">{alert.message}</p>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* AI Smart Insight */}
      <div className="bg-gradient-to-br from-accent/20 to-blue/10 border border-accent/20 rounded-3xl p-8 relative overflow-hidden group">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white text-black rounded-lg">
              <TrendingUp size={20} />
            </div>
            <h3 className="font-display font-bold text-xl">Financial Health Score</h3>
          </div>
          <p className="text-text-muted max-w-lg mb-6">
            Based on your recent activity, your financial health is <span className="text-text font-bold text-green">Excellent (84/100)</span>. 
            You&apos;ve saved 15% more than last month.
          </p>
          <button className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:scale-105 transition-all active:scale-95">
            View Deep Analysis
          </button>
        </div>
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 opacity-10 group-hover:opacity-20 transition-opacity">
           <Bell size={300} />
        </div>
      </div>
    </div>
  )
}
