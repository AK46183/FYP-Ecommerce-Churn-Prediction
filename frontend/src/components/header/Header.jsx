import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import TopHeader from './TopHeader.jsx'
import CategoryNav from './CategoryNav.jsx'
import MobileMenu from './MobileMenu.jsx'
import './Header.css'
// Home page par transparent header (peeche hero video). Pasand na aaye to:
//   neeche TRANSPARENT_ON_HOME = false kar dein (ya yeh import aur TransparentHeader.css file delete kar dein)
import './TransparentHeader.css'

const TRANSPARENT_ON_HOME = true

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()
  const onHome = TRANSPARENT_ON_HOME && pathname === '/'
  const [atTop, setAtTop] = useState(true)

  // Hero ke upar ho to transparent; neeche scroll karein to wapas safed
  useEffect(() => {
    if (!onHome) return undefined
    const onScroll = () => setAtTop(window.scrollY < 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [onHome])

  const classes = ['site-header']
  if (onHome) classes.push('site-header--home')
  if (onHome && atTop && !mobileOpen) classes.push('site-header--clear')

  return (
    <header className={classes.join(' ')}>
      <TopHeader onMenuToggle={() => setMobileOpen(true)} />
      <CategoryNav />
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  )
}
