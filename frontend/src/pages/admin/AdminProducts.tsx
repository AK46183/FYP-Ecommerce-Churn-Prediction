import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus, Edit, Trash2, Package } from 'lucide-react'
import { PageTitle } from '@/components/admin/AdminUI'
import { products, categories, hasVariantPricing, getMinPrice } from '@/data/products'
import { getProductImage } from '@/data/images'

export default function AdminProducts() {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase())
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter
    return matchesSearch && matchesCat
  })

  return (
    <div>
      <PageTitle title="Products" subtitle={`${products.length} products in catalog`} action={<Link to="/admin/products/add" className="btn-accent"><Plus className="h-4 w-4" /> Add Product</Link>} />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1"><Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="input-field pl-10" /></div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="input-field sm:w-48">
          <option value="all">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-800/40">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/[0.06] text-left text-xs font-medium uppercase tracking-wide text-white/40">
              <th className="px-4 py-3">Product</th><th className="px-4 py-3 hidden sm:table-cell">Category</th><th className="px-4 py-3">Price</th><th className="px-4 py-3 hidden md:table-cell">Stock</th><th className="px-4 py-3 hidden lg:table-cell">Rating</th><th className="px-4 py-3 text-right">Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map((p) => {
                const img = getProductImage(p.id)
                const hasVariants = hasVariantPricing(p)
                const minPrice = getMinPrice(p)
                const totalStock = p.variantConfigs?.reduce((sum, c) => sum + c.stock, 0) ?? p.stock
                return (
                  <tr key={p.id} className="border-b border-white/[0.04] transition-colors hover:bg-white/[0.02]">
                    <td className="px-4 py-3"><div className="flex items-center gap-3"><img src={img.main} alt={p.name} className="h-10 w-10 rounded-lg object-cover" /><div><p className="font-medium text-white">{p.name}</p><p className="text-xs text-white/40">{p.brand}</p></div></div></td>
                    <td className="px-4 py-3 hidden sm:table-cell capitalize text-white/60">{p.category}</td>
                    <td className="px-4 py-3 font-medium text-white">{hasVariants && 'From '}${minPrice.toLocaleString()}</td>
                    <td className="px-4 py-3 hidden md:table-cell"><span className={totalStock < 10 ? 'text-amber-400' : 'text-white/60'}>{totalStock}</span></td>
                    <td className="px-4 py-3 hidden lg:table-cell text-white/60">{p.rating} ★</td>
                    <td className="px-4 py-3"><div className="flex items-center justify-end gap-2">
                      <Link to={`/admin/products/${p.id}/edit`} className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:bg-white/[0.04] hover:text-accent-300"><Edit className="h-4 w-4" /></Link>
                      <button className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:bg-rose-500/10 hover:text-rose-400"><Trash2 className="h-4 w-4" /></button>
                    </div></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="flex flex-col items-center py-16 text-center"><Package className="h-8 w-8 text-white/20" /><p className="mt-3 text-sm text-white/40">No products found</p></div>}
      </div>
    </div>
  )
}
