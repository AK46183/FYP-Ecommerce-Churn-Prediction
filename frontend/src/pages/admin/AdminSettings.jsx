import { useEffect, useState } from 'react'
import { api } from '../../services/api.js'
import { getEmailStatus, getCategorySummary } from '../../services/adminApi.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { SHIPPING_STANDARD, SHIPPING_EXPRESS } from '../../config/store.js'
import './AdminPages.css'
import './AdminReports.css'

// Settings: store ki maujooda settings aur system ki haalat (sirf dekhne ke liye)
const pkr = (n) => `PKR ${Number(n).toLocaleString('en-PK')}`

function Status({ ok, yes, no }) {
  if (ok === null) return <span><i className="admin-settings__dot" />Checking…</span>
  return <span><i className={`admin-settings__dot ${ok ? 'is-ok' : 'is-off'}`} />{ok ? yes : no}</span>
}

export default function AdminSettings() {
  const { user } = useAuth()
  const [email, setEmail] = useState(null)
  const [ai, setAi] = useState(null)
  const [catalog, setCatalog] = useState(null)

  useEffect(() => {
    getEmailStatus().then(setEmail).catch(() => setEmail({ configured: false, status: 'Could not check' }))
    api('/chatbot/admin/status').then(setAi).catch(() => setAi({ ai: { running: false, llm: false }, chatStorage: false }))
    getCategorySummary()
      .then((rows) => setCatalog({ products: rows.reduce((s, r) => s + r.products, 0), categories: rows.length }))
      .catch(() => setCatalog({ products: '-', categories: '-' }))
  }, [])

  return (
    <div>
      <div className="admin-page__header">
        <div>
          <h1>Settings</h1>
          <p>Store configuration and system status</p>
        </div>
      </div>

      <div className="admin-settings">
        <section>
          <h2>Store</h2>
          <dl>
            <dt>Store name</dt><dd>MINAYSH</dd>
            <dt>Currency</dt><dd>PKR (Pakistani Rupee)</dd>
            <dt>Standard delivery</dt><dd>{pkr(SHIPPING_STANDARD)} · 3-5 business days</dd>
            <dt>Express delivery</dt><dd>{pkr(SHIPPING_EXPRESS)} · 1-2 business days</dd>
            <dt>Payment methods</dt><dd>Cash on Delivery, Credit / Debit Card</dd>
            <dt>Catalog</dt><dd>{catalog ? `${catalog.products} products in ${catalog.categories} categories` : 'Checking…'}</dd>
          </dl>
        </section>

        <section>
          <h2>Admin account</h2>
          <dl>
            <dt>Name</dt><dd>{user?.name || '-'}</dd>
            <dt>Email</dt><dd>{user?.email || '-'}</dd>
            <dt>Role</dt><dd style={{ textTransform: 'capitalize' }}>{user?.role || '-'}</dd>
          </dl>
        </section>

        <section>
          <h2>System status</h2>
          <dl>
            <dt>Store database</dt><dd><Status ok={catalog ? catalog.products !== '-' : null} yes="Connected" no="Not reachable" /></dd>
            <dt>Skincare Assistant service</dt><dd><Status ok={ai ? ai.ai.running : null} yes="Running" no="Not running" /></dd>
            <dt>AI model key</dt><dd><Status ok={ai ? ai.ai.llm : null} yes="Configured" no="Missing" /></dd>
            <dt>Chat history storage</dt><dd><Status ok={ai ? ai.chatStorage : null} yes="Connected" no="Not connected" /></dd>
            <dt>Email sending</dt><dd><Status ok={email ? email.configured : null} yes="Configured" no="Not configured" /></dd>
          </dl>
          {email?.status && <p>Email: {email.status}</p>}
        </section>

        <section>
          <h2>Privacy</h2>
          <dl>
            <dt>Chat messages</dt><dd>Saved</dd>
            <dt>Face-scan photos</dt><dd>Never saved</dd>
            <dt>Scan results</dt><dd>Saved with the chat</dd>
          </dl>
          <p>Delivery charges and payment methods are set in the store code (config/store.js); this page shows the current values.</p>
        </section>
      </div>
    </div>
  )
}
