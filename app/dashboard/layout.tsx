'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import TopBar from '@/components/dashboard/TopBar'
import { useFinaryStore } from '@/lib/store'
import { generateSeedData } from '@/lib/seed'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import AddTransactionModal from '@/components/dashboard/AddTransactionModal'
import MobileNav from '@/components/dashboard/MobileNav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const transactions = useFinaryStore((state) => state.transactions)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Seed data if empty or corrupted
  useEffect(() => {
    setIsMounted(true)
    const isTransactionsValid = Array.isArray(transactions) && transactions.length > 0
    const isBudgetsValid = Array.isArray(useFinaryStore.getState().budgets) && useFinaryStore.getState().budgets.length > 0
    
    if (!isTransactionsValid || !isBudgetsValid) {
      const seed = generateSeedData()
      // Use setState to ensure we reset if it was an object
      useFinaryStore.setState((state) => ({
        ...state,
        transactions: seed.transactions,
        budgets: seed.budgets,
        subscriptions: seed.subscriptions
      }))
    }
  }, [transactions])

  const getTitle = () => {
    const segment = pathname.split('/').pop()
    if (!segment || segment === 'dashboard') return 'Dashboard'
    return segment.charAt(0).toUpperCase() + segment.slice(1)
  }

  if (!isMounted) return <div className="min-h-screen bg-bg" />

  return (
    <div className="flex min-h-screen bg-bg">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col pb-20 md:pb-0">
        <TopBar title={getTitle()} onAddClick={() => setIsModalOpen(true)} />
        <main className="flex-1 p-4 md:p-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
      <MobileNav />
    </div>
  )
}
