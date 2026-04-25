'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { useRef } from 'react'
import { TrendingUp, PieChart, Wallet, Bot, Diamond } from 'lucide-react'

export default function Hero() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9])

  const words = ["Track Smarter.", "Spend Better.", "Live Freely."]

  return (
    <section ref={containerRef} className="relative pt-48 pb-20 px-6 flex flex-col items-center text-center overflow-hidden min-h-screen">
      {/* Background Blobs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.08, 0.12, 0.08]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-0 -translate-x-1/2 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[140px] pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.05, 0.08, 0.05]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 right-0 translate-x-1/2 w-[500px] h-[500px] bg-blue/10 rounded-full blur-[120px] pointer-events-none" 
      />

      <motion.div style={{ y, opacity, scale }} className="flex flex-col items-center">
        {/* Badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
          className="mb-8 px-4 py-1.5 rounded-full border border-accent/40 bg-accent-dim text-accent text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 shadow-[0_0_20px_rgba(124,58,237,0.2)]"
        >
          <span className="animate-pulse">✦</span> AI-Powered Personal Finance <span>✦</span>
        </motion.div>

        {/* Headline */}
        <h1 className="font-display font-black text-6xl md:text-[10rem] leading-[0.9] mb-8 tracking-tighter">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ y: 100, opacity: 0, rotate: 2 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`block ${i === 2 ? 'bg-gradient-to-r from-accent via-blue to-accent bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-x' : 'text-text'}`}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="max-w-[600px] text-text-muted text-lg md:text-2xl mb-12 font-medium leading-relaxed"
        >
          Your AI financial assistant that learns your habits, spots patterns, and gives real advice — not just charts.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row gap-6 mb-16"
        >
          <Link
            href="/dashboard"
            className="group relative px-10 py-5 bg-accent text-white font-bold rounded-2xl shadow-glow overflow-hidden transition-all hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative flex items-center gap-3 text-lg">
              <Diamond size={20} className="fill-white/20" /> Launch Demo — It&apos;s Free
            </span>
          </Link>
          <Link
            href="https://github.com/emdes515/finary-personal-finance-app"
            target="_blank"
            className="px-10 py-5 bg-surface-2 border border-border hover:border-accent/50 hover:bg-surface-3 text-text font-bold rounded-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-3 text-lg"
          >
            <span className="text-accent">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </span> 
            GitHub Repo
          </Link>
        </motion.div>
      </motion.div>

      {/* Social Proof */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
        className="text-text-faint text-xs font-bold uppercase tracking-[0.2em] mb-24 flex items-center gap-6"
      >
        <div className="h-[1px] w-12 bg-border" />
        <span>Trusted by 2,400+ users</span>
        <div className="h-[1px] w-12 bg-border" />
      </motion.div>

      {/* Dashboard Mockup */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ perspective: 2000 }}
        className="w-full max-w-6xl mx-auto px-4"
      >
        <motion.div
          animate={{
            rotateX: [12, 10, 12],
            rotateY: [-5, -6, -5],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative bg-[#0a0a0a] rounded-[2rem] border border-white/10 shadow-[0_50px_100px_-20px_rgba(124,58,237,0.3)] overflow-hidden aspect-[16/10] group"
        >
           {/* Mockup Top Bar */}
           <div className="h-12 border-b border-white/5 bg-white/[0.02] flex items-center px-6 justify-between">
              <div className="flex gap-2">
                 <div className="w-3 h-3 rounded-full bg-red/40" />
                 <div className="w-3 h-3 rounded-full bg-yellow/40" />
                 <div className="w-3 h-3 rounded-full bg-green/40" />
              </div>
              <div className="w-1/3 h-6 bg-white/5 rounded-full" />
              <div className="w-8 h-8 rounded-full bg-accent/20" />
           </div>

           {/* Mockup Content */}
           <div className="flex h-full">
              {/* Sidebar */}
              <div className="w-48 border-r border-white/5 p-6 space-y-4 hidden md:block">
                 {[1,2,3,4,5].map(i => (
                   <div key={i} className={`h-8 rounded-lg ${i === 1 ? 'bg-accent/20 border border-accent/30' : 'bg-white/5'}`} />
                 ))}
              </div>
              
              {/* Main Area */}
              <div className="flex-1 p-8 space-y-8">
                 <div className="grid grid-cols-4 gap-4">
                    {[
                      { icon: Wallet, color: 'text-green' },
                      { icon: TrendingUp, color: 'text-red' },
                      { icon: PieChart, color: 'text-accent' },
                      { icon: Bot, color: 'text-blue' }
                    ].map((item, i) => (
                      <div key={i} className="h-32 rounded-2xl bg-white/[0.03] border border-white/5 p-4 flex flex-col justify-between">
                         <item.icon size={20} className={item.color} />
                         <div className="h-4 w-1/2 bg-white/10 rounded-full" />
                         <div className="h-6 w-3/4 bg-white/20 rounded-full" />
                      </div>
                    ))}
                 </div>
                 
                 <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-2 h-64 rounded-3xl bg-white/[0.03] border border-white/5 p-6 overflow-hidden relative">
                       <div className="flex justify-between mb-8">
                          <div className="w-1/3 h-6 bg-white/10 rounded-full" />
                          <div className="w-1/4 h-6 bg-white/10 rounded-full" />
                       </div>
                       {/* SVG Chart Line */}
                       <svg className="absolute bottom-0 left-0 w-full h-32 text-accent/20" preserveAspectRatio="none">
                          <motion.path 
                            d="M0 100 Q 150 20, 300 80 T 600 30 T 900 70" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="4"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 2, delay: 2 }}
                          />
                       </svg>
                    </div>
                    <div className="h-64 rounded-3xl bg-white/[0.03] border border-white/5 p-6 flex flex-col items-center justify-center gap-4">
                       <div className="w-32 h-32 rounded-full border-8 border-accent/20 border-t-accent" />
                       <div className="w-1/2 h-4 bg-white/10 rounded-full" />
                    </div>
                 </div>
              </div>
           </div>
           
           {/* Glass Overlay */}
           <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent pointer-events-none" />
           
           {/* Interactive Button */}
           <Link href="/dashboard" className="absolute bottom-12 left-1/2 -translate-x-1/2 px-8 py-4 bg-white text-black font-black rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 shadow-2xl scale-90 group-hover:scale-100">
              OPEN DASHBOARD
           </Link>
        </motion.div>
        
        {/* Glow effect */}
        <div className="w-3/4 h-32 bg-accent/30 blur-[120px] mx-auto -mt-20 -z-10" />
      </motion.div>
    </section>
  )
}
