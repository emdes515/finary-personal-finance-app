'use client'

import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts'

const COLORS = ['#8b5cf6', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#6b7280']

interface CategoryDonutProps {
  data: { name: string; value: number }[]
}

export default function CategoryDonut({ data }: CategoryDonutProps) {
  return (
    <div className="flex flex-col w-full">
      <div className="h-[200px] w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--color-surface)', 
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
                borderRadius: '12px',
                fontSize: '12px'
              }}
              itemStyle={{ color: 'var(--color-text)' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
         {data.slice(0, 6).map((entry, i) => (
           <div key={entry.name} className="flex items-center justify-between text-[11px] min-w-0">
              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                 <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                 <span className="text-text-muted font-medium truncate" title={entry.name}>{entry.name}</span>
              </div>
              <span className="font-bold text-text ml-1 shrink-0">${entry.value.toLocaleString()}</span>
           </div>
         ))}
      </div>
    </div>
  )
}
