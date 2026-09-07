import { motion } from 'framer-motion'
import { useCountUp, useInView } from '@/hooks'
import { useRef } from 'react'
import type { LucideIcon } from 'lucide-react'
import { ArrowUp, ArrowDown } from 'lucide-react'

export function StatCard({ icon: Icon, label, value, prefix = '', suffix = '', change, index = 0 }: { icon: LucideIcon; label: string; value: number; prefix?: string; suffix?: string; change?: number; index?: number }) {
  const { ref, inView } = useInView()
  const count = useCountUp(value, 1500, inView)
  const isPositive = (change ?? 0) > 0

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08, duration: 0.5 }} className="rounded-2xl border border-white/[0.06] bg-ink-800/40 p-5">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-400/10"><Icon className="h-5 w-5 text-accent-300" /></div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-green-400' : 'text-rose-400'}`}>
            {isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <p className="mt-4 font-display text-2xl font-semibold text-white">{prefix}{Math.round(count).toLocaleString()}{suffix}</p>
      <p className="mt-1 text-xs text-white/40">{label}</p>
    </motion.div>
  )
}

export function AdminCard({ children, className = '', title, action }: { children: React.ReactNode; className?: string; title?: string; action?: React.ReactNode }) {
  return (
    <div className={`rounded-2xl border border-white/[0.06] bg-ink-800/40 p-5 sm:p-6 ${className}`}>
      {title && (
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-base font-semibold text-white">{title}</h3>
          {action}
        </div>
      )}
      {children}
    </div>
  )
}

export function RiskBadge({ level }: { level: 'High' | 'Medium' | 'Low' }) {
  const styles = {
    High: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
    Medium: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    Low: 'bg-green-500/15 text-green-400 border-green-500/20',
  }
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[level]}`}>{level} Risk</span>
}

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Delivered: 'bg-green-500/10 text-green-400',
    Shipped: 'bg-accent-400/10 text-accent-300',
    Processing: 'bg-amber-500/10 text-amber-400',
    Pending: 'bg-white/10 text-white/60',
    Cancelled: 'bg-rose-500/10 text-rose-400',
    Active: 'bg-green-500/10 text-green-400',
    'At Risk': 'bg-amber-500/10 text-amber-400',
    Churned: 'bg-rose-500/10 text-rose-400',
    New: 'bg-accent-400/10 text-accent-300',
  }
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] || styles.Pending}`}>{status}</span>
}

export function PageTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-white">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-white/40">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
