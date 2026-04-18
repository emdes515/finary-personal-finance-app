'use client'

import { useEffect } from 'react'
import { useFinaryStore } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

export default function ToastContainer() {
  const toasts = useFinaryStore((state) => state.toasts)
  const removeToast = useFinaryStore((state) => state.removeToast)

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  )
}

function ToastItem({ toast, onRemove }: { toast: any, onRemove: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 3000)
    return () => clearTimeout(timer)
  }, [toast.id, onRemove])

  const icons = {
    success: <CheckCircle2 className="text-green" size={20} />,
    error: <AlertCircle className="text-red" size={20} />,
    info: <Info className="text-accent" size={20} />,
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.9 }}
      className="pointer-events-auto bg-surface border border-border rounded-2xl p-4 shadow-2xl flex items-center gap-3 min-w-[240px]"
    >
      {icons[toast.type as keyof typeof icons]}
      <span className="text-sm font-bold flex-1">{toast.message}</span>
      <button onClick={() => onRemove(toast.id)} className="text-text-faint hover:text-text">
        <X size={16} />
      </button>
    </motion.div>
  )
}
