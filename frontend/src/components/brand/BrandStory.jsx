import { useCallback, useEffect, useRef, useState } from 'react'
import './BrandStory.css'

// "Our Brand" ki story: Instagram story jaisa vertical video player.
// Har chapter ek chhoti video + caption, oopar progress bars, khud agla chapter.
// Tap: daayein = agla, baayein = pichla. Daba ke rakho = ruk jao. Sound button se awaz.
const CHAPTERS = [
  {
    key: 'beauty',
    label: 'Beauty',
    title: 'Beauty is self-expression',
    text: 'From effortless everyday essentials to bold statement looks.',
    video: '/videos/hero-beauty.mp4',
    poster: '/videos/hero-beauty-poster.jpg',
  },
  {
    key: 'confidence',
    label: 'Confidence',
    title: 'Made to move with you',
    text: 'Through ordinary mornings and extraordinary nights alike.',
    video: '/videos/looks-hover.mp4',
    poster: '/videos/looks-hover-poster.jpg',
  },
  {
    key: 'care',
    label: 'Care',
    title: 'Skin-first, always',
    text: 'Formulas chosen for comfort and wear, for real everyday routines.',
    video: '/videos/face-hover.mp4',
    poster: '/videos/face-hover-poster.jpg',
  },
  {
    key: 'you',
    label: 'You',
    title: 'Beauty that belongs to you',
    text: 'Not the other way around.',
    video: '/videos/lip-hover.mp4',
    poster: '/videos/lip-hover-poster.jpg',
  },
]

const CHAPTER_MS = 6000

export default function BrandStory() {
  const [index, setIndex] = useState(0)
  const [progress, setProgress] = useState(0) // 0..1 is chapter ka
  const [paused, setPaused] = useState(false)
  const [muted, setMuted] = useState(true)
  const [visible, setVisible] = useState(true)
  const [reduced] = useState(() => {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    } catch {
      return false
    }
  })
  const rootRef = useRef(null)
  const videoRef = useRef(null)
  const holdRef = useRef(null)

  const go = useCallback((next) => {
    setIndex(((next % CHAPTERS.length) + CHAPTERS.length) % CHAPTERS.length)
    setProgress(0)
  }, [])

  // screen par na ho to rok do (battery / data bachao)
  useEffect(() => {
    const el = rootRef.current
    if (!el || !('IntersectionObserver' in window)) return undefined
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const running = visible && !paused && !reduced

  // chapter ka timer
  useEffect(() => {
    if (!running) return undefined
    let raf = 0
    let last = performance.now()
    const tick = (now) => {
      const dt = now - last
      last = now
      setProgress((p) => {
        const n = p + dt / CHAPTER_MS
        if (n >= 1) {
          go(index + 1)
          return 0
        }
        return n
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [running, index, go])

  // video chalao / roko
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (running) v.play().catch(() => {})
    else v.pause()
  }, [running, index])

  // keyboard: left / right / space
  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') go(index + 1)
    else if (e.key === 'ArrowLeft') go(index - 1)
    else if (e.key === ' ') {
      e.preventDefault()
      setPaused((p) => !p)
    } else return
  }

  // tap = agla/pichla, daba ke rakhna = ruk jana
  const onPointerDown = () => {
    holdRef.current = { at: Date.now(), held: false, timer: setTimeout(() => {
      holdRef.current.held = true
      setPaused(true)
    }, 220) }
  }
  const onPointerUp = (e) => {
    const h = holdRef.current
    if (!h) return
    clearTimeout(h.timer)
    holdRef.current = null
    if (h.held) {
      setPaused(false)
      return
    }
    const r = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX ?? r.left + r.width / 2) - r.left
    go(x < r.width * 0.35 ? index - 1 : index + 1)
  }
  const onPointerCancel = () => {
    if (holdRef.current) clearTimeout(holdRef.current.timer)
    if (holdRef.current?.held) setPaused(false)
    holdRef.current = null
  }

  const chapter = CHAPTERS[index]

  return (
    <section className="brand-story" ref={rootRef} aria-label="The MINAYSH story">
      <div
        className="brand-story__player"
        tabIndex={0}
        role="group"
        aria-roledescription="story"
        aria-label={`Chapter ${index + 1} of ${CHAPTERS.length}: ${chapter.title}. Use left and right arrows to move, space to pause.`}
        onKeyDown={onKeyDown}
      >
        <div className="brand-story__bars" aria-hidden="true">
          {CHAPTERS.map((c, i) => (
            <span key={c.key}>
              <i style={{ transform: `scaleX(${i < index ? 1 : i === index ? (reduced ? 1 : progress) : 0})` }} />
            </span>
          ))}
        </div>

        <video
          key={chapter.key}
          ref={videoRef}
          className="brand-story__video"
          src={chapter.video}
          poster={chapter.poster}
          muted={muted}
          playsInline
          loop
          preload="metadata"
          autoPlay={!reduced}
        />
        <div className="brand-story__shade" aria-hidden="true" />

        <div
          className="brand-story__tap"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerCancel}
          onPointerCancel={onPointerCancel}
          aria-hidden="true"
        />

        <div className="brand-story__caption" aria-live="polite">
          <small>{String(index + 1).padStart(2, '0')} · {chapter.label}</small>
          <h3>{chapter.title}</h3>
          <p>{chapter.text}</p>
        </div>

        <div className="brand-story__controls">
          <button type="button" onClick={() => setPaused((p) => !p)} aria-label={paused ? 'Play story' : 'Pause story'}>
            {paused || reduced ? (
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor" /></svg>
            )}
          </button>
          <button type="button" onClick={() => setMuted((m) => !m)} aria-label={muted ? 'Turn sound on' : 'Turn sound off'}>
            {muted ? (
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4zm12.5 3 2.5 2.5-1 1-2.5-2.5L13 15.5l-1-1 2.5-2.5L12 9.5l1-1 2.5 2.5L18 8.5l1 1z" fill="currentColor" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4zm11.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z" fill="currentColor" /></svg>
            )}
          </button>
        </div>
      </div>

      <div className="brand-story__side">
        <p className="brand-story__eyebrow">The MINAYSH story</p>
        <h2 className="brand-story__heading">Four moments, one idea</h2>
      <ol className="brand-story__chapters">
        {CHAPTERS.map((c, i) => (
          <li key={c.key}>
            <button type="button" className={i === index ? 'is-active' : ''} onClick={() => go(i)} aria-current={i === index ? 'step' : undefined}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              <strong>{c.label}</strong>
              <em>{c.title}</em>
            </button>
          </li>
        ))}
      </ol>
        <p className="brand-story__help">Tap the story to skip ahead, hold to pause.</p>
      </div>
    </section>
  )
}
