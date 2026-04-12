import { Transaction, Budget } from './types'

export const calculateKPIs = (transactions: Transaction[], selectedMonth: string) => {
  const safeTransactions = Array.isArray(transactions) ? transactions : []
  const monthTransactions = safeTransactions.filter(t => t.date && t.date.startsWith(selectedMonth))
  
  const income = monthTransactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0)
    
  const expenses = monthTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0)
    
  const saved = income - expenses
  const savingsRate = income > 0 ? Math.round((saved / income) * 100) : 0
  
  return { income, expenses, saved, savingsRate }
}

export const getSpendingData = (transactions: Transaction[]) => {
  const safeTransactions = Array.isArray(transactions) ? transactions : []
  const groups: Record<string, { month: string, income: number, expenses: number }> = {}
  
  safeTransactions.forEach(t => {
    if (!t.date) return
    const month = t.date.slice(0, 7)
    if (!groups[month]) {
      groups[month] = { month, income: 0, expenses: 0 }
    }
    if (t.type === 'income') groups[month].income += t.amount
    else groups[month].expenses += t.amount
  })
  
  return Object.values(groups).sort((a, b) => a.month.localeCompare(b.month))
}

export const getDailySpendingData = (transactions: Transaction[], selectedMonth: string) => {
  const safeTransactions = Array.isArray(transactions) ? transactions : []
  const [year, month] = selectedMonth.split('-').map(Number)
  const daysInMonth = new Date(year, month, 0).getDate()
  
  const dailyData: Record<string, { day: string, income: number, expenses: number }> = {}
  
  safeTransactions
    .filter(t => t.date && t.date.startsWith(selectedMonth))
    .forEach(t => {
      const day = t.date.split('-')[2]
      if (!dailyData[day]) {
        dailyData[day] = { day, income: 0, expenses: 0 }
      }
      if (t.type === 'income') dailyData[day].income += t.amount
      else dailyData[day].expenses += t.amount
    })
    
  return Array.from({ length: daysInMonth }, (_, i) => {
    const d = (i + 1).toString().padStart(2, '0')
    return dailyData[d] || { day: d, income: 0, expenses: 0 }
  })
}

export const getCategoryData = (transactions: Transaction[], selectedMonth: string) => {
  const safeTransactions = Array.isArray(transactions) ? transactions : []
  const monthTransactions = safeTransactions.filter(t => t.date && t.date.startsWith(selectedMonth) && t.type === 'expense')
  
  const categories: Record<string, number> = {}
  monthTransactions.forEach(t => {
    categories[t.category] = (categories[t.category] || 0) + t.amount
  })
  
  return Object.entries(categories)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}

export const getHeatmapData = (transactions: Transaction[], selectedMonth: string) => {
  const safeTransactions = Array.isArray(transactions) ? transactions : []
  const [year, month] = selectedMonth.split('-').map(Number)
  const daysInMonth = new Date(year, month, 0).getDate()
  
  const data: Record<string, number> = {}
  safeTransactions
    .filter(t => t.date && t.date.startsWith(selectedMonth) && t.type === 'expense')
    .forEach(t => {
      data[t.date] = (data[t.date] || 0) + t.amount
    })
    
  return Array.from({ length: daysInMonth }, (_, i) => {
    const d = (i + 1).toString().padStart(2, '0')
    const date = `${selectedMonth}-${d}`
    return { date, value: data[date] || 0 }
  })
}

export const getTopMerchants = (transactions: Transaction[], selectedMonth: string) => {
  const safeTransactions = Array.isArray(transactions) ? transactions : []
  const merchants: Record<string, number> = {}
  safeTransactions
    .filter(t => t.date && t.date.startsWith(selectedMonth) && t.type === 'expense')
    .forEach(t => {
      merchants[t.description] = (merchants[t.description] || 0) + t.amount
    })
    
  return Object.entries(merchants)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)
}

export const getDayOfWeekData = (transactions: Transaction[], selectedMonth: string) => {
  const safeTransactions = Array.isArray(transactions) ? transactions : []
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const data: Record<string, number> = {}
  
  safeTransactions
    .filter(t => t.date && t.date.startsWith(selectedMonth) && t.type === 'expense')
    .forEach(t => {
      const day = days[new Date(t.date).getDay()]
      data[day] = (data[day] || 0) + t.amount
    })
    
  return days.map(name => ({ name, value: data[name] || 0 }))
}

export const calculateBudgets = (transactions: Transaction[], budgets: Budget[], selectedMonth: string) => {
  const safeBudgets = Array.isArray(budgets) ? budgets : []
  const safeTransactions = Array.isArray(transactions) ? transactions : []

  return safeBudgets
    .filter(b => b.month === selectedMonth)
    .map(budget => {
      const spent = safeTransactions
        .filter(t => 
          t.date &&
          t.date.startsWith(selectedMonth) && 
          t.type === 'expense' && 
          t.category === budget.category
        )
        .reduce((acc, t) => acc + t.amount, 0)
        
      return {
        ...budget,
        spent,
        remaining: budget.limit - spent,
        percentage: budget.limit > 0 ? (spent / budget.limit) * 100 : 0
      }
    })
}
