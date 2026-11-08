import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { getMe, updateMe, changePassword } from '../../services/storeApi.js'
import './AccountPages.css'

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', city: user?.city || '' })
  const [status, setStatus] = useState({ type: '', text: '' })
  const [saving, setSaving] = useState(false)

  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })
  const [pwStatus, setPwStatus] = useState({ type: '', text: '' })
  const [pwSaving, setPwSaving] = useState(false)

  // Taaza profile backend se
  useEffect(() => {
    getMe()
      .then((me) => setForm({ name: me.name || '', phone: me.phone || '', city: me.city || '' }))
      .catch(() => {})
  }, [])

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setStatus({ type: '', text: '' })
    try {
      const me = await updateMe(form)
      updateUser({ name: me.name, phone: me.phone, city: me.city })
      setStatus({ type: 'ok', text: 'Profile saved ✓' })
    } catch (err) {
      setStatus({ type: 'error', text: err.message })
    } finally {
      setSaving(false)
    }
  }

  async function handlePassword(e) {
    e.preventDefault()
    setPwStatus({ type: '', text: '' })
    if (pw.next.length < 6) return setPwStatus({ type: 'error', text: 'New password must be at least 6 characters.' })
    if (pw.next !== pw.confirm) return setPwStatus({ type: 'error', text: 'New passwords do not match.' })
    setPwSaving(true)
    try {
      await changePassword(pw.current, pw.next)
      setPw({ current: '', next: '', confirm: '' })
      setPwStatus({ type: 'ok', text: 'Password changed ✓' })
    } catch (err) {
      setPwStatus({ type: 'error', text: err.message })
    } finally {
      setPwSaving(false)
    }
  }

  return (
    <div className="account-card">
      <h2>Profile</h2>
      <form className="account-form" onSubmit={handleSave}>
        <div className="account-form__field">
          <label>Full name</label>
          <input value={form.name} onChange={update('name')} required />
        </div>
        <div className="account-form__field">
          <label>Email</label>
          <input value={user?.email || ''} type="email" disabled />
        </div>
        <div className="account-form__field">
          <label>Phone number</label>
          <input value={form.phone} onChange={update('phone')} placeholder="03001234567" inputMode="tel" />
        </div>
        <div className="account-form__field">
          <label>City</label>
          <input value={form.city} onChange={update('city')} placeholder="Lahore" />
        </div>
        {status.text && <p className={`account-msg account-msg--${status.type}`}>{status.text}</p>}
        <button type="submit" className="account-form__save" disabled={saving}>
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </form>

      <h2 style={{ marginTop: '2.5rem' }}>Change password</h2>
      <form className="account-form" onSubmit={handlePassword}>
        <div className="account-form__field">
          <label>Current password</label>
          <input type="password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} autoComplete="current-password" required />
        </div>
        <div className="account-form__field">
          <label>New password</label>
          <input type="password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} autoComplete="new-password" required />
        </div>
        <div className="account-form__field">
          <label>Confirm new password</label>
          <input type="password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} autoComplete="new-password" required />
        </div>
        {pwStatus.text && <p className={`account-msg account-msg--${pwStatus.type}`}>{pwStatus.text}</p>}
        <button type="submit" className="account-form__save" disabled={pwSaving}>
          {pwSaving ? 'Updating…' : 'Update Password'}
        </button>
      </form>
    </div>
  )
}
