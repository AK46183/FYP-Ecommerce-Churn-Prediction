import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import {
  LayoutDashboard, Package, Tags, Boxes, ShoppingBag, Users, TrendingDown,
  Sparkles, MessageSquare, BarChart3, Bell, Settings, LogOut, Menu, X,
  ChevronRight, Shield,
} from 'lucide-react'
import { useStore } from '@/context/StoreContext'

const navItems = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Products', to: '/admin/products', icon: Package },
  { label: 'Categories', to: '/admin/categories', icon: Tags },
  { label: 'Inventory', to: '/admin/inventory', icon: Boxes },
  { label: 'Orders', to: '/admin/orders', icon: ShoppingBag },
  { label: 'Customers', to: '/admin/customers', icon: Users },
  { label: 'Churn Analytics', to: '/admin/churn', icon: TrendingDown },
  { label: 'Segmentation', to: '/admin/segmentation', icon: Users },
  { label: 'Retention Actions', to: '/admin/retention', icon: Sparkles },
  { label: 'Chatbot Logs', to: '/admin/chatbot-logs', icon: MessageSquare },
  { label: 'Reports', to: '/admin/reports', icon: BarChart3 },
  { label: 'Notifications', to: '/admin/notifications', icon: Bell },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-white/[0.06] px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-400">
          <span className="font-display text-sm font-bold text-ink-950">N</span>
        </div>
        <div>
          <span className="font-display text-base font-bold tracking-tight text-white">NOVA</span>
          <span className="ml-2 rounded bg-accent-400/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-300">Admin</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-accent-400/10 text-accent-300'
                  : 'text-white/50 hover:bg-white/[0.04] hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`h-4 w-4 ${isActive ? 'text-accent-300' : 'text-white/40 group-hover:text-white/70'}`} />
                <span>{item.label}</span>
                {isActive && <ChevronRight className="ml-auto h-3.5 w-3.5 text-accent-300" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="border-t border-white/[0.06] p-3">
        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-400/20 text-sm font-semibold text-accent-300">
            {(user?.name || 'A')[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-white">{user?.name || 'Admin'}</p>
            <p className="truncate text-xs text-white/40">{user?.email || 'admin@nova.com'}</p>
          </div>
          <button onClick={handleLogout} className="text-white/40 transition-colors hover:text-rose-400">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-ink-950">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/[0.06] bg-ink-900 lg:block">
        {sidebar}
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-y-0 left-0 w-64 border-r border-white/[0.06] bg-ink-900"
            >
              {sidebar}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/[0.06] bg-ink-950/80 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-white/60 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 text-sm text-white/40">
              <Shield className="h-4 w-4 text-accent-400" />
              <span>Admin Portal</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-xs text-white/40 transition-colors hover:text-accent-300">
              View Store →
            </Link>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-400/20 text-sm font-semibold text-accent-300">
              {(user?.name || 'A')[0]}
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  )
}
