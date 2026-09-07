import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Cpu, Sparkles, Target, Rocket, ArrowRight } from 'lucide-react'
import { SectionHeader } from '@/components/ui'

export default function About() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }} transition={{ duration: 8, repeat: Infinity }} className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-500/10 blur-[120px]" />
        <div className="container-wide section-pad relative z-10 text-center">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="eyebrow mb-6">Our Story</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="heading-xl">Engineering the future of electronics.</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="mx-auto mt-6 max-w-2xl text-lg text-white/50">NOVA is a premium electronics brand built on a simple belief — technology should feel extraordinary. We curate the finest devices, pair them with AI-driven intelligence, and deliver an experience that's as exceptional as the products themselves.</motion.p>
        </div>
      </section>

      {/* Values */}
      <section className="container-wide section-pad py-20">
        <SectionHeader eyebrow="What drives us" title="Our Principles" center />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Cpu, title: 'Innovation', desc: 'We seek out the most advanced technology and make it accessible.' },
            { icon: Sparkles, title: 'AI-Powered', desc: 'Every shopping experience is enhanced by intelligent personalization.' },
            { icon: Target, title: 'Precision', desc: 'We obsess over the details — from product curation to packaging.' },
            { icon: Rocket, title: 'Future-First', desc: 'We build for what\'s next, not what\'s now.' },
          ].map((value, i) => (
            <motion.div key={value.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }} className="rounded-2xl border border-white/[0.06] bg-ink-800/40 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-400/10"><value.icon className="h-6 w-6 text-accent-300" /></div>
              <h3 className="mt-4 font-display text-lg font-medium text-white">{value.title}</h3>
              <p className="mt-2 text-sm text-white/50">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FYP banner */}
      <section className="container-wide section-pad py-20">
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-br from-ink-800 to-ink-900 p-8 sm:p-12 lg:p-16">
          <div className="absolute -right-20 -top-20 h-[400px] w-[400px] rounded-full bg-accent-500/10 blur-[100px]" />
          <div className="relative z-10 max-w-2xl">
            <p className="eyebrow mb-4">Final Year Project</p>
            <h2 className="heading-lg">AI-Driven E-Commerce Analytics System with Intelligent Chatbot and Customer Churn Prediction</h2>
            <p className="mt-4 text-white/50">This platform is a comprehensive FYP that combines a premium e-commerce frontend with AI-powered features including an intelligent chatbot assistant, customer behavior tracking, and machine learning-based churn prediction — all designed for industrial-level deployment.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[{ label: 'Customer Pages', value: '20+' }, { label: 'Admin Pages', value: '17+' }, { label: 'AI Features', value: '3' }].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-white/[0.06] bg-ink-800/40 p-4 text-center">
                  <p className="font-display text-3xl font-semibold text-accent-300">{stat.value}</p>
                  <p className="mt-1 text-xs text-white/40">{stat.label}</p>
                </div>
              ))}
            </div>
            <Link to="/shop" className="btn-accent mt-8 group">Explore the Platform <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
          </div>
        </div>
      </section>
    </div>
  )
}
