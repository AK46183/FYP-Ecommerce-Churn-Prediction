// ============================================================
// MINAYSH - shade name -> swatch colour
//
// Product data has shade NAMES only ("Black", "115 Ivory",
// "Dusty Pink"). This turns a name into a display colour.
// If nothing matches it returns null and the swatch shows the
// shade number instead of a fake colour.
// ============================================================

// Order matters: more specific words first.
const COLOR_WORDS = [
  ['black brown', '#2f211b'],
  ['dark brown', '#4a2f23'],
  ['medium brown', '#6b4631'],
  ['light brown', '#9a6b4f'],
  ['soft brown', '#8a6450'],
  ['dark cherry', '#5b1320'],
  ['cardinal red', '#a3121f'],
  ['antique red', '#8e2a2a'],
  ['red chocolate', '#6e2a22'],
  ['cocoa plum', '#5b3140'],
  ['antique rose', '#b06d73'],
  ['dusty pink', '#c98f95'],
  ['soft pink', '#f0b8c0'],
  ['light pink', '#f5c6cf'],
  ['pale pink', '#f4d0d4'],
  ['hot pink', '#e0457b'],
  ['raspberry', '#b3264f'],
  ['rasberry', '#b3264f'],
  ['nude cream', '#e6c3ae'],
  ['warm nude', '#c99a7e'],
  ['natural beige', '#d9b294'],
  ['light beige', '#e8c9ae'],
  ['warm beige', '#d8ae8c'],
  ['silky beige', '#e3c2a3'],
  ['soft tan', '#c1916b'],
  ['sun beige', '#c79a74'],
  ['classic ivory', '#f0d9c2'],
  ['porcelain', '#f6e3d3'],
  ['procelain', '#f6e3d3'],
  ['transparent', '#f4ece6'],
  ['translucent', '#f4ece6'],
  ['clear', '#f1ede9'],
  ['ruby', '#9b1b30'],
  ['garnet', '#7b1e2a'],
  ['cranberry', '#8e1f3a'],
  ['scarlet', '#c21a2b'],
  ['crimson', '#a3172c'],
  ['rouge', '#b3263a'],
  ['vamp', '#4a1426'],
  ['mulberry', '#6b2345'],
  ['fig', '#6a3a4a'],
  ['mahogany', '#6b2e23'],
  ['redwood', '#8b3a2f'],
  ['brick', '#9c3d2e'],
  ['terracotta', '#c0673f'],
  ['rust', '#a4472a'],
  ['auburn', '#8a3b24'],
  ['cinnamon', '#9a5836'],
  ['spice', '#a0522d'],
  ['chestnut', '#6f3d26'],
  ['hazelnut', '#8e6243'],
  ['mocha', '#7b5645'],
  ['cappuccino', '#9b7458'],
  ['latte', '#c8a07e'],
  ['toffee', '#a0703f'],
  ['almond', '#d8b38f'],
  ['cafe', '#6f4e37'],
  ['blonde', '#c9a36b'],
  ['cream', '#f2e3cc'],
  ['milk', '#f4ece2'],
  ['salmon', '#f28b74'],
  ['papaya', '#f47c5a'],
  ['mango', '#f2a24a'],
  ['sunset', '#e97451'],
  ['flamingo', '#f08aa0'],
  ['bubblegum', '#f28fb4'],
  ['candy', '#e8618c'],
  ['blossom', '#f2a6b8'],
  ['orchid', '#b565a7'],
  ['blush', '#e7a0a0'],
  ['rosa', '#e28aa0'],
  ['black', '#161616'],
  ['white', '#f7f7f5'],
  ['ivory', '#f2dfcb'],
  ['beige', '#dcb898'],
  ['nude', '#d6aa8f'],
  ['sand', '#d8b590'],
  ['buff', '#d5ad8a'],
  ['honey', '#c48a55'],
  ['caramel', '#b0713f'],
  ['tan', '#b8875f'],
  ['wheat', '#dcb98f'],
  ['vanilla', '#f0dcc2'],
  ['natural', '#d7aa88'],
  ['golden', '#c9994f'],
  ['gold', '#c8a24a'],
  ['bronze', '#9c6b3f'],
  ['sunbronze', '#9c6b3f'],
  ['sunlight', '#d6a46a'],
  ['copper', '#b0643a'],
  ['champagne', '#ead3b0'],
  ['stardust', '#e9dccf'],
  ['candlelit', '#e8c79b'],
  ['diamond', '#eef0f3'],
  ['pearl', '#efe8e0'],
  ['silver', '#c9cbcf'],
  ['chocolate', '#5a3526'],
  ['cocoa', '#6b4533'],
  ['coffee', '#5d4031'],
  ['espresso', '#3c2a22'],
  ['brown', '#6d4834'],
  ['taupe', '#8b7568'],
  ['grey', '#8a8a8a'],
  ['gray', '#8a8a8a'],
  ['cherry', '#8f1d2c'],
  ['burgundy', '#6d1a2a'],
  ['bourgogne', '#6d1a2a'],
  ['wine', '#6a1f33'],
  ['berry', '#8c2b4b'],
  ['plum', '#6b2d4a'],
  ['mauve', '#a77b8b'],
  ['coral', '#ef7c6c'],
  ['peach', '#f3b393'],
  ['apricot', '#f2a97e'],
  ['orange', '#ee7d3b'],
  ['red', '#c0202e'],
  ['rose', '#d7858f'],
  ['pink', '#ec9fb2'],
  ['fuchsia', '#c2257a'],
  ['magenta', '#b0237a'],
  ['lilac', '#c1a3d4'],
  ['lavender', '#b8a4d9'],
  ['purple', '#6e3b8c'],
  ['violet', '#6b3fa0'],
  ['navy', '#1f2b5c'],
  ['blue', '#1c5fb8'],
  ['teal', '#1d5b5a'],
  ['turquoise', '#2aa3a0'],
  ['green', '#2e6b45'],
  ['emerald', '#136b4f'],
  ['emeraude', '#136b4f'],
  ['khaki', '#8a8455'],
  ['olive', '#6b6b35'],
  ['yellow', '#e8c23a'],
]

