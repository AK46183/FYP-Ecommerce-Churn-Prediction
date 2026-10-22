import { useEffect, useRef, useState } from 'react'

// A real 3D box built with CSS: the shade photo is the front,
// the sides / back / top are drawn in the shade colour, and the whole
// thing turns with rotateY - so it looks like a bottle spinning, not a page.
const DEFAULT_SHAPE = { aspect: 0.3, cap: 0.26, capWidth: 0.58, bodyWidth: 1 }

function light(angleDeg, faceDeg) {
  const a = ((angleDeg + faceDeg - 25) * Math.PI) / 180
  return 0.62 + 0.38 * Math.max(0, Math.cos(a))
}

export default function Bottle3D({ front, back, color, shape, angle, tilt, lift, label }) {
  const boxRef = useRef(null)
  const [size, setSize] = useState({ w: 300, h: 500 })

  useEffect(() => {
    const el = boxRef.current
    if (!el) return undefined
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const s = { ...DEFAULT_SHAPE, ...(shape || {}) }
  const H = Math.min(size.h * 0.94, (size.w * 0.9) / s.aspect)
  const imgW = H * s.aspect
  const W = imgW * s.bodyWidth
  const capH = H * s.cap
  const bodyH = H - capH
  const Wc = W * s.capWidth
  const D = W * 0.5
  const Dc = Math.min(D * 0.82, Wc)
  const bodyY = capH / 2
  const capY = -H / 2 + capH / 2

  const photo = (url, w, h, offY) =>
    url
      ? { backgroundImage: `url("${url}")`, backgroundSize: `${imgW}px ${H}px`, backgroundPosition: `${-(imgW - w) / 2}px ${-offY}px` }
      : {}

  const face = (w, h, transform, extra, faceDeg) => ({
    width: w,
    height: h,
    marginLeft: -w / 2,
    marginTop: -h / 2,
    transform,
    filter: `brightness(${light(angle, faceDeg)})`,
    ...extra,
  })

  const glassSide = {
    background: `linear-gradient(90deg, rgba(255,255,255,.55), rgba(255,255,255,0) 22%, rgba(0,0,0,.08) 70%, rgba(255,255,255,.35)), ${color}`,
  }
  const capSide = { background: 'linear-gradient(90deg, #3a3a3a, #0d0d0d 45%, #262626)' }

  return (
    <div className="b3d" ref={boxRef} aria-hidden="true">
      <div className="b3d__obj" style={{ transform: `translateY(${lift}px) rotateZ(${tilt}deg) rotateY(${angle}deg)` }}>
        {/* body */}
        <div className="b3d__face b3d__front" style={face(W, bodyH, `translateY(${bodyY}px) translateZ(${D / 2}px)`, front ? photo(front, W, bodyH, capH) : { background: color }, 0)}>
          {!front && <span className="b3d__label">{label}</span>}
        </div>
        <div className="b3d__face b3d__back" style={face(W, bodyH, `translateY(${bodyY}px) rotateY(180deg) translateZ(${D / 2}px)`, back ? photo(back, W, bodyH, capH) : { background: color }, 180)} />
        <div className="b3d__face" style={face(D, bodyH, `translateY(${bodyY}px) rotateY(90deg) translateZ(${W / 2}px)`, glassSide, 90)} />
        <div className="b3d__face" style={face(D, bodyH, `translateY(${bodyY}px) rotateY(-90deg) translateZ(${W / 2}px)`, glassSide, -90)} />
        <div className="b3d__face" style={face(W, D, `translateY(${bodyY - bodyH / 2}px) rotateX(90deg)`, { background: `linear-gradient(rgba(255,255,255,.6), rgba(255,255,255,.2)), ${color}` }, 0)} />
        <div className="b3d__face" style={face(W, D, `translateY(${bodyY + bodyH / 2}px) rotateX(-90deg)`, { background: color }, 0)} />
        {/* cap */}
        <div className="b3d__face" style={face(Wc, capH, `translateY(${capY}px) translateZ(${Dc / 2}px)`, front ? photo(front, Wc, capH, 0) : capSide, 0)} />
        <div className="b3d__face" style={face(Wc, capH, `translateY(${capY}px) rotateY(180deg) translateZ(${Dc / 2}px)`, capSide, 180)} />
        <div className="b3d__face" style={face(Dc, capH, `translateY(${capY}px) rotateY(90deg) translateZ(${Wc / 2}px)`, capSide, 90)} />
        <div className="b3d__face" style={face(Dc, capH, `translateY(${capY}px) rotateY(-90deg) translateZ(${Wc / 2}px)`, capSide, -90)} />
        <div className="b3d__face" style={face(Wc, Dc, `translateY(${capY - capH / 2}px) rotateX(90deg)`, { background: '#1b1b1b' }, 0)} />
      </div>
      <div className="b3d__shadow" style={{ width: W * 1.3, transform: `translateX(-50%) scaleX(${0.75 + 0.25 * Math.abs(Math.cos((angle * Math.PI) / 180))})` }} />
    </div>
  )
}
