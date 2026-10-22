import { useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Eye,
  EyeOff,
  ArrowRight,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import './AuthPage.css'

function GoogleIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 48 48"
      aria-hidden="true"
    >
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 5.38 6.51 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6C44.4 38.03 46.98 31.88 46.98 24.55z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59A14.41 14.41 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.2A23.9 23.9 0 0 0 0 24c0 3.87.93 7.51 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  )
}

export default function Login() {
  const [role, setRole] = useState('customer')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isMuted, setIsMuted] = useState(true)
  const [checking, setChecking] = useState(false)

  const videoRef = useRef(null)

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Please enter your email and password.')
      return
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.')
      return
    }

    // "Checking..." pause, then sign in (frontend demo - backend will verify later)
    setChecking(true)

    setTimeout(() => {
      login({
        email: email.trim(),
        role,
      })

      try {
        // the welcome card (WelcomeModal.jsx) plays when this flag is set
        sessionStorage.setItem('minaysh_show_welcome', '1')
      } catch {
        // storage unavailable
      }

      if (role === 'admin') {
        try {
          sessionStorage.removeItem('minaysh_show_welcome')
        } catch {
          // storage unavailable
        }
        navigate('/admin', { replace: true })
        return
      }

      const redirectTo = location.state?.from || '/'
      navigate(redirectTo, { replace: true })
    }, 1100)
  }

  async function toggleSound() {
    const video = videoRef.current

    if (!video) return

    const nextMuted = !video.muted

    video.muted = nextMuted
    video.volume = 0.65

    if (!nextMuted) {
      try {
        await video.play()
      } catch {
        video.muted = true
        setIsMuted(true)
        return
      }
    }

    setIsMuted(nextMuted)
  }

  function handleGoogleSignIn() {
    setError(
      'Google Sign-In will be connected when we integrate the authentication backend.'
    )
  }

  return (
    <main className="min-auth">

      {/* SAME EXISTING TOP NAVIGATION */}

      <nav className="min-auth__nav">

        <Link to="/" className="min-auth__brand">
          MINAYSH
          <span className="min-auth__brand-star">✦</span>
        </Link>

        <div className="min-auth__nav-links">

          <Link to="/">
            Home
          </Link>

          <Link
            to="/login"
            className="is-current"
          >
            Sign In
          </Link>

          <Link to="/register">
            Sign Up
          </Link>

        </div>

      </nav>

      {/* NEW TWO-COLUMN LAYOUT */}

      <div className="min-auth__center min-auth__center--split">

        {/* LEFT SIDE — YOUR VIDEO */}

        <motion.div
          className="min-auth__video-side"
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.6,
            ease: 'easeOut',
          }}
        >

          <div className="min-auth__video-frame">

            <video
              ref={videoRef}
              className="min-auth__video"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            >
              <source
                src="/videos/minaysh-login-video.mp4"
                type="video/mp4"
              />
              Your browser does not support video.
            </video>

            {/* MUSIC BUTTON */}

            <button
              type="button"
              className="min-auth__sound"
              onClick={toggleSound}
              aria-label={
                isMuted
                  ? 'Turn video sound on'
                  : 'Turn video sound off'
              }
            >

              {isMuted ? (
                <VolumeX size={17} />
              ) : (
                <Volume2 size={17} />
              )}

              <span>
                {isMuted ? 'Sound On' : 'Sound Off'}
              </span>

            </button>

          </div>

        </motion.div>

        {/* RIGHT SIDE — SAME EXISTING SIGN IN */}

        <motion.section
          className="min-auth__form-wrap"
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.5,
            ease: 'easeOut',
          }}
        >

          <p className="min-auth__eyebrow">
            THE MINAYSH BEAUTY CLUB
          </p>

          <h1>Sign In</h1>

          <p className="min-auth__intro">
            Welcome back. Your beauty story continues here.
          </p>

          {/* CUSTOMER / ADMIN */}

          <div className="min-auth__roles">

            <button
              type="button"
              className={
                role === 'customer'
                  ? 'is-selected'
                  : ''
              }
              onClick={() => {
                setRole('customer')
                setError('')
              }}
            >
              Customer
            </button>

            <button
              type="button"
              className={
                role === 'admin'
                  ? 'is-selected'
                  : ''
              }
              onClick={() => {
                setRole('admin')
                setError('')
              }}
            >
              Admin
            </button>

          </div>

          <form
            className="min-auth__form"
            onSubmit={handleSubmit}
          >

            {/* EMAIL */}

            <label htmlFor="login-email">
              Email address
            </label>

            <input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />

            {/* PASSWORD */}

            <label htmlFor="login-password">
              Password
            </label>

            <div className="min-auth__password">

              <input
                id="login-password"
                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
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
                  setShowPassword((current) => !current)
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>

            {/* SAME FORGOT PASSWORD */}

            {role === 'customer' && (
              <Link
                to="/forgot-password"
                className="min-auth__forgot"
              >
                Forgot password?
              </Link>
            )}

            {error && (
              <p
                className="min-auth__error"
                role="alert"
              >
                {error}
              </p>
            )}

            {/* SAME SIGN IN BUTTON */}

            <button
              type="submit"
              className={`min-auth__submit ${checking ? 'is-checking' : ''}`}
              disabled={checking}
              aria-busy={checking}
            >
              {checking ? (
                <>
                  <span className="min-auth__spinner" aria-hidden="true" />
                  Checking…
                </>
              ) : (
                <>
                  {role === 'admin' ? 'Admin Sign In' : 'Sign In'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
            <Link to="/register" className="min-auth__alt">Sign Up</Link>

            {/* GOOGLE SIGN IN — CUSTOMER */}

            {role === 'customer' && (
              <>

                <div className="min-auth__divider">
                  <span>OR</span>
                </div>

                <button
                  type="button"
                  className="min-auth__google"
                  onClick={handleGoogleSignIn}
                >

                  <GoogleIcon />

                  <span>
                    Continue with Google
                  </span>

                </button>

              </>
            )}

          </form>

          <p className="min-auth__switch">
            New to MINAYSH?{' '}

            <Link to="/register">
              Create an account
            </Link>
          </p>

          <p className="min-auth__demo">
            Frontend preview only — real authentication
            will be added with the backend.
          </p>

        </motion.section>

      </div>

      {/* SAME DECORATIVE TEXT */}

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