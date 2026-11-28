// ============================================================
// MINAYSH - Virtual try-on drawing (canvas).
// lm = MediaPipe Face Landmarker ke 478 points (x, y: 0..1, video ke hisaab se).
// Har effect chehre ke points se shape banata hai aur rang blend karta hai.
// ============================================================

// MediaPipe face mesh ke points (canonical indices)
const LIPS_OUTER = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 375, 321, 405, 314, 17, 84, 181, 91, 146]
const LIPS_INNER = [78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95]
// upper / lower palak: bahar ke kone se andar ke kone tak
const EYES = [
  { upper: [33, 246, 161, 160, 159, 158, 157, 173, 133], lower: [33, 7, 163, 144, 145, 153, 154, 155, 133],
    browUp: [70, 63, 105, 66, 107], browLow: [46, 53, 52, 65, 55], cheek: 205, cheekTop: 117, edge: 234 },
  { upper: [263, 466, 388, 387, 386, 385, 384, 398, 362], lower: [263, 249, 390, 373, 374, 380, 381, 382, 362],
    browUp: [300, 293, 334, 296, 336], browLow: [276, 283, 282, 295, 285], cheek: 425, cheekTop: 346, edge: 454 },
]
const FACE_OVAL = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148,
  176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109]

/* ----------------------------- chhote helpers ----------------------------- */
const mix = (a, b, t) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t })
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)
const rgba = (hex, a) => {
  const h = hex.replace('#', '')
  const f = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  return `rgba(${parseInt(f.slice(0, 2), 16)},${parseInt(f.slice(2, 4), 16)},${parseInt(f.slice(4, 6), 16)},${a})`
}

/** Points ke beech smooth (curved) band rasta */
function smoothPath(ctx, pts, closed = true) {
  if (pts.length < 3) return
  ctx.moveTo((pts[0].x + pts[1].x) / 2, (pts[0].y + pts[1].y) / 2)
  const n = pts.length
  const last = closed ? n : n - 1
  for (let i = 1; i < last; i++) {
    const p = pts[i % n]
    const q = pts[(i + 1) % n]
    ctx.quadraticCurveTo(p.x, p.y, (p.x + q.x) / 2, (p.y + q.y) / 2)
  }
  if (closed) ctx.closePath()
  else ctx.lineTo(pts[n - 1].x, pts[n - 1].y)
}

/** Polyline par t (0..1) wala point */
function along(pts, t) {
  const seg = (pts.length - 1) * t
  const i = Math.min(Math.floor(seg), pts.length - 2)
  return mix(pts[i], pts[i + 1], seg - i)
}

function fill(ctx, paths, style, { alpha = 1, blur = 0, mode = 'source-over', evenodd = false, clip = null } = {}) {
  ctx.save()
  if (clip) {
    // rang is shape se bahar na phaile (blur ka kinara bhi)
    ctx.beginPath()
    smoothPath(ctx, clip)
    ctx.clip()
  }
  ctx.globalAlpha = alpha
  ctx.globalCompositeOperation = mode
  if (blur) ctx.filter = `blur(${blur}px)`
  ctx.fillStyle = style
  ctx.beginPath()
  paths.forEach((p) => smoothPath(ctx, p))
  ctx.fill(evenodd ? 'evenodd' : 'nonzero')
  ctx.restore()
}

/* --------------------------------- shapes --------------------------------- */
function shapes(lm, w, h) {
  const P = (i) => ({ x: lm[i].x * w, y: lm[i].y * h })
  const faceW = dist(P(234), P(454))
  const eyes = EYES.map((e) => {
    const upper = e.upper.map(P)
    const lower = e.lower.map(P)
    const browLow = e.browLow.map(P)
    const brow = [...e.browUp.map(P), ...browLow.slice().reverse()]
    const outer = upper[0]
    const inner = upper[upper.length - 1]
    const center = mix(along(upper, 0.5), along(lower, 0.5), 0.5)
    const eyeW = dist(outer, inner)
    // eyeshadow: palak se abroo ki taraf 55% tak
    const lid = upper.map((p, i) => mix(p, along(browLow, i / (upper.length - 1)), 0.55))
    return { upper, lower, brow, browLow, outer, inner, center, eyeW, lid,
      cheek: P(e.cheek), cheekTop: P(e.cheekTop), edge: P(e.edge) }
  })
  return {
    P, faceW, eyes,
    lipsOuter: LIPS_OUTER.map(P),
    lipsInner: LIPS_INNER.map(P),
    oval: FACE_OVAL.map(P),
  }
}

