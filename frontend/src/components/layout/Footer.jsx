import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Instagram, Facebook, Music2 } from 'lucide-react'
import { footerLinks } from '../../data/navigation.js'
import './Footer.css'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) return
    setSubmitted(true)
    setEmail('')
  }

  return (
    <footer className="site-footer">
      <div className="container site-footer__top">
        <div className="site-footer__newsletter">
          <h3>Stay in the loop!</h3>
          <p>
            Be the first to hear about new arrivals, beauty edits and MINAYSH exclusives — straight
            to your inbox.
          </p>
          <form onSubmit={handleSubmit} className="site-footer__form">
            <input
              type="email"
              required
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit">SUBSCRIBE</button>
          </form>
          {submitted && <span className="site-footer__confirm">You&apos;re subscribed — welcome.</span>}
        </div>

        <div className="site-footer__col">
          <h4>Help</h4>
          <ul>
            {footerLinks.help.map((link) => (
              <li key={link.path}>
                <Link to={link.path}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="site-footer__col">
          <h4>About MINAYSH</h4>
          <ul>
            {footerLinks.about.map((link) => (
              <li key={link.path}>
                <Link to={link.path}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container site-footer__bottom">
        <div className="site-footer__social">
          <span>FOLLOW US ON</span>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
            <Instagram size={18} strokeWidth={1.5} />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
            <Facebook size={18} strokeWidth={1.5} />
          </a>
          <a href="https://tiktok.com" target="_blank" rel="noreferrer" aria-label="TikTok">
            <Music2 size={18} strokeWidth={1.5} />
          </a>
        </div>
        <img src="/images/minaysh-logo.png" alt="MINAYSH" className="site-footer__logo" />
        <span className="site-footer__copy">© {new Date().getFullYear()} MINAYSH. All rights reserved.</span>
      </div>
    </footer>
  )
}
