import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { PageTitle } from '@/components/admin/AdminUI'
import { getProductById } from '@/data/products'
import { useState } from 'react'

export default function EditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = getProductById(id || '')
  const [form, setForm] = useState({
    name: product?.name || '',
    brand: product?.brand || '',
    price: String(product?.price || ''),
    stock: String(product?.stock || ''),
    shortSpec: product?.shortSpec || '',
    description: product?.description || '',
  })

  const [variantConfigs, setVariantConfigs] = useState(
    (product?.variantConfigs ?? []).map((cfg) => ({
      values: Object.entries(cfg.values).map(([k, v]) => `${k}: ${v}`).join(', '),
      price: String(cfg.price),
      oldPrice: cfg.oldPrice ? String(cfg.oldPrice) : '',
      stock: String(cfg.stock),
      sku: cfg.sku,
    })),
  )

  if (!product) return <div className="text-center py-20"><p className="text-white/40">Product not found</p><Link to="/admin/products" className="btn-ghost mt-4">Back</Link></div>

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); navigate('/admin/products') }

  const updateCfg = (i: number, field: 'price' | 'oldPrice' | 'stock' | 'sku', val: string) =>
    setVariantConfigs((prev) => prev.map((c, idx) => (idx === i ? { ...c, [field]: val } : c)))

  return (
    <div>
      <Link to="/admin/products" className="mb-4 inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70"><ArrowLeft className="h-4 w-4" /> Back to Products</Link>
      <PageTitle title="Edit Product" subtitle={product.name} />
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5 rounded-2xl border border-white/[0.06] bg-ink-800/40 p-6">
        <div><label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/40">Product Name</label><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" /></div>
        <div><label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/40">Brand</label><input required value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="input-field" /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/40">Base Price ($)</label><input type="number" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" /></div>
          <div><label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/40">Base Stock</label><input type="number" required value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input-field" /></div>
        </div>
        <div><label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/40">Short Specification</label><input value={form.shortSpec} onChange={(e) => setForm({ ...form, shortSpec: e.target.value })} className="input-field" /></div>
        <div><label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/40">Description</label><textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field resize-none" /></div>

        {/* Variant configuration editor */}
        {variantConfigs.length > 0 && (
          <div className="border-t border-white/[0.06] pt-5">
            <h3 className="mb-3 text-sm font-semibold text-white">Variant Configurations</h3>
            <p className="mb-4 text-xs text-white/30">Edit price and stock per configuration. Values are shown for reference.</p>
            <div className="space-y-3">
              {variantConfigs.map((cfg, i) => (
                <div key={i} className="rounded-xl border border-white/[0.06] bg-ink-900/40 p-4">
                  <p className="mb-3 text-xs font-medium text-white/60">{cfg.values}</p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div><label className="mb-1 block text-[10px] uppercase tracking-wide text-white/30">Price ($)</label><input type="number" value={cfg.price} onChange={(e) => updateCfg(i, 'price', e.target.value)} className="input-field py-1.5 text-sm" /></div>
                    <div><label className="mb-1 block text-[10px] uppercase tracking-wide text-white/30">Old Price ($)</label><input type="number" value={cfg.oldPrice} onChange={(e) => updateCfg(i, 'oldPrice', e.target.value)} className="input-field py-1.5 text-sm" /></div>
                    <div><label className="mb-1 block text-[10px] uppercase tracking-wide text-white/30">Stock</label><input type="number" value={cfg.stock} onChange={(e) => updateCfg(i, 'stock', e.target.value)} className="input-field py-1.5 text-sm" /></div>
                    <div><label className="mb-1 block text-[10px] uppercase tracking-wide text-white/30">SKU</label><input value={cfg.sku} onChange={(e) => updateCfg(i, 'sku', e.target.value)} className="input-field py-1.5 text-sm" /></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3"><button type="submit" className="btn-accent"><Save className="h-4 w-4" /> Update Product</button><Link to="/admin/products" className="btn-ghost">Cancel</Link></div>
      </form>
    </div>
  )
}
