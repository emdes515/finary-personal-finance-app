'use client'

import { useMemo } from 'react'
import { useFinaryStore } from '@/lib/store'
import { 
  getHeatmapData, 
  getTopMerchants, 
  getDayOfWeekData,
  getCategoryData 
} from '@/lib/calculations'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  Radar,
  Cell
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import AIAnalysisModal from '@/components/dashboard/AIAnalysisModal'

export default function AnalyticsPage() {
  const { transactions, currentMonth } = useFinaryStore()
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [isAIModalOpen, setIsAIModalOpen] = useState(false)
  
  const heatmapData = useMemo(() => getHeatmapData(transactions, currentMonth), [transactions, currentMonth])
  const topMerchants = useMemo(() => getTopMerchants(transactions, currentMonth), [transactions, currentMonth])
  const dayOfWeekData = useMemo(() => getDayOfWeekData(transactions, currentMonth), [transactions, currentMonth])
  const categoryData = useMemo(() => getCategoryData(transactions, currentMonth), [transactions, currentMonth])

  const maxHeatmap = Math.max(...heatmapData.map(d => d.value), 1)

  const selectedDayTransactions = useMemo(() => {
    if (!selectedDay) return []
    return transactions.filter(t => t.date === selectedDay)
  }, [selectedDay, transactions])

  return (
    <div className="space-y-8">
      {/* Header with Depth Analysis */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Financial Analytics</h1>
          <p className="text-text-faint">Deep dive into your spending habits</p>
        </div>
        <button 
          onClick={() => setIsAIModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-accent/10 border border-accent/20 text-accent font-bold rounded-2xl hover:bg-accent hover:text-white transition-all shadow-glow shadow-accent/5"
        >
          <Sparkles size={18} />
          Depth Analysis
        </button>
      </div>

      {/* Heatmap Row */}
      <div className="bg-surface border border-border rounded-[32px] p-8">
        <h2 className="text-xl font-display font-bold mb-6">Spending Heatmap</h2>
        <div className="flex flex-wrap gap-2 relative">
           {heatmapData.map((d, i) => (
             <motion.button 
               key={d.date}
               type="button"
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               title={`${d.date}: $${d.value.toLocaleString()}`}
               onClick={() => {
                 console.log('Clicked day:', d.date);
                 setSelectedDay(selectedDay === d.date ? null : d.date);
               }}
               className={`w-10 h-10 rounded-lg border flex items-center justify-center text-[10px] font-bold cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-accent ${
                 selectedDay === d.date ? 'border-accent ring-2 ring-accent ring-offset-2 ring-offset-bg scale-110 z-10 shadow-lg' : 'border-border hover:border-border-hover'
               }`}
               style={{ 
                 backgroundColor: d.value > 0 
                   ? `rgba(124, 58, 237, ${Math.max(0.1, d.value / maxHeatmap)})` 
                   : 'transparent'
               }}
             >
               {i + 1}
             </motion.button>
           ))}
        </div>
        
        <AnimatePresence>
          {selectedDay && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-8 overflow-hidden"
            >
              <div className="p-6 bg-surface-2 rounded-2xl border border-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">Transactions for {new Date(selectedDay).toLocaleDateString(undefined, { dateStyle: 'long' })}</h3>
                  <button onClick={() => setSelectedDay(null)} className="text-xs text-accent font-bold hover:underline">Clear</button>
                </div>
                <div className="space-y-2">
                  {selectedDayTransactions.length > 0 ? (
                    selectedDayTransactions.map(t => (
                      <div key={t.id} className="flex items-center justify-between p-3 bg-surface rounded-xl border border-border">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{t.category === 'Food' ? '🍕' : t.category === 'Housing' ? '🏠' : t.category === 'Transport' ? '🚗' : t.category === 'Work' ? '💼' : '🛒'}</span>
                          <div>
                            <div className="text-sm font-bold">{t.description}</div>
                            <div className="text-[10px] text-text-faint uppercase font-bold">{t.category}</div>
                          </div>
                        </div>
                        <div className={`font-bold ${t.type === 'income' ? 'text-green' : 'text-text'}`}>
                          {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-text-muted text-sm italic">No transactions for this day</div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 flex items-center gap-4 text-xs text-text-faint">
           <span>Less spent</span>
           <div className="flex gap-1">
              {[0.1, 0.3, 0.6, 0.9].map(o => (
                <div key={o} className="w-4 h-4 rounded" style={{ backgroundColor: `rgba(124, 58, 237, ${o})` }} />
              ))}
           </div>
           <span>More spent</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Merchants */}
        <div className="bg-surface border border-border rounded-[32px] p-8">
           <h2 className="text-xl font-display font-bold mb-6">Top Merchants</h2>
           <div className="space-y-6">
              {topMerchants.map((m, i) => (
                <div key={m.name} className="space-y-2">
                   <div className="flex justify-between text-sm font-bold">
                      <span>{m.name}</span>
                      <span>${m.value.toLocaleString()}</span>
                   </div>
                   <div className="h-3 bg-surface-2 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(m.value / topMerchants[0].value) * 100}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full bg-accent"
                      />
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Day of Week Radar */}
        <div className="bg-surface border border-border rounded-[32px] p-8">
           <h2 className="text-xl font-display font-bold mb-6">Day of Week Activity</h2>
           <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <RadarChart data={dayOfWeekData}>
                    <PolarGrid stroke="rgba(255,255,255,0.06)" />
                    <PolarAngleAxis dataKey="name" tick={{ fill: '#6b6968', fontSize: 12 }} />
                    <Radar
                       name="Spending"
                       dataKey="value"
                       stroke="#7c3aed"
                       fill="#7c3aed"
                       fillOpacity={0.5}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px' }}
                    />
                 </RadarChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* Category Trends Bar */}
      <div className="bg-surface border border-border rounded-[32px] p-8">
         <h2 className="text-xl font-display font-bold mb-6">Category Distribution</h2>
         <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={categoryData}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6b6968', fontSize: 12 }}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px' }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                     {categoryData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={index === 0 ? '#7c3aed' : '#3b82f6'} />
                     ))}
                  </Bar>
               </BarChart>
            </ResponsiveContainer>
         </div>
      </div>

      <AIAnalysisModal 
        isOpen={isAIModalOpen} 
        onClose={() => setIsAIModalOpen(false)} 
        type="depth" 
      />
    </div>
  )
}
