import { useCallback, useEffect, useRef, useState } from 'react'
import {
  X,
  ArrowDown,
  ArrowRight,
  CalendarDays,
  Percent,
  Tag,
  Image as ImageIcon,
  Palette,
  PlusCircle,
  Trash2,
  Download,
  Sparkles,
} from 'lucide-react'
import { eventImages, eventTypes } from '../../data/saleEvents.js'
import { getUpcomingEvents, addEvent, getPosters, savePoster, deletePoster } from '../../services/saleApi.js'
import PosterStudio from './PosterStudio.jsx'
import './AdminSale.css'

// '2026-12-05' ko apne time zone ki tareekh samjho (warna kahin 1 din peeche dikhti hai)
const toDate = (d) => new Date(typeof d === 'string' && d.length === 10 ? `${d}T00:00` : d)
const fmtDate = (d) => toDate(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
const dateRange = (e) => (e.end && e.end !== e.start ? `${fmtDate(e.start)} – ${fmtDate(e.end)}` : fmtDate(e.start))

function daysLeft(start) {
  const diff = Math.ceil((toDate(start) - new Date()) / 86400000)
  if (diff > 1) return `${diff} days to go`
  if (diff === 1) return 'Starts tomorrow'
  if (diff === 0) return 'Starts today'
  return 'Live now'
}

/* ---------- Countdown (hero ke liye) ---------- */
function useCountdown(target) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  const ms = Math.max(0, toDate(target).getTime() - now)
  return {
    d: Math.floor(ms / 86400000),
    h: Math.floor(ms / 3600000) % 24,
    m: Math.floor(ms / 60000) % 60,
    s: Math.floor(ms / 1000) % 60,
  }
}

/* ---------- Button se nikalne aur wapas jaane wala card ---------- */
function useFlipCard() {
  const [card, setCard] = useState(null) // { kind, from, phase }
  const anchor = useRef(null)

  const measure = (el) => {
    const r = el.getBoundingClientRect()
    return {
      dx: r.left + r.width / 2 - window.innerWidth / 2,
      dy: r.top + r.height / 2 - window.innerHeight / 2,
      s: Math.max(r.width / 520, 0.12),
    }
  }

  const open = (kind, el) => {
    anchor.current = el
    setCard({ kind, from: measure(el), phase: 'start' })
    requestAnimationFrame(() => requestAnimationFrame(() => setCard((c) => (c ? { ...c, phase: 'open' } : c))))
  }

  const close = useCallback(() => {
    setCard((c) => (c ? { ...c, from: anchor.current ? measure(anchor.current) : c.from, phase: 'closing' } : c))
    setTimeout(() => setCard(null), 460)
  }, [])

  return { card, open, close }
}

function FlipCard({ card, onClose, title, children }) {
  const isOpen = card.phase === 'open'
  const style = isOpen
    ? { transform: 'translate(-50%, -50%) scale(1)' }
    : { transform: `translate(calc(-50% + ${card.from.dx}px), calc(-50% + ${card.from.dy}px)) scale(${card.from.s})` }

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <>
      <div className={`sl-backdrop ${isOpen ? 'is-open' : ''}`} onClick={onClose} />
      <article className={`sl-card ${isOpen ? 'is-open' : ''}`} style={style} role="dialog" aria-modal="true" aria-label={title}>
        <button type="button" className="sl-card__close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
        <div className="sl-card__content">{children}</div>
      </article>
    </>
  )
}

/* ---------- Add event form ---------- */
const emptyForm = { name: '', tagline: '', type: 'Sale', start: '', end: '', discount: '', categories: '', description: '', image: eventImages[0] }

