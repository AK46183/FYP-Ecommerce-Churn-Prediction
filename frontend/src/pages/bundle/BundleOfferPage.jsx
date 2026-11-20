import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Plus, Search, X } from 'lucide-react'
import { allProducts } from '../../data/products.js'
import { useCart } from '../../context/CartContext.jsx'
import { isPurchasable } from '../../services/product.js'
import { formatPKR } from '../../services/format.js'
import { BUNDLE_SIZE, BUNDLE_OFF, BUNDLE_MIN_TOTAL, BUNDLE_MAX_ITEMS } from '../../utils/bundleDeal.js'
import './BundleOfferPage.css'

// BUNDLE OFFER: customer khud 3 (ya zyada) products chun kar apna bundle banata hai, PKR 1,000 off.
const TABS = [
  ['all', 'All'],
  ['skinCare', 'Skin Care'],
  ['makeup', 'Makeup'],
  ['sunCare', 'Sun Care'],
  ['hair', 'Hair'],
  ['fragrances', 'Fragrances'],
  ['accessories', 'Accessories'],
]
const PAGE = 24

export default function BundleOfferPage() {
  const { addItem } = useCart()
  const navigate = useNavigate()
  const [tab, setTab] = useState('all')
  const [query, setQuery] = useState('')
  const [shown, setShown] = useState(PAGE)
  const [picked, setPicked] = useState([])
  const [note, setNote] = useState('')

  // Sirf database wale products (order inhi se banta hai); database na chale to sab
  const pool = useMemo(() => {
    const ok = allProducts.filter((p) => isPurchasable(p))
    const server = ok.filter((p) => p.fromServer)
    return server.length ? server : ok
  }, [])

  const tabs = useMemo(() => TABS.filter(([key]) => key === 'all' || pool.some((p) => p.category === key)), [pool])

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return pool.filter(
      (p) =>
        (tab === 'all' || p.category === tab) &&
        (!q || `${p.brand} ${p.name} ${p.subCategory}`.toLowerCase().includes(q)),
    )
  }, [pool, tab, query])

  const total = picked.reduce((s, p) => s + p.price, 0)
  const needItems = Math.max(0, BUNDLE_SIZE - picked.length)
  const needMoney = Math.max(0, BUNDLE_MIN_TOTAL - total)
  const ready = needItems === 0 && needMoney === 0
  const isPicked = (id) => picked.some((p) => p.id === id)

  function toggle(product) {
    setNote('')
    if (isPicked(product.id)) {
      setPicked((cur) => cur.filter((p) => p.id !== product.id))
      return
    }
    if (picked.length >= BUNDLE_MAX_ITEMS) {
      setNote(`A bundle can have up to ${BUNDLE_MAX_ITEMS} products.`)
      return
    }
    setPicked((cur) => [...cur, product])
  }

  function addBundle() {
    if (!ready) return
    picked.forEach((p) => addItem(p, { quantity: 1 }))
    setPicked([])
    setNote('')
  }

  const slots = Array.from({ length: Math.max(BUNDLE_SIZE, picked.length) }, (_, i) => picked[i] || null)

  return (
    <div className="bundle-page">
      <section className="bundle-hero">
        <p className="bundle-hero__eyebrow">Bundle offer</p>
        <h1>Build your own bundle</h1>
        <p className="bundle-hero__sub">
          Pick any {BUNDLE_SIZE} products and get <b>{formatPKR(BUNDLE_OFF)} off</b>. Mix skincare, makeup, hair, anything you love.
        </p>
        <ol className="bundle-steps">
          <li><span>1</span>Pick {BUNDLE_SIZE} or more products</li>
          <li><span>2</span>Bundle total {formatPKR(BUNDLE_MIN_TOTAL)} or more</li>
          <li><span>3</span>{formatPKR(BUNDLE_OFF)} off at checkout</li>
        </ol>
      </section>

      <div className="bundle-layout container">
        <div className="bundle-shop">
          <div className="bundle-filters">
            <div className="bundle-tabs" role="tablist">
              {tabs.map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={tab === key}
                  className={tab === key ? 'is-active' : ''}
                  onClick={() => { setTab(key); setShown(PAGE) }}
                >
                  {label}
                </button>
              ))}
            </div>
            <label className="bundle-search">
              <Search size={16} aria-hidden="true" />
              <input
                type="search"
                placeholder="Search products"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setShown(PAGE) }}
              />
            </label>
          </div>

          {list.length === 0 ? (
            <p className="bundle-empty">No products found. Try another category or search.</p>
          ) : (
            <>
              <div className="bundle-grid">
                {list.slice(0, shown).map((p) => {
                  const on = isPicked(p.id)
                  return (
                    <article key={p.id} className={`bundle-tile${on ? ' is-on' : ''}`}>
                      <button type="button" className="bundle-tile__img" onClick={() => navigate(`/product/${p.id}`)} aria-label={`View ${p.name}`}>
                        <img src={p.image} alt="" loading="lazy" />
                      </button>
                      <div className="bundle-tile__body">
                        {p.brand && <small>{p.brand}</small>}
                        <h3>{p.name}</h3>
                        <div className="bundle-tile__price">
                          <b>{formatPKR(p.price)}</b>
                          {p.oldPrice > p.price && <s>{formatPKR(p.oldPrice)}</s>}
                        </div>
                      </div>
                      <button type="button" className="bundle-tile__add" onClick={() => toggle(p)} aria-pressed={on}>
                        {on ? <><Check size={15} /> Added</> : <><Plus size={15} /> Add to bundle</>}
                      </button>
                    </article>
                  )
                })}
              </div>
              {shown < list.length && (
                <button type="button" className="bundle-more" onClick={() => setShown((n) => n + PAGE)}>
                  Show more ({list.length - shown} left)
                </button>
              )}
            </>
          )}
        </div>

        <aside className="bundle-tray" aria-live="polite">
          <h2>Your bundle</h2>
          <div className="bundle-slots">
            {slots.map((p, i) =>
              p ? (
                <div key={p.id} className="bundle-slot is-filled">
                  <img src={p.image} alt="" />
                  <div>
                    <span>{p.name}</span>
                    <b>{formatPKR(p.price)}</b>
                  </div>
                  <button type="button" onClick={() => toggle(p)} aria-label={`Remove ${p.name}`}><X size={14} /></button>
                </div>
              ) : (
                <div key={`empty-${i}`} className="bundle-slot">
                  <span className="bundle-slot__num">{i + 1}</span>
                  <span>Pick a product</span>
                </div>
              ),
            )}
          </div>

          <div className="bundle-sum">
            <div><span>Products</span><span>{formatPKR(total)}</span></div>
            <div className={ready ? 'is-off' : 'is-locked'}>
              <span>Bundle discount</span>
              <span>− {formatPKR(ready ? BUNDLE_OFF : 0)}</span>
            </div>
            <div className="bundle-sum__total"><span>Bundle total</span><b>{formatPKR(Math.max(0, total - (ready ? BUNDLE_OFF : 0)))}</b></div>
          </div>

          <p className="bundle-hint">
            {ready
              ? `You save ${formatPKR(BUNDLE_OFF)} on this bundle!`
              : needItems > 0
                ? `Pick ${needItems} more product${needItems > 1 ? 's' : ''} to unlock ${formatPKR(BUNDLE_OFF)} off.`
                : `Add ${formatPKR(needMoney)} more to your bundle to unlock ${formatPKR(BUNDLE_OFF)} off.`}
          </p>
          {note && <p className="bundle-note">{note}</p>}

          <button type="button" className="bundle-cta" disabled={!ready} onClick={addBundle}>
            Add bundle to bag
          </button>
          <p className="bundle-small">The discount is applied in your bag and at checkout.</p>
        </aside>
      </div>
    </div>
  )
}
