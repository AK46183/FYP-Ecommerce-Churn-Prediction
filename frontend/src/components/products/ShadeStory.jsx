import { useEffect, useRef, useState } from 'react'
import { SHADE_IMAGES } from '../../data/shadeImages.js'
import { SHADE_TURNTABLES } from '../../data/shadeTurntables.js'
import Turntable from './Turntable.jsx'
import { shadeColor } from '../../utils/shadeColor.js'
import { formatPKR } from '../../services/format.js'
import Bottle3D from './Bottle3D.jsx'
import './ShadeStory.css'

// "115 Ivory" -> "115"   (same rule as sync-shades.py)
function codeOf(label) {
  const m = String(label || '').match(/^\s*([A-Za-z]?\d{1,4}(?:\.\d+)?[A-Za-z]?)(?=[\s,]|$)/)
  return m ? m[1].toUpperCase() : null
}
const toRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16)
  return [n >> 16, (n >> 8) & 255, n & 255]
}
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t))
const smooth = (t) => t * t * (3 - 2 * t)
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

const FALLBACK = '#d8a9a0'
const STEP_VH = 80 // scroll distance per shade

// Product stays in the middle and turns around while you scroll;
// the shade name / colour / text flow up and the next shade comes in.
export default function ShadeStory({ product, options, onAdd, canAdd, selected }) {
  const sectionRef = useRef(null)
  const lastSelected = useRef(selected)
  const [pos, setPos] = useState(0) // 0 .. count-1, with decimals while scrolling
  const [prog, setProg] = useState(0) // 0..1 through the whole section

  const saved = SHADE_IMAGES[product.id] || {}
  const turntable = SHADE_TURNTABLES[product.id]
  // products with 0-1 shade but a photo set: one "360 view" panel instead of a shade story
  const single = options.length < 2
  const list = single
    ? [{ label: options[0]?.label || '', price: options[0]?.price ?? null, oldPrice: options[0]?.oldPrice ?? null, available: options[0]?.available ?? true }]
    : options
  const shades = list.map((o) => {
    const own = saved[codeOf(o.label)] || saved[o.label]
    const color = own?.color || shadeColor(o.label, product.subCategory) || FALLBACK
    const name = own?.name && !o.label.toLowerCase().includes(own.name.toLowerCase()) ? own.name : ''
    const display = name ? `${o.label} ${name}` : o.label
    const bigWord = single ? product.brand || '' : (name || o.label.replace(/^\s*\S+\s*/, '') || o.label).trim()
    return { ...o, display, bigWord, code: codeOf(o.label) || o.label, image: own?.image || product.image, ownImage: Boolean(own?.image), shape: own?.shape, color, rgb: toRgb(color) }
  })
  const count = shades.length

  useEffect(() => {
    // warm the browser cache so the photo swap is instant
    shades.forEach((s) => {
      if (s.ownImage) new Image().src = s.image
    })
    let frame = 0
    function update() {
      frame = 0
      const el = sectionRef.current
      if (!el) return
      const travel = el.offsetHeight - window.innerHeight
      const p = travel > 0 ? clamp(-el.getBoundingClientRect().top / travel, 0, 1) : 0
      setPos(p * Math.max(0, count - 1))
      setProg(p)
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, product.id])

  // a swatch was clicked in the buy box above -> scroll down to that shade
  useEffect(() => {
    if (selected === lastSelected.current) return // page just opened: stay at the top
    lastSelected.current = selected
    const el = sectionRef.current
    if (!el || selected == null || count < 2) return
    const travel = el.offsetHeight - window.innerHeight
    const top = el.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: top + (travel * selected) / (count - 1), behavior: 'smooth' })
  }, [selected, count])

  if (single && !turntable) return null
  if (!single && count < 2) return null

  // ---- where are we between two shades ----
  const base = Math.min(count - 1, Math.floor(pos))
  const next = Math.min(count - 1, base + 1)
  const frac = pos - base
  const spin = clamp((frac - 0.2) / 0.6, 0, 1) // the turn happens in the middle of the scroll
  const showing = spin < 0.5 ? base : next
  const active = frac < 0.5 ? base : next
  const tiltOf = (i) => (i % 2 === 0 ? -4 : 3)
  const turnScale = Math.max(0.03, Math.abs(Math.cos(Math.PI * spin)))
  const tilt = (tiltOf(base) + (tiltOf(next) - tiltOf(base)) * smooth(spin)) * (1 - 0.65 * Math.sin(Math.PI * spin))
  const lift = -Math.sin(Math.PI * frac) * 8
  const shadeLight = 1 - 0.28 * Math.sin(Math.PI * spin) // darker while the back faces us
  const use3D = !turntable && shades.some((s) => s.ownImage)
  // liquid tint for the photo turntable: shade colour relative to the colour in the photos
  const tintOf = (rgb) => {
    const ref = toRgb(turntable?.ref || '#ffffff')
    return rgb.map((c, i) => Math.round(255 * Math.min(1, c / ref[i]) ** (turntable?.power || 1)))
  }
  // 3D: one full turn between two shades; the photo swaps while the bottle is side-on
  const angle = -22 + spin * 360
  const frontShade = shades[spin < 0.25 ? base : next]
  const liquid = `rgb(${mix(shades[base].rgb, shades[next].rgb, smooth(spin)).join(',')})`
  const cur = shades[showing]

  function jumpTo(i) {
    const el = sectionRef.current
    const travel = el.offsetHeight - window.innerHeight
    const top = el.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: top + (travel * i) / (count - 1), behavior: 'smooth' })
  }
  function skip() {
    const el = sectionRef.current
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + el.offsetHeight, behavior: 'smooth' })
  }

  return (
    <section
      className="shade-story"
      ref={sectionRef}
      style={{ height: single ? '240vh' : `calc(${(count - 1) * STEP_VH}vh + 100vh)` }}
      aria-label="Shades"
    >
      <div className="shade-story__sticky">
        {/* panels move up like a page; one panel per shade */}
        <div className="shade-story__track" style={{ transform: `translate3d(0, ${-pos * 100}%, 0)` }}>
          {shades.map((s, i) => (
            <div className="shade-story__panel" key={s.label} aria-hidden={i !== active}>
              <div className="shade-story__copy">
                <p className="shade-story__eyebrow">
                  {single ? '360° view' : `Shade ${String(i + 1).padStart(2, '0')} / ${String(count).padStart(2, '0')}`}
                </p>
                <p className="shade-story__product">{product.name}</p>
                {canAdd(s) && (
                  <button type="button" className="shade-story__add" tabIndex={i === active ? 0 : -1} onClick={() => onAdd(s)}>
                    {s.display ? `Add ${s.display} to bag` : 'Add to bag'}
                  </button>
                )}
              </div>

              <div className="shade-story__center">
                <span className="shade-story__blob" style={{ background: s.color }} aria-hidden="true" />
                <h2 className="shade-story__word">{s.bigWord}</h2>
              </div>

              <dl className="shade-story__facts">
                {s.code && <div><dt>Shade</dt><dd>{s.code}</dd></div>}
                {!single && s.bigWord !== s.code && <div><dt>Name</dt><dd>{s.bigWord}</dd></div>}
                {single && product.brand && <div><dt>Brand</dt><dd>{product.brand}</dd></div>}
                <div><dt>Price</dt><dd>{formatPKR(s.price ?? product.price)}</dd></div>
                <div><dt>Colour</dt><dd><span className="shade-story__chip" style={{ background: s.color }} /></dd></div>
              </dl>
            </div>
          ))}
        </div>

        {/* the product: fixed in the middle, turns while scrolling */}
        <div className="shade-story__product-wrap">
          {turntable ? (
            <Turntable
              config={turntable}
              view={single
                ? smooth(prog) * ((turntable.shadeFrames ? Object.values(turntable.shadeFrames)[0] : turntable.frames).length - 1)
                : (turntable.swing ?? 1) * smooth(spin < 0.5 ? spin * 2 : (1 - spin) * 2)}
              layers={[
                { code: shades[base].code, tint: turntable.ref ? `rgb(${tintOf(shades[base].rgb).join(',')})` : null, opacity: 1 },
                { code: shades[next].code, tint: turntable.ref ? `rgb(${tintOf(shades[next].rgb).join(',')})` : null, opacity: next === base ? 0 : smooth(clamp((spin - 0.35) / 0.3, 0, 1)) },
              ]}
              tilt={tilt}
              lift={lift}
            />
          ) : use3D ? (
            <Bottle3D
              front={frontShade.ownImage ? frontShade.image : null}
              back={shades[next].ownImage ? shades[next].image : null}
              color={liquid}
              shape={frontShade.shape || shades.find((x) => x.shape)?.shape}
              angle={angle}
              tilt={tilt}
              lift={lift}
              label={frontShade.code}
            />
          ) : (
            <img
              src={cur.image}
              alt=""
              aria-hidden="true"
              className="shade-story__bottle is-generic"
              style={{
                transform: `translateY(${lift}px) rotate(${tilt}deg) scaleX(${turnScale})`,
                filter: `brightness(${shadeLight})`,
              }}
            />
          )}
        </div>

        {canAdd(shades[active]) && (
          <button type="button" className="shade-story__add shade-story__add--phone" onClick={() => onAdd(shades[active])}>
            {shades[active].display ? `Add ${shades[active].display}` : 'Add to bag'}
          </button>
        )}

        {!single && <div className="shade-story__dots" role="tablist" aria-label="Shades">
          {shades.map((s, i) => (
            <button
              key={s.label}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={s.display}
              title={s.display}
              className={`shade-story__dot ${i === active ? 'is-active' : ''}`}
              style={{ background: s.color }}
              onClick={() => jumpTo(i)}
            />
          ))}
        </div>}
        <button type="button" className="shade-story__skip" onClick={skip}>Skip ↓</button>
      </div>
    </section>
  )
}
