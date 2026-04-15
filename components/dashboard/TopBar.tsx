'use client'

import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useFinaryStore } from '@/lib/store'

interface TopBarProps {
  title: string
  onAddClick: () => void
}

export default function TopBar({ title, onAddClick }: TopBarProps) {
  const { currentMonth, setCurrentMonth } = useFinaryStore()

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-').map(Number)
    const date = new Date(year, month - 1, 1)
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const handlePrevMonth = () => {
    const [year, month] = currentMonth.split('-').map(Number)
    const date = new Date(year, month - 2, 1)
    const newYear = date.getFullYear()
    const newMonth = (date.getMonth() + 1).toString().padStart(2, '0')
    setCurrentMonth(`${newYear}-${newMonth}`)
  }

  const handleNextMonth = () => {
    const [year, month] = currentMonth.split('-').map(Number)
    const date = new Date(year, month, 1)
    const newYear = date.getFullYear()
    const newMonth = (date.getMonth() + 1).toString().padStart(2, '0')
    setCurrentMonth(`${newYear}-${newMonth}`)
  }

  return (
    <header className="h-20 border-b border-border px-4 md:px-8 flex items-center justify-between sticky top-0 bg-bg/80 backdrop-blur-md z-40">
      <div className="flex flex-col">
        <h1 className="text-lg md:text-xl font-display font-bold truncate max-w-[120px] md:max-w-none">{title}</h1>
        <div className="text-[10px] text-text-faint uppercase tracking-widest font-bold">Overview</div>
      </div>

      <div className="flex items-center gap-2 md:gap-6">
        <div className="flex items-center gap-4 bg-surface-2 rounded-full px-4 py-2 border border-border">
          <button 
            onClick={handlePrevMonth}
            className="p-1 hover:bg-white/10 rounded-full transition-colors text-text-muted hover:text-text"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-xs md:text-sm font-bold min-w-[100px] md:min-w-[120px] text-center">
            {formatMonth(currentMonth)}
          </span>
          <button 
            onClick={handleNextMonth}
            className="p-1 hover:bg-white/10 rounded-full transition-colors text-text-muted hover:text-text"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <ThemeToggle />

        <button
          onClick={onAddClick}
          className="bg-accent hover:brightness-110 text-white p-2.5 md:px-5 md:py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-glow transition-all active:scale-95"
        >
          <Plus size={18} />
          <span className="hidden md:inline">Add Transaction</span>
        </button>
      </div>
    </header>
  )
}
