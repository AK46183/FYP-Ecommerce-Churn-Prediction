// Bundle deal: koi bhi 3 alag products = 1 bundle = PKR 1,000 off.
// Har bundle ka total kam az kam PKR 3,000. Frontend (src/utils/bundleDeal.js) sirf dikhata hai; order yahan se banta hai.
const BUNDLE_SIZE = 3;
const BUNDLE_OFF = 1000;
const BUNDLE_MIN_TOTAL = 3000;

/** lines: [{ product: { id }, price, quantity }] -> { bundles, discount } */
const bundleDeal = (lines = []) => {
  const distinct = new Set(lines.map((l) => l.product.id)).size;
  const subtotal = lines.reduce((s, l) => s + l.price * l.quantity, 0);
  const bundles = Math.min(Math.floor(distinct / BUNDLE_SIZE), Math.floor(subtotal / BUNDLE_MIN_TOTAL));
  return { bundles, discount: Math.min(subtotal, bundles * BUNDLE_OFF) };
};

module.exports = { bundleDeal, BUNDLE_SIZE, BUNDLE_OFF, BUNDLE_MIN_TOTAL };
