// Help / policy pages ke chhote building blocks (Help Center jaisa theme: safed cards + rose-gold accents)
import { Link } from 'react-router-dom'
import { Check, Mail, MessageCircle } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader.jsx'
import './InfoPages.css'

const openHelpBot = () => document.querySelector('button[aria-label="Open help bot"]')?.click()

export function InfoPage({ title, subtitle, updated, children }) {
  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />
      <section className="info-page">
        <div className="container info-wrap">
          {children}
          {updated && <p className="info-updated">Last updated: {updated}</p>}
          <HelpCta />
        </div>
      </section>
    </>
  )
}

/** Bari "hero" line: icon + ek ahem baat (maslan "7-day exchange") */
export function InfoHighlight({ icon: Icon, title, children }) {
  return (
    <div className="info-highlight">
      {Icon && <span className="info-icon info-icon--lg"><Icon size={24} strokeWidth={1.6} aria-hidden="true" /></span>}
      <div>
        <h2>{title}</h2>
        <p>{children}</p>
      </div>
    </div>
  )
}

/** Options (delivery / payment) ke cards */
export function OptionCards({ items }) {
  return (
    <div className="info-options">
      {items.map(({ icon: Icon, title, price, meta, tag, tone, children }) => (
        <article key={title} className={`info-option${tone === 'muted' ? ' info-option--muted' : ''}`}>
          <div className="info-option__top">
            <span className="info-icon"><Icon size={20} strokeWidth={1.6} aria-hidden="true" /></span>
            {tag && <span className={`info-tag info-tag--${tone || 'ok'}`}>{tag}</span>}
          </div>
          <h3>{title}</h3>
          {price && <p className="info-option__price">{price}</p>}
          {meta && <p className="info-option__meta">{meta}</p>}
          {children && <p className="info-option__text">{children}</p>}
        </article>
      ))}
    </div>
  )
}

/** Panel: heading (chhote caps) + content */
export function InfoPanel({ icon: Icon, title, children }) {
  return (
    <section className="info-panel">
      {title && <h2>{Icon && <Icon size={17} strokeWidth={1.7} aria-hidden="true" />}{title}</h2>}
      {children}
    </section>
  )
}

/** Numbered steps (1 -> 2 -> 3) */
export function Steps({ items }) {
  return (
    <ol className="info-steps">
      {items.map(({ icon: Icon, title, text }, i) => (
        <li key={title}>
          <span className="info-steps__dot">{Icon ? <Icon size={18} strokeWidth={1.7} aria-hidden="true" /> : i + 1}</span>
          <strong>{title}</strong>
          <p>{text}</p>
        </li>
      ))}
    </ol>
  )
}

/** Tick wali list */
export function Checklist({ items }) {
  return (
    <ul className="info-check">
      {items.map((t) => (
        <li key={typeof t === 'string' ? t : t.key}>
          <Check size={16} strokeWidth={2.2} aria-hidden="true" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  )
}

/** Note / warning box */
export function Callout({ icon: Icon, title, children, tone = 'soft' }) {
  return (
    <div className={`info-callout info-callout--${tone}`}>
      {Icon && <Icon size={20} strokeWidth={1.7} aria-hidden="true" />}
      <div>
        {title && <strong>{title}</strong>}
        <p>{children}</p>
      </div>
    </div>
  )
}

/** Har page ke neeche: "Still have a question?" */
export function HelpCta() {
  return (
    <div className="info-cta">
      <div>
        <h3>Still have a question?</h3>
        <p>Ask our Help Bot for a quick answer, or send us a message and our team replies within 1 to 2 business days.</p>
      </div>
      <div className="info-cta__btns">
        <button type="button" className="info-btn" onClick={openHelpBot}>
          <MessageCircle size={16} aria-hidden="true" />Ask the Help Bot
        </button>
        <Link to="/contact" className="info-btn info-btn--ghost"><Mail size={16} aria-hidden="true" />Contact us</Link>
      </div>
    </div>
  )
}
