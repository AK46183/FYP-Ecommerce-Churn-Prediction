import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ShoppingBag,
  PackageCheck,
  PackageX,
  UserPlus,
  AlertTriangle,
  MessageSquare,
  Mail,
  TrendingDown,
  CheckCheck,
} from 'lucide-react'
import {
  getNotifications,
  markNotification,
  markAllNotifications,
  getEmailLog,
  getMessages,
  setMessageStatus,
  getSubscribers,
  getEmailStatus,
  sendTestEmail,
} from '../../services/adminApi.js'
import './AdminPages.css'

const fmt = (d) => new Date(d).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

// Inbox ke types: icon + naam
const TYPES = {
  order: { label: 'New order', icon: ShoppingBag, tone: 'info' },
  delivered: { label: 'Delivered', icon: PackageCheck, tone: 'success' },
  cancelled: { label: 'Cancelled', icon: PackageX, tone: 'danger' },
  customer: { label: 'New customer', icon: UserPlus, tone: 'success' },
  complaint: { label: 'Complaint', icon: AlertTriangle, tone: 'danger' },
  message: { label: 'Message', icon: MessageSquare, tone: 'info' },
  subscriber: { label: 'Subscriber', icon: Mail, tone: 'success' },
  low_stock: { label: 'Low stock', icon: TrendingDown, tone: 'pending' },
}

const EMAIL_TYPES = {
  welcome: 'Welcome',
  order: 'Order confirmation',
  status: 'Order status',
  reset: 'Password reset',
  contact: 'Contact reply',
  newsletter: 'Newsletter',
  engagement: 'Churn engagement',
  cart: 'Abandoned cart',
  restock: 'Back in stock',
  price_drop: 'Price drop',
  admin: 'Admin alert',
  test: 'Test',
  general: 'Other',
}

const EMAIL_STATUS = {
  sent: ['Sent', 'success'],
  not_configured: ['Not sent (SMTP off)', 'pending'],
  failed: ['Failed', 'danger'],
}

const TOPICS = { general: 'General', order: 'Order issue', product: 'Product question', complaint: 'Complaint' }
const msgVariant = { new: 'pending', read: 'info', replied: 'success' }

const notifyInboxChanged = () => window.dispatchEvent(new Event('minaysh:inbox-changed'))