function AddEventForm({ onSaved }) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.start || !form.end || form.discount === '' || !form.description.trim()) {
      setError('Name, dates, discount aur description zaroori hain.')
      return
    }
    if (form.end < form.start) {
      setError('End date, start date se pehle nahi ho sakti.')
      return
    }
    const d = Number(form.discount)
    if (Number.isNaN(d) || d < 0 || d > 90) {
      setError('Discount 0 se 90 ke beech hona chahiye.')
      return
    }
    const others = eventImages.filter((src) => src !== form.image)
    const saved = await addEvent({
      ...form,
      discount: d,
      images: [form.image, others[0], others[1]],
    })
    onSaved(saved)
  }

  return (
    <form className="sl-form" onSubmit={submit} noValidate>
      <span className="sl-eyebrow">New event / sale</span>
      <h3>Add to the calendar</h3>

      <label>
        <span>Name *</span>
        <input value={form.name} onChange={set('name')} placeholder="e.g. Summer Glow Sale" />
      </label>
      <label>
        <span>Tagline</span>
        <input value={form.tagline} onChange={set('tagline')} placeholder="One short line" />
      </label>
      <div className="sl-form__row">
        <label>
          <span>Type</span>
          <select value={form.type} onChange={set('type')}>
            {eventTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Discount % *</span>
          <input type="number" min="0" max="90" value={form.discount} onChange={set('discount')} placeholder="30" />
        </label>
      </div>
      <div className="sl-form__row">
        <label>
          <span>Start date *</span>
          <input type="date" value={form.start} onChange={set('start')} />
        </label>
        <label>
          <span>End date *</span>
          <input type="date" value={form.end} onChange={set('end')} />
        </label>
      </div>
      <label>
        <span>Categories on sale</span>
        <input value={form.categories} onChange={set('categories')} placeholder="Makeup, Skincare" />
      </label>
      <label>
        <span>Description *</span>
        <textarea rows={2} value={form.description} onChange={set('description')} placeholder="What is on offer?" />
      </label>
      <div>
        <span className="sl-form__label">Cover picture</span>
        <div className="sl-form__images">
          {eventImages.map((src) => (
            <button
              key={src}
              type="button"
              className={form.image === src ? 'is-active' : ''}
              style={{ backgroundImage: `url(${src})` }}
              onClick={() => setForm((f) => ({ ...f, image: src }))}
              aria-label="Choose picture"
            />
          ))}
        </div>
      </div>

      {error && <p className="sl-error">{error}</p>}

      <button type="submit" className="sl-btn sl-btn--full">
        <PlusCircle size={16} /> Add event
      </button>
    </form>
  )
}