// Foundations / concealers / powders are often named only by number:
// 1xx = light, 2xx = medium, 3xx = tan, 4xx+ = deep
const TONE_BY_FIRST_DIGIT = {
  0: '#f3dfcc',
  1: '#ecceb3',
  2: '#d9ad8a',
  3: '#bf8b64',
  4: '#9c6a48',
  5: '#7a4d33',
}

const BASE_CATEGORIES = [
  'foundations',
  'concealers',
  'face powders',
  'face primers',
  'bronzers & contours',
]

export function shadeLabel(option) {
  if (!option) return ''
  if (typeof option === 'string') return option.trim()
  return String(option.name || option.title || option.shade || option.size || '').trim()
}

export function shadeColor(name, subCategory = '') {
  const text = String(name || '').toLowerCase()
  if (!text) return null

  if (option_isHex(text)) return text

  for (const [word, hex] of COLOR_WORDS) {
    if (new RegExp(`\\b${word}\\b`).test(text)) return hex
  }

  const sub = String(subCategory || '').toLowerCase()
  const number = text.match(/\b(\d{2,3})\b/)
  if (number && BASE_CATEGORIES.includes(sub)) {
    const digits = number[1].padStart(3, '0')
    return TONE_BY_FIRST_DIGIT[digits[0]] || null
  }

  return null
}

function option_isHex(text) {
  return /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/.test(text)
}

// Short text shown inside a swatch that has no colour ("403", "F5", "P5")
export function shadeShortCode(name) {
  const text = String(name || '').trim()
  const code = text.match(/\b([A-Za-z]?\d{1,3})\b/)
  if (code) return code[1].toUpperCase()
  return text.slice(0, 2).toUpperCase()
}

// Light swatches need a dark tick / text
export function isLightColor(hex) {
  if (!hex) return true
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const r = parseInt(full.slice(0, 2), 16)
  const g = parseInt(full.slice(2, 4), 16)
  const b = parseInt(full.slice(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 170
}