/* -------------------------------- effects --------------------------------- */
function lips(ctx, s, color, { strength = 0.6, gloss = 0, matte = 0 } = {}) {
  const paths = [s.lipsOuter, s.lipsInner.slice().reverse()]
  const b = s.faceW * 0.006
  fill(ctx, paths, color, { alpha: strength, blur: b, mode: 'color', evenodd: true })
  fill(ctx, paths, color, { alpha: strength * 0.55, blur: b, mode: 'multiply', evenodd: true })
  if (matte) fill(ctx, paths, color, { alpha: matte, blur: b, evenodd: true })
  if (gloss) {
    // neeche wale honth par chamak
    const c = mix(s.P(14), s.P(17), 0.45)
    const r = dist(s.P(61), s.P(291)) * 0.22
    ctx.save()
    ctx.globalCompositeOperation = 'screen'
    ctx.globalAlpha = gloss
    ctx.filter = `blur(${s.faceW * 0.01}px)`
    ctx.beginPath()
    ctx.ellipse(c.x, c.y, r, r * 0.32, 0, 0, Math.PI * 2)
    ctx.fillStyle = '#ffffff'
    ctx.fill()
    ctx.restore()
  }
}

function lipLiner(ctx, s, color) {
  ctx.save()
  ctx.strokeStyle = rgba(color, 0.75)
  ctx.lineWidth = s.faceW * 0.009
  ctx.lineJoin = 'round'
  ctx.globalCompositeOperation = 'multiply'
  ctx.filter = `blur(${s.faceW * 0.003}px)`
  ctx.beginPath()
  smoothPath(ctx, s.lipsOuter)
  ctx.stroke()
  ctx.restore()
  lips(ctx, s, color, { strength: 0.18 })
}

function liner(ctx, e, color, { wing = true, width = 0.07 } = {}) {
  const lw = e.eyeW * width
  ctx.save()
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.globalAlpha = 0.9
  ctx.filter = `blur(${Math.max(0.4, lw * 0.12)}px)`
  // andar se bahar patla -> mota
  const pts = e.upper.slice().reverse()
  for (let i = 0; i < pts.length - 1; i++) {
    ctx.lineWidth = lw * (0.45 + 0.55 * (i / (pts.length - 1)))
    ctx.beginPath()
    ctx.moveTo(pts[i].x, pts[i].y)
    ctx.lineTo(pts[i + 1].x, pts[i + 1].y)
    ctx.stroke()
  }
  if (wing) {
    // bahar ke kone se upar ki taraf wing
    const dir = { x: e.outer.x - e.inner.x, y: e.outer.y - e.inner.y }
    const len = Math.hypot(dir.x, dir.y)
    const u = { x: dir.x / len, y: dir.y / len }
    // "upar" = neeche wali palak se upar wali palak ki taraf
    const top = along(e.upper, 0.5)
    const bottom = along(e.lower, 0.5)
    const ul = Math.hypot(top.x - bottom.x, top.y - bottom.y) || 1
    const up = { x: (top.x - bottom.x) / ul, y: (top.y - bottom.y) / ul }
    const tip = { x: e.outer.x + u.x * e.eyeW * 0.32 + up.x * e.eyeW * 0.14, y: e.outer.y + u.y * e.eyeW * 0.32 + up.y * e.eyeW * 0.14 }
    const base = along(e.upper, 0.22)
    ctx.beginPath()
    ctx.moveTo(base.x, base.y)
    ctx.quadraticCurveTo(e.outer.x + up.x * lw * 0.3, e.outer.y + up.y * lw * 0.3, tip.x, tip.y)
    ctx.lineTo(e.outer.x - up.x * lw * 0.4, e.outer.y - up.y * lw * 0.4)
    ctx.closePath()
    ctx.fill()
  }
  ctx.restore()
}

