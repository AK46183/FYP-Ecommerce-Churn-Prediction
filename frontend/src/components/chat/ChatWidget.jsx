import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api.js'
import { useCart } from '../../context/CartContext.jsx'
import { allProducts } from '../../data/products.js'
import FaceCapture from './FaceCapture.jsx'
import './ChatWidget.css'

// MINAYSH Skin Assistant: neeche kone ka chat button + chat panel (text + optional selfie scan)
const STORE_KEY = 'minaysh_skin_chat'
const CONSENT_KEY = 'minaysh_skin_scan_consent'
const GREETING = {
  from: 'bot',
  text: "Hi! I'm the MINAYSH Skin Assistant. Tell me about your skin, or send a selfie for a quick skin check.",
}

const newId = () =>
  (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`).replace(/[^a-zA-Z0-9-]/g, '')

function loadSaved() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORE_KEY) || 'null')
    if (saved?.sessionId && Array.isArray(saved.messages)) return saved
  } catch {
    /* storage band ho to nayi chat */
  }
  return { sessionId: newId(), messages: [GREETING] }
}

// tasveer ko chhota karke JPEG base64 banata hai (max 1024px), taake upload halka rahe
function fileToJpegBase64(file, max = 1024) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
      resolve({ base64: dataUrl.split(',')[1], preview: dataUrl })
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('This image could not be opened. Please try a JPG or PNG photo.'))
    }
    img.src = url
  })
}

// Website ke catalog mein product na mile (maslan naya Makeup City product abhi load nahi hua) to backend se le aao
const fetched = new Map()
async function findProduct(sku) {
  const local = allProducts.find((x) => x.id === sku)
  if (local) return local
  if (!fetched.has(sku)) {
    fetched.set(
      sku,
      api(`/products/${encodeURIComponent(sku)}`)
        .then((p) => {
          if (!p?.sku) return null
          const image = p.imageUrl || '/images/products/product-placeholder.svg'
          const product = {
            id: p.sku,
            brand: p.brand || '',
            name: p.name,
            tagline: p.brand || '',
            category: String(p.sku).startsWith('sun-') ? 'sunCare' : 'skinCare',
            subCategory: p.subCategory || '',
            price: Number(p.price) || 0,
            oldPrice: p.oldPrice ? Number(p.oldPrice) : null,
            currency: 'PKR',
            badge: p.badge || null,
            available: p.available !== false && Number(p.price) > 0,
            image,
            gallery: [image],
            shades: [],
            sizes: [],
            variants: [],
            description: p.description || '',
            fromServer: true,
          }
          if (!allProducts.some((x) => x.id === product.id)) allProducts.push(product) // product page bhi khul sake
          return product
        })
        .catch(() => null),
    )
  }
  return fetched.get(sku)
}

// Bot ne jo store products bataye: chhote cards (tasveer, naam, price, View, Add to bag)
function ProductCards({ products, onView }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState({})
  const [found, setFound] = useState({}) // sku -> product | null

  useEffect(() => {
    let alive = true
    ;(products || []).forEach((p) => {
      findProduct(p.sku).then((full) => alive && setFound((f) => ({ ...f, [p.sku]: full })))
    })
    return () => {
      alive = false
    }
  }, [products])

  if (!products?.length) return null
  return (
    <div className="skin-chat__products">
      {products.map((p) => {
        const full = found[p.sku]
        const status = added[p.sku]
        return (
          <div key={p.sku} className="skin-chat__product">
            {full?.image && <img src={full.image} alt="" loading="lazy" />}
            <div className="skin-chat__product-info">
              <strong>{p.name}</strong>
              <span>{p.brand ? `${p.brand} · ` : ''}PKR {Number(p.price).toLocaleString()}</span>
              <div className="skin-chat__product-actions">
                {full === undefined && <em>Loading…</em>}
                {full === null && <em>Not available right now</em>}
                {full && (
                  <>
                    <Link to={`/product/${full.id}`} onClick={onView}>View</Link>
                    <button
                      type="button"
                      disabled={status === 'yes' || status === 'no'}
                      onClick={() => {
                        // addItem state updater ke bahar: warna React (StrictMode) use do dafa chala deta hai
                        const ok = addItem(full, { quantity: 1 }) !== false
                        setAdded((a) => ({ ...a, [p.sku]: ok ? 'yes' : 'no' }))
                      }}
                    >
                      {status === 'yes' ? 'Added ✓' : status === 'no' ? 'Out of stock' : 'Add to bag'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [{ sessionId, messages }, setChat] = useState(loadSaved)
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [askConsent, setAskConsent] = useState(false)
  const [chooser, setChooser] = useState(false) // camera ya upload
  const [liveScan, setLiveScan] = useState(false)
  const listRef = useRef(null)
  const inputRef = useRef(null)
  const fileRef = useRef(null)

  useEffect(() => {
    try {
      // tasveer ka preview save nahi karte (privacy + storage)
      const slim = messages.map(({ image, ...m }) => (image ? { ...m, hadImage: true } : m))
      sessionStorage.setItem(STORE_KEY, JSON.stringify({ sessionId, messages: slim }))
    } catch {
      /* ignore */
    }
  }, [sessionId, messages])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, busy, open, askConsent, chooser])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const push = (msg) => setChat((c) => ({ ...c, messages: [...c.messages, msg] }))

  async function send(body, userMsg) {
    push(userMsg)
    setBusy(true)
    try {
      const data = await api('/chatbot/message', { method: 'POST', body: { sessionId, ...body } })
      push({ from: 'bot', text: data?.reply || 'Sorry, I could not answer that. Please try again.', products: data?.products || [], sources: data?.sources || [] })
    } catch (err) {
      push({ from: 'bot', error: true, text: err.message || 'Something went wrong. Please try again.' })
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
    send({ message }, { from: 'user', text: message })
  }

  function onPickPhoto() {
    if (busy) return
    let agreed = false
    try {
      agreed = sessionStorage.getItem(CONSENT_KEY) === 'yes'
    } catch {
      /* ignore */
    }
    if (agreed) setChooser(true)
    else setAskConsent(true)
  }

  function onConsent(yes) {
    setAskConsent(false)
    if (!yes) return
    try {
      sessionStorage.setItem(CONSENT_KEY, 'yes')
    } catch {
      /* ignore */
    }
    setChooser(true)
  }

  function onLiveShot({ base64, preview }) {
    setLiveScan(false)
    const message = text.trim()
    setText('')
    send({ message, imageBase64: base64, imageMime: 'image/jpeg' }, { from: 'user', text: message, image: preview })
  }

  async function onFile(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      push({ from: 'bot', error: true, text: 'Please choose a photo (JPG or PNG).' })
      return
    }
    try {
      const { base64, preview } = await fileToJpegBase64(file)
      const message = text.trim()
      setText('')
      send({ message, imageBase64: base64, imageMime: 'image/jpeg' }, { from: 'user', text: message, image: preview })
    } catch (err) {
      push({ from: 'bot', error: true, text: err.message })
    }
  }

  function onReset() {
    if (busy) return
    api('/chatbot/reset', { method: 'POST', body: { sessionId } }).catch(() => {})
    setChat({ sessionId: newId(), messages: [GREETING] })
  }

  return (
    <div className="skin-chat">
      {open && (
        <section className="skin-chat__panel" role="dialog" aria-label="MINAYSH Skin Assistant">
          <header className="skin-chat__head">
            <div>
              <strong>Skin Assistant</strong>
              <span>Skincare tips and product picks</span>
            </div>
            <button type="button" onClick={onReset} disabled={busy} title="Start a new chat">New chat</button>
            <button type="button" className="skin-chat__close" onClick={() => setOpen(false)} aria-label="Close chat">×</button>
          </header>

          <div className="skin-chat__list" ref={listRef} aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} className={`skin-chat__msg skin-chat__msg--${m.from}${m.error ? ' skin-chat__msg--error' : ''}`}>
                {m.image && <img src={m.image} alt="Your uploaded selfie" />}
                {m.hadImage && !m.image && <em>Photo sent</em>}
                {m.text && <p>{m.text}</p>}
                {m.from === 'bot' && <ProductCards products={m.products} onView={() => setOpen(false)} />}
                {m.from === 'bot' && m.sources?.length > 0 && (
                  <small className="skin-chat__sources">Based on: {m.sources.join(' · ')}</small>
                )}
              </div>
            ))}
            {busy && (
              <div className="skin-chat__msg skin-chat__msg--bot skin-chat__typing" aria-label="Assistant is typing">
                <i /><i /><i />
              </div>
            )}
            {askConsent && (
              <div className="skin-chat__consent">
                <p>
                  Your photo is sent to an AI service (Google Gemini) to estimate visible skin signs. It is not saved by
                  MINAYSH, and the result is an estimate, not a medical diagnosis.
                </p>
                <div>
                  <button type="button" onClick={() => onConsent(true)}>I agree</button>
                  <button type="button" className="is-quiet" onClick={() => onConsent(false)}>Cancel</button>
                </div>
              </div>
            )}
          </div>

          {chooser && (
            <div className="skin-chat__chooser">
              <button
                type="button"
                className="is-primary"
                onClick={() => {
                  setChooser(false)
                  setLiveScan(true)
                }}
              >
                Live scan with camera
              </button>
              <button
                type="button"
                onClick={() => {
                  setChooser(false)
                  fileRef.current?.click()
                }}
              >
                Upload a photo
              </button>
              <button type="button" className="is-quiet" onClick={() => setChooser(false)}>Cancel</button>
            </div>
          )}

          <form className="skin-chat__form" onSubmit={onSubmit}>
            <button type="button" className="skin-chat__photo" onClick={onPickPhoto} disabled={busy} aria-label="Send a selfie for a skin check" title="Send a selfie for a skin check">
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path d="M9 4.5 7.6 6.5H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-2.6L15 4.5H9Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <circle cx="12" cy="13" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={onFile} />
            <input
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ask about your skin..."
              maxLength={1000}
              aria-label="Your message"
            />
            <button type="submit" className="skin-chat__send" disabled={busy || !text.trim()}>Send</button>
          </form>
          <p className="skin-chat__note">Chats are saved to improve our service. Photos are never saved.</p>
        </section>
      )}

      {liveScan && (
        <FaceCapture
          onCapture={onLiveShot}
          onClose={() => setLiveScan(false)}
          onUpload={() => {
            setLiveScan(false)
            fileRef.current?.click()
          }}
        />
      )}

      <button
        type="button"
        className={`skin-chat__fab${open ? ' is-open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? 'Close skin assistant' : 'Open skin assistant'}
      >
        {open ? (
          '×'
        ) : (
          <>
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H11l-4.5 4v-4A2.5 2.5 0 0 1 4 13.5v-8Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
            <span>Skincare Assistant</span>
          </>
        )}
      </button>
    </div>
  )
}
