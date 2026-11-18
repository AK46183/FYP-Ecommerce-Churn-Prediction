import { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { CheckCircle2, Package, ChevronRight } from 'lucide-react'
import { formatPKR } from '../../services/format.js'
import { getMyOrders } from '../../services/storeApi.js'
import './AccountPages.css'

// status -> rang (pill)
const STATUS_TONE = {
  pending: 'wait',
  processing: 'wait',
  confirmed: 'info',
  shipped: 'info',
  delivered: 'done',
  completed: 'done',
  cancelled: 'stop',
}

export default function Orders() {
  const location = useLocation()
  const justPlaced = location.state?.justPlaced
  const [orders, setOrders] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getMyOrders()
      .then(setOrders)
      .catch((e) => setError(e.message))
  }, [])

  return (
    <div className="account-card">
      <div className="orders-head">
        <h2>Orders</h2>
        {orders?.length > 0 && <span>{orders.length} order{orders.length === 1 ? '' : 's'}</span>}
      </div>

      {justPlaced && (
        <div className="order-placed" role="status">
          <CheckCircle2 size={22} strokeWidth={1.8} aria-hidden="true" />
          <div>
            <strong>Order placed{location.state?.orderId ? `: ${location.state.orderId}` : ''}</strong>
            <p>Thank you for shopping with MINAYSH. A confirmation email is on its way.</p>
          </div>
        </div>
      )}

      {error && <p className="account-error">{error}</p>}

      {!orders && !error ? (
        <div className="orders-list" aria-busy="true">
          {[0, 1].map((i) => <div key={i} className="order-card order-card--skeleton" />)}
        </div>
      ) : orders?.length === 0 ? (
        <div className="orders-empty">
          <Package size={34} strokeWidth={1.4} aria-hidden="true" />
          <p>You haven&apos;t placed any orders yet.</p>
          <Link to="/skincare" className="orders-empty__cta">Start shopping</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders?.map((order) => {
            const count = order.items.reduce((n, it) => n + it.quantity, 0)
            const tone = STATUS_TONE[String(order.status).toLowerCase()] || 'wait'
            const thumbs = order.items.slice(0, 4)
            return (
              <Link to={`/account/orders/${order.id}`} className="order-card" key={order.id}>
                <div className="order-card__top">
                  <div>
                    <p className="order-card__id">{order.id}</p>
                    <p className="order-card__date">Placed on {order.date}</p>
                  </div>
                  <span className={`order-status order-status--${tone}`}>{order.status}</span>
                </div>
                <div className="order-card__bottom">
                  <div className="order-card__thumbs" aria-hidden="true">
                    {thumbs.map((it, i) => (
                      <span key={`${it.id}-${i}`}>{it.image ? <img src={it.image} alt="" loading="lazy" /> : <Package size={18} />}</span>
                    ))}
                    {order.items.length > 4 && <span className="order-card__more">+{order.items.length - 4}</span>}
                  </div>
                  <div className="order-card__sum">
                    <small>{count} item{count === 1 ? '' : 's'}</small>
                    <strong>{formatPKR(order.total)}</strong>
                  </div>
                  <span className="order-card__view">
                    View details <ChevronRight size={16} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
