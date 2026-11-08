import { useState } from 'react'
import ContentPage from './ContentPage.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { sendContact } from '../../services/storeApi.js'

export default function ContactUs() {
  const { user } = useAuth()
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    topic: 'general',
    orderRef: '',
    message: '',
  })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setSending(true)
    setError('')
    try {
      await sendContact(form)
      setSent(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <ContentPage title="Contact Us" subtitle="We'd love to hear from you.">
      {sent ? (
        <p>Thank you for reaching out — we&apos;ve emailed you a confirmation and our team will respond within 1-2 business days.</p>
      ) : (
        <form className="content-page__form" onSubmit={handleSubmit}>
          <input type="text" placeholder="Your name" value={form.name} onChange={update('name')} required />
          <input type="email" placeholder="Your email" value={form.email} onChange={update('email')} required />
          <select value={form.topic} onChange={update('topic')} aria-label="Topic">
            <option value="general">General question</option>
            <option value="order">Question about my order</option>
            <option value="product">Product question</option>
            <option value="complaint">Complaint</option>
          </select>
          {(form.topic === 'order' || form.topic === 'complaint') && (
            <input type="text" placeholder="Order number (e.g. MN-12) — optional" value={form.orderRef} onChange={update('orderRef')} />
          )}
          <textarea placeholder="How can we help?" value={form.message} onChange={update('message')} required minLength={5} />
          {error && <p className="content-page__error" role="alert">{error}</p>}
          <button type="submit" disabled={sending}>{sending ? 'Sending…' : 'Send Message'}</button>
        </form>
      )}
    </ContentPage>
  )
}
