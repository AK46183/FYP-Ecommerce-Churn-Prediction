import { noBgImages } from './noBgImages.js' // MINAYSH_NOBG_IMAGES_V1
import { makeupCityVerified } from './makeupCityVerified.js' // MINAYSH_MAKEUPCITY_VERIFIED_PRICES_V2
// ============================================================
// MINAYSH - Central product catalog
// Every page (home, listing, details, cart, admin) reads from here.
// ============================================================

// ---------- Skin care ----------
import { makeupCitySunCareProducts } from './products/skincare/sunCare/sunscreen.js'
import { minayshDayCreamBatch02Products } from './products/skincare/moisturizers/dayCream.js'
import { minayshNightCreamBatch02Products } from './products/skincare/moisturizers/nightCream.js'
import { minayshMasksBatch02Products } from './products/skincare/treatments/masks.js'
import { minayshEyeCareBatch02Products } from './products/skincare/treatments/eyeCare.js'
import { minayshSerumsBatch02Products } from './products/skincare/treatments/serums.js'
import { minayshFaceWashBatchProducts } from './products/skincare/cleansers/faceWash.js'
import { minayshExfoliatorBatchProducts } from './products/skincare/cleansers/exfoliators.js'

// ---------- Makeup: eyes ----------
import { mascaraProducts } from './products/makeup/eyes/mascara.js'
import { eyelinerProducts } from './products/makeup/eyes/eyeliner.js'
import { falseLashProducts } from './products/makeup/eyes/falseLashes.js'
import { eyeshadowProducts } from './products/makeup/eyes/eyeshadow.js'
import { browProducts } from './products/makeup/eyes/brows.js'
import { eyeshadowPaletteProducts } from './products/makeup/palettes/eyeshadowPalettes.js'

// ---------- Makeup: face ----------
import { makeupFixerProducts } from './products/makeup/face/makeupFixers.js'
import { highlighterProducts } from './products/makeup/face/highlighters.js'
import { blushProducts } from './products/makeup/face/blush.js'
import { facePowderProducts } from './products/makeup/face/facePowders.js'
import { facePrimerProducts } from './products/makeup/face/facePrimers.js'
import { bronzerProducts } from './products/makeup/face/bronzers.js'
import { concealerProducts } from './products/makeup/face/concealers.js'
import { foundationProducts } from './products/makeup/face/foundations.js'

// ---------- Makeup: lips + hands ----------
import { lipstickProducts } from './products/makeup/lips/lipstick.js'
import { lipGlossProducts } from './products/makeup/lips/lipGloss.js'
import { lipLinerProducts } from './products/makeup/lips/lipLiner.js'
import { lipCareProducts } from './products/makeup/lips/lipCare.js'
import { lipTintProducts } from './products/makeup/lips/lipTints.js'
import { nailPolishProducts } from './products/makeup/hands/nailPolish.js'

// ---------- Hair ----------
import { shampooProducts } from './products/hair/shampoo.js'
import { conditionerProducts } from './products/hair/conditioner.js'
import { hairOilProducts } from './products/hair/hairOils.js'
import { hairTreatmentProducts } from './products/hair/hairTreatments.js'

// ---------- Accessories + fragrances ----------
import { makeupAccessoriesProducts } from './products/accessories/makeupAccessories.js'
import { forHerMistProducts } from './products/fragrances/forHerMists.js'

export const skinCareProducts = [
  ...makeupCitySunCareProducts,
  ...minayshDayCreamBatch02Products,
  ...minayshNightCreamBatch02Products,
  ...minayshMasksBatch02Products,
  ...minayshEyeCareBatch02Products,
  ...minayshSerumsBatch02Products,
  ...minayshFaceWashBatchProducts,
  ...minayshExfoliatorBatchProducts,
]

export const makeupProducts = [
  // Eyes
  ...mascaraProducts,
  ...eyelinerProducts,
  ...falseLashProducts,
  ...eyeshadowProducts,
  ...eyeshadowPaletteProducts,
  ...browProducts,

  // Face
  ...makeupFixerProducts,
  ...highlighterProducts,
  ...blushProducts,
  ...facePowderProducts,
  ...facePrimerProducts,
  ...bronzerProducts,
  ...concealerProducts,
  ...foundationProducts,

  // Lips
  ...lipstickProducts,
  ...lipGlossProducts,
  ...lipLinerProducts,
  ...lipCareProducts,
  ...lipTintProducts,

  // Hands
  ...nailPolishProducts,
]

