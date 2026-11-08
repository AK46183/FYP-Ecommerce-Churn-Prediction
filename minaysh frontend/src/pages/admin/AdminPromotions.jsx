import { useEffect, useState } from 'react'
import {
  getCoupons,
  createCoupon,
  updateCoupon,
  getAbandonedCarts,
  sendCartReminders,
} from '../../services/adminApi.js'
import { formatPKR } from '../../services/format.js'
import './AdminPages.css'

const empty = { code: '', type: 'percent', value: '', minOrder: '', maxUses: '', expiresAt: '', description: '' }

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—')

const isExpired = (c) => c.expiresAt && new Date(c.expiresAt) < new Date()
const isUsedUp = (c) => c.maxUses !== null && c.usedCount >= c.maxUses

export default function AdminPromotions() {
  const [tab, setTab] = useState('coupons')
  const [coupons, setCoupons] = useState(null)
  const [showPersonal, setShowPersonal] = useState(false)
  const [form, setForm] = useState(empty)
  const [adding, setAdding] = useState(false)
  const [carts, setCarts] = useState(null)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const loadCoupons = (all = showPersonal) =>
    getCoupons(all).then(setCoupons).catch((e) => setError(e.message))
  const loadCarts = () => getAbandonedCarts().then(setCarts).catch((e) => setError(e.message))

  useEffect(() => {
    loadCoupons(false)
    loadCarts()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  async function handleCreate(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await createCoupon({
        ...form,
        value: form.type === 'shipping' ? 0 : Number(form.value),
        minOrder: form.minOrder === '' ? 0 : Number(form.minOrder),
        maxUses: form.maxUses === '' ? null : Number(form.maxUses),
        expiresAt: form.expiresAt || null,
      })
      setForm(empty)
      setAdding(false)
      setMsg('Coupon created')
      loadCoupons()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function toggle(c) {
    setError('')
    try {
      await updateCoupon(c.id, { active: !c.active })
      loadCoupons()
    } catch (err) {
      setError(err.message)
    }
  }

  async function remind() {
    setBusy(true)
    setError('')
    try {
      const r = await sendCartReminders()
      setMsg(r.sent ? `Reminder email sent to ${r.sent} customer(s).` : 'No carts need a reminder right now.')
      loadCarts()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const statusOf = (c) =>
    !c.active ? ['Off', 'pending'] : isExpired(c) ? ['Expired', 'danger'] : isUsedUp(c) ? ['Used', 'info'] : ['Active', 'success']

  return (
    <div>
      <div className="admin-page__header">
        <div>
          <h1>Promotions</h1>
          <p>Discount codes and abandoned carts</p>
        </div>
        {tab === 'coupons' && !adding && (
          <button className="admin-page__action-btn" onClick={() => setAdding(true)}>+ New Code</button>
        )}
        {tab === 'carts' && (
          <button className="admin-page__action-btn" onClick={remind} disabled={busy}>
            {busy ? 'Sending…' : 'Send reminder emails'}
          </button>
        )}
      </div>

      <div className="admin-tabs">
        <button type="button" className={tab === 'coupons' ? 'is-active' : ''} onClick={() => setTab('coupons')}>
          Discount codes
        </button>
        <button type="button" className={tab === 'carts' ? 'is-active' : ''} onClick={() => setTab('carts')}>
          Abandoned carts ({carts?.length ?? 0})
        </button>
      </div>

      {error && <p className="admin-error">{error}</p>}
      {msg && <p className="admin-ok">{msg}</p>}

      {tab === 'coupons' && (
        <>
          {adding && (
            <form className="admin-form" onSubmit={handleCreate}>
              <label>
                Code
                <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="EID25" required />
              </label>
              <label>
                Type
                <select value={form.type} onChange={update('type')}>
                  <option value="percent">% off</option>
                  <option value="fixed">PKR off</option>
                  <option value="shipping">Free delivery</option>
                </select>
              </label>
              {form.type !== 'shipping' && (
                <label>
                  {form.type === 'percent' ? 'Percent' : 'Amount (PKR)'}
                  <input type="number" min="1" value={form.value} onChange={update('value')} required />
                </label>
              )}
              <label>
                Min order (PKR)
                <input type="number" min="0" value={form.minOrder} onChange={update('minOrder')} placeholder="0" />
              </label>
              <label>
                Max uses
                <input type="number" min="1" value={form.maxUses} onChange={update('maxUses')} placeholder="Unlimited" />
              </label>
              <label>
                Expires
                <input type="date" value={form.expiresAt} onChange={update('expiresAt')} />
              </label>
              <label className="admin-form__wide">
                Description (shown to customer)
                <input value={form.description} onChange={update('description')} placeholder="Eid sale — 25% off" />
              </label>
              <div className="admin-form__actions">
                <button type="submit" className="admin-page__action-btn" disabled={busy}>{busy ? 'Saving…' : 'Create code'}</button>
                <button type="button" className="admin-chip" onClick={() => setAdding(false)}>Cancel</button>
              </div>
            </form>
          )}

          <label className="admin-check">
            <input
              type="checkbox"
              checked={showPersonal}
              onChange={(e) => {
                setShowPersonal(e.target.checked)
                loadCoupons(e.target.checked)
              }}
            />
            Show personal codes sent by churn engagement
          </label>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Discount</th>
                  <th>Used</th>
                  <th>Expires</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {coupons?.length === 0 && (
                  <tr><td colSpan={5} className="admin-table__empty">No codes yet.</td></tr>
                )}
                {coupons?.map((c) => {
                  const [label, variant] = statusOf(c)
                  return (
                    <tr key={c.id}>
                      <td>
                        <b>{c.code}</b>
                        <small className="admin-table__sub">
                          {c.userId ? `Personal · customer #${c.userId}` : c.source === 'system' ? 'Built-in' : 'Public'}
                        </small>
                      </td>
                      <td>{c.label}</td>
                      <td>{c.usedCount}{c.maxUses !== null ? ` / ${c.maxUses}` : ''}</td>
                      <td>{fmtDate(c.expiresAt)}</td>
                      <td>
                        <span className={`admin-badge admin-badge--${variant}`}>{label}</span>
                        <button type="button" className="admin-chip" style={{ marginLeft: 8 }} onClick={() => toggle(c)}>
                          {c.active ? 'Turn off' : 'Turn on'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'carts' && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Items</th>
                <th>Value</th>
                <th>Left on</th>
                <th>Reminder</th>
              </tr>
            </thead>
            <tbody>
              {carts?.length === 0 && (
                <tr><td colSpan={5} className="admin-table__empty">No abandoned carts — customers left nothing behind for 24+ hours.</td></tr>
              )}
              {carts?.map((c) => (
                <tr key={c.cartId}>
                  <td>
                    {c.name}
                    <small className="admin-table__sub">{c.email}</small>
                  </td>
                  <td>{c.items.map((i) => `${i.name}${i.quantity > 1 ? ` ×${i.quantity}` : ''}`).join(', ')}</td>
                  <td>{formatPKR(c.value)}</td>
                  <td>{fmtDate(c.lastChangedAt)}</td>
                  <td>{c.reminderSentAt ? fmtDate(c.reminderSentAt) : <span className="admin-table__sub">Not sent</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
