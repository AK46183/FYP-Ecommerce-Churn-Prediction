import { allProducts } from '../../data/products.js'
import { formatPKR } from '../../services/format.js'
import './AdminPages.css'

export default function AdminProducts() {
  return (
    <div>
      <div className="admin-page__header">
        <div>
          <h1>Products</h1>
          <p>{allProducts.length} products in catalog</p>
        </div>
        <button className="admin-page__action-btn">+ Add Product</button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {allProducts.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.subCategory}</td>
                <td>{formatPKR(p.price)}</td>
                <td>
                  <span
                    className={`admin-badge admin-badge--${
                      p.badge === 'SOLD OUT' ? 'danger' : 'success'
                    }`}
                  >
                    {p.badge === 'SOLD OUT' ? 'Sold Out' : 'Active'}
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
