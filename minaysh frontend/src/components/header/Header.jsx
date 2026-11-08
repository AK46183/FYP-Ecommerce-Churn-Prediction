import { useState } from 'react'
import TopHeader from './TopHeader.jsx'
import CategoryNav from './CategoryNav.jsx'
import MobileMenu from './MobileMenu.jsx'
import './Header.css'

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="site-header">
      <TopHeader onMenuToggle={() => setMobileOpen(true)} />
      <CategoryNav />
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  )
}
