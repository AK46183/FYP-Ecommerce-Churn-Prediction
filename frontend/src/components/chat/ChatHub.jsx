import { useEffect, useState } from 'react'
import ChatWidget from './ChatWidget.jsx'
import HelpBot from './HelpBot.jsx'
import './ChatHub.css'

// Ek hi chat button. Kholne par customer chunti hai: Skin Assistant (AI) ya Help & Orders (FAQ bot).
// Jo chuna, wohi chat khulti hai; "‹" se wapas options par.
const STORE_KEY = 'minaysh_chat_hub'

const OPTIONS = [
  {
    id: 'skin',
    title: 'Skin Assistant',
    text: 'Skincare tips, product picks and a selfie skin check',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path d="M10 3.5c.6 3.9 2.6 5.9 6.5 6.5-3.9.6-5.9 2.6-6.5 6.5-.6-3.9-2.6-5.9-6.5-6.5 3.9-.6 5.9-2.6 6.5-6.5Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M18 14.5c.3 1.9 1.1 2.7 3 3-1.9.3-2.7 1.1-3 3-.3-1.9-1.1-2.7-3-3 1.9-.3 2.7-1.1 3-3Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'help',
    title: 'Help & Orders (FAQ)',
    text: 'Track an order, delivery, returns and complaints',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="m4 7.5 8 4.5 8-4.5M12 12v9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
  },
]

const loadView = () => {
  try {
    const v = sessionStorage.getItem(STORE_KEY)
    return v === 'skin' || v === 'help' ? v : null
  } catch {
    return null
  }
}

export default function ChatHub() {
  // null = band, 'menu' = options, 'skin' / 'help' = chat
  const [view, setView] = useState(null)
  const [last, setLast] = useState(loadView) // pichli dafa kaunsi chat thi (isi tab mein)

  const pick = (id) => {
    setView(id)
    setLast(id)
    try {
      sessionStorage.setItem(STORE_KEY, id)
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    if (view !== 'menu') return undefined
    const onKey = (e) => e.key === 'Escape' && setView(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [view])

  const close = () => setView(null)
  const back = () => setView('menu')
  const open = view !== null

  return (
    <>
      <ChatWidget open={view === 'skin'} onClose={close} onBack={back} hideFab />
      <HelpBot open={view === 'help'} onClose={close} onBack={back} hideFab />

      <div className="chat-hub">
        {view === 'menu' && (
          <section className="chat-hub__panel" role="dialog" aria-label="Choose a chat">
            <header className="chat-hub__head">
              <div>
                <strong>Hi! How can we help?</strong>
                <span>Choose a chat to start</span>
              </div>
              <button type="button" className="chat-hub__close" onClick={close} aria-label="Close chat">×</button>
            </header>
            <div className="chat-hub__options">
              {OPTIONS.map((o) => (
                <button key={o.id} type="button" className="chat-hub__option" onClick={() => pick(o.id)}>
                  <span className="chat-hub__icon">{o.icon}</span>
                  <span className="chat-hub__text">
                    <strong>{o.title}</strong>
                    <small>{o.text}</small>
                  </span>
                  {last === o.id && <em className="chat-hub__badge">Continue</em>}
                  <span className="chat-hub__arrow" aria-hidden="true">›</span>
                </button>
              ))}
            </div>
          </section>
        )}

        <button
          type="button"
          className={`chat-hub__fab${open ? ' is-open' : ''}`}
          onClick={() => setView(open ? null : 'menu')}
          aria-expanded={open}
          aria-label={open ? 'Close chat' : 'Open chat'}
        >
          {open ? (
            '×'
          ) : (
            <>
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H11l-4.5 4v-4A2.5 2.5 0 0 1 4 13.5v-8Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              </svg>
              <span>Chat with us</span>
            </>
          )}
        </button>
      </div>
    </>
  )
}
