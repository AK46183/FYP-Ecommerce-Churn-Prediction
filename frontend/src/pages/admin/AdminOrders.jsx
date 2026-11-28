import { useEffect, useState } from 'react'
import { getOrders, updateOrderStatus } from '../../services/adminApi.js'
import './AdminPages.css'

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

const statusVariant = {
  delivered: 'success',
  shipped: 'info',
  processing: 'info',
  pending: 'pending',
  cancelled: 'danger',
}

// Card order ki payment baqi? (purane card orders 'none' hain, woh baqi nahi)
const awaitingPayment = (o) => o.payment === 'card' && o.paymentStatus === 'unpaid' && o.status !== 'cancelled'

const paymentLabel = (o) => {
  if (o.payment !== 'card') return { text: 'Cash on delivery', variant: 'info' }
  if (o.paymentStatus === 'paid') return { text: 'Card · paid', variant: 'success' }
  if (o.paymentStatus === 'unpaid') return { text: o.status === 'cancelled' ? 'Card · not paid' : 'Card · payment pending', variant: o.status === 'cancelled' ? 'danger' : 'pending' }
  return { text: 'Card', variant: 'info' }
}

const pkr = (n) => `PKR ${Math.round(Number(n) || 0).toLocaleString('en-PK')}`
const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export default function AdminOrders() {
  const [orders, setOrders] = useState(null)
  const [error, setError] = useState('')
  const [savingId, setSavingId] = useState(null)

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .catch((e) => setError(e.message))
  }, [])

  const changeStatus = async (order, status) => {
    setSavingId(order.id)
    setError('')
    try {
      const updated = await updateOrderStatus(order.id, status)
      setOrders((list) => list.map((o) => (o.id === order.id ? { ...o, status: updated.status } : o)))
    } catch (e) {
      setError(e.message)
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div>
      <div className="admin-page__header">
        <div>
          <h1>Orders</h1>
          <p>{orders ? `${orders.length} orders` : 'Loading…'}</p>
        </div>
      </div>

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders?.length === 0 && (
              <tr><td colSpan={7} className="admin-table__empty">No orders yet.</td></tr>
            )}
            {orders?.map((order) => {
              const items = order.OrderItems || []
              const count = items.reduce((s, i) => s + i.quantity, 0)
              const names = items.map((i) => i.Product?.name).filter(Boolean).join(', ')
              const pay = paymentLabel(order)
              const unpaid = awaitingPayment(order)
              return (
                <tr key={order.id}>
                  <td>MN-{order.id}</td>
                  <td>
                    {order.User?.name || '-'}
                    <small className="admin-table__sub">{order.User?.email}</small>
                  </td>
                  <td>{fmtDate(order.createdAt)}</td>
                  <td title={names}>{count}</td>
                  <td>{pkr(order.totalAmount)}</td>
                  <td>
                    <span className={`admin-badge admin-badge--${pay.variant}`}>{pay.text}</span>
                  </td>
                  <td>
                    <span className={`admin-badge admin-badge--${statusVariant[order.status] || 'pending'}`}>
                      {order.status}
                    </span>
                    <select
                      className="admin-select"
                      value={order.status}
                      disabled={savingId === order.id}
                      onChange={(e) => changeStatus(order, e.target.value)}
                      aria-label={`Change status of order MN-${order.id}`}
                    >
                      {STATUSES.map((s) => (
                        // payment baqi ho to aage nahi bhej sakte, sirf cancel
                        <option key={s} value={s} disabled={unpaid && s !== order.status && s !== 'cancelled'}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
