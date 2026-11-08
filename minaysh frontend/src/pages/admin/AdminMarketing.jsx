import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { Plus, Target, Send, TrendingUp, Sparkles, ChevronUp, ChevronDown } from 'lucide-react'
import { seasons } from '../../data/marketingSeasons.js'
import { getStrategies } from '../../services/strategyApi.js'
import './AdminMarketing.css'

// pills ki alag alag lambai (picture jaisa design)
const pillHeights = [72, 88, 62, 84, 68, 78]

export default function AdminMarketing() {
  const [params, setParams] = useSearchParams()
  const location = useLocation()
  const railRef = useRef(null)

  const startIdx = Math.max(0, seasons.findIndex((s) => s.key === params.get('season')))
  const [active, setActive] = useState(startIdx)
  const [strategies, setStrategies] = useState([])
  const [open, setOpen] = useState(0) // kaun si pill khuli hai
  const [toast, setToast] = useState(location.state?.saved || '')

  const season = seasons[active]

  // season badle to us ki strategies lao
  useEffect(() => {
    let alive = true
    setOpen(0)
    getStrategies(season.key).then((list) => alive && setStrategies(list))
    setParams({ season: season.key }, { replace: true })
    // selected circle ko list ke beech mein le aao (sirf list scroll ho, page nahi)
    const list = railRef.current
    const el = list?.querySelector(`[data-key="${season.key}"]`)
    if (list && el) {
      list.scrollTo({
        top: el.offsetTop - list.clientHeight / 2 + el.offsetHeight / 2,
        left: el.offsetLeft - list.clientWidth / 2 + el.offsetWidth / 2,
        behavior: 'smooth',
      })
    }
    return () => {
      alive = false
    }
  }, [season.key]) // eslint-disable-line react-hooks/exhaustive-deps

  // "Strategy saved" wala message 3 second baad gayab
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 3000)
    return () => clearTimeout(t)
  }, [toast])

  // keyboard: ↑ ↓ se season badlo
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowDown') setActive((a) => Math.min(seasons.length - 1, a + 1))
      if (e.key === 'ArrowUp') setActive((a) => Math.max(0, a - 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const best = strategies.reduce((m, s) => Math.max(m, parseInt(s.uplift, 10) || 0), 0)

  return (
    <div className="mk">
      {/* Background: season ki picture (blur) + sea-green shade */}
      {seasons.map((s, i) => (
        <div
          key={s.key}
          className={`mk-bg ${i === active ? 'is-active' : ''}`}
          style={{ backgroundImage: `url(${s.image})` }}
          aria-hidden="true"
        />
      ))}
      <div className="mk-shade" aria-hidden="true" />

      {/* Top bar */}
      <header className="mk-top">
        <div>
          <span className="mk-eyebrow">Marketing Strategy</span>
          <p className="mk-sub">Pick a season to see what to run</p>
        </div>
        <Link to={`/admin/marketing/new?season=${season.key}`} className="mk-make">
          <Plus size={16} strokeWidth={2.2} /> Make Strategy
        </Link>
      </header>

      {toast && <div className="mk-toast">{toast}</div>}

      <div className="mk-body">
        {/* Left: seasons ki scroll hone wali list */}
        <nav className="mk-rail" aria-label="Seasons">
          <button
            type="button"
            className="mk-rail__arrow"
            onClick={() => setActive((a) => Math.max(0, a - 1))}
            aria-label="Previous season"
          >
            <ChevronUp size={16} />
          </button>
          <ul ref={railRef}>
            {seasons.map((s, i) => (
              <li key={s.key}>
                <button
                  type="button"
                  data-key={s.key}
                  className={`mk-dot ${i === active ? 'is-active' : ''}`}
                  style={{ backgroundImage: `url(${s.image})` }}
                  onClick={() => setActive(i)}
                  aria-label={s.name}
                  aria-current={i === active}
                >
                  <span>{s.name}</span>
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="mk-rail__arrow"
            onClick={() => setActive((a) => Math.min(seasons.length - 1, a + 1))}
            aria-label="Next season"
          >
            <ChevronDown size={16} />
          </button>
        </nav>

        {/* Beech: season ka naam aur detail */}
        <section className="mk-info" key={season.key}>
          <span className="mk-info__tag">{season.tagline}</span>
          <h1>{season.name}</h1>
          <p>{season.description}</p>
          <div className="mk-info__stats">
            <div>
              <b>{strategies.length}</b>
              <small>Strategies</small>
            </div>
            <div>
              <b>+{best}%</b>
              <small>Best expected uplift</small>
            </div>
          </div>
        </section>

        {/* Right: strategies pills */}
        <section className="mk-pills" key={`p-${season.key}`} aria-label={`${season.name} strategies`}>
          {strategies.map((st, i) => {
            const isOpen = i === open
            return (
              <button
                key={st.id}
                type="button"
                className={`mk-pill ${isOpen ? 'is-open' : ''}`}
                style={{
                  '--h': `${pillHeights[i % pillHeights.length]}%`,
                  '--i': i,
                  backgroundImage: `url(${season.image})`,
                }}
                onClick={() => setOpen(i)}
                aria-expanded={isOpen}
              >
                <span className="mk-pill__num">{String(i + 1).padStart(2, '0')}</span>
                {st.custom && <span className="mk-pill__mine">Mine</span>}

                {/* band pill: khara (vertical) naam */}
                <span className="mk-pill__label">{st.title}</span>

                {/* khuli pill: poori detail */}
                <span className="mk-pill__detail">
                  <span className="mk-pill__type">{st.type}</span>
                  <strong>{st.title}</strong>
                  <span className="mk-pill__offer">{st.offer}</span>
                  <span className="mk-pill__meta">
                    <span><Target size={13} /> {st.target}</span>
                    <span><Send size={13} /> {st.channel}</span>
                    <span><TrendingUp size={13} /> {st.uplift} expected</span>
                  </span>
                </span>
              </button>
            )
          })}

          {/* aakhri pill: nayi strategy banao */}
          <Link
            to={`/admin/marketing/new?season=${season.key}`}
            className="mk-pill mk-pill--add"
            style={{ '--h': '54%', '--i': strategies.length }}
          >
            <Sparkles size={18} />
            <span className="mk-pill__label">Add new</span>
          </Link>
        </section>
      </div>
    </div>
  )
}