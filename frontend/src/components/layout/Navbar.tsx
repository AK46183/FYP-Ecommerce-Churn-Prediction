import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingCart, Search, User, Menu, X, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useStore } from '@/context/StoreContext'
import { useScrollDirection } from '@/hooks'
import { categories } from '@/data/products'

export default function Navbar({ onOpenSearch }: { onOpenSearch?: () => void }) {
  const { cartCount, wishlist, user } = useStore()
  const { scrolled } = useScrollDirection()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const navItems = [
    { label: 'Home', to: '/' },
    { label: 'Shop', to: '/shop' },
    { label: 'New Arrivals', to: '/shop?filter=new' },
    { label: 'Deals', to: '/shop?filter=deals' },
  ]

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? 'border-b border-white/[0.06] bg-ink-950/80 backdrop-blur-2xl' : 'bg-transparent'
        }`}
      >
        <nav className="container-wide section-pad flex h-16 items-center justify-between gap-4 lg:h-18">
          {/* Left: Logo + Desktop Nav */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-400">
                <span className="font-display text-sm font-bold text-ink-950">N</span>
              </div>
              <span className="font-display text-lg font-bold tracking-tight text-white">NOVA</span>
            </Link>

            <div className="hidden items-center gap-6 lg:flex">
              {navItems.map((item) => (
                <Link key={item.to} to={item.to} className="nav-link group">
                  {item.label}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent-400 transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
              {/* Categories dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setCategoriesOpen(true)}
                onMouseLeave={() => setCategoriesOpen(false)}
              >
                <button className="nav-link group flex items-center gap-1">
                  Categories
                  <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180" />
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent-400 transition-all duration-300 group-hover:w-full" />
                </button>
                <AnimatePresence>
                  {categoriesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.25 }}
                      className="absolute left-1/2 top-full w-[520px] -translate-x-1/2 pt-4"
                    >
                      <div className="grid grid-cols-2 gap-1 rounded-2xl border border-white/[0.08] bg-ink-900/95 p-3 backdrop-blur-2xl">
                        {categories.map((cat) => (
                          <Link
                            key={cat.id}
                            to={`/category/${cat.slug}`}
                            className="group rounded-xl p-3 transition-colors hover:bg-white/[0.04]"
                          >
                            <p className="font-display text-sm font-medium text-white">{cat.name}</p>
                            <p className="mt-0.5 text-xs text-white/40">{cat.description}</p>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={onOpenSearch}
              aria-label="Search"
              className="flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition-colors hover:text-white"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative hidden h-10 w-10 items-center justify-center rounded-full text-white/70 transition-colors hover:text-white sm:flex"
            >
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              aria-label="Cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition-colors hover:text-white"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-400 px-1 text-[10px] font-bold text-ink-950">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              to={user ? (user.role === 'admin' ? '/admin' : '/profile') : '/login'}
              aria-label="Account"
              className="hidden h-10 w-10 items-center justify-center rounded-full text-white/70 transition-colors hover:text-white sm:flex"
            >
              <User className="h-5 w-5" />
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Menu"
              className="flex h-10 w-10 items-center justify-center rounded-full text-white lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] lg:hidden"
          >
            <div className="absolute inset-0 bg-ink-950/90 backdrop-blur-xl" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 top-0 h-full w-[85%] max-w-sm overflow-y-auto border-l border-white/[0.08] bg-ink-900 p-6"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-lg font-bold text-white">NOVA</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-white/60"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-8 flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl px-4 py-3 text-base font-medium text-white/80 transition-colors hover:bg-white/[0.04] hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <p className="mt-8 mb-3 px-4 text-xs font-medium uppercase tracking-[0.2em] text-white/30">Categories</p>
              <div className="flex flex-col gap-1">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl px-4 py-2.5 text-sm text-white/60 transition-colors hover:bg-white/[0.04] hover:text-white"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-1 border-t border-white/[0.06] pt-6">
                <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="rounded-xl px-4 py-3 text-sm text-white/60 hover:text-white">
                  Wishlist
                </Link>
                <Link to={user ? '/profile' : '/login'} onClick={() => setMobileOpen(false)} className="rounded-xl px-4 py-3 text-sm text-white/60 hover:text-white">
                  Account
                </Link>
                <Link to="/about" onClick={() => setMobileOpen(false)} className="rounded-xl px-4 py-3 text-sm text-white/60 hover:text-white">
                  About
                </Link>
                <Link to="/contact" onClick={() => setMobileOpen(false)} className="rounded-xl px-4 py-3 text-sm text-white/60 hover:text-white">
                  Contact
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
