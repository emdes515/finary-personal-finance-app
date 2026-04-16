'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface KPICardProps {
  title: string
  value: string | number
  subtitle: string
  icon: ReactNode
  colorClass: string
  trend?: number
}

export default function KPICard({ title, value, subtitle, icon, colorClass, trend }: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface border border-border rounded-2xl p-6 shadow-card hover:border-border-hover transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2.5 rounded-xl bg-surface-2 border border-border ${colorClass}`}>
          {icon}
        </div>
        {trend !== undefined && (
           <div className={`text-xs font-bold px-2 py-1 rounded-full ${trend >= 0 ? 'bg-green-dim text-green' : 'bg-red-dim text-red'}`}>
              {trend >= 0 ? '+' : ''}{trend}%
           </div>
        )}
      </div>
      
      <div className="text-text-muted text-xs font-bold uppercase tracking-widest mb-1">{title}</div>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-3xl font-display font-bold mb-1"
      >
        {typeof value === 'number' ? `$${value.toLocaleString()}` : value}
      </motion.div>
      <div className="text-text-faint text-sm">{subtitle}</div>
      
      {/* Decorative Sparkline */}
      <div className="mt-4 h-1 w-full bg-surface-3 rounded-full overflow-hidden">
         <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '60%' }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full ${colorClass.split(' ')[0] === 'text-green' ? 'bg-green' : colorClass.split(' ')[0] === 'text-red' ? 'bg-red' : 'bg-accent'}`}
         />
      </div>
    </motion.div>
  )
}
