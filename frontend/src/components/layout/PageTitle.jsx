import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Gives every page its own browser-tab title, e.g. "Lipstick | MINAYSH".
// It reads the page's main heading (h1), so new pages get a title by themselves.
const SITE = 'MINAYSH'
const HOME_TITLE = 'MINAYSH — Beauty, Confidence, You'

function tidy(text) {
  const t = String(text || '').replace(/\s+/g, ' ').trim()
  if (!t) return ''
  // headings written in capitals ("SKIN CARE") become "Skin Care"
  return t === t.toUpperCase() ? t.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase()) : t
}

export default function PageTitle() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    if (pathname === '/') {
      document.title = HOME_TITLE
      return undefined
    }
    const update = () => {
      const heading = document.querySelector('main h1') || document.querySelector('h1')
      const name = tidy(heading?.textContent)
      document.title = name ? `${name} | ${SITE}` : HOME_TITLE
    }
    update()
    const timer = window.setTimeout(update, 400) // pages that fill in a moment later
    return () => window.clearTimeout(timer)
  }, [pathname, search])

  return null
}
