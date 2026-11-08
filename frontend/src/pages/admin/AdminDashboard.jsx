import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Bell,
  CalendarDays,
  ShoppingBag,
  Users,
  TrendingUp,
  ArrowUpRight,
  Wallet,
  Activity,
  Gauge as GaugeIcon,
  PieChart,
  Star,
  CalendarClock,
  Megaphone,
} from 'lucide-react'
import { getDashboard } from '../../services/adminApi.js'
import { useAuth } from '../../context/AuthContext.jsx'
import './AdminDashboard.css'

const ranges = [
  { key: '7d', label: '7 Days' },
  { key: '30d', label: '30 Days' },
  { key: '90d', label: '90 Days' },
]

const pkr = (n) => `PKR ${n.toLocaleString('en-PK')}`

/* ---------- Chhote SVG charts ---------- */

function DotBars({ bars }) {
  const max = Math.max(...bars.map((b) => b.value)) || 1 // sab 0 hon to bhi chart na toote
  return (
    <div className="db-dotbars">
      {bars.map((b) => (
        <div key={b.label} className="db-dotbars__col">
          <div className="db-dotbars__track">
            <span className="db-dotbars__bar" style={{ height: `${(b.value / max) * 100}%` }} />
          </div>
          <small>{b.label.charAt(0)}</small>
        </div>
      ))}
    </div>
  )
}

function WaveLine({ points }) {
  const w = 300
  const h = 100
  const min = Math.min(...points) - 0.5
  const max = Math.max(...points) + 0.5
  const xy = points.map((p, i) => [(i / (points.length - 1)) * w, h - ((p - min) / (max - min)) * h])
  let d = `M ${xy[0][0]} ${xy[0][1]}`
  for (let i = 1; i < xy.length; i++) {
    const [x0, y0] = xy[i - 1]
    const [x1, y1] = xy[i]
    const cx = (x0 + x1) / 2
    d += ` C ${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`
  }
  const last = xy[xy.length - 1]
  return (
    <svg className="db-wave" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="dbWaveFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#f4a46a" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#f4a46a" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L ${w} ${h} L 0 ${h} Z`} fill="url(#dbWaveFill)" />
      <path d={d} fill="none" stroke="#f4a46a" strokeWidth="2.2" vectorEffect="non-scaling-stroke" />
      <circle cx={last[0]} cy={last[1]} r="4" fill="#fff" stroke="#e0793a" strokeWidth="2" />
    </svg>
  )
}

function Gauge({ value, target }) {
  const pct = Math.min(value / target, 1)
  const len = Math.PI * 70
  return (
    <svg className="db-gauge" viewBox="0 0 180 100">
      <defs>
        <linearGradient id="dbGauge" x1="0" x2="1">
          <stop offset="0%" stopColor="#f4a46a" />
          <stop offset="100%" stopColor="#e0793a" />
        </linearGradient>
      </defs>
      <path d="M 20 90 A 70 70 0 0 1 160 90" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="10" strokeLinecap="round" />
      <path
        d="M 20 90 A 70 70 0 0 1 160 90"
        fill="none"
        stroke="url(#dbGauge)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={`${len * pct} ${len}`}
      />
    </svg>
  )
}

