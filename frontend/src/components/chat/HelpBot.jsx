import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, getToken } from '../../services/api.js'
import { formatPKR } from '../../services/format.js'
import './HelpBot.css'

// MINAYSH Help Bot: rule-based chat (FAQ, order status, complaint). Backend: POST /api/helpbot/message
// Neeche baayen kone mein button. Skincare Assistant (AI) daayen kone mein alag hai.
const STORE_KEY = 'minaysh_help_bot'

const MENU = [
  { label: 'Track my order', intent: 'order_status' },
  { label: 'Delivery & charges', intent: 'faq_delivery' },
  { label: 'Returns & exchange', intent: 'faq_returns' },
  { label: 'Payment methods', intent: 'faq_payment' },
  { label: 'Make a complaint', intent: 'complaint' },
  { label: 'Talk to a person', intent: 'human_support' },
]

const GREETING = {
  from: 'bot',
  text: "Hi! I'm the MINAYSH Help Bot. I can track your order, answer questions about delivery, returns and payment, or take a complaint.",
  quickReplies: MENU,
}

const STATUS_TONE = { Pending: 'wait', Processing: 'wait', Confirmed: 'info', Shipped: 'info', Delivered: 'done', Completed: 'done', Cancelled: 'stop' }

function loadSaved() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORE_KEY) || 'null')
    if (Array.isArray(saved?.messages) && saved.messages.length) {
      return { messages: saved.messages, botState: saved.botState || null, personal: Boolean(saved.personal) }
    }
  } catch {
    /* storage band ho to nayi chat */
  }
  return { messages: [GREETING], botState: null, personal: false }
}

function OfferCard({ offer }) {
  if (!offer) return null
  return (
    <div className="help-bot__offer">
      <span>Just for you</span>
      <strong>{offer.code}</strong>
      <small>{offer.description}{offer.validUntil ? ` · valid until ${offer.validUntil}` : ''}</small>
    </div>
  )
}

function OrderCards({ orders, onNavigate }) {
  if (!orders?.length) return null
  return (
    <div className="help-bot__orders">
      {orders.map((o) => (
        <Link key={o.id} to={`/account/orders/${o.id}`} className="help-bot__order" onClick={onNavigate}>
          <div className="help-bot__order-top">
            <strong>{o.id}</strong>
            <span className={`help-bot__status help-bot__status--${STATUS_TONE[o.status] || 'info'}`}>{o.status}</span>
          </div>
          <span className="help-bot__order-meta">
            {o.date} · {o.items} item{o.items === 1 ? '' : 's'} · {formatPKR(Number(o.total))}
          </span>
          {o.firstItem && <span className="help-bot__order-item">{o.firstItem}{o.items > 1 ? ' and more' : ''}</span>}
        </Link>
      ))}
    </div>
  )
}

function Links({ links, onNavigate }) {
  if (!links?.length) return null
  return (
    <div className="help-bot__links">
      {links.map((l) =>
        l.href ? (
          <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer">{l.label} ↗</a>
        ) : (
          <Link key={l.label} to={l.to} onClick={onNavigate}>{l.label} →</Link>
        ),
      )}
    </div>
  )
}