function lashes(ctx, e, color, { length = 0.14, count = 22, width = 0.018 } = {}) {
  // palak ki line thori gehri
  liner(ctx, e, color, { wing: false, width: 0.03 })
  ctx.save()
  ctx.strokeStyle = color
  ctx.lineCap = 'round'
  ctx.globalAlpha = 0.92
  ctx.lineWidth = Math.max(1, e.eyeW * width)
  const outward = { x: e.outer.x - e.inner.x, y: e.outer.y - e.inner.y }
  const ol = Math.hypot(outward.x, outward.y)
  for (let i = 1; i < count; i++) {
    const t = i / count // 0 = bahar ka kona
    const p = along(e.upper, t)
    let n = { x: p.x - e.center.x, y: p.y - e.center.y }
    const nl = Math.hypot(n.x, n.y) || 1
    n = { x: n.x / nl, y: n.y / nl }
    // bahar wali palkein lambi aur bahar ki taraf jhuki
    const lean = (1 - t) * 0.6
    const d = { x: n.x + (outward.x / ol) * lean, y: n.y + (outward.y / ol) * lean }
    const dl = Math.hypot(d.x, d.y)
    const L = e.eyeW * length * (0.65 + 0.6 * (1 - t))
    const end = { x: p.x + (d.x / dl) * L, y: p.y + (d.y / dl) * L }
    const ctrl = { x: p.x + (d.x / dl) * L * 0.6 + (outward.x / ol) * L * 0.25, y: p.y + (d.y / dl) * L * 0.4 }
    ctx.beginPath()
    ctx.moveTo(p.x, p.y)
    ctx.quadraticCurveTo(ctrl.x, ctrl.y, end.x, end.y)
    ctx.stroke()
  }
  ctx.restore()
}

function eyeshadow(ctx, e, color, color2) {
  const region = [...e.upper, ...e.lid.slice().reverse()]
  const b = e.eyeW * 0.12
  let style = color
  if (color2) {
    // palette: andar halka, bahar gehra
    const g = ctx.createLinearGradient(e.inner.x, e.inner.y, e.outer.x, e.outer.y)
    g.addColorStop(0, color)
    g.addColorStop(1, color2)
    style = g
  }
  fill(ctx, [region], style, { alpha: 0.5, blur: b, mode: 'multiply' })
  fill(ctx, [region], style, { alpha: 0.35, blur: b, mode: 'color' })
}

function brows(ctx, e, color) {
  fill(ctx, [e.brow], color, { alpha: 0.5, blur: e.eyeW * 0.04, mode: 'multiply' })
  fill(ctx, [e.brow], color, { alpha: 0.25, blur: e.eyeW * 0.03 })
}

