import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Activity,
  Megaphone,
  CalendarClock,
  ArrowUpRight,
  LogOut,
  Store,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import './AdminHome.css'
import './AdminTheme.css'

// 4 workspaces. side: 'left' | 'center' | 'right'. Preview numbers abhi sample hain.
const workspaces = [
  {
    key: 'dashboard',
    side: 'center',
    title: 'Dashboard',
    description: 'Sales, orders and store performance at a glance.',
    to: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    key: 'churn',
    side: 'right',
    title: 'Churn Monitoring',
    description: 'See which customers are at risk of leaving, and why.',
    to: '/admin/churn',
    icon: Activity,
  },
  {
    key: 'marketing',
    side: 'left',
    title: 'Marketing Strategy',
    description: 'Win-back campaigns and offers for at-risk customers.',
    to: '/admin/marketing',
    icon: Megaphone,
  },
  {
    key: 'sale',
    side: 'right',
    title: 'Upcoming Sale',
    description: 'Plan, schedule and track your next big sale.',
    to: '/admin/sale',
    icon: CalendarClock,
  },
]

// Card ke neeche wala chhota preview box
function CardPreview({ type }) {
  if (type === 'dashboard') {
    const bars = [38, 52, 44, 70, 62, 88]
    return (
      <div className="ah-preview">
        <span className="ah-preview__label">Revenue this month</span>
        <strong className="ah-preview__value">PKR 842,500</strong>
        <div className="ah-bars">
          {bars.map((h, i) => (
            <span key={i} style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    )
  }
  if (type === 'churn') {
    return (
      <div className="ah-preview">
        <span className="ah-preview__label">Customers at risk</span>
        <div className="ah-rows">
          <div className="ah-row"><span className="ah-chip ah-chip--high">High</span><b>128</b></div>
          <div className="ah-row"><span className="ah-chip ah-chip--mid">Medium</span><b>346</b></div>
          <div className="ah-row"><span className="ah-chip ah-chip--low">Low</span><b>1,027</b></div>
        </div>
      </div>
    )
  }
  if (type === 'marketing') {
    return (
      <div className="ah-preview">
        <span className="ah-preview__label">Campaigns live</span>
        <strong className="ah-preview__value">3 active</strong>
        <div className="ah-tags"><span>Email</span><span>SMS</span><span>Push</span></div>
      </div>
    )
  }
  return (
    <div className="ah-preview">
      <span className="ah-preview__label">11.11 Sale starts in</span>
      <div className="ah-countdown">
        <div><b>08</b><small>Days</small></div>
        <div><b>14</b><small>Hrs</small></div>
        <div><b>32</b><small>Min</small></div>
      </div>
    </div>
  )
}

export default function AdminHome() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const rootRef = useRef(null)
  const firstName = user?.name ? user.name.split(' ')[0] : 'Admin'

  // Mouse ke saath cards ka halka hilna (smooth floating)
  useEffect(() => {
    const root = rootRef.current
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    const target = { x: 0, y: 0 }
    const cur = { x: 0, y: 0 }
    const tick = () => {
      cur.x += (target.x - cur.x) * 0.08
      cur.y += (target.y - cur.y) * 0.08
      root.style.setProperty('--mx', cur.x.toFixed(3))
      root.style.setProperty('--my', cur.y.toFixed(3))
      const moving = Math.abs(target.x - cur.x) > 0.001 || Math.abs(target.y - cur.y) > 0.001
      frame = moving ? requestAnimationFrame(tick) : 0
    }
    const onMove = (e) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2
      target.y = (e.clientY / window.innerHeight - 0.5) * 2
      if (!frame) frame = requestAnimationFrame(tick)
    }
    window.addEventListener('pointermove', onMove)
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  // Ek card banane ka function
  const renderCard = (ws, n) => {
    const Icon = ws.icon
    const isMain = ws.side === 'center'
    return (
      <Link
        key={ws.key}
        to={ws.to}
        className={`ah-card ${isMain ? 'ah-card--main' : 'ah-card--side'}`}
        style={{ '--n': n }}
        aria-label={`Open ${ws.title}`}
      >
        <div className="ah-card__top">
          <span className="ah-card__icon">
            <Icon size={isMain ? 22 : 18} strokeWidth={1.7} />
          </span>
          <span className="ah-card__go">
            <ArrowUpRight size={16} strokeWidth={1.8} />
          </span>
        </div>
        <h2>{ws.title}</h2>
        <p>{ws.description}</p>
        <CardPreview type={ws.key} />
      </Link>
    )
  }

  const left = workspaces.filter((w) => w.side === 'left')
  const center = workspaces.filter((w) => w.side === 'center')
  const right = workspaces.filter((w) => w.side === 'right')

  return (
    <div className="ah" ref={rootRef}>
      {/* Top bar */}
      <header className="ah-top">
        <Link to="/admin" className="ah-brand">
          <span className="ah-brand__logo">
            <img src="/images/minaysh-logo.png" alt="" />
          </span>
          <span className="ah-brand__text">
            <strong>MINAYSH</strong>
            <small>Admin Console</small>
          </span>
        </Link>

        <div className="ah-top__actions">
          <Link to="/" className="ah-link">
            <Store size={15} strokeWidth={1.6} />
            <span className="ah-link__text">View store</span>
          </Link>
          <button type="button" className="ah-logout" onClick={handleLogout}>
            Logout <LogOut size={14} strokeWidth={1.8} />
          </button>
        </div>
      </header>

      {/* Heading */}
      <section className="ah-intro">
        <span className="ah-eyebrow">Welcome back, {firstName}</span>
        <h1>Choose your workspace</h1>
        <p>Click a card to open it.</p>
      </section>

      {/* 4 floating cards: left | Dashboard (beech, bara) | right */}
      <section className="ah-stage" aria-label="Workspaces">
        <div className="ah-side ah-side--left">{left.map((ws, i) => renderCard(ws, i + 1))}</div>
        <div className="ah-center">{center.map((ws) => renderCard(ws, 0))}</div>
        <div className="ah-side ah-side--right">{right.map((ws, i) => renderCard(ws, i + 1))}</div>
      </section>
    </div>
  )
}