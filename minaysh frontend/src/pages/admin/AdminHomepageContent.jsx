import './AdminPages.css'

const sections = [
  'Top Header',
  'Category Navigation',
  'Multi-Level Mega Menu',
  'Cinematic Hero Video',
  'Tips & Trends',
  'Top Categories',
  'Shop Skin Care',
  'Our Brand',
  'Delivery / Secure Payment / Exchange Strip',
  'Newsletter + Footer',
]

export default function AdminHomepageContent() {
  return (
    <div>
      <div className="admin-page__header">
        <div>
          <h1>Homepage Content</h1>
          <p>Section order is locked to the approved MINAYSH homepage layout</p>
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Section</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((section, i) => (
              <tr key={section}>
                <td>{i + 1}</td>
                <td>{section}</td>
                <td>
                  <span className="admin-badge admin-badge--success">Live</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
