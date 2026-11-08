import { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { formatPKR } from '../../services/format.js'
import { getMyOrders } from '../../services/storeApi.js'
import './AccountPages.css'

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
      <h2>Orders</h2>

      {justPlaced && (
        <div className="account-just-placed">
          Your order {location.state?.orderId ? <strong>{location.state.orderId}</strong> : null} has been placed
          successfully — a confirmation email is on its way. Thank you for shopping with MINAYSH.
        </div>
      )}

      {error && <p className="account-error">{error}</p>}

      {!orders && !error ? (
        <p className="account-empty">Loading your orders…</p>
      ) : orders?.length === 0 ? (
        <p className="account-empty">You haven&apos;t placed any orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders?.map((order) => (
            <div className="order-row" key={order.id}>
              <div>
                <p className="order-row__id">{order.id}</p>
                <p className="order-row__meta">
                  {order.date} · {formatPKR(order.total)}
                  {` · ${order.items.reduce((n, it) => n + it.quantity, 0)} item(s)`}
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
