import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  X,
  AlertTriangle,
  ShieldCheck,
  Megaphone,
  Clock,
  ShoppingBag,
  Wallet,
  MapPin,
  Send,
  Siren,
  ArrowRight,
} from 'lucide-react'
import { getChurn } from '../../services/churnApi.js'
import './AdminChurn.css'

const pkr = (n) => `PKR ${Math.round(n).toLocaleString('en-PK')}`

// mahine se season (Marketing page pe sahi season khule)
function seasonFor(month) {
  if (month === 11 || month <= 1) return 'winter'
  if (month <= 3) return 'spring'
  if (month <= 5) return 'summer'
  if (month <= 7) return 'monsoon'
  return 'autumn'
}

/* 6 mahine ka churn trend (line chart) */
function TrendChart({ points }) {
  const w = 520
  const h = 180
  const pad = 26
  const vals = points.map((p) => p.value)
  const min = Math.min(...vals) - 1
  const max = Math.max(...vals) + 1
  const xy = points.map((p, i) => [
    pad + (i / (points.length - 1)) * (w - pad * 2),
    h - pad - ((p.value - min) / (max - min)) * (h - pad * 2),
  ])
  let d = `M ${xy[0][0]} ${xy[0][1]}`
  for (let i = 1; i < xy.length; i++) {
    const [x0, y0] = xy[i - 1]
    const [x1, y1] = xy[i]
    const cx = (x0 + x1) / 2
    d += ` C ${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`
  }
  return (
    <svg className="ch-trend" viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <linearGradient id="chTrendFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#7cc9b8" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#7cc9b8" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L ${xy[xy.length - 1][0]} ${h - pad} L ${xy[0][0]} ${h - pad} Z`} fill="url(#chTrendFill)" />
      <path d={d} fill="none" stroke="#7cc9b8" strokeWidth="2.5" />
      {xy.map(([x, y], i) => (
        <g key={points[i].label}>
          <circle cx={x} cy={y} r={i === xy.length - 1 ? 6 : 4} fill={i === xy.length - 1 ? '#ff8a7a' : '#0b2f2c'} stroke="#7cc9b8" strokeWidth="2" />
          <text x={x} y={y - 12} textAnchor="middle" className="ch-trend__val">{points[i].value}%</text>
          <text x={x} y={h - 6} textAnchor="middle" className="ch-trend__lbl">{points[i].label}</text>
        </g>
      ))}
    </svg>
  )
}

/* Orbit pe ek customer */
function OrbitNode({ c, angle, onOpen }) {
  return (
    <div className={`ch-node ch-node--${c.type}`} style={{ '--a': `${angle}deg` }}>
      <div className="ch-node__inner">
        <button type="button" className="ch-node__pill" onClick={(e) => onOpen(c, e.currentTarget.querySelector('.ch-avatar'))}>
          <span className="ch-avatar">{c.initials}</span>
          <span className="ch-node__text">
            <b>{c.name}</b>
            <small>{c.risk}% risk</small>
          </span>
        </button>
      </div>
    </div>
  )
}

