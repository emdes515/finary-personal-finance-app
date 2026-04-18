'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  variant = 'danger'
}: ConfirmationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-bg/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-md bg-surface border border-border rounded-[32px] overflow-hidden shadow-2xl p-8"
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
              variant === 'danger' ? 'bg-red-dim text-red' : 
              variant === 'warning' ? 'bg-yellow/10 text-yellow' : 
              'bg-accent-dim text-accent'
            }`}>
              <AlertTriangle size={32} />
            </div>

            <h3 className="text-2xl font-display font-bold mb-2">{title}</h3>
            <p className="text-text-muted mb-8">{message}</p>

            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 py-4 bg-surface-2 hover:bg-surface-3 text-text font-bold rounded-2xl transition-all"
              >
                {cancelText}
              </button>
              <button
                onClick={() => {
                  onConfirm()
                  onClose()
                }}
                className={`flex-1 py-4 text-white font-bold rounded-2xl shadow-lg transition-all hover:brightness-110 active:scale-95 ${
                  variant === 'danger' ? 'bg-red' : 
                  variant === 'warning' ? 'bg-yellow' : 
                  'bg-accent'
                }`}
              >
                {confirmText}
              </button>
            </div>

            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-text-muted hover:text-text rounded-full hover:bg-white/5 transition-all"
            >
              <X size={20} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
