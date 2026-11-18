import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, ClipboardList, PackageCheck, Truck, Home, MapPin, Banknote, CreditCard, Package } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader.jsx'
import { formatPKR } from '../../services/format.js'
import { getMyOrder } from '../../services/storeApi.js'
import './AccountPages.css'

const STEPS = [
  { key: 'Pending', label: 'Order placed', icon: ClipboardList },
  { key: 'Processing', label: 'Processing', icon: PackageCheck },
  { key: 'Shipped', label: 'Shipped', icon: Truck },
  { key: 'Delivered', label: 'Delivered', icon: Home },
]
const TONE = { Pending: 'wait', Processing: 'wait', Confirmed: 'info', Shipped: 'info', Delivered: 'done', Completed: 'done', Cancelled: 'stop' }

export default function OrderDetails() {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    setOrder(null)
    setError('')
    getMyOrder(orderId)
      .then(setOrder)
      .catch((e) => setError(e.message))
  }, [orderId])

  const step = order ? STEPS.findIndex((s) => s.key === order.status) : -1
  const a = order?.customer || {}
  const count = order ? order.items.reduce((n, it) => n + it.quantity, 0) : 0

  return (
    <>
      <PageHeader title={`Order ${orderId}`} subtitle={order ? `Placed on ${order.date}` : ''} />
      <section className="account-page">
        <div className="container od-wrap">
          <Link to="/account/orders" className="od-back">
            <ChevronLeft size={16} aria-hidden="true" /> Back to orders
          </Link>

          {error && <p className="account-error">{error}</p>}
          {!order && !error && <div className="od-card od-skeleton" aria-busy="true" />}

          {order && (
            <div className="od-layout">
              <div className="od-main">
                <div className="od-card">
                  <div className="od-card__head">
                    <h3>Order status</h3>
                    <span className={`order-status order-status--${TONE[order.status] || 'wait'}`}>{order.status}</span>
                  </div>
                  {order.status === 'Cancelled' ? (
                    <p className="od-note">This order was cancelled. If you have questions, please contact us.</p>
                  ) : (
                    <ol className="od-track">
                      {STEPS.map((s, i) => {
                        const Icon = s.icon
                        const state = i < step ? 'done' : i === step ? 'now' : ''
                        return (
                          <li key={s.key} className={state ? `is-${state}` : ''}>
                            <span className="od-track__dot"><Icon size={16} strokeWidth={1.7} aria-hidden="true" /></span>
                            <span className="od-track__label">{s.label}</span>
                          </li>
                        )
                      })}
                    </ol>
                  )}
                </div>

                <div className="od-card">
                  <div className="od-card__head">
                    <h3>Items</h3>
                    <span className="od-muted">{count} item{count === 1 ? '' : 's'}</span>
                  </div>
                  <ul className="od-items">
                    {order.items.map((it) => (
                      <li key={`${it.id}-${it.shade || ''}-${it.size || ''}`}>
                        <span className="od-items__img">
                          {it.image ? <img src={it.image} alt="" loading="lazy" /> : <Package size={20} aria-hidden="true" />}
                        </span>
                        <div className="od-items__info">
                          <Link to={`/product/${it.id}`}>{it.name}</Link>
                          <small>
                            {[it.shade, it.size].filter(Boolean).join(' · ')}
                            {(it.shade || it.size) ? ' · ' : ''}Qty {it.quantity} × {formatPKR(it.price)}
                          </small>
                        </div>
                        <strong>{formatPKR(it.price * it.quantity)}</strong>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="od-info">
                  <div className="od-card od-mini">
                    <span className="od-mini__icon"><MapPin size={17} strokeWidth={1.7} aria-hidden="true" /></span>
                    <div>
                      <h4>Delivery address</h4>
                      <p>
                        {a.name}<br />
                        {[a.street, a.city, a.province, a.postal].filter(Boolean).join(', ')}<br />
                        {a.phone}
                      </p>
                    </div>
                  </div>
                  <div className="od-card od-mini">
                    <span className="od-mini__icon">
                      {order.payment === 'cod' ? <Banknote size={17} strokeWidth={1.7} aria-hidden="true" /> : <CreditCard size={17} strokeWidth={1.7} aria-hidden="true" />}
                    </span>
                    <div>
                      <h4>Payment and delivery</h4>
                      <p>
                        {order.payment === 'cod' ? 'Cash on delivery' : 'Card (confirmed by phone)'}<br />
                        {order.delivery === 'express' ? 'Express delivery (1 to 2 days)' : 'Standard delivery (3 to 5 days)'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <aside className="od-summary">
                <h3>Order summary</h3>
                <div className="od-summary__rows">
                  <p><span>Subtotal</span><span>{formatPKR(order.subtotal)}</span></p>
                  <p><span>Delivery ({order.delivery === 'express' ? 'Express' : 'Standard'})</span><span>{formatPKR(order.shipping)}</span></p>
                  {order.discount > 0 && (
                    <p className="od-summary__off">
                      <span>Discount{order.couponCode ? ` (${order.couponCode})` : ''}</span>
                      <span>−{formatPKR(order.discount)}</span>
                    </p>
                  )}
                  <p className="od-summary__total"><span>Total</span><span>{formatPKR(order.total)}</span></p>
                </div>
                <Link to="/help" className="od-summary__help">Need help with this order?</Link>
              </aside>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