/* ---------- Ring ke cards (graphs aur readings) ---------- */
function buildWidgets(data) {
  return [
    {
      key: 'revenue',
      icon: Wallet,
      short: `PKR ${(data.revenue.total / 1000).toFixed(1)}K`,
      tone: 'light',
      label: 'Revenue',
      body: (
        <>
          <strong className="db-big">{pkr(data.revenue.total)}</strong>
          <span className="db-pill db-pill--up">
            <TrendingUp size={12} /> +{data.revenue.change}%
          </span>
          <DotBars bars={data.revenue.bars} />
        </>
      ),
    },
    {
      key: 'churn',
      icon: Activity,
      short: `${data.churn.rate}%`,
      tone: 'dark',
      label: 'Churn Rate',
      link: '/admin/churn',
      body: (
        <>
          <strong className="db-big">
            {data.churn.rate}
            <small>%</small>
          </strong>
          <small className="db-muted">{data.churn.highRisk} customers at high risk</small>
          <WaveLine points={data.churn.trend} />
        </>
      ),
    },
    {
      key: 'orders',
      icon: ShoppingBag,
      short: `${data.orders.total}`,
      tone: 'light',
      label: 'Orders',
      body: (
        <>
          <ShoppingBag size={18} className="db-muted" />
          <strong className="db-big">{data.orders.total}</strong>
          <div className="db-ring-chart" style={{ '--p': data.orders.fulfilled }}>
            <span>{data.orders.fulfilled}%</span>
          </div>
          <small className="db-muted">fulfilled on time</small>
        </>
      ),
    },
    {
      key: 'aov',
      icon: GaugeIcon,
      short: `PKR ${data.avgOrderValue.value.toLocaleString()}`,
      tone: 'dark',
      label: 'Avg. Order Value',
      body: (
        <>
          <Gauge value={data.avgOrderValue.value} target={data.avgOrderValue.target} />
          <strong className="db-mid db-center">{pkr(data.avgOrderValue.value)}</strong>
          <small className="db-muted db-center">Target {pkr(data.avgOrderValue.target)}</small>
        </>
      ),
    },
    {
      key: 'customers',
      icon: Users,
      short: data.customers.total.toLocaleString(),
      tone: 'light',
      label: 'Customers',
      body: (
        <>
          <Users size={18} className="db-muted" />
          <strong className="db-big">{data.customers.total.toLocaleString()}</strong>
          <small className="db-muted">+{data.customers.newThisPeriod} new this period</small>
          <div className="db-spark">
            {[30, 45, 38, 60, 52, 70, 82].map((h, i) => (
              <span key={i} style={{ height: `${h}%` }} />
            ))}
          </div>
        </>
      ),
    },
    {
      key: 'risk',
      icon: PieChart,
      short: `${data.churn.highRisk} high`,
      tone: 'accent',
      label: 'Risk Breakdown',
      link: '/admin/churn',
      body: (
        <>
          <div className="db-risk-bars">
            {[
              ['high', 'High', data.churn.highRisk],
              ['mid', 'Medium', data.churn.mediumRisk],
              ['low', 'Low', data.churn.lowRisk],
            ].map(([k, name, v]) => (
              <div key={k} className="db-risk-col">
                <span className={`db-risk-fill db-seg--${k}`} style={{ height: `${Math.min(100, (v / (data.churn.lowRisk || 1)) * 100)}%` }} />
                <b>{v.toLocaleString()}</b>
                <small>{name}</small>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      key: 'top',
      icon: Star,
      short: data.topProducts[0].name.split(' ').slice(0, 2).join(' '),
      tone: 'light',
      label: 'Top Products',
      link: '/admin/products',
      body: (
        <ul className="db-list">
          {data.topProducts.map((p, i) => (
            <li key={p.name}>
              <span className="db-list__rank">{i + 1}</span>
              <span className="db-list__name">{p.name}</span>
              <b>{p.sold}</b>
            </li>
          ))}
        </ul>
      ),
    },
    {
      key: 'sale',
      icon: CalendarClock,
      short: '8 days',
      tone: 'dark',
      label: 'Next Sale',
      link: '/admin/sale',
      body: (
        <>
          <strong className="db-mid">11.11 Mega Sale</strong>
          <div className="db-countdown">
            <div><b>08</b><small>Days</small></div>
            <div><b>14</b><small>Hrs</small></div>
            <div><b>32</b><small>Min</small></div>
          </div>
          <small className="db-muted">42 products on sale</small>
        </>
      ),
    },
  ]
}

/* ---------- 3D ghoomti ring ---------- */
function WidgetRing({ widgets, focusReq, onFront }) {
  const stageRef = useRef(null)
  const ringRef = useRef(null)
  const [front, setFront] = useState(0)
  const count = widgets.length
  const step = 360 / count

  // angle ki values (re-render ke baghair animation)
  const motion = useRef({ cur: 0, target: 0, paused: false, drag: null, moved: false })
  const onFrontRef = useRef(onFront)
  onFrontRef.current = onFront

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame
    let lastFront = -1
    const loop = () => {
      const m = motion.current
      if (!m.paused && !m.drag && !reduce) m.target -= 0.06 // khud dheere ghoomna
      m.cur += (m.target - m.cur) * 0.08
      if (ringRef.current) ringRef.current.style.setProperty('--angle', `${m.cur}deg`)
      const idx = ((Math.round(-m.cur / step) % count) + count) % count
      if (idx !== lastFront) {
        lastFront = idx
        setFront(idx)
        onFrontRef.current?.(idx)
      }
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [count, step])

  // mouse scroll se ghumao
  useEffect(() => {
    const el = stageRef.current
    const onWheel = (e) => {
      e.preventDefault()
      motion.current.target -= (e.deltaY + e.deltaX) * 0.12
    }
    el?.addEventListener('wheel', onWheel, { passive: false })
    return () => el?.removeEventListener('wheel', onWheel)
  }, [])

  // drag se ghumao
  const onPointerDown = (e) => {
    motion.current.drag = { x: e.clientX, start: motion.current.target }
    motion.current.moved = false
  }
  const onPointerMove = (e) => {
    const d = motion.current.drag
    if (!d) return
    const dx = e.clientX - d.x
    if (Math.abs(dx) > 4) motion.current.moved = true
    motion.current.target = d.start + dx * 0.35
  }
  const endDrag = () => (motion.current.drag = null)

  // card ko ghuma kar saamne lao
  const rotateTo = (i) => {
    const m = motion.current
    const goal = -i * step
    const turns = Math.round((m.target - goal) / 360)
    m.target = goal + turns * 360
  }
  const bringToFront = (i) => {
    if (motion.current.moved) return
    rotateTo(i)
  }

  // neeche wale chhote card pe click hua: wahi card upar saamne lao
  useEffect(() => {
    if (focusReq) {
      rotateTo(focusReq.index)
      motion.current.paused = true
      const t = setTimeout(() => (motion.current.paused = false), 2500)
      return () => clearTimeout(t)
    }
  }, [focusReq]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="db-stage"
      ref={stageRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={() => {
        endDrag()
        motion.current.paused = false
      }}
      onPointerEnter={() => (motion.current.paused = true)}
    >
      <div className="db-ring" ref={ringRef} style={{ '--count': count }}>
        {widgets.map((w, i) => (
          <section
            key={w.key}
            className={`db-card db-card--${w.tone} ${i === front ? 'is-front' : ''}`}
            style={{ '--i': i }}
            onClick={() => bringToFront(i)}
          >
            <div className="db-card__top">
              <span className="db-label">{w.label}</span>
              {w.link && (
                <Link to={w.link} className="db-arrow" aria-label={`Open ${w.label}`} onClick={(e) => e.stopPropagation()}>
                  <ArrowUpRight size={14} />
                </Link>
              )}
            </div>
            <div className="db-card__body">{w.body}</div>
          </section>
        ))}
      </div>
      <p className="db-hint">Scroll, drag or click a card to rotate</p>
    </div>
  )
}

/* ---------- Page ---------- */
export default function AdminDashboard() {
  const { user } = useAuth()
  const [range, setRange] = useState('30d')
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [front, setFront] = useState(0) // ring mein abhi saamne wala card
  const [focusReq, setFocusReq] = useState(null) // neeche se kis card ko upar lana hai

  useEffect(() => {
    let alive = true
    setError('')
    getDashboard(range)
      .then((d) => alive && setData(d))
      .catch((e) => alive && setError(e.message))
    return () => {
      alive = false
    }
  }, [range])

  const widgets = data ? buildWidgets(data) : []

  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  const initial = (user?.name || 'A').charAt(0).toUpperCase()

  return (
    <div className="db">
      {/* Top bar */}
      <header className="db-topbar">
        <div className="db-topbar__title">
          <h1>Dashboard</h1>
          <p>Store overview</p>
        </div>

        <div className="db-tabs" role="tablist">
          {ranges.map((r) => (
            <button
              key={r.key}
              role="tab"
              aria-selected={range === r.key}
              className={range === r.key ? 'is-active' : ''}
              onClick={() => setRange(r.key)}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div className="db-topbar__tools">
          <span className="db-chip">
            <CalendarDays size={14} /> {today}
          </span>
          <button className="db-icon-btn" aria-label="Notifications">
            <Bell size={16} />
          </button>
          <span className="db-avatar">{initial}</span>
        </div>
      </header>

      {error && <div className="db-error">{error}</div>}

      {/* Beech mein: graphs ki 3D ring */}
      {data ? (
        <>
          <WidgetRing widgets={widgets} focusReq={focusReq} onFront={setFront} />

          {/* Neeche chhote cards: click karo to upar ring mein saamne aata hai */}
          <div className="db-dock" role="tablist" aria-label="Show widget">
            {widgets.map((w, i) => {
              const Icon = w.icon
              return (
                <button
                  key={w.key}
                  type="button"
                  role="tab"
                  aria-selected={front === i}
                  className={`db-dock__item db-dock__item--${w.tone} ${front === i ? 'is-active' : ''}`}
                  style={{ '--d': i }}
                  onClick={() => setFocusReq({ index: i, at: Date.now() })}
                >
                  <span className="db-dock__icon">
                    <Icon size={16} strokeWidth={1.8} />
                  </span>
                  <span className="db-dock__text">
                    <small>{w.label}</small>
                    <b>{w.short}</b>
                  </span>
                </button>
              )
            })}
          </div>
        </>
      ) : (
        <div className="db-loading">Loading…</div>
      )}

      {/* Recent orders */}
      {data && (
        <section className="db-orders">
          <div className="db-orders__top">
            <span className="db-label">Recent Orders</span>
            <Link to="/admin/orders" className="db-link">View all</Link>
          </div>
          <div className="db-table-wrap">
            <table className="db-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{o.customer}</td>
                    <td>{o.items}</td>
                    <td>{pkr(o.total)}</td>
                    <td>
                      <span className={`db-status db-status--${o.status.toLowerCase()}`}>{o.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Aakhir mein: aur kahan ja sakte hain */}
      {data && (
        <section className="db-explore">
          <span className="db-label">Explore more</span>
          <div className="db-explore__row">
            {[
              { to: '/admin/marketing', title: 'Marketing Strategy', sub: '3 campaigns live', icon: Megaphone },
              { to: '/admin/churn', title: 'Churn Monitoring', sub: `${data.churn.highRisk} at high risk`, icon: Activity },
              { to: '/admin/sale', title: 'Upcoming Sale', sub: '11.11 in 8 days', icon: CalendarClock },
            ].map((l, i) => {
              const Icon = l.icon
              return (
                <Link key={l.to} to={l.to} className="db-explore__card" style={{ '--d': i }}>
                  <span className="db-explore__icon">
                    <Icon size={18} strokeWidth={1.8} />
                  </span>
                  <span className="db-explore__text">
                    <b>{l.title}</b>
                    <small>{l.sub}</small>
                  </span>
                  <ArrowUpRight size={16} className="db-explore__go" />
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}