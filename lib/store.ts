import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { FinaryState, Transaction, Budget, Goal, Subscription } from './types'
import { uuid } from './utils'
import { generateSeedData } from './seed'

const initialData = generateSeedData()

interface FinaryActions {
  addTransaction: (t: Omit<Transaction, 'id' | 'createdAt'>) => void
  deleteTransaction: (id: string) => void
  updateTransaction: (id: string, t: Partial<Transaction>) => void
  
  addBudget: (b: Omit<Budget, 'id'>) => void
  updateBudget: (id: string, b: Partial<Budget>) => void
  deleteBudget: (id: string) => void
  
  addGoal: (g: Omit<Goal, 'id'>) => void
  updateGoal: (id: string, g: Partial<Goal>) => void
  deleteGoal: (id: string) => void

  addSubscription: (s: Omit<Subscription, 'id'>) => void
  updateSubscription: (id: string, s: Partial<Subscription>) => void
  deleteSubscription: (id: string) => void
  
  setCurrentMonth: (month: string) => void
  setOpenRouterKey: (key: string) => void
  addToast: (message: string, type: 'success' | 'error' | 'info') => void
  removeToast: (id: string) => void
  loadSeedData: (transactions: Transaction[], budgets?: Budget[], subscriptions?: Subscription[]) => void
}

export const useFinaryStore = create<FinaryState & FinaryActions>()(
  persist(
    (set, get) => ({
      transactions: initialData.transactions,
      budgets: initialData.budgets,
      goals: [],
      subscriptions: initialData.subscriptions,
      currentMonth: new Date().toISOString().slice(0, 7),
      settings: {
        currency: 'USD',
        openrouterKey: '',
      },
      toasts: [],

      loadSeedData: (seedTransactions, seedBudgets, seedSubscriptions) => set((state) => ({
        transactions: [...seedTransactions, ...(Array.isArray(state.transactions) ? state.transactions : [])],
        budgets: seedBudgets 
          ? [...seedBudgets, ...(Array.isArray(state.budgets) ? state.budgets : [])] 
          : (Array.isArray(state.budgets) ? state.budgets : []),
        subscriptions: seedSubscriptions 
          ? [...seedSubscriptions, ...(Array.isArray(state.subscriptions) ? state.subscriptions : [])] 
          : (Array.isArray(state.subscriptions) ? state.subscriptions : []),
      })),

      addToast: (message, type) => set(state => ({
        toasts: [...state.toasts, { id: uuid(), message, type }]
      })),

      removeToast: (id) => set(state => ({
        toasts: state.toasts.filter(t => t.id !== id)
      })),

      addTransaction: (t) => {
        set((state) => {
          const safeTransactions = Array.isArray(state.transactions) ? state.transactions : []
          return {
            transactions: [
              {
                ...t,
                id: uuid(),
                createdAt: Date.now(),
              },
              ...safeTransactions,
            ],
          }
        })
        get().addToast('Transaction added!', 'success')
      },

      deleteTransaction: (id) => {
        set((state) => ({
          transactions: (Array.isArray(state.transactions) ? state.transactions : []).filter((t) => t.id !== id),
        }))
        get().addToast('Transaction deleted', 'info')
      },

      updateTransaction: (id, updated) => {
        set((state) => ({
          transactions: (Array.isArray(state.transactions) ? state.transactions : []).map((t) =>
            t.id === id ? { ...t, ...updated } : t
          ),
        }))
        get().addToast('Changes saved', 'success')
      },

      addBudget: (b) => {
        set((state) => ({
          budgets: [...(Array.isArray(state.budgets) ? state.budgets : []), { ...b, id: uuid() }],
        }))
        get().addToast('Budget created', 'success')
      },

      updateBudget: (id, updated) => {
        set((state) => ({
          budgets: (Array.isArray(state.budgets) ? state.budgets : []).map((b) =>
            b.id === id ? { ...b, ...updated } : b
          ),
        }))
        get().addToast('Budget updated', 'success')
      },

      deleteBudget: (id) => {
        set((state) => ({
          budgets: (Array.isArray(state.budgets) ? state.budgets : []).filter((b) => b.id !== id),
        }))
        get().addToast('Budget deleted', 'info')
      },

      addGoal: (g) => {
        set((state) => ({
          goals: [...(Array.isArray(state.goals) ? state.goals : []), { ...g, id: uuid() }],
        }))
        get().addToast('Goal started!', 'success')
      },

      updateGoal: (id, updated) => {
        set((state) => ({
          goals: (Array.isArray(state.goals) ? state.goals : []).map((g) =>
            g.id === id ? { ...g, ...updated } : g
          ),
        }))
        get().addToast('Goal progress updated', 'success')
      },

      deleteGoal: (id) => {
        set((state) => ({
          goals: (Array.isArray(state.goals) ? state.goals : []).filter((g) => g.id !== id),
        }))
        get().addToast('Goal deleted', 'info')
      },

      addSubscription: (s) => {
        set((state) => ({
          subscriptions: [...(Array.isArray(state.subscriptions) ? state.subscriptions : []), { ...s, id: uuid() }],
        }))
        get().addToast('Subscription added', 'success')
      },

      updateSubscription: (id, updated) => {
        set((state) => ({
          subscriptions: (Array.isArray(state.subscriptions) ? state.subscriptions : []).map((s) =>
            s.id === id ? { ...s, ...updated } : s
          ),
        }))
        get().addToast('Subscription updated', 'success')
      },

      deleteSubscription: (id) => {
        set((state) => ({
          subscriptions: (Array.isArray(state.subscriptions) ? state.subscriptions : []).filter((s) => s.id !== id),
        }))
        get().addToast('Subscription deleted', 'info')
      },

      setCurrentMonth: (month) => set({ currentMonth: month }),
    }),
    {
      name: 'finary_data',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        transactions: state.transactions,
        budgets: state.budgets,
        goals: state.goals,
        subscriptions: state.subscriptions,
        settings: state.settings,
      }),
    }
  )
)
