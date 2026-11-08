import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Save, Wand2, Target, Send, TrendingUp } from 'lucide-react'
import { seasons, strategyTypes, targetGroups, channels } from '../../data/marketingSeasons.js'
import { saveStrategy } from '../../services/strategyApi.js'
import './AdminStrategyBuilder.css'

// Churn model ke hisaab se tayyar suggestions (ek click mein form bhar dete hain)
const templates = [
  { label: 'Win back high-risk', type: 'Win-back', target: 'High risk', offer: '30% off their next order', channel: 'SMS', uplift: '+20%' },
  { label: 'Reward loyal buyers', type: 'Loyalty', target: 'Loyal customers', offer: '2x points for 2 weeks', channel: 'Email', uplift: '+9%' },
  { label: 'Bundle for medium-risk', type: 'Bundle', target: 'Medium risk', offer: '3 products at 25% off', channel: 'Push', uplift: '+14%' },
]

const empty = {
  title: '',
  type: 'Discount',
  target: 'High risk',
  offer: '',
  channel: 'Email',
  uplift: '+10%',
  start: '',
  end: '',
  budget: '',
  notes: '',
}

export default function AdminStrategyBuilder() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [season, setSeason] = useState(params.get('season') || seasons[0].key)
  const [form, setForm] = useState(empty)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const seasonData = seasons.find((s) => s.key === season) || seasons[0]
  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const useTemplate = (t) => {
    setForm((f) => ({ ...f, ...t, title: t.label }))
    setError('')
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.offer.trim()) {
      setError('Strategy name aur offer dono zaroori hain.')
      return
    }
    if (form.start && form.end && form.end < form.start) {
      setError('End date, start date se pehle nahi ho sakti.')
      return
    }
    setSaving(true)
    await saveStrategy({ ...form, season })
    navigate(`/admin/marketing?season=${season}`, {
      state: { saved: `"${form.title}" saved to ${seasonData.name}` },
    })
  }

  return (
    <div className="sb" style={{ '--img': `url(${seasonData.image})` }}>
      <div className="sb-bg" aria-hidden="true" />

      {/* Top bar */}
      <header className="sb-top">
        <Link to={`/admin/marketing?season=${season}`} className="sb-back">
          <ArrowLeft size={16} /> Back to strategies
        </Link>
        <div>
          <span className="sb-eyebrow">Make Strategy</span>
          <h1>Create a new strategy</h1>
        </div>
      </header>

      <div className="sb-grid">
        {/* Form */}
        <form className="sb-form" onSubmit={onSubmit} noValidate>
          {/* Season */}
          <fieldset className="sb-field">
            <legend>Season</legend>
            <div className="sb-seasons">
              {seasons.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  className={`sb-season ${s.key === season ? 'is-active' : ''}`}
                  onClick={() => setSeason(s.key)}
                >
                  <span style={{ backgroundImage: `url(${s.image})` }} />
                  {s.name}
                </button>
              ))}
            </div>
          </fieldset>

          {/* Suggestions */}
          <div className="sb-field">
            <span className="sb-label">
              <Wand2 size={14} /> Quick start (suggested by churn model)
            </span>
            <div className="sb-chips">
              {templates.map((t) => (
                <button key={t.label} type="button" className="sb-chip" onClick={() => useTemplate(t)}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <label className="sb-field">
            <span className="sb-label">Strategy name *</span>
            <input value={form.title} onChange={set('title')} placeholder="e.g. Winter Rescue Kit" />
          </label>

          <div className="sb-row">
            <label className="sb-field">
              <span className="sb-label">Type</span>
              <select value={form.type} onChange={set('type')}>
                {strategyTypes.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            <label className="sb-field">
              <span className="sb-label">Target customers</span>
              <select value={form.target} onChange={set('target')}>
                {targetGroups.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="sb-field">
            <span className="sb-label">Offer *</span>
            <input value={form.offer} onChange={set('offer')} placeholder="e.g. 25% off on night creams" />
          </label>

          <fieldset className="sb-field">
            <legend>Channel</legend>
            <div className="sb-chips">
              {channels.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`sb-chip ${form.channel === c ? 'is-active' : ''}`}
                  onClick={() => setForm((f) => ({ ...f, channel: c }))}
                >
                  {c}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="sb-row">
            <label className="sb-field">
              <span className="sb-label">Start date</span>
              <input type="date" value={form.start} onChange={set('start')} />
            </label>
            <label className="sb-field">
              <span className="sb-label">End date</span>
              <input type="date" value={form.end} onChange={set('end')} />
            </label>
          </div>

          <div className="sb-row">
            <label className="sb-field">
              <span className="sb-label">Budget (PKR)</span>
              <input type="number" min="0" value={form.budget} onChange={set('budget')} placeholder="50000" />
            </label>
            <label className="sb-field">
              <span className="sb-label">Expected uplift</span>
              <input value={form.uplift} onChange={set('uplift')} placeholder="+10%" />
            </label>
          </div>

          <label className="sb-field">
            <span className="sb-label">Notes</span>
            <textarea rows={3} value={form.notes} onChange={set('notes')} placeholder="Anything the team should know" />
          </label>

          {error && <p className="sb-error">{error}</p>}

          <div className="sb-actions">
            <button type="button" className="sb-btn sb-btn--ghost" onClick={() => setForm(empty)}>
              Clear
            </button>
            <button type="submit" className="sb-btn" disabled={saving}>
              <Save size={16} /> {saving ? 'Saving…' : 'Save strategy'}
            </button>
          </div>
        </form>

        {/* Live preview (pill jaisa) */}
        <aside className="sb-preview" aria-label="Preview">
          <span className="sb-label">Live preview</span>
          <div className="sb-pill">
            <span className="sb-pill__type">{form.type}</span>
            <strong>{form.title || 'Your strategy name'}</strong>
            <span className="sb-pill__offer">{form.offer || 'Your offer will show here'}</span>
            <span className="sb-pill__meta">
              <span><Target size={13} /> {form.target}</span>
              <span><Send size={13} /> {form.channel}</span>
              <span><TrendingUp size={13} /> {form.uplift || '—'} expected</span>
            </span>
          </div>
          <p className="sb-preview__note">
            Saved strategies show first in the <b>{seasonData.name}</b> list.
          </p>
        </aside>
      </div>
    </div>
  )
}