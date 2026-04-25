import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import HowItWorks from '@/components/landing/HowItWorks'
import ParticleBackground from '@/components/landing/ParticleBackground'
import Link from 'next/link'
import { Code, X, Briefcase, Diamond } from 'lucide-react'

export default function LandingPage() {
  return (
    <main className="relative min-h-screen selection:bg-accent selection:text-white bg-bg text-text">
      <ParticleBackground />
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      
      {/* Footer Enhanced */}
      <footer className="py-24 px-6 border-t border-border bg-surface/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
           <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                 <Diamond className="text-accent fill-accent/20" size={32} />
                 <span className="font-display font-black text-2xl tracking-tight uppercase">Finary</span>
              </div>
              <p className="text-text-muted max-w-sm mb-8 font-medium">
                 The next generation of personal finance tracking. 
                 AI-powered, 100% private, and built for people who want to master their money.
              </p>
              <div className="flex gap-4">
                 {[Code, X, Briefcase].map((Icon, i) => (
                   <Link key={i} href="#" className="w-10 h-10 rounded-xl bg-surface-2 border border-border flex items-center justify-center hover:border-accent hover:text-accent transition-all">
                      <Icon size={20} />
                   </Link>
                 ))}
              </div>
           </div>
           
           <div>
              <h4 className="font-display font-black text-sm uppercase tracking-widest mb-6">Product</h4>
              <ul className="space-y-4 text-sm text-text-muted font-bold">
                 <li><Link href="#features" className="hover:text-accent transition-colors">Features</Link></li>
                 <li><Link href="#how-it-works" className="hover:text-accent transition-colors">How it works</Link></li>
                 <li><Link href="/dashboard" className="hover:text-accent transition-colors">Launch Demo</Link></li>
              </ul>
           </div>
           
           <div>
              <h4 className="font-display font-black text-sm uppercase tracking-widest mb-6">Developer</h4>
              <div className="flex flex-col gap-4">
                 <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-surface-3 border border-border overflow-hidden bg-[url('/mateusz.jpg')] bg-cover bg-center" />
                    <div>
                       <div className="text-sm font-black">emdes515</div>
                       <div className="text-[10px] text-accent font-bold uppercase tracking-widest">Full-stack Dev</div>
                    </div>
                 </div>
                 <Link href="https://github.com/emdes515" target="_blank" className="text-xs text-text-muted font-bold hover:text-white transition-colors">
                    github.com/emdes515
                 </Link>
              </div>
           </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
           <p className="text-text-faint text-xs font-bold uppercase tracking-[0.2em]">
              © 2026 Finary App. No rights reserved. Built with ❤️ for the community.
           </p>
           <p className="text-text-faint text-xs font-bold uppercase tracking-[0.2em]">
              100% Privacy First · Open Source
           </p>
        </div>
      </footer>
    </main>
  )
}