/* Customer card (photo se nikalta hai, wapas usi mein jata hai) */
function CustomerCard({ card, onClose, season }) {
  const { c, from, phase } = card
  const isHigh = c.type === 'high'
  const open = phase === 'open'

  const style = open
    ? { transform: 'translate(-50%, -50%) scale(1)' }
    : { transform: `translate(calc(-50% + ${from.dx}px), calc(-50% + ${from.dy}px)) scale(${from.s})` }

  return (
    <>
      <div className={`ch-backdrop ${open ? 'is-open' : ''}`} onClick={onClose} />
      <article
        className={`ch-card ch-card--${c.type} ${open ? 'is-open' : ''}`}
        style={style}
        role="dialog"
        aria-modal="true"
        aria-label={`${c.name} details`}
      >
        <button type="button" className="ch-card__close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <div className="ch-card__content">
          <header className="ch-card__head">
            <span className="ch-avatar ch-avatar--lg">{c.initials}</span>
            <div>
              <h3>{c.name}</h3>
              <span className="ch-card__city"><MapPin size={12} /> {c.city}</span>
            </div>
            <span className={`ch-badge ch-badge--${c.type}`}>
              {isHigh ? <AlertTriangle size={13} /> : <ShieldCheck size={13} />}
              {isHigh ? 'High risk' : 'Low risk'} · {c.risk}%
            </span>
          </header>

          <div className="ch-card__stats">
            <div><ShoppingBag size={14} /><b>{c.orders}</b><small>Orders</small></div>
            <div><Clock size={14} /><b>{c.lastOrderDays}d</b><small>Last order</small></div>
            <div><Wallet size={14} /><b>{pkr(c.avgOrder)}</b><small>Avg order</small></div>
          </div>

          <section className="ch-card__block">
            <h4>{isHigh ? 'Why she is at high risk' : 'Why she is safe'}</h4>
            <p>{c.reason}</p>
            <small>Lifetime value: {pkr(c.lifetimeValue)}</small>
          </section>

          {isHigh ? (
            <section className="ch-card__block ch-card__block--action">
              <h4><Megaphone size={14} /> How to bring her back</h4>
              <p>{c.action}</p>
              <span className="ch-card__channel"><Send size={12} /> {c.channel}</span>
              <Link to={`/admin/marketing/new?season=${season}`} className="ch-card__btn">
                Make win-back strategy <ArrowRight size={14} />
              </Link>
            </section>
          ) : (
            <section className="ch-card__block ch-card__block--safe">
              <h4><ShieldCheck size={14} /> Safe to leave alone for ~{c.ignoreWeeks} weeks</h4>
              <div className="ch-meter"><span style={{ width: `${Math.min(100, c.ignoreWeeks * 12)}%` }} /></div>
              <p>{c.action}</p>
              <small>Check again if she has not ordered in {c.ignoreWeeks * 7} days.</small>
            </section>
          )}
        </div>
      </article>
    </>
  )
}  

