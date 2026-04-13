'use client'

import { motion } from 'framer-motion'
import { 
  Bot, 
  BarChart3, 
  Target, 
  Zap, 
  Calendar, 
  Lock 
} from 'lucide-react'

const features = [
  {
    icon: Bot,
    title: 'AI Insights',
    color: 'text-accent',
    bg: 'bg-accent/10',
    description: 'Ask your AI assistant about any transaction or pattern and get real advice.',
  },
  {
    icon: BarChart3,
    title: 'Live Charts',
    color: 'text-blue',
    bg: 'bg-blue/10',
    description: 'Visual spending breakdown with real-time updates and interactive dashboards.',
  },
  {
    icon: Target,
    title: 'Smart Goals',
    color: 'text-green',
    bg: 'bg-green/10',
    description: 'Set targets and AI tracks your progress automatically with monthly advice.',
  },
  {
    icon: Zap,
    title: 'Quick Add',
    color: 'text-yellow',
    bg: 'bg-yellow/10',
    description: 'Add expense in 2 taps with smart category detection and description parsing.',
  },
  {
    icon: Calendar,
    title: 'Monthly View',
    color: 'text-red',
    bg: 'bg-red/10',
    description: 'Navigate months, see trends and compare periods side by side easily.',
  },
  {
    icon: Lock,
    title: '100% Private',
    color: 'text-blue',
    bg: 'bg-blue/10',
    description: 'All data stays in your browser, never uploaded anywhere. Your privacy first.',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-32 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-24">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display font-black text-5xl md:text-7xl mb-6 tracking-tight"
        >
          Master your money
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-text-muted text-xl max-w-2xl mx-auto font-medium"
        >
          Everything you need to take control of your financial future.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group p-10 bg-surface border border-border rounded-[2.5rem] hover:border-accent/40 hover:-translate-y-2 transition-all duration-500 shadow-xl"
          >
            <div className={`w-16 h-16 rounded-2xl ${feature.bg} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
              <feature.icon className={`${feature.color}`} size={32} />
            </div>
            <h3 className="font-display font-black text-2xl mb-4 tracking-tight">{feature.title}</h3>
            <p className="text-text-muted leading-relaxed font-medium">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
