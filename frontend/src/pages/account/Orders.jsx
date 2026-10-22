import { useLocation, Link } from 'react-router-dom'
import { formatPKR } from '../../services/format.js'
import './AccountPages.css'

const ORDERS_KEY = 'minaysh_orders'

// orders saved by the checkout page (newest first)
function readOrders() {
  try {
    const raw = window.localStorage.getItem(ORDERS_KEY)
    const list = raw ? JSON.parse(raw) : []
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

export default function Orders() {
  const location = useLocation()
  const justPlaced = location.state?.justPlaced
  const orders = readOrders()

  return (
    <div className="account-card">
      <h2>Orders</h2>

      {justPlaced && (
        <div className="account-just-placed">
          Your order {location.state?.orderId ? <strong>{location.state.orderId}</strong> : null} has been placed
          successfully — thank you for shopping with MINAYSH.
        </div>
      )}

      {orders.length === 0 ? (
        <p className="account-empty">You haven&apos;t placed any orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-row" key={order.id}>
              <div>
                <p className="order-row__id">{order.id}</p>
                <p className="order-row__meta">
                  {order.date} · {typeof order.total === 'number' ? formatPKR(order.total) : order.total}
                  {order.items ? ` · ${order.items.reduce((n, it) => n + it.quantity, 0)} item(s)` : ''}
                </p>
              </div>
              <span className="order-row__status">{order.status}</span>
              <Link to={`/account/orders/${order.id}`}>View Details</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
