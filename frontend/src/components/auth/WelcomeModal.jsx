import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Check } from 'lucide-react'

import { useAuth } from '../../context/AuthContext.jsx'
import './WelcomeModal.css'

// ============================================================
// MINAYSH - login welcome animation
//
// 1. After sign in, a glowing profile card appears in the middle
// 2. A ring draws around the avatar, then "Profile ready" pops in
// 3. The card shrinks and flies into the profile logo in the header
//    (the element with id="header-avatar" in TopHeader.jsx)
// ============================================================

const SHOW_FLAG = 'minaysh_show_welcome'
const HOLD_MS = 2300 // how long the card stays before flying
const AUTH_PAGES = ['/login', '/register', '/forgot-password']

export default function WelcomeModal() {
  const { user } = useAuth()
  const location = useLocation()
  const reduceMotion = useReducedMotion()

  // hidden -> show -> fly
  const [phase, setPhase] = useState('hidden')
  const [target, setTarget] = useState(null)
  const cardRef = useRef(null)
  const timerRef = useRef(null)

  // Start when the login page set the flag
  useEffect(() => {
    if (!user || AUTH_PAGES.includes(location.pathname)) return

    let shouldShow = null
    try {
      shouldShow = sessionStorage.getItem(SHOW_FLAG)
      if (shouldShow === '1') sessionStorage.removeItem(SHOW_FLAG)
    } catch {
      // storage unavailable
    }
    if (shouldShow === '1') setPhase('show')
  }, [location.pathname, user])

  const fly = useCallback(() => {
    clearTimeout(timerRef.current)

    const avatar = document.getElementById('header-avatar')
    const card = cardRef.current
    if (!avatar || !card || reduceMotion) {
      setTarget(null)
      setPhase('fly')
      return
    }

    const a = avatar.getBoundingClientRect()
    const c = card.getBoundingClientRect()
    setTarget({
      x: a.left + a.width / 2 - (c.left + c.width / 2),
      y: a.top + a.height / 2 - (c.top + c.height / 2),
      // separate X / Y scale so the tall card lands as a perfect circle
      scaleX: a.width / c.width,
      scaleY: a.height / c.height,
    })
    setPhase('fly')
  }, [reduceMotion])

  // Hold the card, then fly
  useEffect(() => {
    if (phase !== 'show') return undefined
    timerRef.current = setTimeout(fly, HOLD_MS)

    function onKey(event) {
      if (event.key === 'Escape') fly()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(timerRef.current)
      window.removeEventListener('keydown', onKey)
    }
  }, [phase, fly])

  function handleFlyComplete() {
    if (phase !== 'fly') return
    setPhase('hidden')
    setTarget(null)
    // tell the header logo to do a small "pop"
    window.dispatchEvent(new Event('minaysh:avatar-pop'))
  }

  if (!user) return null

  const name = user.name || user.email?.split('@')[0] || 'Beauty'
  const initial = name.slice(0, 1).toUpperCase()

  const cardAnimate =
    phase === 'fly'
      ? target
        ? {
            x: target.x,
            y: target.y,
            scaleX: target.scaleX,
            scaleY: target.scaleY,
            borderRadius: '50%',
            opacity: 1,
            transition: { duration: 0.85, ease: [0.7, 0, 0.3, 1] },
          }
        : { opacity: 0, scale: 0.9, transition: { duration: 0.35 } }
      : { x: 0, y: 0, scaleX: 1, scaleY: 1, opacity: 1, borderRadius: '22px' }

  return (
    <AnimatePresence>
      {phase !== 'hidden' && (
        <div className="min-welcome" key="welcome">
          {/* dim background: fades away while the card flies (separate layer,
              so the card itself stays visible all the way to the header) */}
          <motion.div
            className="min-welcome__backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'fly' ? 0 : 1 }}
            transition={{ duration: phase === 'fly' ? 0.5 : 0.35 }}
            onClick={fly}
          />

          <motion.section
            ref={cardRef}
            className={`min-welcome__card ${phase === 'fly' ? 'is-flying' : ''}`}
            role="status"
            aria-live="polite"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scaleX: 0.8, scaleY: 0.8, y: 30 }}
            animate={cardAnimate}
            transition={{ type: 'spring', stiffness: 240, damping: 22 }}
            onAnimationComplete={handleFlyComplete}
            onClick={(event) => {
              event.stopPropagation()
              fly()
            }}
          >
            {/* everything inside fades out while the card becomes the logo */}
            <motion.div
              className="min-welcome__content"
              animate={{ opacity: phase === 'fly' ? 0 : 1 }}
              transition={{ duration: 0.25 }}
            >
              <div className="min-welcome__avatar-wrap">
                <svg className="min-welcome__ring" viewBox="0 0 100 100" aria-hidden="true">
                  <circle className="min-welcome__ring-track" cx="50" cy="50" r="46" />
                  <motion.circle
                    className="min-welcome__ring-progress"
                    cx="50"
                    cy="50"
                    r="46"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.9, delay: 0.35, ease: 'easeInOut' }}
                  />
                </svg>
                <div className="min-welcome__avatar">{initial}</div>
              </div>

              <p className="min-welcome__eyebrow">WELCOME TO MINAYSH</p>
              <h2 className="min-welcome__name">{name}</h2>
              <p className="min-welcome__email">{user.email}</p>

              <motion.span
                className="min-welcome__pill"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.25, type: 'spring', stiffness: 380, damping: 18 }}
              >
                <Check size={14} strokeWidth={2.5} /> Profile ready
              </motion.span>
            </motion.div>

          </motion.section>
        </div>
      )}
    </AnimatePresence>
  )
}
