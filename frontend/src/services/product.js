export function hasValidPrice(product) {
  return (
    typeof product?.price === 'number' &&
    Number.isFinite(product.price) &&
    product.price > 0
  )
}

export function isPurchasable(product) {
  return (
    hasValidPrice(product) &&
    product.draft !== true &&
    product.available !== false &&
    product.badge !== 'SOLD OUT'
  )
}