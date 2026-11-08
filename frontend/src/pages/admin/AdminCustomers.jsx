import { useEffect, useState } from 'react'
import { getCustomers } from '../../services/adminApi.js'
import { setComplaint } from '../../services/churnApi.js'
import './AdminPages.css'

const pkr = (n) => `PKR ${Math.round(Number(n) || 0).toLocaleString('en-PK')}`
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—')

const riskVariant = { High: 'danger', Medium: 'pending', Low: 'success' }

export default function AdminCustomers() {
  const [customers, setCustomers] = useState(null)
  const [error, setError] = useState('')
  const [savingId, setSavingId] = useState(null)

  useEffect(() => {
    getCustomers()
      .then(setCustomers)
      .catch((e) => setError(e.message))
  }, [])

  const toggleComplaint = async (c) => {
    setSavingId(c.id)
    setError('')
    try {
      const r = await setComplaint(c.id, !c.hasComplaint)
      setCustomers((list) => list.map((x) => (x.id === c.id ? { ...x, hasComplaint: r.hasComplaint } : x)))
    } catch (e) {
      setError(e.message)
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div>
      <div className="admin-page__header">
        <div>
          <h1>Customers</h1>
          <p>{customers ? `${customers.length} registered customers` : 'Loading…'}</p>
        </div>
      </div>

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>City</th>
              <th>Orders</th>
              <th>Total Spend</th>
              <th>Last Order</th>
              <th>Churn Risk</th>
              <th>Complaint</th>
            </tr>
          </thead>
          <tbody>
            {customers?.length === 0 && (
              <tr><td colSpan={8} className="admin-table__empty">No customers yet.</td></tr>
            )}
            {customers?.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.city || '—'}</td>
                <td>{c.orders}</td>
                <td>{pkr(c.totalSpent)}</td>
                <td>{fmtDate(c.lastOrderAt)}</td>
                <td>
                  {c.churn ? (
                    <span className={`admin-badge admin-badge--${riskVariant[c.churn.riskLevel]}`}>
                      {c.churn.riskLevel} · {Math.round(c.churn.probability * 100)}%
                    </span>
                  ) : (
                    <span className="admin-table__sub">Not scored</span>
                  )}
                </td>
                <td>
                  <button
                    type="button"
                    className={`admin-chip ${c.hasComplaint ? 'is-on' : ''}`}
                    onClick={() => toggleComplaint(c)}
                    disabled={savingId === c.id}
                  >
                    {c.hasComplaint ? 'Yes — clear' : 'No — mark'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
