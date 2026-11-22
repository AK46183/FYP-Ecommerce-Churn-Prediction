import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { tipsTrends } from '../../data/tipsTrends.js'
import './TipsTrends.css'
import './TipsTrendsExpand.css'

// short lines for each card (change the words here)
const CARD_TEXT = {
  eye: { label: 'Eye looks', title: 'Eyes That\nSpeak', text: 'Shadows, liners and lashes, from soft everyday to bold evening drama.' },
  face: { label: 'Face', title: 'Skin That\nGlows', text: 'Prep, base and glow: the steps for a fresh, even, radiant face.' },
  lip: { label: 'Lips', title: 'Colour That\nStays', text: 'Find your shade, line, fill and finish for lips that last all day.' },
  looks: { label: 'Looks & occasions', title: 'Ready for\nEvery Moment', text: 'Complete looks for weddings, parties, office days and everything between.' },
}

// 3D tilt: the card leans towards the mouse (like NAVIS)
const MAX_TILT = 7 // degrees

function handleTilt(e) {
  const card = e.currentTarget
  const r = card.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width - 0.5 // -0.5 .. 0.5
  const y = (e.clientY - r.top) / r.height - 0.5
  card.style.setProperty('--ry', `${(x * MAX_TILT * 2).toFixed(2)}deg`)
  card.style.setProperty('--rx', `${(-y * MAX_TILT * 2).toFixed(2)}deg`)
  card.style.setProperty('--mx', `${((x + 0.5) * 100).toFixed(1)}%`)
  card.style.setProperty('--my', `${((y + 0.5) * 100).toFixed(1)}%`)
}

function resetTilt(e) {
  const card = e.currentTarget
  card.style.setProperty('--rx', '0deg')
  card.style.setProperty('--ry', '0deg')
}

// Video sirf tab download / play ho jab card khula ho aur section screen par ho.
// Pehle charon videos page khulte hi download hoti thin (~3 MB), ab sirf ek, aur woh bhi scroll karne par.
function TipVideo({ src, poster, playing }) {
  const ref = useRef(null)
  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (playing) {
      if (!v.getAttribute('src')) v.setAttribute('src', src)
      v.play().catch(() => {})
    } else {
      v.pause()
    }
  }, [playing, src])
  return <video ref={ref} className="tips-x__video" muted loop playsInline preload="none" poster={poster} />
}

export default function TipsTrends() {
  const [active, setActive] = useState(0)
  const [inView, setInView] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el || !('IntersectionObserver' in window)) {
      setInView(true)
      return undefined
    }
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: '200px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section className="tips-trends" ref={sectionRef}>
      {/* decorative background waves */}
      <span className="tips-trends__wave tips-trends__wave--1" />
      <span className="tips-trends__wave tips-trends__wave--2" />
      <span className="tips-trends__wave tips-trends__wave--3" />
      <span className="tips-trends__wave tips-trends__wave--4" />
      <span className="tips-trends__wave tips-trends__wave--5" />
      <span className="tips-trends__wave tips-trends__wave--6" />

      <div className="container tips-trends__inner">
        <p className="tips-trends__eyebrow">TIPS &amp; TRENDS</p>

        <h2 className="tips-trends__heading">Beauty Inspiration</h2>

        <p className="tips-trends__subhead">Enhance your Beauty with our products</p>

        {/* one big card, the rest narrow; hover or focus a card to open it */}
        <div className="tips-x">
          {tipsTrends.map((tip, i) => {
            const copy = CARD_TEXT[tip.key] || { label: tip.title, title: tip.title, text: '' }
            const isOpen = i === active
            return (
              <Link
                key={tip.key}
                to={tip.path}
                className={`tips-x__card ${isOpen ? 'is-open' : ''}`}
                onMouseEnter={() => setActive(i)}
                onMouseMove={handleTilt}
                onMouseLeave={resetTilt}
                onFocus={() => setActive(i)}
              >
                <TipVideo src={tip.video} poster={tip.poster} playing={inView && isOpen} />
                <span className="tips-x__shade" aria-hidden="true" />
                <span className="tips-x__glare" aria-hidden="true" />

                <span className="tips-x__label">{copy.label}</span>
                <span className="tips-x__arrow" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17 17 7M8 7h9v9" />
                  </svg>
                </span>

                <span className="tips-x__body">
                  <span className="tips-x__title">{copy.title}</span>
                  <span className="tips-x__text">{copy.text}</span>
                  <span className="tips-x__btn">
                    {isOpen ? 'Explore tips' : 'Details'}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </span>
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
