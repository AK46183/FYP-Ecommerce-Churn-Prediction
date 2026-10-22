import { primaryNav } from '../../data/navigation.js'
import './AdminPages.css'

export default function AdminCategories() {
  return (
    <div>
      <div className="admin-page__header">
        <div>
          <h1>Categories</h1>
          <p>Manage storefront navigation categories</p>
        </div>
        <button className="admin-page__action-btn">+ Add Category</button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Path</th>
              <th>Visible</th>
            </tr>
          </thead>
          <tbody>
            {primaryNav.map((cat) => (
              <tr key={cat.key}>
                <td>{cat.label}</td>
                <td>{cat.path}</td>
                <td>
                  <span className="admin-badge admin-badge--success">Visible</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
