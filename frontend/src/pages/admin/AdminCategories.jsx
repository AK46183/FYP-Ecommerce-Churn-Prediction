import { useEffect, useState } from 'react'
import { getCategorySummary } from '../../services/adminApi.js'
import './AdminPages.css'

export default function AdminCategories() {
  const [rows, setRows] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getCategorySummary()
      .then(setRows)
      .catch((e) => setError(e.message))
  }, [])

  return (
    <div>
      <div className="admin-page__header">
        <div>
          <h1>Categories</h1>
          <p>Products per category, from the store database</p>
        </div>
      </div>

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Products</th>
              <th>Active</th>
              <th>Units in stock</th>
            </tr>
          </thead>
          <tbody>
            {rows?.length === 0 && (
              <tr><td colSpan={4} className="admin-table__empty">No products yet — run npm run seed:catalog.</td></tr>
            )}
            {rows?.map((c) => (
              <tr key={c.categoryId ?? c.name}>
                <td>{c.name}</td>
                <td>{c.products}</td>
                <td>
                  <span className="admin-badge admin-badge--success">{c.available}</span>
                </td>
                <td>{c.stock.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
