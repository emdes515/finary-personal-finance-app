'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Code, Diamond } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

export default function Navbar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 pt-2 md:pt-4">
      {/* Top Author Bar */}
      <div className="bg-bg/60 backdrop-blur-md border border-accent/20 py-1.5 px-4 rounded-full flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.2em] text-accent/80 mb-2 max-w-7xl mx-auto shadow-xl">
         <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-surface-3 border border-accent/30 overflow-hidden bg-[url('https://github.com/mateuszjankowski.png')] bg-cover bg-center" />
            <span className="hidden sm:inline">Built by Mateusz Jankowski</span>
            <span className="sm:hidden">by Mateusz</span>
         </div>
         <div className="flex items-center gap-4">
           <Link 
             href="https://github.com/mateuszjankowski/finary" 
             target="_blank"
             className="flex items-center gap-2 hover:text-accent transition-colors"
           >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
              <span>Repo</span>
           </Link>
           <Link 
             href="https://github.com/mateuszjankowski" 
             target="_blank"
             className="flex items-center gap-2 hover:text-accent transition-colors"
           >
              <Code size={12} />
              Profile
           </Link>
         </div>
      </div>

      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 backdrop-blur-xl bg-bg/80 border border-border rounded-2xl shadow-2xl"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-bold shadow-glow">
             <Diamond size={18} className="fill-white/20" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">Finary</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm text-text-muted hover:text-text transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" className="text-sm text-text-muted hover:text-text transition-colors">
            How it works
          </Link>
          <Link href="https://github.com/mateuszjankowski/finary" target="_blank" className="text-sm text-text-muted hover:text-text transition-colors flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
            Star on GitHub
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/dashboard"
            className="px-5 py-2 bg-accent text-white text-sm font-medium rounded-full shadow-glow hover:brightness-110 hover:scale-105 transition-all"
          >
            → Launch App
          </Link>
        </div>
      </motion.nav>
    </div>
  )
}
