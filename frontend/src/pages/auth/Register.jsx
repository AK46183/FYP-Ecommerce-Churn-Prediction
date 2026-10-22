import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import './AuthPage.css'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (
      !name.trim() ||
      !email.trim() ||
      !password ||
      !confirm
    ) {
      setError('Please complete every field.')
      return
    }

    if (password.length < 6) {
      setError('Password must have at least 6 characters.')
      return
    }

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    // Frontend demo — no actual account is created.
    setChecking(true)

    setTimeout(() => {
      login({
        name: name.trim(),
        email: email.trim(),
        role: 'customer',
      })

      try {
        sessionStorage.setItem('minaysh_show_welcome', '1')
      } catch {
        // storage unavailable
      }

      navigate('/', { replace: true })
    }, 1100)
  }

  return (
    <main className="min-auth">

      <nav className="min-auth__nav">

        <Link to="/" className="min-auth__brand">
          MINAYSH
          <span className="min-auth__brand-star">✦</span>
        </Link>

        <div className="min-auth__nav-links">

          <Link to="/">
            Home
          </Link>

          <Link to="/login">
            Sign In
          </Link>

          <Link
            to="/register"
            className="is-current"
          >
            Sign Up
          </Link>

        </div>

      </nav>

      <div className="min-auth__center">

        <motion.section
          className="min-auth__form-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >

          <p className="min-auth__eyebrow">
            JOIN THE MINAYSH BEAUTY CLUB
          </p>

          <h1>Sign Up</h1>

          <p className="min-auth__intro">
            A little more beauty, made just for you.
          </p>

          <form
            className="min-auth__form"
            onSubmit={handleSubmit}
          >

            <label htmlFor="register-name">
              Full name
            </label>

            <input
              id="register-name"
              type="text"
              placeholder="Your name"
              autoComplete="name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              required
            />

            <label htmlFor="register-email">
              Email address
            </label>

            <input
              id="register-email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

            <label htmlFor="register-password">
              Password
            </label>

            <div className="min-auth__password">

              <input
                id="register-password"
                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }
                placeholder="At least 6 characters"
                autoComplete="new-password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

              <button
                type="button"
                aria-label={
                  showPassword
                    ? 'Hide password'
                    : 'Show password'
                }
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword
                  ? <EyeOff size={18} />
                  : <Eye size={18} />
                }
              </button>

            </div>

            <label htmlFor="register-confirm">
              Confirm password
            </label>

            <input
              id="register-confirm"
              type={
                showPassword
                  ? 'text'
                  : 'password'
              }
              placeholder="Repeat your password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) =>
                setConfirm(e.target.value)
              }
              required
            />

            {error && (
              <p
                className="min-auth__error"
                role="alert"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              className={`min-auth__submit ${checking ? 'is-checking' : ''}`}
              disabled={checking}
              aria-busy={checking}
            >
              {checking ? (
                <>
                  <span className="min-auth__spinner" aria-hidden="true" />
                  Creating your profile…
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={18} />
                </>
              )}
            </button>
            <Link to="/login" className="min-auth__alt">Sign In</Link>

          </form>

          <p className="min-auth__switch">
            Already a member?{' '}

            <Link to="/login">
              Sign In
            </Link>
          </p>

          <p className="min-auth__demo">
            Frontend preview only — actual account
            creation will require the backend.
          </p>

        </motion.section>

      </div>

      <span className="min-auth__side-label">
        BEAUTY, MADE PERSONAL
      </span>

      <div className="min-auth__bottom">
        A BEAUTY STORY BY MINAYSH
        <span>✦</span>
        EST. 2026
      </div>

    </main>
  )
}