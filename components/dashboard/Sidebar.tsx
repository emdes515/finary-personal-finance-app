'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  ReceiptText, 
  BarChart3, 
  PieChart, 
  Target, 
  MessageSquareCode,
  Wallet,
  Repeat,
  Diamond,
  Sparkles,
  Bell
} from 'lucide-react'
import { useFinaryStore } from '@/lib/store'
import { useMemo } from 'react'
import { useAlerts } from '@/hooks/useAlerts'

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: ReceiptText, label: 'Transactions', href: '/dashboard/transactions' },
  { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' },
  { icon: PieChart, label: 'Budgets', href: '/dashboard/budgets' },
  { icon: Target, label: 'Goals', href: '/dashboard/goals' },
  { icon: Repeat, label: 'Subscriptions', href: '/dashboard/subscriptions' },
  { icon: Bell, label: 'Alerts', href: '/dashboard/alerts', alert: true },
  { icon: MessageSquareCode, label: 'AI Assistant', href: '/dashboard/ai' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const transactions = useFinaryStore((state) => state.transactions)
  const { hasAlerts } = useAlerts()
  
  const netWorth = useMemo(() => {
    if (!Array.isArray(transactions)) return 0
    return transactions.reduce((acc, t) => {
      return t.type === 'income' ? acc + t.amount : acc - t.amount
    }, 0)
  }, [transactions])

  return (
    <aside className="w-[260px] bg-surface border-r border-border flex flex-col h-screen sticky top-0">
      <div className="p-8 flex items-center gap-3 mb-6 group cursor-pointer">
        <div className="relative">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="text-accent flex items-center justify-center relative z-10"
          >
             <Diamond size={32} className="fill-accent/20" />
          </motion.div>
          <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full scale-150 group-hover:bg-accent/40 transition-colors" />
          <div className="absolute -top-1 -right-1 z-20">
             <Sparkles size={14} className="text-yellow animate-pulse" />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="font-display font-black text-2xl tracking-tighter bg-gradient-to-br from-white via-accent to-blue bg-clip-text text-transparent dark:from-white dark:to-accent">
            FINARY
          </span>
          <span className="text-[10px] font-bold text-text-faint uppercase tracking-[0.2em] -mt-1">AI Intelligence</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href
          const isAlert = item.alert && hasAlerts
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative group ${
                isActive 
                  ? 'text-white bg-accent/15' 
                  : isAlert
                  ? 'text-red-400 hover:bg-red-500/10'
                  : 'text-text-muted hover:text-text hover:bg-white/5'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav"
                  className="absolute left-0 w-1 h-6 bg-accent rounded-full"
                />
              )}
              
              <div className="relative">
                <item.icon 
                  size={20} 
                  className={`transition-colors ${
                    isActive ? 'text-accent' : isAlert ? 'text-red' : ''
                  }`} 
                />
                {isAlert && !isActive && (
                   <motion.div 
                     animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.2, 1] }}
                     transition={{ duration: 2, repeat: Infinity }}
                     className="absolute inset-0 bg-red/20 blur-md rounded-full -z-10"
                   />
                )}
                {isAlert && !isActive && (
                   <span className="absolute -top-1 -right-1 w-2 h-2 bg-red rounded-full border-2 border-surface shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                )}
              </div>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-6 border-t border-border">
        <div className="bg-surface-2 rounded-2xl p-4 border border-border">
          <div className="flex items-center gap-2 text-text-muted mb-1">
            <Wallet size={16} />
            <span className="text-xs uppercase tracking-wider font-bold">Net Worth</span>
          </div>
          <div className="text-2xl font-display font-bold">
            ${netWorth.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-green mt-1 flex items-center gap-1">
             <span>+12%</span> this month
          </div>
        </div>
      </div>
    </aside>
  )
}
