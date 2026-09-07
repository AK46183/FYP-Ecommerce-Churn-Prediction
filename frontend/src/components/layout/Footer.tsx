import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Twitter, Instagram, Youtube, Github } from 'lucide-react'

export default function Footer() {
  const sections = [
    {
      title: 'Shop',
      links: [
        { label: 'All Products', to: '/shop' },
        { label: 'New Arrivals', to: '/shop?filter=new' },
        { label: 'Deals', to: '/shop?filter=deals' },
        { label: 'Categories', to: '/shop' },
      ],
    },
    {
      title: 'Account',
      links: [
        { label: 'My Profile', to: '/profile' },
        { label: 'My Orders', to: '/orders' },
        { label: 'Wishlist', to: '/wishlist' },
        { label: 'Cart', to: '/cart' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', to: '/about' },
        { label: 'Contact', to: '/contact' },
        { label: 'Admin Portal', to: '/admin' },
      ],
    },
  ]

  return (
    <footer className="relative mt-32 border-t border-white/[0.06] bg-ink-950">
      <div className="container-wide section-pad py-16">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-400">
                <span className="font-display text-sm font-bold text-ink-950">N</span>
              </div>
              <span className="font-display text-lg font-bold tracking-tight text-white">NOVA</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-white/40">
              A premium futuristic electronics shopping experience powered by AI-driven analytics.
            </p>
            <div className="mt-6 flex gap-3">
              {[Twitter, Instagram, Youtube, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] text-white/50 transition-all duration-300 hover:border-accent-400/40 hover:text-accent-300"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link sections */}
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-white">{section.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-white/40 transition-colors hover:text-accent-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-12 flex flex-col items-center justify-between gap-6 rounded-2xl border border-white/[0.06] bg-ink-900/50 p-6 sm:flex-row sm:p-8">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-accent-400" />
            <div>
              <p className="font-display text-base font-medium text-white">Stay in the loop</p>
              <p className="text-sm text-white/40">Get notified about new launches and exclusive deals.</p>
            </div>
          </div>
          <div className="flex w-full max-w-md gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              className="input-field"
            />
            <button className="btn-accent shrink-0">Subscribe</button>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 sm:flex-row">
          <p className="text-xs text-white/30">© 2026 NOVA Electronics. All rights reserved. Final Year Project.</p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-white/30 hover:text-white/60">Privacy Policy</a>
            <a href="#" className="text-xs text-white/30 hover:text-white/60">Terms of Service</a>
            <a href="#" className="text-xs text-white/30 hover:text-white/60">Warranty</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
