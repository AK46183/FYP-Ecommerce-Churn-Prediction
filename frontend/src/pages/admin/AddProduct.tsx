import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react'
import { PageTitle } from '@/components/admin/AdminUI'
import { categories, brands } from '@/data/products'
import { useState } from 'react'

interface VariantRow {
  values: string
  price: string
  stock: string
  sku: string
}

export default function AddProduct() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', brand: 'Apple', category: 'smartphones', price: '', oldPrice: '', stock: '', shortSpec: '', description: '' })
  const [variantDimensions, setVariantDimensions] = useState<{ name: string; values: string }[]>([])
  const [variantRows, setVariantRows] = useState<VariantRow[]>([])

  const addDimension = () => setVariantDimensions((prev) => [...prev, { name: '', values: '' }])
  const removeDimension = (i: number) => setVariantDimensions((prev) => prev.filter((_, idx) => idx !== i))
  const updateDimension = (i: number, field: 'name' | 'values', val: string) =>
    setVariantDimensions((prev) => prev.map((d, idx) => (idx === i ? { ...d, [field]: val } : d)))

  const addVariantRow = () => setVariantRows((prev) => [...prev, { values: '', price: '', stock: '', sku: '' }])
  const removeVariantRow = (i: number) => setVariantRows((prev) => prev.filter((_, idx) => idx !== i))
  const updateVariantRow = (i: number, field: keyof VariantRow, val: string) =>
    setVariantRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, [field]: val } : r)))

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); navigate('/admin/products') }

  return (
    <div>
      <Link to="/admin/products" className="mb-4 inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70"><ArrowLeft className="h-4 w-4" /> Back to Products</Link>
      <PageTitle title="Add Product" subtitle="Create a new product listing" />
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5 rounded-2xl border border-white/[0.06] bg-ink-800/40 p-6">
        <div><label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/40">Product Name</label><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="e.g. iPhone 17 Pro" /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/40">Brand</label><select value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="input-field">{brands.map((b) => <option key={b} value={b}>{b}</option>)}</select></div>
          <div><label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/40">Category</label><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">{categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}</select></div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div><label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/40">Base Price ($)</label><input type="number" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" /></div>
          <div><label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/40">Old Price ($)</label><input type="number" value={form.oldPrice} onChange={(e) => setForm({ ...form, oldPrice: e.target.value })} className="input-field" /></div>
          <div><label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/40">Base Stock</label><input type="number" required value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input-field" /></div>
        </div>
        <div><label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/40">Short Specification</label><input value={form.shortSpec} onChange={(e) => setForm({ ...form, shortSpec: e.target.value })} className="input-field" placeholder="e.g. A19 Pro · 6.3 OLED · 48MP Camera" /></div>
        <div><label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/40">Description</label><textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field resize-none" /></div>

        {/* Variant dimensions */}
        <div className="border-t border-white/[0.06] pt-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Variant Dimensions</h3>
            <button type="button" onClick={addDimension} className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/60 hover:border-accent-400/40 hover:text-accent-300"><Plus className="h-3.5 w-3.5" /> Add Dimension</button>
          </div>
          <p className="mb-3 text-xs text-white/30">e.g. Dimension Name: "Storage", Values: "256GB, 512GB, 1TB" (comma-separated)</p>
          {variantDimensions.map((dim, i) => (
            <div key={i} className="mb-2 flex gap-2">
              <input value={dim.name} onChange={(e) => updateDimension(i, 'name', e.target.value)} placeholder="Dimension name" className="input-field flex-1" />
              <input value={dim.values} onChange={(e) => updateDimension(i, 'values', e.target.value)} placeholder="Comma-separated values" className="input-field flex-[2]" />
              <button type="button" onClick={() => removeDimension(i)} className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white/40 hover:border-rose-500/40 hover:text-rose-400"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>

        {/* Variant configurations */}
        {variantDimensions.length > 0 && (
          <div className="border-t border-white/[0.06] pt-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Variant Configurations</h3>
              <button type="button" onClick={addVariantRow} className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/60 hover:border-accent-400/40 hover:text-accent-300"><Plus className="h-3.5 w-3.5" /> Add Config</button>
            </div>
            <p className="mb-3 text-xs text-white/30">Each combination needs its own price, stock, and SKU. Values must match dimension values exactly (comma-separated, same order as dimensions).</p>
            {variantRows.map((row, i) => (
              <div key={i} className="mb-2 grid grid-cols-[1fr_80px_80px_120px_40px] gap-2">
                <input value={row.values} onChange={(e) => updateVariantRow(i, 'values', e.target.value)} placeholder="e.g. 256GB" className="input-field" />
                <input type="number" value={row.price} onChange={(e) => updateVariantRow(i, 'price', e.target.value)} placeholder="Price" className="input-field" />
                <input type="number" value={row.stock} onChange={(e) => updateVariantRow(i, 'stock', e.target.value)} placeholder="Stock" className="input-field" />
                <input value={row.sku} onChange={(e) => updateVariantRow(i, 'sku', e.target.value)} placeholder="SKU" className="input-field" />
                <button type="button" onClick={() => removeVariantRow(i)} className="flex items-center justify-center rounded-lg border border-white/10 text-white/40 hover:border-rose-500/40 hover:text-rose-400"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3"><button type="submit" className="btn-accent"><Save className="h-4 w-4" /> Save Product</button><Link to="/admin/products" className="btn-ghost">Cancel</Link></div>
      </form>
    </div>
  )
}
