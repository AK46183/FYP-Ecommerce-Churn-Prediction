import './AdminPages.css'

const bundles = [
  { name: 'Everyday Glow Bundle', items: 3, price: 'PKR 7,900', active: true },
  { name: 'Weekend Skin Reset', items: 4, price: 'PKR 10,200', active: true },
]

export default function AdminBundles() {
  return (
    <div>
      <div className="admin-page__header">
        <div>
          <h1>Bundle Offers</h1>
          <p>Create and manage product bundles</p>
        </div>
        <button className="admin-page__action-btn">+ Create Bundle</button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Bundle</th>
              <th>Items</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bundles.map((b) => (
              <tr key={b.name}>
                <td>{b.name}</td>
                <td>{b.items} products</td>
                <td>{b.price}</td>
                <td>
                  <span className="admin-badge admin-badge--success">Active</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
