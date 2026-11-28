// ============================================================
// MINAYSH - Virtual try-on: product type -> kaunsa effect aur kaunse rang
// Chehre ke points Google MediaPipe Face Landmarker deta hai (478 points).
// Yeh file sirf "kya lagana hai" batati hai; drawing VirtualTryOn.jsx mein hai.
// ============================================================
import { shadeColor, shadeLabel } from './shadeColor.js'

// effect: drawing function ka naam (VirtualTryOn.jsx), colors: shade na mile to yeh dikhte hain
const LOOKS = {
  Mascara: { effect: 'mascara', colors: ['#141010', '#3b2a22'] },
  'False Lashes': { effect: 'lashes', colors: ['#100c0c'] },
  Eyeliner: { effect: 'liner', colors: ['#121010', '#3b2a22', '#1d3a6b', '#5b1f6b'] },
  Eyeshadow: { effect: 'shadow', colors: ['#b98a7c', '#a35d5d', '#7a5c8a', '#c9a27a', '#5a4038'] },
  'Eyeshadow Palettes': { effect: 'palette', colors: ['#b98a7c', '#a35d5d', '#7a5c8a', '#c9a27a'] },
  'Brow Products': { effect: 'brows', colors: ['#4a3328', '#2f211b', '#6b4631'] },
  Lipstick: { effect: 'lipstick', colors: ['#a3121f', '#b06d73', '#7a2e3b', '#c98f95', '#e0457b', '#8e4a3c'] },
  'Lip Tints': { effect: 'tint', colors: ['#c2334d', '#d6566a', '#b8475a', '#e07a7a'] },
  'Lip Gloss': { effect: 'gloss', colors: ['#e7a1a8', '#d9707f', '#f1c3bd', '#c9576a'] },
  'Lip Liner': { effect: 'lipliner', colors: ['#8e4a4a', '#6e2a22', '#a3555e', '#5b3140'] },
  'Lip Care': { effect: 'balm', colors: ['#f2b8b8'] },
  Blush: { effect: 'blush', colors: ['#e58a93', '#d9707f', '#f0a07a', '#c95f70'] },
  'Bronzers & Contours': { effect: 'contour', colors: ['#8a5a3e', '#6e4a36', '#a06a48'] },
  'Face Highlighters': { effect: 'highlight', colors: ['#fff1d6', '#ffe0c8', '#f6d7b0'] },
  Foundations: { effect: 'foundation', colors: ['#f0d9c2', '#e3c2a3', '#d8ae8c', '#c1916b', '#a8774f', '#7d5434'] },
  Concealers: { effect: 'concealer', colors: ['#f2dcc6', '#e8c9ae', '#d9b294', '#c99a7e'] },
  'Face Powders': { effect: 'powder', colors: ['#ecd3bb', '#dcbb9c', '#c99f7c'] },
  'Face Primers': { effect: 'primer', colors: ['#f4e6dc'] },
  'Makeup Fixers': { effect: 'primer', colors: ['#f4e6dc'] },
}

const FIXED = new Set(['lashes', 'primer'])
const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i

/** Kya is product ka try-on ho sakta hai? */
export function canTryOn(product) {
  return Boolean(product && LOOKS[product.subCategory])
}

/**
 * Product ke liye effect aur shades. Shades product ke naam / shade list se (asli rang mil jaye to),
 * warna is type ke aam rang ("sample" = true).
 * Returns { effect, shades: [{ label, color }], sample }
 */
export function tryOnLook(product) {
  const look = LOOKS[product?.subCategory]
  if (!look) return null
  const sub = product.subCategory
  const found = []
  const seen = new Set()
  const add = (label, color) => {
    if (!color || !HEX.test(color) || seen.has(color.toLowerCase())) return
    seen.add(color.toLowerCase())
    found.push({ label, color })
  }
  for (const opt of product.shades || []) {
    const label = shadeLabel(opt)
    add(label, (opt && typeof opt === 'object' && (opt.color || opt.hex)) || shadeColor(label, sub))
  }
  if (!found.length && / [-–] /.test(product.name || '')) {
    // "ST London - Velvet Matt Lipstick - Hyper Brown" -> aakhri hissa shade ka naam (brand ka naam nahi, "Miss Rose" != rose)
    const last = String(product.name).split(/ [-–] /).pop().replace(new RegExp(String(product.brand || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), '')
    add('This shade', shadeColor(last, sub))
  }
  // in ka rang hamesha type wala (palkein kaali, primer / fixer be-rang)
  if (FIXED.has(look.effect)) found.length = 0
  if (found.length) return { effect: look.effect, shades: found.slice(0, 12), sample: false }
  return { effect: look.effect, shades: look.colors.map((color, i) => ({ label: `Sample ${i + 1}`, color })), sample: true }
}
