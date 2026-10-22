import './AdminPages.css'

const stats = [
  { label: 'Revenue (30 days)', value: 'PKR 2,148,600', change: '+12.4%' },
  { label: 'Orders', value: '386', change: '+8.1%' },
  { label: 'Customers', value: '1,204', change: '+3.6%' },
  { label: 'Avg. Order Value', value: 'PKR 5,565', change: '+1.2%' },
]

const recentOrders = [
  { id: 'MN-10231', customer: 'Ayesha Malik', total: 'PKR 6,200', status: 'Delivered' },
  { id: 'MN-10230', customer: 'Hina Raza', total: 'PKR 3,400', status: 'Processing' },
  { id: 'MN-10229', customer: 'Sara Khan', total: 'PKR 8,900', status: 'Pending' },
  { id: 'MN-10228', customer: 'Zainab Tariq', total: 'PKR 2,100', status: 'Delivered' },
]

const statusVariant = {
  Delivered: 'success',
  Processing: 'info',
  Pending: 'pending',
  Cancelled: 'danger',
}

export default function AdminDashboard() {
  return (
    <div>
      <div className="admin-page__header">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of MINAYSH store performance</p>
        </div>
      </div>

      <div className="admin-stats-grid">
        {stats.map((stat) => (
          <div className="admin-stat-card" key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
            <small>{stat.change} vs last period</small>
          </div>
        ))}
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer}</td>
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
