import { allProducts, skinCareProducts, makeupProducts, hairProducts } from './products.js'
import { API_URL } from '../services/api.js'

const CATEGORY_KEY = (p) => {
  if (String(p.sku).startsWith('sun-')) return 'sunCare'
  const n = String(p.Category?.name || p.category || '').toLowerCase().replace(/\s+/g, '')
  if (n === 'skincare') return 'skinCare'
  if (n === 'suncare') return 'sunCare'
  return n
}

function toFrontendProduct(p) {
  const image = p.imageUrl || '/images/products/product-placeholder.svg'
  const price = Number(p.price) || 0
  const oldPrice = p.oldPrice ? Number(p.oldPrice) : null
  const variants = Array.isArray(p.variants) ? p.variants : []
  return {
    id: p.sku,
    brand: p.brand || '',
    name: p.name,
    tagline: p.brand || '',
    category: CATEGORY_KEY(p),
    subCategory: p.subCategory || '',
    productType: p.productType || null,
    price,
    oldPrice,
    currency: 'PKR',
    rating: 0,
    reviews: 0,
    badge: p.badge || (oldPrice && oldPrice > price ? 'SALE' : null),
    available: p.available !== false && price > 0,
    image,
    gallery: [image],
    shades: [],
    sizes: variants.map((v) => v.size).filter(Boolean),
    variants: variants.map((v) => ({
      sku: v.sku,
      name: v.label || v.size || '',
      size: v.size || null,
      price: Number(v.price) || price,
      available: v.available !== false,
    })),
    description: p.description || '',
    fromServer: true,
  }
}

export async function loadServerProducts(timeoutMs = 4000) {
  try {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), timeoutMs)
    const res = await fetch(`${API_URL}/products`, { signal: ctrl.signal })
    clearTimeout(t)
    if (!res.ok) {
      console.warn('[loadServerProducts] API status', res.status)
      return
    }
    const body = await res.json()
    const rows = Array.isArray(body) ? body : body.data
    if (!Array.isArray(rows)) return

    const byId = new Map(allProducts.map((p) => [p.id, p]))
    let added = 0
    for (const row of rows) {
      if (!row.sku) continue
      const existing = byId.get(row.sku)
      if (existing) {
        const price = Number(row.price)
        if (price > 0) existing.price = price
        existing.oldPrice = row.oldPrice ? Number(row.oldPrice) : existing.oldPrice ?? null
        if (row.available === false) existing.available = false
        else if (existing.available === false && price > 0) existing.available = true
        continue
      }
      const fp = toFrontendProduct(row)
      if (!fp.category) continue
      added++
      allProducts.push(fp)
      if (fp.category === 'skinCare' || fp.category === 'sunCare') skinCareProducts.push(fp)
      else if (fp.category === 'makeup') makeupProducts.push(fp)
      else if (fp.category === 'hair') hairProducts.push(fp)
    }
    console.log(`[loadServerProducts] ${rows.length} rows, ${added} naye products add hue`)
  } catch (e) {
    console.warn('[loadServerProducts] backend se products nahi aaye, static data use ho raha hai:', e?.message || e)
  }
}