export default function AdminMessages() {
  const [tab, setTab] = useState('inbox')
  const [error, setError] = useState('')

  // Inbox
  const [notes, setNotes] = useState(null)
  const [noteFilter, setNoteFilter] = useState('')
  const [unreadOnly, setUnreadOnly] = useState(false)
  const [openId, setOpenId] = useState(null)

  // Others
  const [emails, setEmails] = useState(null)
  const [emailFilter, setEmailFilter] = useState('')
  const [messages, setMessages] = useState(null)
  const [subscribers, setSubscribers] = useState(null)
  const [emailStatus, setEmailStatusState] = useState(null)
  const [testTo, setTestTo] = useState('')
  const [testResult, setTestResult] = useState('')

  const loadNotes = useCallback(() => {
    getNotifications({ type: noteFilter, unread: unreadOnly ? '1' : '' })
      .then(setNotes)
      .catch((e) => setError(e.message))
  }, [noteFilter, unreadOnly])

  useEffect(() => {
    loadNotes()
  }, [loadNotes])

  useEffect(() => {
    getEmailLog(emailFilter).then(setEmails).catch(() => {})
  }, [emailFilter])

  useEffect(() => {
    getMessages().then(setMessages).catch(() => {})
    getSubscribers().then(setSubscribers).catch(() => {})
    getEmailStatus().then(setEmailStatusState).catch(() => {})
  }, [])

  const openNote = async (n) => {
    setOpenId(openId === n.id ? null : n.id)
    if (!n.read) {
      setNotes((list) => list.map((x) => (x.id === n.id ? { ...x, read: true } : x)))
      markNotification(n.id, true).then(notifyInboxChanged).catch(() => {})
    }
  }

  const readAll = async () => {
    try {
      await markAllNotifications()
      setNotes((list) => list?.map((x) => ({ ...x, read: true })))
      notifyInboxChanged()
    } catch (e) {
      setError(e.message)
    }
  }

  const changeStatus = async (m, status) => {
    try {
      const updated = await setMessageStatus(m.id, status)
      setMessages((list) => list.map((x) => (x.id === m.id ? { ...x, status: updated.status } : x)))
    } catch (e) {
      setError(e.message)
    }
  }

  const runTest = async (e) => {
    e.preventDefault()
    setTestResult('Sending…')
    try {
      const r = await sendTestEmail(testTo.trim())
      setTestResult(
        r.sent
          ? `Sent to ${r.to} — check the inbox (and spam).`
          : r.logged
            ? 'SMTP is not set up yet — the email was printed in the backend terminal instead.'
            : `Failed: ${r.error}`
      )
      getEmailLog(emailFilter).then(setEmails).catch(() => {})
    } catch (err) {
      setTestResult(err.message)
    }
  }

  const unread = notes?.filter((n) => !n.read).length || 0
  const newMessages = messages?.filter((m) => m.status === 'new').length || 0

  return (
    <div>
      <div className="admin-page__header">
        <div>
          <h1>Inbox</h1>
          <p>Store alerts (also sent to the admin email), customer emails and messages</p>
        </div>
        {tab === 'inbox' && unread > 0 && (
          <button className="admin-page__action-btn" onClick={readAll}>
            <CheckCheck size={14} style={{ verticalAlign: '-2px', marginRight: 6 }} />
            Mark all read
          </button>
        )}
      </div>

      <div className="admin-tabs">
        {[
          ['inbox', `Inbox${unread ? ` (${unread})` : ''}`],
          ['sent', 'Sent emails'],
          ['messages', `Contact messages${newMessages ? ` (${newMessages} new)` : ''}`],
          ['subscribers', `Newsletter (${subscribers?.length ?? 0})`],
          ['setup', 'Email setup'],
        ].map(([key, label]) => (
          <button key={key} type="button" className={tab === key ? 'is-active' : ''} onClick={() => setTab(key)}>
            {label}
          </button>
        ))}
      </div>

      {error && <p className="admin-error">{error}</p>}

      {/* ---------------- Inbox ---------------- */}
      {tab === 'inbox' && (
        <>
          <div className="inbox-filters">
            <select className="admin-select" value={noteFilter} onChange={(e) => setNoteFilter(e.target.value)}>
              <option value="">All alerts</option>
              {Object.entries(TYPES).map(([k, t]) => (
                <option key={k} value={k}>{t.label}</option>
              ))}
            </select>
            <label className="admin-check">
              <input type="checkbox" checked={unreadOnly} onChange={(e) => setUnreadOnly(e.target.checked)} />
              Unread only
            </label>
          </div>

          <div className="inbox-list">
            {notes?.length === 0 && <p className="admin-placeholder-card">No alerts yet. New orders, customers and complaints will appear here.</p>}
            {notes?.map((n) => {
              const t = TYPES[n.type] || TYPES.message
              const Icon = t.icon
              const open = openId === n.id
              return (
                <article key={n.id} className={`inbox-item ${n.read ? '' : 'is-unread'} ${open ? 'is-open' : ''}`}>
                  <button type="button" className="inbox-item__head" onClick={() => openNote(n)}>
                    <span className={`inbox-item__icon inbox-item__icon--${t.tone}`}><Icon size={16} /></span>
                    <span className="inbox-item__title">
                      <b>{n.title}</b>
                      {!open && <small>{n.body.split('\n')[0]}</small>}
                    </span>
                    <span className="inbox-item__meta">
                      <span className={`admin-badge admin-badge--${t.tone}`}>{t.label}</span>
                      <small>{fmt(n.createdAt)}{n.emailed ? ' · emailed' : ''}</small>
                    </span>
                  </button>
                  {open && (
                    <div className="inbox-item__body">
                      <p>{n.body}</p>
                      {n.link && <Link to={n.link} className="admin-link">Open {n.link.replace('/admin/', '')} →</Link>}
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        </>
      )}

      {/* ---------------- Sent emails ---------------- */}
      {tab === 'sent' && (
        <>
          <div className="inbox-filters">
            <select className="admin-select" value={emailFilter} onChange={(e) => setEmailFilter(e.target.value)}>
              <option value="">All emails</option>
              {Object.entries(EMAIL_TYPES).map(([k, label]) => (
                <option key={k} value={k}>{label}</option>
              ))}
            </select>
            {emails?.stats && (
              <small className="admin-table__sub">
                Sent {emails.stats.sent || 0} · Not sent {emails.stats.not_configured || 0} · Failed {emails.stats.failed || 0}
              </small>
            )}
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>To</th>
                  <th>Subject</th>
                  <th>Type</th>
                  <th>When</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {emails?.emails.length === 0 && (
                  <tr><td colSpan={5} className="admin-table__empty">No emails yet.</td></tr>
                )}
                {emails?.emails.map((m) => {
                  const [label, variant] = EMAIL_STATUS[m.status] || ['—', 'info']
                  return (
                    <tr key={m.id}>
                      <td>{m.to}</td>
                      <td>{m.subject}</td>
                      <td>{EMAIL_TYPES[m.type] || m.type}</td>
                      <td>{fmt(m.sentAt)}</td>
                      <td>
                        <span className={`admin-badge admin-badge--${variant}`} title={m.error || ''}>{label}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ---------------- Contact messages ---------------- */}
      {tab === 'messages' && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>From</th>
                <th>Topic</th>
                <th>Message</th>
                <th>Received</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {messages?.length === 0 && (
                <tr><td colSpan={5} className="admin-table__empty">No messages yet.</td></tr>
              )}
              {messages?.map((m) => (
                <tr key={m.id}>
                  <td>
                    {m.name}
                    <small className="admin-table__sub"><a href={`mailto:${m.email}`}>{m.email}</a></small>
                  </td>
                  <td>
                    <span className={`admin-badge admin-badge--${m.topic === 'complaint' ? 'danger' : 'info'}`}>
                      {TOPICS[m.topic] || 'General'}
                    </span>
                    {m.orderRef && <small className="admin-table__sub">{m.orderRef}</small>}
                  </td>
                  <td className="admin-table__message">{m.message}</td>
                  <td>{fmt(m.createdAt)}</td>
                  <td>
                    <span className={`admin-badge admin-badge--${msgVariant[m.status]}`}>{m.status}</span>
                    <select
                      className="admin-select"
                      value={m.status}
                      onChange={(e) => changeStatus(m, e.target.value)}
                      aria-label="Change status"
                    >
                      <option value="new">new</option>
                      <option value="read">read</option>
                      <option value="replied">replied</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ---------------- Subscribers ---------------- */}
      {tab === 'subscribers' && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {subscribers?.length === 0 && (
                <tr><td colSpan={2} className="admin-table__empty">No subscribers yet.</td></tr>
              )}
              {subscribers?.map((s) => (
                <tr key={s.id}>
                  <td>{s.email}</td>
                  <td>{fmt(s.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ---------------- Setup ---------------- */}
      {tab === 'setup' && (
        <div className="admin-placeholder-card admin-email-card">
          <p>
            <b>Status:</b>{' '}
            <span className={`admin-badge admin-badge--${emailStatus?.configured ? 'success' : 'pending'}`}>
              {emailStatus ? emailStatus.status : 'Checking…'}
            </span>
          </p>
          <p className="admin-table__sub">
            Admin alerts go to <b>ADMIN_EMAIL</b> in the backend .env file (or SMTP_USER if it is empty).
          </p>
          <form className="admin-inline-edit" onSubmit={runTest}>
            <input
              type="email"
              placeholder="Send test to (empty = admin email)"
              value={testTo}
              onChange={(e) => setTestTo(e.target.value)}
            />
            <button type="submit">Send test email</button>
          </form>
          {testResult && <p>{testResult}</p>}
        </div>
      )}
    </div>
  )
}
