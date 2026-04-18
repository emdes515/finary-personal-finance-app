'use client'

import { useFinaryStore } from '@/lib/store'
import { calculateBudgets } from '@/lib/calculations'
import { useMemo } from 'react'

export function useAlerts() {
  const transactions = useFinaryStore((state) => state.transactions)
  const budgets = useFinaryStore((state) => state.budgets)
  const subscriptions = useFinaryStore((state) => state.subscriptions)
  const currentMonth = useFinaryStore((state) => state.currentMonth)
  
  const alerts = useMemo(() => {
    const safeTransactions = Array.isArray(transactions) ? transactions : []
    const safeBudgets = Array.isArray(budgets) ? budgets : []
    const safeSubscriptions = Array.isArray(subscriptions) ? subscriptions : []
    
    const budgetStatus = calculateBudgets(safeTransactions, safeBudgets, currentMonth)
    
    return [
      ...budgetStatus
        .filter(b => b.percentage >= 85)
        .map(b => ({
          id: `budget-${b.id}`,
          type: b.percentage >= 100 ? 'danger' : 'warning',
          title: b.percentage >= 100 ? 'Budget Exceeded' : 'Budget Warning',
          message: `You have spent ${b.percentage.toFixed(1)}% of your ${b.category} budget.`,
        })),
      ...safeSubscriptions.map(s => {
        const nextDate = new Date(s.nextBillingDate)
        const today = new Date()
        const diffDays = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        
        if (diffDays <= 7 && diffDays >= 0) {
          return {
            id: `sub-${s.id}`,
            type: 'info',
            title: 'Upcoming Subscription',
            message: `${s.name} ($${s.cost}) is due in ${diffDays} days.`,
          }
        }
        return null
      }).filter(Boolean) as any[]
    ]
  }, [transactions, budgets, subscriptions, currentMonth])

  return { alerts, hasAlerts: alerts.length > 0 }
}