export const hairProducts = [
  ...shampooProducts,
  ...conditionerProducts,
  ...hairOilProducts,
  ...hairTreatmentProducts,
]

export const allProducts = [
  ...skinCareProducts,
  ...makeupProducts,
  ...hairProducts,
  ...makeupAccessoriesProducts,
  ...forHerMistProducts,
]

export function getProductById(id) {
  return allProducts.find((p) => p.id === id)
}

// ---------- "You May Also Like": similar products ----------
// Groups of sub-categories that belong together (lipstick ↔ lip gloss, etc.)
const RELATED_GROUPS = [
  ['Foundations', 'Concealers', 'Face Primers', 'Face Powders', 'Makeup Fixers'],
  ['Blush', 'Bronzers & Contours', 'Face Highlighters'],
  ['Lipstick', 'Lip Gloss', 'Lip Liner', 'Lip Tints', 'Lip Care'],
  ['Mascara', 'Eyeliner', 'False Lashes', 'Eyeshadow', 'Eyeshadow Palettes', 'Brow Products'],
  ['Face Wash', 'Exfoliators', 'Serums', 'Masks', 'Eye Care', 'Day Cream', 'Night Cream', 'Sunscreen'],
  ['Shampoo', 'Conditioner', 'Hair Oils & Serums', 'Hair Treatments'],
]

const STOP_WORDS = new Set(['the', 'and', 'with', 'for', 'of', 'ml', 'g', 'spf', 'new', 'pro', 'up', 'to'])

function nameWords(product) {
  const brand = String(product.brand || '').toLowerCase()
  return new Set(
    String(product.name || '')
      .toLowerCase()
      .replace(/[^a-z\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOP_WORDS.has(w) && !brand.includes(w))
  )
}

function groupOf(subCategory) {
  return RELATED_GROUPS.findIndex((g) => g.includes(subCategory))
}

function similarityScore(base, p, baseWords, baseGroup) {
  let score = 0
  if (p.subCategory === base.subCategory) score += 1
  else if (baseGroup !== -1 && groupOf(p.subCategory) === baseGroup) score += 1
  else if (p.category === base.category) score += 1 // same section, only used if nothing closer exists
  else return 0 // different section (e.g. hair for a lipstick) never shows

  // shared words in the name ("matte", "velvet", "liquid" ...)
  const words = nameWords(p)
  baseWords.forEach((w) => { if (words.has(w)) score += 8 })

  if (p.brand && p.brand === base.brand) score += 6 // same brand

  // similar price range
  if (base.price > 0 && p.price > 0) {
    const ratio = Math.min(base.price, p.price) / Math.max(base.price, p.price)
    score += Math.round(ratio * 10)
  }

  if (p.price > 0 && p.draft !== true && p.available !== false) score += 5 // buyable products first
  return score
}

// 3 = same type, 2 = close type, 1 = same section
function tier(base, p, baseGroup) {
  if (p.subCategory === base.subCategory) return 3
  if (baseGroup !== -1 && groupOf(p.subCategory) === baseGroup) return 2
  return 1
}

export function getRelatedProducts(product, count = 4) {
  if (!product) return []
  const baseWords = nameWords(product)
  const baseGroup = groupOf(product.subCategory)

  return allProducts
    .filter((p) => p.id !== product.id)
    .map((p) => ({ p, score: similarityScore(product, p, baseWords, baseGroup) }))
    .filter((x) => x.score > 0)
    // closest type first, then by score
    .sort((a, b) => tier(product, b.p, baseGroup) - tier(product, a.p, baseGroup) || b.score - a.score)
    .slice(0, count)
    .map((x) => x.p)
}
// MINAYSH_MAKEUPCITY_VERIFIED_PRICES_V2: apply verified Makeup City prices
for (const p of allProducts) {
  const verified = makeupCityVerified[String(p.id)]
  if (verified) Object.assign(p, verified)
}

// MINAYSH_NOBG_IMAGES_V1: use background-removed product images
for (const p of allProducts) {
  if (noBgImages[p.image]) p.image = noBgImages[p.image]
  if (Array.isArray(p.gallery)) p.gallery = p.gallery.map((src) => noBgImages[src] || src)
}

// MINAYSH_NO_COMING_SOON: hide the old "COMING SOON" badge on every product
for (const p of allProducts) {
  if (p.badge === 'COMING SOON') p.badge = null
}
