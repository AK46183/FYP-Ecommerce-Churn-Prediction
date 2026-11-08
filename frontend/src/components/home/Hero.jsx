import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import './Hero.css'

// ============================================================
// MINAYSH - homepage hero
// Full-screen video with:
//   left   - big serif headline (middle line italic)
//   center - short line of copy + dark button
//   right  - small spaced lines
// ============================================================

// change the words here
const HERO = {
  eyebrow: ['MAKEUP & SKINCARE', 'MADE FOR YOU'],
  headline: ['Beauty','Beyond', 'Limits'], // the middle line is italic
  text: 'Makeup, skincare and more, curated for every skin and every story. Delivered across Pakistan.',
  cta: 'Explore Collection',
  ctaLink: '/makeup',
}

const rise = {
  hidden: { opacity: 0, y: 26 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.15 + i * 0.12, ease: [0.2, 0.7, 0.2, 1] },
  }),
}

// "Beyond" in rose script with flourishes on both sides (soft 3D emboss)
function BeyondScript() {
  return (
    <svg className="hero__beyond" viewBox="0 0 900 300" role="img" aria-label="Beyond">
      <defs>
        <linearGradient id="heroBeyondRose" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d4808f" />
          <stop offset="0.45" stopColor="#b04f63" />
          <stop offset="1" stopColor="#7f2c40" />
        </linearGradient>
        <filter id="heroBeyondEmboss" x="-10%" y="-20%" width="120%" height="150%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2.2" result="blur" />
          <feOffset in="blur" dx="3" dy="5" result="off" />
          <feFlood floodColor="#2a0912" floodOpacity="0.55" />
          <feComposite in2="off" operator="in" result="shadow" />
          <feSpecularLighting in="blur" surfaceScale="4" specularConstant="0.7" specularExponent="18" lightingColor="#ffe3ea" result="spec">
            <feDistantLight azimuth="235" elevation="48" />
          </feSpecularLighting>
          <feComposite in="spec" in2="SourceAlpha" operator="in" result="shine" />
          <feMerge>
            <feMergeNode in="shadow" />
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="shine" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#heroBeyondEmboss)" fill="url(#heroBeyondRose)" stroke="url(#heroBeyondRose)">
        <text x="450" y="200" textAnchor="middle" fontFamily="'Great Vibes', cursive" fontSize="235" stroke="none">
          Beyond
        </text>
        <g fill="none" strokeWidth="9" strokeLinecap="round">
          <path d="M150 150 C 115 150, 70 135, 48 112 C 28 90, 42 62, 72 66 C 100 70, 104 104, 78 112 C 58 118, 44 100, 56 88" />
          <path d="M150 150 C 190 150, 215 146, 235 140" strokeWidth="5" />
          <path d="M705 168 C 760 172, 815 160, 848 128 C 876 100, 866 66, 836 66 C 806 66, 798 98, 822 110 C 842 120, 866 108, 876 92" />
          <path d="M300 232 C 420 262, 600 258, 738 214" strokeWidth="5" />
          <path d="M738 214 C 768 204, 790 196, 812 198" strokeWidth="3.5" />
        </g>
      </g>
    </svg>
  )
}

export default function Hero() {
  const [videoFailed, setVideoFailed] = useState(false)

  return (
    <section className="hero">
      {videoFailed ? (
        <img src="/videos/hero-beauty-poster.jpg" alt="" className="hero__video hero__poster-fallback" />
      ) : (
        <video
          className="hero__video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/videos/hero-beauty-poster.jpg"
          onError={() => setVideoFailed(true)}
        >
          <source src="/videos/hero-beauty.mp4" type="video/mp4" />
        </video>
      )}

      {/* soft shade on the left so the text is always readable */}
      <div className="hero__overlay" />

      <div className="hero__inner">
        {/* LEFT: big headline */}
        <h1 className="hero__headline">
          {HERO.headline.map((word, i) => (
            <motion.span
              key={word}
              className={i === 1 ? 'hero__headline-italic' : undefined}
              variants={rise}
              initial="hidden"
              animate="show"
              custom={i}
            >
              {i === 1 ? <BeyondScript /> : word}
            </motion.span>
          ))}
        </h1>

        {/* CENTER: short text + button */}
        <motion.div className="hero__center" variants={rise} initial="hidden" animate="show" custom={3}>
          <p className="hero__text">{HERO.text}</p>
          <Link to={HERO.ctaLink} className="hero__cta">
            {HERO.cta}
            <ArrowRight size={16} strokeWidth={1.5} />
          </Link>
        </motion.div>

        {/* RIGHT: small spaced lines */}
        <motion.p className="hero__eyebrow" variants={rise} initial="hidden" animate="show" custom={4}>
          {HERO.eyebrow.map((line) => (
            <span key={line}>{line}</span>
          ))}
          <span className="hero__eyebrow-line" aria-hidden="true" />
        </motion.p>
      </div>
    </section>
  )
}