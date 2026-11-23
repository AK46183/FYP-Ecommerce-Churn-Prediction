import { useEffect, useMemo, useState } from 'react'
import { getUpcomingEvents } from '../../services/saleApi.js'
import { api } from '../../services/api.js'
import './NewDropPage.css'

// NEW: "Coming soon" + countdown agle launch tak, "Notify me".
// Launch wahi events hain jo admin "Upcoming Sale" mein banata hai (Product Launch pehle, warna koi bhi agla event).
const pad = (n) => String(Math.max(0, n)).padStart(2, '0')

function useNow(ms = 1000) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), ms)
    return () => clearInterval(t)
  }, [ms])
  return now
}

function pickLaunch(events, now) {
  const future = events.filter((e) => new Date(e.start).getTime() > now)
  return future.find((e) => /launch/i.test(e.type || '')) || future[0] || null
}

export default function NewDropPage() {
  const now = useNow()
  const [events, setEvents] = useState(null)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | done | error
  const [message, setMessage] = useState('')

  useEffect(() => {
    getUpcomingEvents()
      .then(setEvents)
      .catch(() => setEvents([]))
  }, [])

  const launch = useMemo(() => (events ? pickLaunch(events, now) : null), [events, now])
  const ms = launch ? new Date(launch.start).getTime() - now : 0
  const parts = [
    ['Days', Math.floor(ms / 86400000)],
    ['Hours', Math.floor((ms % 86400000) / 3600000)],
    ['Minutes', Math.floor((ms % 3600000) / 60000)],
    ['Seconds', Math.floor((ms % 60000) / 1000)],
  ]


  async function notify(e) {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setStatus('error')
      setMessage('Please enter a valid email address.')
      return
    }
    setStatus('sending')
    try {
      await api('/newsletter', { method: 'POST', body: { email: email.trim(), source: launch ? `launch:${launch.id || launch.name}` : 'new-drop' } })
      setStatus('done')
      setMessage("You're on the list. We'll email you the moment it drops.")
    } catch (err) {
      setStatus('error')
      setMessage(/already/i.test(err.message || '') ? "You're already on the list. We'll let you know!" : err.message || 'Could not subscribe right now.')
    }
  }

  const bg = '/videos/new-drop-bg-poster.jpg'
  const date = launch ? new Date(launch.start).toLocaleDateString('en-PK', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : ''

  return (
    <div className="new-drop">
      <section className="new-drop__hero" style={{ '--new-drop-bg': `url("${bg}")` }}>
        <video
          className="new-drop__video"
          src="/videos/new-drop-bg.mp4"
          poster="/videos/new-drop-bg-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
        <div className="new-drop__inner container">
          <p className="new-drop__eyebrow">{launch ? launch.type || 'Coming soon' : 'Coming soon'}</p>
          <h1>{events === null ? 'Something new is coming' : launch ? launch.name : 'Something new is on its way'}</h1>
          {launch?.tagline && <p className="new-drop__tagline">{launch.tagline}</p>}

          {launch && (
            <>
              <div className="new-drop__count" role="timer" aria-label={`${parts[0][1]} days, ${parts[1][1]} hours, ${parts[2][1]} minutes left`}>
                {parts.map(([label, value]) => (
                  <div key={label}>
                    <b>{pad(value)}</b>
                    <small>{label}</small>
                  </div>
                ))}
              </div>
              <p className="new-drop__date">
                Drops {date}
                {launch.categories ? ` · ${launch.categories}` : ''}
              </p>
            </>
          )}

          <form className="new-drop__notify" onSubmit={notify}>
            <label htmlFor="new-drop-email">Get notified when it drops</label>
            <div>
              <input
                id="new-drop-email"
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'sending' || status === 'done'}
                autoComplete="email"
              />
              <button type="submit" disabled={status === 'sending' || status === 'done'}>
                {status === 'done' ? 'Done ✓' : status === 'sending' ? 'Saving…' : 'Notify me'}
              </button>
            </div>
            {message && <p className={`new-drop__msg${status === 'error' ? ' is-error' : ''}`} role="status">{message}</p>}
          </form>
        </div>
      </section>

    </div>
  )
}
