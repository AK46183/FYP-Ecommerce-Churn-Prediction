import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'new' | 'deal' | 'default'
  className?: string
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const styles = {
    new: 'bg-accent-400 text-ink-950',
    deal: 'bg-rose-500 text-white',
    default: 'bg-white/10 text-white/80',
  }
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  )
}

interface RatingProps {
  rating: number
  count?: number
  size?: 'sm' | 'md'
}

export function Rating({ rating, count, size = 'sm' }: RatingProps) {
  const starSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <svg
            key={i}
            className={`${starSize} ${i <= Math.round(rating) ? 'fill-accent-400 text-accent-400' : 'fill-white/10 text-white/10'}`}
            viewBox="0 0 20 20"
          >
            <path d="M10 1l2.928 6.282 6.85.568-5.196 4.526 1.554 6.748L10 16.692l-6.136 3.432 1.554-6.748L.222 8.462l6.85-.568z" />
          </svg>
        ))}
      </div>
      <span className={`${size === 'sm' ? 'text-xs' : 'text-sm'} font-medium text-white/60`}>
        {rating.toFixed(1)}
      </span>
      {count && <span className={`${size === 'sm' ? 'text-xs' : 'text-sm'} text-white/30`}>({count})</span>}
    </div>
  )
}

interface SectionHeaderProps {
  eyebrow?: string
  title: string
  subtitle?: string
  link?: { to: string; label: string }
  center?: boolean
}

export function SectionHeader({ eyebrow, title, subtitle, link, center }: SectionHeaderProps) {
  return (
    <div className={`flex flex-col gap-3 ${center ? 'items-center text-center' : 'sm:flex-row sm:items-end sm:justify-between'}`}>
      <div className={center ? 'max-w-2xl' : 'max-w-xl'}>
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="heading-md"
        >
          {title}
        </motion.h2>
        {subtitle && <p className="mt-3 text-white/50">{subtitle}</p>}
      </div>
      {link && (
        <Link
          to={link.to}
          className="group inline-flex items-center gap-2 text-sm font-medium text-white/70 transition-colors hover:text-accent-300"
        >
          {link.label}
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </Link>
      )}
    </div>
  )
}

interface IconButtonProps {
  icon: LucideIcon
  onClick?: () => void
  label: string
  active?: boolean
}

export function IconButton({ icon: Icon, onClick, label, active }: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
        active ? 'text-accent-300' : 'text-white/70 hover:text-white'
      }`}
    >
      <Icon className="h-5 w-5" />
    </button>
  )
}

export function PageHeader({ title, subtitle, breadcrumb }: { title: string; subtitle?: string; breadcrumb?: string }) {
  return (
    <div className="border-b border-white/[0.06] bg-ink-900/40">
      <div className="section-pad container-wide py-12 sm:py-16">
        {breadcrumb && (
          <p className="mb-3 text-sm text-white/40">{breadcrumb}</p>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="heading-lg"
        >
          {title}
        </motion.h1>
        {subtitle && <p className="mt-4 max-w-2xl text-white/50">{subtitle}</p>}
      </div>
    </div>
  )
}

export function EmptyState({ icon: Icon, title, description, action }: { icon: LucideIcon; title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.06] bg-ink-800/60">
        <Icon className="h-7 w-7 text-white/40" />
      </div>
      <h3 className="font-display text-xl font-medium text-white">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-white/40">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
