'use client'

import { motion } from 'framer-motion'

export default function AISuggestionSkeleton() {
  return (
    <div className="w-full bg-accent/5 border border-accent/20 rounded-2xl p-6 overflow-hidden relative">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-accent/20 animate-pulse" />
        <div className="h-4 w-32 bg-accent/20 rounded animate-pulse" />
      </div>
      
      <div className="space-y-3">
        <div className="h-3 w-full bg-text-faint/10 rounded animate-pulse" />
        <div className="h-3 w-[90%] bg-text-faint/10 rounded animate-pulse" />
        <div className="h-3 w-[70%] bg-text-faint/10 rounded animate-pulse" />
      </div>

      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent -translate-x-full"
        animate={{ x: ['100%', '-100%'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
      
      <div className="mt-4 flex justify-end">
        <div className="h-8 w-24 bg-accent/20 rounded-lg animate-pulse" />
      </div>
    </div>
  )
}
