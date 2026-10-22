import './AdminPages.css'

const orders = [
  { id: 'MN-10231', customer: 'Ayesha Malik', date: 'Sep 12, 2026', total: 'PKR 6,200', status: 'Delivered' },
  { id: 'MN-10230', customer: 'Hina Raza', date: 'Sep 11, 2026', total: 'PKR 3,400', status: 'Processing' },
  { id: 'MN-10229', customer: 'Sara Khan', date: 'Sep 10, 2026', total: 'PKR 8,900', status: 'Pending' },
  { id: 'MN-10228', customer: 'Zainab Tariq', date: 'Sep 9, 2026', total: 'PKR 2,100', status: 'Delivered' },
  { id: 'MN-10227', customer: 'Mahnoor Aslam', date: 'Sep 8, 2026', total: 'PKR 4,750', status: 'Cancelled' },
]

const statusVariant = {
  Delivered: 'success',
  Processing: 'info',
  Pending: 'pending',
  Cancelled: 'danger',
}

export default function AdminOrders() {
  return (
    <div>
      <div className="admin-page__header">
        <div>
          <h1>Orders</h1>
          <p>{orders.length} orders this month</p>
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.date}</td>
                <td>{order.total}</td>
                <td>
                  <span className={`admin-badge admin-badge--${statusVariant[order.status]}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
