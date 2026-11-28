import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ClipboardList, PackageCheck, Truck, Home, ChevronRight } from 'lucide-react'
import { formatPKR } from '../../services/format.js'
import { getMyOrder, getMyOrders } from '../../services/storeApi.js'
import '../account/AccountPages.css'
import './InfoPages.css'

// My Account -> Track order: order number likho, status ka timeline dekho
const STEPS = [
  { key: 'Pending', label: 'Order placed', icon: ClipboardList },
  { key: 'Processing', label: 'Processing', icon: PackageCheck },
  { key: 'Shipped', label: 'Shipped', icon: Truck },
  { key: 'Delivered', label: 'Delivered', icon: Home },
]
const STEP_OF = { Pending: 0, Confirmed: 0, Processing: 1, Shipped: 2, Delivered: 3, Completed: 3 }
const TONE = { Pending: 'wait', Processing: 'wait', Confirmed: 'info', Shipped: 'info', Delivered: 'done', Completed: 'done', Cancelled: 'stop' }
const MESSAGE = {
  Pending: 'We have received your order and will start packing it soon.',
  Confirmed: 'Your order is confirmed and will be packed soon.',
  Processing: 'Your order is being packed right now.',
  Shipped: 'Your parcel is on its way with our courier.',
  Delivered: 'Your order has been delivered. We hope you love it!',
  Completed: 'Your order has been delivered. We hope you love it!',
  Cancelled: 'This order was cancelled.',
}

// "12", "mn12", "MN-12" -> "MN-12"
const cleanId = (v) => {
  const m = String(v).trim().match(/^(?:mn\s*-?\s*)?(\d{1,9})$/i)
  return m ? `MN-${m[1]}` : null
}

export default function TrackOrder() {
  const [query, setQuery] = useState('')
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [recent, setRecent] = useState([])

  useEffect(() => {
    getMyOrders().then((list) => setRecent(list.slice(0, 4))).catch(() => setRecent([]))
  }, [])

  async function track(value) {
    const id = cleanId(value)
    setError('')
    setOrder(null)
    if (!id) {
      setError('Please enter an order number like MN-12.')
      return
    }
    setQuery(id)
    setLoading(true)
    try {
      setOrder(await getMyOrder(id))
    } catch (e) {
      setError(e.status === 404 ? `We couldn't find ${id} in your account. Please check the number in your confirmation email.` : e.message)
    } finally {
      setLoading(false)
    }
  }

  const step = order ? STEP_OF[order.status] ?? -1 : -1
  const cancelled = order?.status === 'Cancelled'
  const count = order ? order.items.reduce((n, i) => n + i.quantity, 0) : 0

  return (
    <div className="account-card">
      <h2>Track your order</h2>
      <form className="track-form" onSubmit={(e) => { e.preventDefault(); track(query) }}>
        <label>
          <Search size={18} aria-hidden="true" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Order number, e.g. MN-12"
            aria-label="Order number"
            maxLength={20}
          />
        </label>
        <button type="submit" className="info-btn" disabled={loading}>{loading ? 'Checking…' : 'Track order'}</button>
      </form>
      <p className="track-hint">You can find your order number in your confirmation email.</p>

      {error && <p className="account-error" role="alert">{error}</p>}

      {order && (
        <div className="track-result" aria-live="polite">
          <div className="track-result__head">
            <div>
              <p className="track-result__id">{order.id}</p>
              <p className="track-result__meta">Placed on {order.date} · {count} item{count === 1 ? '' : 's'}</p>
            </div>
            <span className={`order-status order-status--${TONE[order.status] || 'wait'}`}>{order.status}</span>
          </div>

          {!cancelled && (
            <ol className="track-steps">
              {STEPS.map((s, i) => {
                const Icon = s.icon
                return (
                  <li key={s.key} className={`${i <= step ? 'is-done' : ''}${i === step ? ' is-current' : ''}`}>
                    <span><Icon size={18} strokeWidth={1.7} aria-hidden="true" /></span>
                    {s.label}
                  </li>
                )
              })}
            </ol>
          )}
          <p className="track-result__msg">{MESSAGE[order.status] || ''}</p>

          <div className="track-result__foot">
            <span>Total <strong>{formatPKR(order.total)}</strong></span>
            <Link to={`/account/orders/${order.id}`}>View full details <ChevronRight size={14} aria-hidden="true" style={{ verticalAlign: '-2px' }} /></Link>
          </div>
        </div>
      )}

      {recent.length > 0 && (
        <div className="track-recent">
          <h3>Your recent orders</h3>
          <div className="track-recent__list">
            {recent.map((o) => (
              <button key={o.id} type="button" onClick={() => track(o.id)}>
                <span><strong>{o.id}</strong> <small>· {o.date}</small></span>
                <span className={`order-status order-status--${TONE[o.status] || 'wait'}`}>{o.status}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
