'use client'

import { useMemo } from 'react'
import { useFinaryStore } from '@/lib/store'
import { calculateKPIs, getSpendingData, getCategoryData, getDailySpendingData } from '@/lib/calculations'
import KPICard from '@/components/dashboard/KPICard'
import SpendingChart from '@/components/dashboard/SpendingChart'
import CategoryDonut from '@/components/dashboard/CategoryDonut'
import AIAnalysisModal from '@/components/dashboard/AIAnalysisModal'
import { 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, 
  BarChart2,
  ArrowRight,
  Plus,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function DashboardHome() {
  const { transactions, currentMonth } = useFinaryStore()
  const [period, setPeriod] = useState<'M' | '3M' | 'Y'>('M')
  const [isAIModalOpen, setIsAIModalOpen] = useState(false)
  
  const kpis = useMemo(() => calculateKPIs(transactions, currentMonth), [transactions, currentMonth])
  const allSpendingData = useMemo(() => getSpendingData(transactions), [transactions])
  const dailySpendingData = useMemo(() => getDailySpendingData(transactions, currentMonth), [transactions, currentMonth])
  
  const spendingData = useMemo(() => {
    if (period === 'M') return dailySpendingData
    if (period === '3M') return allSpendingData.slice(-3)
    return allSpendingData.slice(-12)
  }, [allSpendingData, dailySpendingData, period])

  const categoryData = useMemo(() => getCategoryData(transactions, currentMonth), [transactions, currentMonth])
  const recentTransactions = useMemo(() => {
    return transactions
      .filter(t => t.date.startsWith(currentMonth))
      .slice(0, 5)
  }, [transactions, currentMonth])

  return (
    <div className="space-y-8">
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Income" 
          value={kpis.income} 
          subtitle="this month" 
          icon={<TrendingUp size={20} />} 
          colorClass="text-green border-green/20"
          trend={12}
        />
        <KPICard 
          title="Expenses" 
          value={kpis.expenses} 
          subtitle="this month" 
          icon={<TrendingDown size={20} />} 
          colorClass="text-red border-red/20"
          trend={-5}
        />
        <KPICard 
          title="Saved" 
          value={kpis.saved} 
          subtitle={`${kpis.savingsRate}% savings rate`} 
          icon={<PiggyBank size={20} />} 
          colorClass="text-accent border-accent/20"
        />
        <KPICard 
          title="Avg. Daily" 
          value={Math.round(kpis.expenses / 30)} 
          subtitle="predicted spending" 
          icon={<BarChart2 size={20} />} 
          colorClass="text-blue border-blue/20"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Spending Overview */}
        <div className="lg:col-span-3 bg-surface border border-border rounded-3xl p-8">
          <div className="flex items-center justify-between mb-6">
             <h2 className="text-xl font-display font-bold">Spending Overview</h2>
             <div className="flex gap-2">
                {(['M', '3M', 'Y'] as const).map(t => (
                  <button 
                    key={t} 
                    onClick={() => setPeriod(t)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg border border-border transition-all hover:bg-white/5 ${
                      period === t ? 'bg-white/10 border-white/20 text-white' : 'text-text-faint'
                    }`}
                  >
                    {t}
                  </button>
                ))}
             </div>
          </div>
          <SpendingChart 
            data={spendingData} 
            xAxisKey={period === 'M' ? 'day' : 'month'} 
          />
        </div>

        {/* Category Breakdown */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-3xl p-8">
          <h2 className="text-xl font-display font-bold mb-6">By Category</h2>
          <CategoryDonut data={categoryData} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Recent Transactions */}
        <div className="lg:col-span-3 bg-surface border border-border rounded-3xl p-8">
           <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold">Recent Transactions</h2>
              <Link href="/dashboard/transactions" className="text-accent text-sm font-bold flex items-center gap-1 hover:underline">
                 View all <ArrowRight size={14} />
              </Link>
           </div>
           <div className="space-y-1">
              {recentTransactions.map((t, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={t.id} 
                  className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-colors group cursor-pointer"
                >
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-surface-2 border border-border flex items-center justify-center text-lg">
                        {t.type === 'income' ? '💼' : '🛒'}
                      </div>
                      <div>
                        <div className="font-bold text-sm">{t.description}</div>
                        <div className="text-xs text-text-faint">{t.category} • {t.date}</div>
                      </div>
                   </div>
                   <div className={`font-bold ${t.type === 'income' ? 'text-green' : 'text-text'}`}>
                      {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                   </div>
                </motion.div>
              ))}
           </div>
        </div>

        {/* AI Insight Card */}
        <div className="lg:col-span-2 bg-accent/5 border border-accent/20 rounded-3xl p-8 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 text-accent/20 group-hover:text-accent/40 transition-colors">
              <Plus size={64} className="rotate-45" />
           </div>
           <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center gap-2 text-accent mb-4">
                 <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                    🤖
                 </div>
                 <span className="font-bold text-sm uppercase tracking-widest">AI Insight</span>
              </div>
              <h3 className="text-2xl font-display font-bold mb-4">Your spending is up 23% this week.</h3>
              <p className="text-text-muted leading-relaxed mb-8 flex-1">
                 Most of it happened on weekends — consider setting a weekend dining budget of $80 to stay on track for your July vacation goal.
              </p>
              <button 
                onClick={() => setIsAIModalOpen(true)}
                className="w-full py-4 bg-accent text-white font-bold rounded-2xl shadow-glow hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                 <Sparkles size={18} />
                 Show Analysis
              </button>
           </div>
        </div>
      </div>

      <AIAnalysisModal 
        isOpen={isAIModalOpen} 
        onClose={() => setIsAIModalOpen(false)} 
        type="general" 
      />
    </div>
  )
}
