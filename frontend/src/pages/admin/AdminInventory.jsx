import { allProducts } from '../../data/products.js'
import './AdminPages.css'

const mockStock = allProducts.map((p, i) => ({
  ...p,
  stock: p.badge === 'SOLD OUT' ? 0 : 40 + i * 7,
}))

export default function AdminInventory() {
  return (
    <div>
      <div className="admin-page__header">
        <div>
          <h1>Inventory</h1>
          <p>Track stock levels across all products</p>
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>In Stock</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {mockStock.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.stock} units</td>
                <td>
                  <span
                    className={`admin-badge admin-badge--${
                      p.stock === 0 ? 'danger' : p.stock < 30 ? 'pending' : 'success'
                    }`}
                  >
                    {p.stock === 0 ? 'Out of Stock' : p.stock < 30 ? 'Low Stock' : 'In Stock'}
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
