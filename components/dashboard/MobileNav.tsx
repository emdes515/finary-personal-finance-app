'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  ReceiptText, 
  MessageSquareCode,
  Target,
  Bell
} from 'lucide-react'

import { useAlerts } from '@/hooks/useAlerts'

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: 'Home', href: '/dashboard' },
  { icon: ReceiptText, label: 'List', href: '/dashboard/transactions' },
  { icon: Target, label: 'Goals', href: '/dashboard/goals' },
  { icon: Bell, label: 'Alerts', href: '/dashboard/alerts', alert: true },
  { icon: MessageSquareCode, label: 'AI', href: '/dashboard/ai' },
]

export default function MobileNav() {
  const pathname = usePathname()
  const { hasAlerts } = useAlerts()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-xl border-t border-border px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] flex items-center justify-between z-[100] shadow-[0_-10px_30px_-5px_rgba(0,0,0,0.3)]">
      {MENU_ITEMS.map((item) => {
        const isActive = pathname === item.href
        const isAlert = item.alert && hasAlerts
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 transition-all relative ${
              isActive ? 'text-accent scale-110' : 'text-text-muted hover:text-text'
            }`}
          >
            <div className={`p-1 rounded-lg ${isActive ? 'bg-accent/10' : ''} relative`}>
              <item.icon 
                size={22} 
                className={isActive ? 'text-accent' : isAlert ? 'text-red' : ''} 
              />
              {isAlert && !isActive && (
                <motion.div 
                  animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-red/20 blur-md rounded-full -z-10"
                />
              )}
              {isAlert && !isActive && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red rounded-full border-2 border-surface shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
              )}
            </div>
            <span className="text-[9px] font-bold uppercase tracking-widest">{item.label}</span>
            </Link>
            )
            })}
            </nav>
            )
            }
