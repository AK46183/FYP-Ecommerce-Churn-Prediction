import './AdminPages.css'

export default function AdminSettings() {
  return (
    <div>
      <div className="admin-page__header">
        <div>
          <h1>Settings</h1>
          <p>Store configuration</p>
        </div>
      </div>

      <div className="admin-placeholder-card">
        Store settings — currency, delivery zones, payment gateways and admin roles — will be
        configured here.
      </div>
    </div>
  )
}