function radial(ctx, c, r, color, alpha, mode, sx = 1, sy = 1, rot = 0) {
  ctx.save()
  ctx.globalCompositeOperation = mode
  ctx.globalAlpha = alpha
  ctx.translate(c.x, c.y)
  ctx.rotate(rot)
  ctx.scale(sx, sy)
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r)
  g.addColorStop(0, rgba(color, 1))
  g.addColorStop(0.55, rgba(color, 0.5))
  g.addColorStop(1, rgba(color, 0))
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(0, 0, r, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function blush(ctx, s, color) {
  s.eyes.forEach((e) => {
    const c = mix(e.cheek, e.cheekTop, 0.35)
    radial(ctx, c, s.faceW * 0.13, color, 0.45, 'multiply', 1.2, 0.85)
    radial(ctx, c, s.faceW * 0.1, color, 0.18, 'source-over', 1.2, 0.85)
  })
}

function contour(ctx, s, color) {
  s.eyes.forEach((e) => {
    // gaal ki haddi ke neeche, kaan se munh ki taraf lambi shade
    const c = mix(e.edge, e.cheek, 0.38)
    const rot = Math.atan2(e.cheek.y - e.edge.y, e.cheek.x - e.edge.x)
    radial(ctx, { x: c.x, y: c.y + s.faceW * 0.03 }, s.faceW * 0.16, color, 0.4, 'multiply', 1, 0.32, rot)
    radial(ctx, mix(e.edge, e.browLow[0], 0.5), s.faceW * 0.09, color, 0.25, 'multiply')
  })
}

function highlight(ctx, s, color) {
  s.eyes.forEach((e) => {
    radial(ctx, mix(e.cheekTop, e.outer, 0.35), s.faceW * 0.075, color, 0.55, 'screen', 1.4, 0.7)
  })
  radial(ctx, mix(s.P(6), s.P(4), 0.5), s.faceW * 0.05, color, 0.35, 'screen', 0.45, 1.6)
}

/** Chehre ka hissa (aankhein, abroo, honth chhor kar) */
function skinPaths(s) {
  return [s.oval, ...s.eyes.map((e) => [...e.upper, ...e.lower.slice().reverse()]).map((p) => p.slice().reverse()),
    ...s.eyes.map((e) => e.brow.slice().reverse()), s.lipsOuter.slice().reverse()]
}

function smoothSkin(ctx, s, video, w, h, amount) {
  ctx.save()
  ctx.beginPath()
  skinPaths(s).forEach((p) => smoothPath(ctx, p))
  ctx.clip('evenodd')
  ctx.globalAlpha = amount
  ctx.filter = `blur(${s.faceW * 0.012}px)`
  ctx.drawImage(video, 0, 0, w, h)
  ctx.restore()
}

function foundation(ctx, s, color, video, w, h, { coverage = 0.35 } = {}) {
  smoothSkin(ctx, s, video, w, h, 0.45)
  fill(ctx, skinPaths(s), color, { alpha: coverage, blur: s.faceW * 0.03, mode: 'soft-light', evenodd: true, clip: s.oval })
  fill(ctx, skinPaths(s), color, { alpha: coverage * 0.35, blur: s.faceW * 0.03, evenodd: true, clip: s.oval })
}

function concealer(ctx, s, color) {
  s.eyes.forEach((e) => {
    const down = e.lower.map((p) => ({ x: p.x, y: p.y + e.eyeW * 0.38 }))
    const area = [...e.lower.slice(1, -1), ...down.slice(1, -1).reverse()]
    fill(ctx, [area], color, { alpha: 0.45, blur: e.eyeW * 0.16, mode: 'soft-light' })
    fill(ctx, [area], color, { alpha: 0.22, blur: e.eyeW * 0.16 })
  })
}

/**
 * Ek frame: video (shisha ki tarah ulta) + makeup.
 * opts: { effect, color, color2, bare }  bare = true ho to sirf video (compare)
 */
export function drawFrame(ctx, video, lm, opts) {
  const w = ctx.canvas.width
  const h = ctx.canvas.height
  ctx.save()
  ctx.clearRect(0, 0, w, h)
  ctx.translate(w, 0)
  ctx.scale(-1, 1) // selfie: shisha
  ctx.drawImage(video, 0, 0, w, h)
  if (lm && !opts.bare) {
    const s = shapes(lm, w, h)
    const c = opts.color
    switch (opts.effect) {
      case 'lipstick': lips(ctx, s, c, { strength: 0.7, matte: 0.18 }); break
      case 'tint': lips(ctx, s, c, { strength: 0.4 }); break
      case 'gloss': lips(ctx, s, c, { strength: 0.35, gloss: 0.45 }); break
      case 'balm': lips(ctx, s, c, { strength: 0.12, gloss: 0.4 }); break
      case 'lipliner': lipLiner(ctx, s, c); break
      case 'mascara': s.eyes.forEach((e) => lashes(ctx, e, c, { length: 0.12, count: 20, width: 0.016 })); break
      case 'lashes': s.eyes.forEach((e) => lashes(ctx, e, c, { length: 0.22, count: 30, width: 0.014 })); break
      case 'liner': s.eyes.forEach((e) => liner(ctx, e, c, { wing: opts.wing !== false })); break
      case 'shadow': s.eyes.forEach((e) => eyeshadow(ctx, e, c)); break
      case 'palette': s.eyes.forEach((e) => eyeshadow(ctx, e, c, opts.color2 || '#5a3f4a')); break
      case 'brows': s.eyes.forEach((e) => brows(ctx, e, c)); break
      case 'blush': blush(ctx, s, c); break
      case 'contour': contour(ctx, s, c); break
      case 'highlight': highlight(ctx, s, c); break
      case 'foundation': foundation(ctx, s, c, video, w, h); break
      case 'concealer': smoothSkin(ctx, s, video, w, h, 0.3); concealer(ctx, s, c); break
      case 'powder': foundation(ctx, s, c, video, w, h, { coverage: 0.18 }); break
      case 'primer': smoothSkin(ctx, s, video, w, h, 0.55); break
      default: break
    }
  }
  ctx.restore()
}
