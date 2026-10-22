import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check } from 'lucide-react'
import { useCart } from '../../context/CartContext.jsx'
import './FlyToCart.css'

// ============================================================
// MINAYSH - "Add to Bag" card (same feel as the login profile card)
//
// 1. A glowing card pops up in the middle: product photo, green tick,
//    "Added to bag successfully!", product name
// 2. The SAME card shrinks into a circle and flies into the bag icon
// 3. The bag icon bounces and the shopping bag drawer opens
//
// CartContext.addItem() fires 'minaysh:added-to-cart', so this works
// for every "Add to Bag" button on the site without extra code.
// ============================================================

const HOLD_MS = 1200 // how long the card stays in the middle
const FLY_MS = 750 // flight to the bag icon
const OPEN_DELAY_MS = 200 // pause after landing, then the drawer opens

// Find the bag icon in the header (id first, then any visible link to /cart)
function findBagIcon() {
  const candidates = [
    document.getElementById('header-cart'),
    ...document.querySelectorAll('a[href="/cart"]'),
  ].filter(Boolean)
  return candidates.find((el) => {
    const r = el.getBoundingClientRect()
    return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < window.innerHeight
  })
}

function bumpBag(target) {
  if (!target) return
  target.classList.remove('is-bump')
  void target.offsetWidth // restart the CSS animation
  target.classList.add('is-bump')
  setTimeout(() => target.classList.remove('is-bump'), 650)
}

export default function FlyToCart() {
  const { openCart } = useCart()
  const openCartRef = useRef(openCart)
  openCartRef.current = openCart

  // item = what was added, phase = 'show' | 'fly'
  const [item, setItem] = useState(null)
  const [phase, setPhase] = useState('show')
  const cardRef = useRef(null)
  const timers = useRef([])
  const flyingRef = useRef(false)
  const currentKey = useRef(null) // which card is on screen right now

  function clearTimers() {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  // new "Add to Bag" -> show the card
  useEffect(() => {
    function onAdded(event) {
      clearTimers()
      flyingRef.current = false
      const key = Date.now()
      currentKey.current = key
      setPhase('show')
      setItem({ ...(event.detail || {}), key })
    }
    window.addEventListener('minaysh:added-to-cart', onAdded)
    return () => {
      window.removeEventListener('minaysh:added-to-cart', onAdded)
      clearTimers()
    }
  }, [])

  // hold the card, then fly
  useEffect(() => {
    if (!item || phase !== 'show') return undefined
    const t = setTimeout(() => setPhase('fly'), HOLD_MS)
    timers.current.push(t)
    return () => clearTimeout(t)
  }, [item, phase])

  // the flight itself (runs once per card)
  useLayoutEffect(() => {
    if (!item || phase !== 'fly' || flyingRef.current) return
    flyingRef.current = true

    const card = cardRef.current
    const bag = findBagIcon()
    const myKey = item.key

    function finish() {
      // a newer "Add to Bag" replaced this card meanwhile -> leave it alone
      if (currentKey.current !== myKey) return
      setItem(null)
      bumpBag(bag)
      timers.current.push(setTimeout(() => openCartRef.current(), OPEN_DELAY_MS))
    }

    if (!card || !bag || typeof card.animate !== 'function') {
      finish()
      return
    }

    const c = card.getBoundingClientRect()
    const b = bag.getBoundingClientRect()
    const dx = b.left + b.width / 2 - (c.left + c.width / 2)
    const dy = b.top + b.height / 2 - (c.top + c.height / 2)
    // separate X / Y scale: the card lands as a perfect small circle on the icon
    const sx = (b.width * 1.2) / c.width
    const sy = (b.width * 1.2) / c.height

    const flight = card.animate(
      [
        { transform: 'translate(0, 0) scale(1, 1)', borderRadius: '22px', opacity: 1 },
        {
          transform: `translate(${dx * 0.35}px, ${dy * 0.35 - 60}px) scale(${0.45}, ${0.45 * (c.width / c.height)})`,
          borderRadius: '50%',
          opacity: 1,
          offset: 0.45,
        },
        { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, borderRadius: '50%', opacity: 0.85 },
      ],
      { duration: FLY_MS, easing: 'cubic-bezier(.6,0,.4,1)', fill: 'forwards' }
    )
    flight.onfinish = finish
  }, [item, phase])

  if (!item) return null

  const skip = () => {
    if (phase === 'show') setPhase('fly')
  }

  return createPortal(
    <div className={`atb ${phase === 'fly' ? 'is-flying' : ''}`} key={item.key}>
      <div className="atb__backdrop" onClick={skip} />

      <section ref={cardRef} className="atb__card" role="status" aria-live="polite" onClick={skip}>
        <div className="atb__content">
          <div className="atb__photo">
            {item.image ? <img src={item.image} alt="" /> : <span className="atb__photo-empty" />}
            <span className="atb__tick">
              <Check size={18} strokeWidth={3} />
            </span>
          </div>

          <p className="atb__eyebrow">MINAYSH BAG</p>
          <h2 className="atb__title">Added to bag successfully!</h2>

          {item.name && (
            <p className="atb__name">
              {item.quantity > 1 ? `${item.quantity} × ` : ''}
              {item.name}
            </p>
          )}
          {item.shade && <p className="atb__shade">Shade: {item.shade}</p>}
        </div>
      </section>
    </div>,
    document.body
  )
}