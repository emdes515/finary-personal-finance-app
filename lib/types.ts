export type TransactionType = 'expense' | 'income'

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  description: string
  category: string
  date: string
  createdAt: number
}

export interface Budget {
  id: string
  category: string
  limit: number
  month: string // YYYY-MM
}

export interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: string
  emoji: string
}

export interface Subscription {
  id: string
  name: string
  cost: number
  billingCycle: 'monthly' | 'yearly'
  category: string
  nextBillingDate: string
  isFixed: boolean
  icon?: string
}

export interface FinaryState {
  transactions: Transaction[]
  budgets: Budget[]
  goals: Goal[]
  subscriptions: Subscription[]
  currentMonth: string
  settings: {
    currency: string
  }
  toasts: { id: string, message: string, type: 'success' | 'error' | 'info' }[]
}