/* Page */
export default function AdminChurn() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [data, setData] = useState(null)
  const [card, setCard] = useState(null) // { c, from, phase }
  const avatarRef = useRef(null)

  useEffect(() => {
    let alive = true
    getChurn(year, month).then((d) => alive && setData(d))
    return () => {
      alive = false
    }
  }, [year, month])

  const shiftMonth = (step) => {
    const d = new Date(year, month + step, 1)
    setYear(d.getFullYear())
    setMonth(d.getMonth())
  }
  const onPickMonth = (e) => {
    const [y, m] = e.target.value.split('-').map(Number)
    if (y && m) {
      setYear(y)
      setMonth(m - 1)
    }
  }

  // photo ki jagah se card kitna door aur kitna chhota hai
  const measure = (el) => {
    const r = el.getBoundingClientRect()
    return {
      dx: r.left + r.width / 2 - window.innerWidth / 2,
      dy: r.top + r.height / 2 - window.innerHeight / 2,
      s: Math.max(r.width / 440, 0.08),
    }
  }

  const openCard = (c, el) => {
    avatarRef.current = el
    setCard({ c, from: measure(el), phase: 'start' })
    requestAnimationFrame(() => requestAnimationFrame(() => setCard((k) => (k ? { ...k, phase: 'open' } : k))))
  }

  const closeCard = useCallback(() => {
    setCard((k) => {
      if (!k) return k
      const from = avatarRef.current ? measure(avatarRef.current) : k.from
      return { ...k, from, phase: 'closing' }
    })
    setTimeout(() => setCard(null), 480)
  }, [])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && closeCard()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeCard])

  const monthValue = `${year}-${String(month + 1).padStart(2, '0')}`
  const season = seasonFor(month)

  // aakhri bar: abhi kya karna zaroori hai
  const urgent = data
    ? [
        {
          level: data.counts.high > 130 ? 'critical' : 'high',
          text: `${data.counts.high} customers are at high risk — launch a win-back SMS campaign within 48 hours.`,
          to: `/admin/marketing/new?season=${season}`,
          cta: 'Make strategy',
        },
        {
          level: 'high',
          text: `Top 5 high-risk VIPs could cost about ${pkr(data.revenueAtRisk)} — call them personally this week.`,
          to: null,
        },
        {
          level: 'medium',
          text: `${data.drivers[0].value}% leave because of "${data.drivers[0].label}" — add an automatic reminder on day 30.`,
          to: `/admin/marketing?season=${season}`,
          cta: 'See strategies',
        },
      ]
    : []

  return (
    <div className="ch">
      {/* Orbit */}
      <section className="ch-stage">
        <header className="ch-top">
          <div>
            <span className="ch-eyebrow">Churn Monitoring</span>
            <p className="ch-sub">Click a customer to see why — and what to do</p>
          </div>
          <div className="ch-legend">
            <span><i className="ch-dot ch-dot--high" /> High risk (top 5)</span>
            <span><i className="ch-dot ch-dot--low" /> Low risk (top 4)</span>
          </div>
        </header>

        <div className={`ch-orbit ${card ? 'is-paused' : ''}`} key={monthValue}>
          <div className="ch-ring ch-ring--outer">
            {data?.high.map((c, i) => (
              <OrbitNode key={c.id} c={c} angle={(360 / data.high.length) * i - 90} onOpen={openCard} />
            ))}
          </div>
          <div className="ch-ring ch-ring--mid" aria-hidden="true">
            {[20, 140, 260].map((a) => (
              <span key={a} className="ch-spark" style={{ '--a': `${a}deg` }} />
            ))}
          </div>
          <div className="ch-ring ch-ring--inner">
            {data?.low.map((c, i) => (
              <OrbitNode key={c.id} c={c} angle={(360 / data.low.length) * i + 45} onOpen={openCard} />
            ))}
          </div>

          <div className="ch-center">
            <small>{data?.label}</small>
            <span>Churn</span>
            <strong>Monitor</strong>
            <em>{data ? `${data.rate}% churn rate` : 'Loading…'}</em>
          </div>
        </div>

        {/* Orbit ke neeche right: mahina badlo */}
        <div className="ch-month">
          <span>Viewing</span>
          <button type="button" onClick={() => shiftMonth(-1)} aria-label="Previous month">
            <ChevronLeft size={16} />
          </button>
          <input type="month" value={monthValue} onChange={onPickMonth} aria-label="Choose month" />
          <button type="button" onClick={() => shiftMonth(1)} aria-label="Next month">
            <ChevronRight size={16} />
          </button>
        </div>
      </section>

      {/* Neeche: overall results */}
      {data && (
        <section className="ch-results">
          <h2>
            Overall churn results <span>{data.label}</span>
          </h2>

          <div className="ch-kpis">
            <div className="ch-kpi ch-kpi--alert"><small>Churn rate</small><b>{data.rate}%</b></div>
            <div className="ch-kpi"><small>High risk</small><b>{data.counts.high}</b></div>
            <div className="ch-kpi"><small>Medium risk</small><b>{data.counts.medium}</b></div>
            <div className="ch-kpi"><small>Low risk</small><b>{data.counts.low.toLocaleString()}</b></div>
            <div className="ch-kpi"><small>Revenue at risk</small><b>{pkr(data.revenueAtRisk)}</b></div>
          </div>

          <div className="ch-panels">
            <div className="ch-panel">
              <h3>Churn rate — last 6 months</h3>
              <TrendChart points={data.trend} />
            </div>

            <div className="ch-panel">
              <h3>Customers by risk</h3>
              <div className="ch-split">
                {['high', 'medium', 'low'].map((k) => (
                  <span key={k} className={`ch-split__${k}`} style={{ flex: data.counts[k] }} />
                ))}
              </div>
              <ul className="ch-split__legend">
                <li><i className="ch-split__high" /> High <b>{data.counts.high}</b></li>
                <li><i className="ch-split__medium" /> Medium <b>{data.counts.medium}</b></li>
                <li><i className="ch-split__low" /> Low <b>{data.counts.low.toLocaleString()}</b></li>
              </ul>

              <h3 className="ch-panel__sub">Why customers leave</h3>
              <ul className="ch-drivers">
                {data.drivers.map((d) => (
                  <li key={d.label}>
                    <span>{d.label}</span>
                    <div><i style={{ width: `${d.value * 2}%` }} /></div>
                    <b>{d.value}%</b>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Aakhir mein: urgent action bar */}
          <div className="ch-urgent">
            <div className="ch-urgent__title">
              <Siren size={20} />
              <div>
                <strong>Urgent action required</strong>
                <small>Based on {data.label} results</small>
              </div>
            </div>
            <ul>
              {urgent.map((u) => (
                <li key={u.text} className={`ch-urgent__item ch-urgent__item--${u.level}`}>
                  <span className="ch-urgent__level">{u.level}</span>
                  <p>{u.text}</p>
                  {u.to && (
                    <Link to={u.to} className="ch-urgent__btn">
                      {u.cta} <ArrowRight size={13} />
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {card && <CustomerCard card={card} onClose={closeCard} season={season} />}
    </div>
  )
}