'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Rocket, CreditCard, MessageCircle, Diamond } from 'lucide-react'

const steps = [
  {
    icon: Rocket,
    title: 'Click Launch',
    description: 'Enter the app instantly. No signup, no password, no friction.',
  },
  {
    icon: CreditCard,
    title: 'Add Transactions',
    description: 'Takes only 5 seconds. AI detects categories automatically.',
  },
  {
    icon: MessageCircle,
    title: 'Ask AI Anything',
    description: 'Chat with your data and get personalized financial advice.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 px-6 max-w-7xl mx-auto overflow-hidden">
      <div className="text-center mb-24">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display font-black text-5xl md:text-7xl mb-6 tracking-tight"
        >
          Up and running in seconds
        </motion.h2>
      </div>

      <div className="relative">
        {/* Animated Background Line */}
        <div className="hidden lg:block absolute top-[70px] left-[15%] right-[15%] h-[4px]">
          <div className="absolute inset-0 bg-white/5 rounded-full" />
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: '100%' }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="h-full bg-gradient-to-r from-accent via-blue to-accent shadow-[0_0_20px_rgba(124,58,237,0.5)] rounded-full"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-12 relative z-10">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-32 h-32 rounded-full bg-bg border-4 border-surface shadow-2xl flex items-center justify-center mb-10 group-hover:scale-110 group-hover:border-accent transition-all duration-500 overflow-hidden relative">
                <div className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-10 transition-opacity" />
                <step.icon size={48} className="text-accent group-hover:animate-bounce" />
                <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-accent text-white font-black flex items-center justify-center text-xl shadow-glow">
                   {i + 1}
                </div>
              </div>
              <h3 className="font-display font-black text-3xl mb-4 tracking-tight">{step.title}</h3>
              <p className="text-text-muted text-lg max-w-[280px] font-medium leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-48 text-center relative"
      >
        <div className="absolute inset-0 -z-10 bg-accent/20 blur-[160px] rounded-full scale-50" />
        <h2 className="font-display font-black text-5xl md:text-[8rem] mb-16 tracking-tighter leading-none">
          Ready to take<br/>control?
        </h2>
        <div className="relative inline-block group">
           <div className="absolute inset-0 bg-accent blur-[40px] opacity-40 group-hover:opacity-60 transition-opacity" />
           <Link
             href="/dashboard"
             className="relative px-12 py-6 bg-accent text-white font-black text-2xl rounded-3xl shadow-glow hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-4"
           >
             <Diamond size={28} className="fill-white/20" /> Launch Finary Demo
           </Link>
        </div>
      </motion.div>
    </section>
  )
}
