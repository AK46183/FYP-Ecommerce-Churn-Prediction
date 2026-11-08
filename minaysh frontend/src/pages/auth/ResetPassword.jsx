import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { resetPassword } from '../../services/storeApi.js'
import './AuthPage.css'

// Email wala link: /reset-password?token=...
export default function ResetPassword() {
  const [params] = useSearchParams()
  const token = params.get('token') || ''
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password.length < 6) return setError('Password must be at least 6 characters.')
    if (password !== confirm) return setError('Passwords do not match.')
    setSaving(true)
    try {
      await resetPassword(token, password)
      setDone(true)
      setTimeout(() => navigate('/login', { replace: true }), 2500)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-page__form-side">
        <img src="/images/minaysh-logo.png" alt="MINAYSH" className="auth-page__logo" />
        <h1 className="auth-page__headline">Choose a new password</h1>

        {!token ? (
          <p className="auth-page__footer-note">
            This reset link is incomplete.{' '}
            <Link to="/forgot-password" className="auth-page__link">Request a new link</Link>
          </p>
        ) : done ? (
          <p className="auth-page__footer-note">
            Your password has been changed. Taking you to sign in…
          </p>
        ) : (
          <form className="auth-page__form" onSubmit={handleSubmit}>
            <div className="auth-page__field">
              <label htmlFor="rp-password">New password</label>
              <input
                id="rp-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>
            <div className="auth-page__field">
              <label htmlFor="rp-confirm">Confirm new password</label>
              <input
                id="rp-confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>
            {error && <p className="auth-page__error" role="alert">{error}</p>}
            <button type="submit" className="auth-page__submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save New Password'}
            </button>
            <p className="auth-page__footer-note">
              <Link to="/forgot-password" className="auth-page__link">Need a new link?</Link>
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
