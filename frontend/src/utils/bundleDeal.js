// Bundle deal: koi bhi 3 alag products = 1 bundle = PKR 1,000 off.
// Har bundle ka total kam az kam PKR 3,000 hona chahiye (taa ke 1,000 off sasti cheezon par na lage).
// Yahi rule backend (Backend/src/services/bundleDeal.service.js) bhi lagata hai; asli hisaab wahi karta hai.
export const BUNDLE_SIZE = 3
export const BUNDLE_OFF = 1000
export const BUNDLE_MIN_TOTAL = 3000
export const BUNDLE_MAX_ITEMS = 6

/** Cart items -> { bundles, discount } */
export function bundleDeal(items = []) {
  const distinct = new Set(items.map((it) => it.id)).size
  const subtotal = items.reduce((s, it) => s + (Number(it.price) || 0) * (Number(it.quantity) || 0), 0)
  const bundles = Math.min(Math.floor(distinct / BUNDLE_SIZE), Math.floor(subtotal / BUNDLE_MIN_TOTAL))
  return { bundles, discount: Math.min(subtotal, bundles * BUNDLE_OFF) }
}