export default function HelpBot({ open: openProp, onClose, onBack, hideFab = false } = {}) {
  // ChatHub se chalta hai (open / onClose / onBack); akela chale to apna button aur apni state
  const controlled = openProp !== undefined
  const [openState, setOpenState] = useState(false)
  const open = controlled ? openProp : openState
  const setOpen = (v) => {
    const next = typeof v === 'function' ? v(open) : v
    if (controlled) {
      if (!next) onClose?.()
    } else setOpenState(next)
  }
  // Escape wale effect ke liye hamesha taaza setOpen (har render naya banta hai)
  const setOpenRef = useRef(setOpen)
  setOpenRef.current = setOpen
  const [{ messages, botState, personal }, setChat] = useState(loadSaved)
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const listRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    try {
      sessionStorage.setItem(STORE_KEY, JSON.stringify({ messages: messages.slice(-60), botState, personal }))
    } catch {
      /* ignore */
    }
  }, [messages, botState, personal])

  // Login customer: pehli dafa kholne par greeting server se (us mein at-risk customer ka personal offer ho sakta hai)
  useEffect(() => {
    if (!open || personal || !getToken() || messages.length !== 1) return
    setChat((c) => ({ ...c, personal: true }))
    api('/helpbot/message', { method: 'POST', body: { intent: 'greeting' } })
      .then((data) => {
        if (!data?.reply) return
        setChat((c) => (c.messages.length === 1
          ? { ...c, messages: [{ from: 'bot', text: data.reply, quickReplies: data.quickReplies || MENU, links: data.links || [], offer: data.offer || null }] }
          : c))
      })
      .catch(() => {})
  }, [open, personal, messages.length])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, busy, open])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && setOpenRef.current(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  async function send({ message, intent, label }) {
    if (busy) return
    setChat((c) => ({ ...c, messages: [...c.messages, { from: 'user', text: label || message }] }))
    setBusy(true)
    try {
      const data = await api('/helpbot/message', {
        method: 'POST',
        // button ka intent ho to sirf woh; warna message + chal rahe flow ka state
        body: intent ? { intent } : { message, state: botState },
      })
      setChat((c) => ({
        ...c,
        botState: data?.state || null,
        messages: [
          ...c.messages,
          {
            from: 'bot',
            text: data?.reply || 'Sorry, something went wrong.',
            quickReplies: data?.quickReplies || [],
            links: data?.links || [],
            orders: data?.orders || [],
            offer: data?.offer || null,
          },
        ],
      }))
    } catch (err) {
      setChat((c) => ({
        ...c,
        messages: [...c.messages, { from: 'bot', error: true, text: err.message || 'Something went wrong. Please try again.', quickReplies: MENU }],
      }))
    } finally {
      setBusy(false)
      inputRef.current?.focus()
    }
  }

  function onSubmit(e) {
    e.preventDefault()
    const message = text.trim()
    if (!message || busy) return
    setText('')
    send({ message })
  }

  function onQuick(q) {
    if (q.intent) send({ intent: q.intent, label: q.label })
    else send({ message: q.message, label: q.label })
  }

  function onReset() {
    if (busy) return
    setChat({ messages: [GREETING], botState: null, personal: false })
  }

  const close = () => setOpen(false)
  const lastIndex = messages.length - 1

  return (
    <div className={`help-bot${hideFab ? ' help-bot--hub' : ''}`}>
      {open && (
        <section className="help-bot__panel" role="dialog" aria-label="MINAYSH Help Bot">
          <header className="help-bot__head">
            {onBack && (
              <button type="button" className="help-bot__back" onClick={onBack} aria-label="Back to chat options">‹</button>
            )}
            <div>
              <strong>Help &amp; Orders</strong>
              <span>Order tracking, delivery, returns, complaints</span>
            </div>
            <button type="button" onClick={onReset} disabled={busy} title="Start a new chat">New chat</button>
            <button type="button" className="help-bot__close" onClick={close} aria-label="Close help bot">×</button>
          </header>

          <div className="help-bot__list" ref={listRef} aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} className={`help-bot__row help-bot__row--${m.from}`}>
                <div className={`help-bot__msg help-bot__msg--${m.from}${m.error ? ' help-bot__msg--error' : ''}`}>
                  <p>{m.text}</p>
                  {m.from === 'bot' && <OfferCard offer={m.offer} />}
                  {m.from === 'bot' && <OrderCards orders={m.orders} onNavigate={close} />}
                  {m.from === 'bot' && <Links links={m.links} onNavigate={close} />}
                </div>
                {/* buttons sirf aakhri jawab ke neeche, taake purane buttons dobara na dabein */}
                {m.from === 'bot' && i === lastIndex && m.quickReplies?.length > 0 && (
                  <div className="help-bot__chips">
                    {m.quickReplies.map((q) => (
                      <button key={q.label} type="button" onClick={() => onQuick(q)} disabled={busy}>
                        {q.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {busy && (
              <div className="help-bot__msg help-bot__msg--bot help-bot__typing" aria-label="Help bot is typing">
                <i /><i /><i />
              </div>
            )}
          </div>

          <form className="help-bot__form" onSubmit={onSubmit}>
            <input
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={botState?.step === 'email' ? 'Your email address' : 'Type your question, e.g. where is my order?'}
              maxLength={500}
              aria-label="Your message"
            />
            <button type="submit" disabled={busy || !text.trim()}>Send</button>
          </form>
          <p className="help-bot__note">Never share card numbers, OTP or passwords in chat.</p>
        </section>
      )}

      {!hideFab && <button
        type="button"
        className={`help-bot__fab${open ? ' is-open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? 'Close help bot' : 'Open help bot'}
      >
        {open ? (
          '×'
        ) : (
          <>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .8-1 1.5v.4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <circle cx="12" cy="16.6" r="1" fill="currentColor" />
            </svg>
            <span>Help &amp; Orders</span>
          </>
        )}
      </button>}
    </div>
  )
}
