import './AdminPages.css'

const customers = [
  { name: 'Ayesha Malik', email: 'ayesha@example.com', orders: 6, spend: 'PKR 28,400' },
  { name: 'Hina Raza', email: 'hina@example.com', orders: 3, spend: 'PKR 11,900' },
  { name: 'Sara Khan', email: 'sara@example.com', orders: 9, spend: 'PKR 41,200' },
  { name: 'Zainab Tariq', email: 'zainab@example.com', orders: 2, spend: 'PKR 6,300' },
]

export default function AdminCustomers() {
  return (
    <div>
      <div className="admin-page__header">
        <div>
          <h1>Customers</h1>
          <p>{customers.length} registered customers</p>
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Orders</th>
              <th>Total Spend</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.email}>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.orders}</td>
                <td>{c.spend}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
