import { useState } from 'react'
import { Link } from 'react-router-dom'
import { requestPasswordReset } from '../../services/storeApi.js'
import './AuthPage.css'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) return
    setSending(true)
    setError('')
    try {
      await requestPasswordReset(email.trim())
      setSent(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-page__form-side">
        <img src="/images/minaysh-logo.png" alt="MINAYSH" className="auth-page__logo" />
        <h1 className="auth-page__headline">Reset your password</h1>
        <p className="auth-page__subtitle">
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>

        {sent ? (
          <p className="auth-page__footer-note">
            If an account exists for {email}, a reset link is on its way. Check your inbox (and spam) — the link works for 30 minutes.
          </p>
        ) : (
          <form className="auth-page__form" onSubmit={handleSubmit}>
            <div className="auth-page__field">
              <label htmlFor="fp-email">Email</label>
              <input
                id="fp-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {error && <p className="auth-page__error" role="alert">{error}</p>}
            <button type="submit" className="auth-page__submit" disabled={sending}>
              {sending ? 'Sending…' : 'Send Reset Link'}
            </button>
            <p className="auth-page__footer-note">
              <Link to="/login" className="auth-page__link">
                Back to Sign In
              </Link>
            </p>
          </form>
        )}
      </div>

      <div className="auth-page__visual-side">
        <div className="auth-page__visual-box">
          <video autoPlay muted loop playsInline preload="auto" poster="/videos/hero-beauty-poster.jpg">
            <source src="/videos/hero-beauty.mp4" type="video/mp4" />
          </video>
          <div className="auth-page__visual-overlay">
            <p className="auth-page__visual-caption">Beauty, made personal.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
