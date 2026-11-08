// Frontend ke products ko Backend/data/catalog.json mein likhta hai,
// taake backend unhein database mein daal sake (npm run seed:catalog).
// Chalayein (minaysh frontend folder se):  node scripts/export-catalog.mjs ../Backend/data/catalog.json
import { writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const out = resolve(process.argv[2] || resolve(here, '../../Backend/data/catalog.json'))
const { allProducts } = await import(pathToFileURL(resolve(here, '../src/data/products.js')).href)

const catalog = allProducts.map((p) => ({
  sku: p.id,
  name: p.name,
  brand: p.brand || null,
  category: p.category || null,
  subCategory: p.subCategory || null,
  productType: p.productType || null,
  price: typeof p.price === 'number' ? p.price : 0,
  oldPrice: typeof p.oldPrice === 'number' ? p.oldPrice : null,
  image: p.image || null,
  badge: p.badge || null,
  available: p.available !== false && p.draft !== true && p.badge !== 'SOLD OUT',
  // label = wahi text jo website pe option ke taur pe dikhta hai (cart mein "shade" ban kar jata hai)
  variants: (p.variants || []).map((v) => ({
    sku: v.sku || null,
    label: String(v.name || v.title || v.shade || v.size || '').trim() || null,
    shade: v.shade || null,
    size: v.size || null,
    price: typeof v.price === 'number' && v.price > 0 ? v.price : null,
    available: v.available !== false && v.stock !== 0,
  })),
  shades: (p.shades || []).map((s) => (typeof s === 'string' ? s : s?.label || s?.name || null)).filter(Boolean),
}))

writeFileSync(out, JSON.stringify(catalog))
console.log(`✔ ${catalog.length} products -> ${out}`)
