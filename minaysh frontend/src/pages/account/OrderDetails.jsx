import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader.jsx'
import { formatPKR } from '../../services/format.js'
import { getMyOrder } from '../../services/storeApi.js'
import './AccountPages.css'

const STEPS = ['Pending', 'Processing', 'Shipped', 'Delivered']

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

  const step = order ? STEPS.indexOf(order.status) : -1
  const a = order?.customer || {}

  return (
    <>
      <PageHeader title={`Order ${orderId}`} subtitle={order ? `Placed on ${order.date}` : ''} />
      <section className="account-page">
        <div className="container">
          <div className="account-card">
            {error && <p className="account-error">{error}</p>}
            {!order && !error && <p className="account-empty">Loading order…</p>}

            {order && (
              <>
                <h2>Status: {order.status}</h2>

                {order.status !== 'Cancelled' && (
                  <ol className="order-steps">
                    {STEPS.map((s, i) => (
                      <li key={s} className={i <= step ? 'is-done' : ''}>{s}</li>
                    ))}
                  </ol>
                )}

                <div className="orders-list">
                  {order.items.map((it) => (
                    <div className="order-row" key={`${it.id}-${it.shade || ''}-${it.size || ''}`}>
                      <div>
                        <p className="order-row__id">
                          <Link to={`/product/${it.id}`}>{it.name}</Link>
                          {it.shade || it.size ? ` — ${it.shade || it.size}` : ''}
                        </p>
                        <p className="order-row__meta">Qty {it.quantity} · {formatPKR(it.price)} each</p>
                      </div>
                      <span className="order-row__status">{formatPKR(it.price * it.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="order-summary">
                  <p><span>Subtotal</span><span>{formatPKR(order.subtotal)}</span></p>
                  <p><span>Shipping ({order.delivery})</span><span>{formatPKR(order.shipping)}</span></p>
                  <p className="order-summary__total"><span>Total</span><span>{formatPKR(order.total)}</span></p>
                </div>

                <div className="order-ship">
                  <h4>Delivery to</h4>
                  <p>
                    {a.name}<br />
                    {[a.street, a.city, a.province, a.postal].filter(Boolean).join(', ')}<br />
                    {a.phone}
                  </p>
                  <p>Payment: {order.payment === 'cod' ? 'Cash on Delivery' : 'Card (confirmed by phone)'}</p>
                </div>
              </>
            )}

            <Link to="/account/orders" style={{ display: 'inline-block', marginTop: '1.5rem', fontSize: '0.82rem', textDecoration: 'underline' }}>
              Back to Orders
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