/* ---------- Page ---------- */
export default function AdminSale() {
  const [events, setEvents] = useState([])
  const [active, setActive] = useState(0)
  const [posters, setPosters] = useState([])
  const [studio, setStudio] = useState(false)
  const [toast, setToast] = useState('')
  const { card, open, close } = useFlipCard()
  const scrollyRef = useRef(null)
  const pendingScroll = useRef(null)

  const ev = events[active]
  const next = events.find((e) => toDate(e.start) > new Date()) || events[0]
  const cd = useCountdown(next?.start || Date.now())

  const loadEvents = useCallback(async (selectId) => {
    const list = await getUpcomingEvents()
    setEvents(list)
    if (selectId) {
      const i = list.findIndex((e) => e.id === selectId)
      if (i >= 0) {
        setActive(i)
        pendingScroll.current = i
      }
    }
  }, [])

  // Mouse scroll ke saath event khud badle (section screen pe ruka rehta hai)
  useEffect(() => {
    const n = events.length
    if (!n) return
    const onScroll = () => {
      const el = scrollyRef.current
      if (!el || card) return
      const r = el.getBoundingClientRect()
      const total = el.offsetHeight - window.innerHeight + 32
      const progress = Math.min(Math.max(-r.top / Math.max(total, 1), 0), 0.9999)
      setActive(Math.floor(progress * n))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [events.length, card])

  // kisi event pe le jao (progress bar click / naya event)
  const scrollToEvent = useCallback(
    (i) => {
      const el = scrollyRef.current
      if (!el || !events.length) return
      const top = el.getBoundingClientRect().top + window.scrollY
      const total = el.offsetHeight - window.innerHeight + 32
      window.scrollTo({ top: top + (total * (i + 0.5)) / events.length, behavior: 'smooth' })
    },
    [events.length]
  )

  useEffect(() => {
    if (pendingScroll.current === null) return
    const i = pendingScroll.current
    pendingScroll.current = null
    requestAnimationFrame(() => scrollToEvent(i))
  }, [events, scrollToEvent])

  useEffect(() => {
    loadEvents()
  }, [loadEvents])

  useEffect(() => {
    if (ev) getPosters(ev.id).then(setPosters)
  }, [ev])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 3000)
    return () => clearTimeout(t)
  }, [toast])

  const onEventSaved = async (saved) => {
    close()
    await loadEvents(saved.id)
    setToast(`"${saved.name}" added`)
  }

  const onPosterSave = async (dataUrl) => {
    await savePoster(ev.id, dataUrl)
    setPosters(await getPosters(ev.id))
    setStudio(false)
    setToast('Poster saved')
  }

  const onPosterDelete = async (id) => {
    await deletePoster(ev.id, id)
    setPosters(await getPosters(ev.id))
  }

  const [first, ...rest] = (ev?.name || '').split(' ')

  return (
    <div className="sl">
      {/* ---------- 1. Coming soon ---------- */}
      <section className="sl-hero">
        <h1 className="sl-coming">
          <span className="sl-brush" aria-hidden="true">
            <svg viewBox="0 0 600 240" preserveAspectRatio="none">
              <defs>
                <linearGradient id="slBrush" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="#a8e0d2" />
                  <stop offset="55%" stopColor="#7cc9b8" />
                  <stop offset="100%" stopColor="#4fa896" />
                </linearGradient>
                <filter id="slRough">
                  <feTurbulence type="fractalNoise" baseFrequency="0.02 0.6" numOctaves="2" seed="4" />
                  <feDisplacementMap in="SourceGraphic" scale="14" />
                </filter>
              </defs>
              <path
                filter="url(#slRough)"
                fill="url(#slBrush)"
                d="M40 140 C 40 70, 160 40, 300 46 C 430 52, 560 30, 580 70 C 596 104, 520 120, 470 128 C 540 140, 560 196, 470 206 C 360 218, 200 226, 110 212 C 30 200, 40 170, 40 140 Z"
              />
            </svg>
          </span>
          <span>Coming</span>
          <small>soon…</small>
        </h1>
        <p className="sl-hero__line">Something new is on its way — fresh deals and a brand-new drop for our beauty lovers.</p>
        {next && (
          <>
            <p className="sl-hero__next">
              Next up: <b>{next.name}</b> · {fmtDate(next.start)}
            </p>
            <div className="sl-count">
              {[['d', 'Days'], ['h', 'Hours'], ['m', 'Min'], ['s', 'Sec']].map(([k, label]) => (
                <div key={k}>
                  <b>{String(cd[k]).padStart(2, '0')}</b>
                  <small>{label}</small>
                </div>
              ))}
            </div>
          </>
        )}
        <p className="sl-hero__small">Want to be the first to know? Customers get an alert the moment it goes live.</p>
        <a href="#sl-events" className="sl-scroll" aria-label="See upcoming events">
          <ArrowDown size={18} />
        </a>
      </section>

      {/* ---------- 2. Events (picture 2 jaisa) ---------- */}
      <div
        className="sl-scrolly"
        id="sl-events"
        ref={scrollyRef}
        style={{ '--count': Math.max(events.length, 1) }}
      >
      <section className="sl-events">
        {toast && <div className="sl-toast">{toast}</div>}
        {ev ? (
          <div className="sl-events__grid" key={ev.id}>
            <div className="sl-info">
              <span className="sl-info__type">
                {ev.type} · {toDate(ev.start).toLocaleDateString('en-GB', { month: 'long' })}
              </span>
              <div className="sl-progress">
                <span className="sl-progress__count">
                  <b>{String(active + 1).padStart(2, '0')}</b> / {String(events.length).padStart(2, '0')}
                </span>
                <div className="sl-progress__bar" role="tablist" aria-label="Events">
                  {events.map((e, i) => (
                    <button
                      key={e.id}
                      type="button"
                      role="tab"
                      aria-selected={i === active}
                      aria-label={e.name}
                      title={e.name}
                      className={i === active ? 'is-active' : i < active ? 'is-done' : ''}
                      onClick={() => scrollToEvent(i)}
                    />
                  ))}
                </div>
              </div>
              <h2>
                <b>{first}</b> <span>{rest.join(' ')}</span>
              </h2>
              <p className="sl-info__date">
                <CalendarDays size={15} /> {dateRange(ev)}
              </p>
              <p className="sl-info__tag">{ev.tagline}</p>
              <button type="button" className="sl-details" onClick={(e) => open('details', e.currentTarget)}>
                Details
              </button>
              <span className="sl-info__rule" />
            </div>

            <div className="sl-collage">
              <div className="sl-collage__big" style={{ backgroundImage: `url(${ev.images[0]})` }}>
                <span className="sl-collage__badge">
                  {ev.discount ? `Up to ${ev.discount}% off` : 'New'}
                </span>
              </div>
              <div className="sl-collage__small" style={{ backgroundImage: `url(${ev.images[1]})` }} />
              <div className="sl-collage__small" style={{ backgroundImage: `url(${ev.images[2]})` }} />
            </div>
          </div>
        ) : (
          <div className="sl-empty">
            <Sparkles size={22} />
            <p>No events planned for the rest of this year yet.</p>
          </div>
        )}

        {ev && (
          <p className="sl-hint">
            {active < events.length - 1 ? (
              <>
                <ArrowDown size={14} /> Scroll for next: <b>{events[active + 1].name}</b>
              </>
            ) : (
              <>Last event of the year</>
            )}
          </p>
        )}

        {/* ---------- 3. Do floating buttons ---------- */}
        <div className="sl-actions">
          <button
            type="button"
            className="sl-action"
            disabled={!ev}
            onClick={(e) => open('posters', e.currentTarget)}
          >
            <span className="sl-action__icon"><ImageIcon size={18} /></span>
            <span className="sl-action__text">
              <b>Posters for event</b>
              <small>{ev ? `${posters.length} saved for ${ev.name}` : 'Pick an event first'}</small>
            </span>
            <ArrowRight size={16} />
          </button>
          <button type="button" className="sl-action" onClick={(e) => open('add', e.currentTarget)}>
            <span className="sl-action__icon"><PlusCircle size={18} /></span>
            <span className="sl-action__text">
              <b>Add event / sale</b>
              <small>Put a new date on the calendar</small>
            </span>
            <ArrowRight size={16} />
          </button>
        </div>
      </section>
      </div>

      {/* ---------- Cards ---------- */}
      {card?.kind === 'details' && ev && (
        <FlipCard card={card} onClose={close} title={`${ev.name} details`}>
          <div className="sl-detail__cover" style={{ backgroundImage: `url(${ev.images[0]})` }}>
            <span>{daysLeft(ev.start)}</span>
          </div>
          <span className="sl-eyebrow">{ev.type}</span>
          <h3>{ev.name}</h3>
          <p className="sl-detail__desc">{ev.description}</p>
          <ul className="sl-detail__facts">
            <li><CalendarDays size={15} /><span>Dates</span><b>{dateRange(ev)}</b></li>
            <li><Percent size={15} /><span>Discount</span><b>{ev.discount ? `Up to ${ev.discount}%` : '—'}</b></li>
            <li><Tag size={15} /><span>On sale</span><b>{ev.categories || 'All products'}</b></li>
            <li><ImageIcon size={15} /><span>Posters</span><b>{posters.length} saved</b></li>
          </ul>
        </FlipCard>
      )}

      {card?.kind === 'posters' && ev && (
        <FlipCard card={card} onClose={close} title="Posters">
          <span className="sl-eyebrow">Posters</span>
          <h3>{ev.name}</h3>
          {posters.length ? (
            <div className="sl-posters">
              {posters.map((p) => (
                <figure key={p.id}>
                  <img src={p.dataUrl} alt={`${ev.name} poster`} />
                  <figcaption>
                    <a href={p.dataUrl} download={`${ev.name}-poster.jpg`} aria-label="Download">
                      <Download size={14} />
                    </a>
                    <button type="button" onClick={() => onPosterDelete(p.id)} aria-label="Delete">
                      <Trash2 size={14} />
                    </button>
                  </figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <p className="sl-posters__empty">No posters yet for this event.</p>
          )}
          <button type="button" className="sl-btn sl-btn--full" onClick={() => setStudio(true)}>
            <Palette size={16} /> Design poster
          </button>
        </FlipCard>
      )}

      {card?.kind === 'add' && (
        <FlipCard card={card} onClose={close} title="Add event">
          <AddEventForm onSaved={onEventSaved} />
        </FlipCard>
      )}

      {studio && ev && <PosterStudio event={ev} onClose={() => setStudio(false)} onSave={onPosterSave} />}
    </div>
  )
}