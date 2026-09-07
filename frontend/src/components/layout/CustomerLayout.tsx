import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import Chatbot from '@/components/chatbot/Chatbot'
import SearchOverlay from '@/components/search/SearchOverlay'
import QuickViewModal from '@/components/QuickViewModal'
import type { Product } from '@/data/products'

export interface CustomerOutletContext {
  openQuickView: (product: Product) => void
}

export default function CustomerLayout() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [quickView, setQuickView] = useState<Product | null>(null)

  return (
    <div className="relative min-h-screen bg-ink-950">
      {/* Ambient background glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-accent-500/[0.06] blur-[120px]" />
        <div className="absolute right-[-10%] top-[40%] h-[600px] w-[600px] rounded-full bg-accent-700/[0.04] blur-[140px]" />
      </div>

      <Navbar onOpenSearch={() => setSearchOpen(true)} />

      <main className="relative z-10">
        <Outlet context={{ openQuickView: setQuickView } satisfies CustomerOutletContext} />
      </main>

      <Footer />
      <Chatbot />

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
    </div>
  )
}
