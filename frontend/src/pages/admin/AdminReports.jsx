import { useEffect, useMemo, useState } from 'react'
import { getDashboard, getOrders, getCategorySummary } from '../../services/adminApi.js'
import './AdminPages.css'
import './AdminReports.css'

// Reports: store ke asli data se (orders, products, categories). Koi sample number nahi.
const pkr = (n) => `PKR ${Math.round(Number(n) || 0).toLocaleString('en-PK')}`
const RANGES = [['7d', 'Last 7 days', 7], ['30d', 'Last 30 days', 30], ['90d', 'Last 90 days', 90]]
const STATUS_ORDER = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

function downloadCsv(name, rows) {
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const blob = new Blob([rows.map((r) => r.map(esc).join(',')).join('\n')], { type: 'text/csv;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = name
  a.click()
  URL.revokeObjectURL(a.href)
}

export default function AdminReports() {
  const [range, setRange] = useState('30d')
  const [dash, setDash] = useState(null)
  const [orders, setOrders] = useState(null)
  const [categories, setCategories] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    setDash(null)
    getDashboard(range)
      .then((d) => alive && setDash(d))
      .catch((e) => alive && setError(e.message || 'Report could not be loaded.'))
    return () => {
      alive = false
    }
  }, [range])

  useEffect(() => {
    getOrders().then(setOrders).catch(() => setOrders([]))
    getCategorySummary().then(setCategories).catch(() => setCategories([]))
  }, [])

  const days = RANGES.find((r) => r[0] === range)[2]
  const inRange = useMemo(() => {
    const from = Date.now() - days * 86400000
    return (orders || []).filter((o) => new Date(o.createdAt).getTime() >= from)
  }, [orders, days])

  const byStatus = useMemo(() => {
    const map = {}
    inRange.forEach((o) => {
      const row = (map[o.status] ||= { count: 0, amount: 0 })
      row.count += 1
      row.amount += Number(o.totalAmount) || 0
    })
    return STATUS_ORDER.filter((s) => map[s]).map((s) => ({ status: s, ...map[s] }))
  }, [inRange])

  const bars = dash?.revenue?.bars || []
  const maxBar = Math.max(1, ...bars.map((b) => b.value))

  const exportOrders = () =>
    downloadCsv(`minaysh-orders-${range}.csv`, [
      ['Order', 'Customer', 'Email', 'Date', 'Items', 'Total (PKR)', 'Status'],
      ...inRange.map((o) => [
        `MN-${o.id}`,
        o.User?.name || '',
        o.User?.email || '',
        new Date(o.createdAt).toISOString().slice(0, 10),
        (o.OrderItems || []).reduce((s, i) => s + (i.quantity || 0), 0),
        Math.round(o.totalAmount),
        o.status,
      ]),
    ])

  return (
    <div>
      <div className="admin-page__header">
        <div>
          <h1>Reports</h1>
          <p>Sales and performance from your store data</p>
        </div>
        <button type="button" className="admin-page__action-btn" onClick={exportOrders} disabled={!inRange.length}>
          Export orders (CSV)
        </button>
      </div>

      <div className="admin-tabs">
        {RANGES.map(([key, label]) => (
          <button key={key} type="button" className={range === key ? 'is-active' : ''} onClick={() => setRange(key)}>
            {label}
          </button>
        ))}
      </div>

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <span>Revenue</span>
          <strong>{dash ? pkr(dash.revenue.total) : '-'}</strong>
          {dash && <small>{dash.revenue.change >= 0 ? '+' : ''}{dash.revenue.change}% vs previous period</small>}
        </div>
        <div className="admin-stat-card">
          <span>Orders</span>
          <strong>{dash ? dash.orders.total : '-'}</strong>
          {dash && <small>{dash.orders.fulfilled}% delivered</small>}
        </div>
        <div className="admin-stat-card">
          <span>Average order value</span>
          <strong>{dash ? pkr(dash.avgOrderValue.value) : '-'}</strong>
        </div>
        <div className="admin-stat-card">
          <span>New customers</span>
          <strong>{dash ? dash.customers.newThisPeriod : '-'}</strong>
          {dash && <small>{dash.customers.total} customers in total</small>}
        </div>
      </div>

      <section className="admin-report">
        <h2>Revenue over time</h2>
        {!dash && <p className="admin-report__hint">Loading…</p>}
        {dash && (
          <div className="admin-report__bars" role="img" aria-label="Revenue per period">
            {bars.map((b, i) => (
              <div key={i} className="admin-report__bar">
                <small>{b.value ? pkr(b.value).replace('PKR ', '') : '0'}</small>
                <span style={{ height: `${Math.max(2, (b.value / maxBar) * 100)}%` }} />
                <em>{b.label}</em>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="admin-report__grid">
        <section className="admin-report">
          <h2>Orders by status</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Status</th><th>Orders</th><th>Amount</th></tr>
              </thead>
              <tbody>
                {orders === null && <tr><td colSpan={3} className="admin-table__empty">Loading…</td></tr>}
                {orders !== null && byStatus.length === 0 && <tr><td colSpan={3} className="admin-table__empty">No orders in this period.</td></tr>}
                {byStatus.map((r) => (
                  <tr key={r.status}>
                    <td style={{ textTransform: 'capitalize' }}>{r.status}</td>
                    <td>{r.count}</td>
                    <td>{pkr(r.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="admin-report">
          <h2>Top products</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Product</th><th>Sold</th><th>Revenue</th></tr>
              </thead>
              <tbody>
                {!dash && <tr><td colSpan={3} className="admin-table__empty">Loading…</td></tr>}
                {dash?.topProducts.map((p) => (
                  <tr key={p.name}>
                    <td>{p.name}</td>
                    <td>{p.sold}</td>
                    <td>{pkr(p.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section className="admin-report">
        <h2>Catalog by category</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Category</th><th>Products</th><th>Active</th><th>Units in stock</th></tr>
            </thead>
            <tbody>
              {categories === null && <tr><td colSpan={4} className="admin-table__empty">Loading…</td></tr>}
              {(categories || []).map((c) => (
                <tr key={c.categoryId ?? c.name}>
                  <td>{c.name}</td>
                  <td>{c.products}</td>
                  <td>{c.available}</td>
                  <td>{Number(c.stock).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
