import { Link } from 'react-router-dom'
import { Plus, Tags } from 'lucide-react'
import { PageTitle } from '@/components/admin/AdminUI'
import { categories, getProductsByCategory } from '@/data/products'
import { categoryImages } from '@/data/images'

export default function AdminCategories() {
  return (
    <div>
      <PageTitle title="Categories" subtitle={`${categories.length} product categories`} action={<button className="btn-accent"><Plus className="h-4 w-4" /> Add Category</button>} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => {
          const img = categoryImages[cat.slug as keyof typeof categoryImages]
          const count = getProductsByCategory(cat.slug).length
          return (
            <div key={cat.id} className="group overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-800/40">
              <div className="relative h-32 overflow-hidden"><div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${img})` }} /><div className="absolute inset-0 bg-gradient-to-t from-ink-900 to-transparent" /></div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div><h3 className="font-display text-base font-medium text-white">{cat.name}</h3><p className="mt-0.5 text-xs text-white/40">{count} products</p></div>
                  <Link to={`/admin/products`} className="text-xs text-accent-300 hover:text-accent-200">Edit →</Link>
                </div>
                <p className="mt-2 text-xs text-white/40">{cat.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
