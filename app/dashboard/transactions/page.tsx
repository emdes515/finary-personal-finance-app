'use client'

import { useState, useMemo } from 'react'
import { useFinaryStore } from '@/lib/store'
import { Transaction } from '@/lib/types'
import { 
  Search, 
  Filter, 
  Download, 
  Edit2, 
  Trash2, 
  ChevronDown,
  ArrowUpDown
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import AddTransactionModal from '@/components/dashboard/AddTransactionModal'
import ConfirmationModal from '@/components/ui/ConfirmationModal'

export default function TransactionsPage() {
  const { transactions, deleteTransaction, currentMonth } = useFinaryStore()

  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesMonth = t.date.startsWith(currentMonth)
      const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter
      const matchesType = typeFilter === 'All' || t.type === typeFilter
      return matchesMonth && matchesSearch && matchesCategory && matchesType
    })
  }, [transactions, search, categoryFilter, typeFilter, currentMonth])

  const groupedTransactions = useMemo(() => {
    const groups: Record<string, Transaction[]> = {}
    filteredTransactions.forEach(t => {
      if (!groups[t.date]) groups[t.date] = []
      groups[t.date].push(t)
    })
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]))
  }, [filteredTransactions])

  const exportCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount']
    const rows = filteredTransactions.map(t => [
      t.date, t.description, t.category, t.type, t.amount
    ])
    const content = [headers, ...rows].map(e => e.join(',')).join('\n')
    const blob = new Blob([content], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-surface border border-border p-4 rounded-3xl shadow-sm">
        <div className="flex flex-1 items-center gap-4 w-full">
           <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-faint" size={18} />
              <input 
                type="text" 
                placeholder="Search transactions..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-surface-2 border border-border rounded-2xl py-3 pl-12 pr-4 text-sm focus:border-accent outline-none transition-colors"
              />
           </div>
           <select 
             value={categoryFilter}
             onChange={(e) => setCategoryFilter(e.target.value)}
             className="bg-surface-2 border border-border rounded-2xl py-3 px-4 text-sm focus:border-accent outline-none hidden md:block"
           >
              <option value="All">All Categories</option>
              <option value="Food">Food</option>
              <option value="Housing">Housing</option>
              <option value="Transport">Transport</option>
              <option value="Shopping">Shopping</option>
              <option value="Health">Health</option>
              <option value="Gaming">Gaming</option>
              <option value="Work">Work</option>
           </select>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
           <button 
             onClick={exportCSV}
             className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-surface-2 hover:bg-surface-3 border border-border px-5 py-3 rounded-2xl text-sm font-bold transition-colors"
           >
              <Download size={18} />
              Export CSV
           </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-8">
        <AnimatePresence mode="popLayout">
          {groupedTransactions.map(([date, items]) => (
            <motion.div 
              key={date}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-3"
            >
              <h3 className="text-sm font-bold text-text-faint uppercase tracking-widest pl-4">
                {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </h3>
              
              <div className="bg-surface border border-border rounded-[32px] overflow-hidden">
                {items.map((t, idx) => (
                  <div 
                    key={t.id} 
                    className={`flex items-center justify-between p-5 hover:bg-white/5 transition-colors group ${
                      idx !== items.length - 1 ? 'border-b border-border' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-surface-2 border border-border flex items-center justify-center text-xl">
                         {t.category === 'Food' ? '🍕' : t.category === 'Housing' ? '🏠' : t.category === 'Transport' ? '🚗' : t.category === 'Work' ? '💼' : '🛒'}
                       </div>
                       <div>
                         <div className="font-bold">{t.description}</div>
                         <div className="text-xs text-text-faint">{t.category}</div>
                       </div>
                    </div>

                    <div className="flex items-center gap-6">
                       <div className={`font-display font-bold text-lg ${t.type === 'income' ? 'text-green' : 'text-text'}`}>
                         {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                       </div>
                       
                       <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => {
                              setEditingTransaction(t)
                              setIsEditModalOpen(true)
                            }}
                            className="p-2 hover:bg-accent/10 hover:text-accent rounded-xl transition-colors"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => {
                              setTransactionToDelete(t.id)
                              setIsDeleteModalOpen(true)
                            }}
                            className="p-2 hover:bg-red/10 hover:text-red rounded-xl transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredTransactions.length === 0 && (
          <div className="py-20 text-center">
             <div className="text-4xl mb-4">🔍</div>
             <h3 className="text-xl font-display font-bold mb-2">No transactions found</h3>
             <p className="text-text-muted">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      <AddTransactionModal 
        isOpen={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingTransaction(null)
        }}
        editTransaction={editingTransaction || undefined}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setTransactionToDelete(null)
        }}
        onConfirm={() => {
          if (transactionToDelete) {
            deleteTransaction(transactionToDelete)
          }
        }}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
      />
    </div>
  )
}
