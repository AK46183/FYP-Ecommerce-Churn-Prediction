import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, useOutletContext } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, X, ChevronDown, Check } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import { PageHeader, EmptyState } from '@/components/ui'
import { products, categories, brands, type Product } from '@/data/products'
import { useStore } from '@/context/StoreContext'

type OutletCtx = { openQuickView: (p: Product) => void }

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Best Rated' },
]

export default function Shop() {
  const { openQuickView } = useOutletContext<OutletCtx>()
  const [searchParams, setSearchParams] = useSearchParams()
  const { searchQuery } = useStore()

  const [sortBy, setSortBy] = useState('featured')
  const [showFilters, setShowFilters] = useState(false)
  const [showSort, setShowSort] = useState(false)
  const [filters, setFilters] = useState({
    category: [] as string[],
    brand: [] as string[],
    minPrice: 0,
    maxPrice: 6000,
    rating: 0,
    availability: 'all',
    color: [] as string[],
    storage: [] as string[],
  })

  const filterParam = searchParams.get('filter')

  useEffect(() => {
    if (filterParam === 'new') setFilters((f) => ({ ...f, availability: 'new' }))
    if (filterParam === 'deals') setFilters((f) => ({ ...f, availability: 'deals' }))
  }, [filterParam])

  const filtered = useMemo(() => {
    let result = [...products]
    if (filters.category.length > 0) result = result.filter((p) => filters.category.includes(p.category))
    if (filters.brand.length > 0) result = result.filter((p) => filters.brand.includes(p.brand))
    result = result.filter((p) => p.price >= filters.minPrice && p.price <= filters.maxPrice)
    if (filters.rating > 0) result = result.filter((p) => p.rating >= filters.rating)
    if (filters.availability === 'in-stock') result = result.filter((p) => p.stock > 0)
    if (filters.availability === 'new') result = result.filter((p) => p.isNew)
    if (filters.availability === 'deals') result = result.filter((p) => p.isDeal)
    if (filters.color.length > 0) result = result.filter((p) => p.colors.some((c) => filters.color.includes(c.name)))
    if (filters.storage.length > 0) result = result.filter((p) => p.variants.some((v) => v.name === 'Storage' && v.values.some((val) => filters.storage.includes(val))))
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q))
    }

    switch (sortBy) {
      case 'newest': result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break
      case 'price-low': result.sort((a, b) => a.price - b.price); break
      case 'price-high': result.sort((a, b) => b.price - a.price); break
      case 'rating': result.sort((a, b) => b.rating - a.rating); break
      default: result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
    }
    return result
  }, [filters, sortBy, searchQuery])

  const toggleArrayFilter = (key: 'category' | 'brand' | 'color' | 'storage', value: string) => {
    setFilters((f) => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value],
    }))
  }

  const clearFilters = () => {
    setFilters({ category: [], brand: [], minPrice: 0, maxPrice: 6000, rating: 0, availability: 'all', color: [], storage: [] })
    setSearchParams({})
  }

  const activeFilterCount = filters.category.length + filters.brand.length + filters.color.length + filters.storage.length + (filters.rating > 0 ? 1 : 0) + (filters.availability !== 'all' ? 1 : 0)

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/40">Category</h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer group">
              <button
                onClick={() => toggleArrayFilter('category', cat.slug)}
                className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${filters.category.includes(cat.slug) ? 'border-accent-400 bg-accent-400' : 'border-white/20 group-hover:border-white/40'}`}
              >
                {filters.category.includes(cat.slug) && <Check className="h-3 w-3 text-ink-950" />}
              </button>
              <span className="text-sm text-white/70 group-hover:text-white">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brand */}
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/40">Brand</h4>
        <div className="flex flex-wrap gap-2">
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => toggleArrayFilter('brand', brand)}
              className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-all ${filters.brand.includes(brand) ? 'border-accent-400 bg-accent-400/10 text-accent-300' : 'border-white/10 text-white/50 hover:border-white/25'}`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/40">Price Range</h4>
        <div className="flex items-center gap-2">
          <input type="number" value={filters.minPrice} onChange={(e) => setFilters((f) => ({ ...f, minPrice: +e.target.value }))} className="input-field py-2 text-xs" placeholder="Min" />
          <span className="text-white/30">—</span>
          <input type="number" value={filters.maxPrice} onChange={(e) => setFilters((f) => ({ ...f, maxPrice: +e.target.value }))} className="input-field py-2 text-xs" placeholder="Max" />
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/40">Minimum Rating</h4>
        <div className="flex gap-2">
          {[0, 3, 4, 4.5].map((r) => (
            <button key={r} onClick={() => setFilters((f) => ({ ...f, rating: r }))} className={`rounded-lg border px-3 py-1 text-xs font-medium transition-all ${filters.rating === r ? 'border-accent-400 bg-accent-400/10 text-accent-300' : 'border-white/10 text-white/50 hover:border-white/25'}`}>
              {r === 0 ? 'All' : `${r}+ ★`}
            </button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/40">Availability</h4>
        <div className="flex flex-wrap gap-2">
          {[{ v: 'all', l: 'All' }, { v: 'in-stock', l: 'In Stock' }, { v: 'new', l: 'New Arrivals' }, { v: 'deals', l: 'On Sale' }].map((opt) => (
            <button key={opt.v} onClick={() => setFilters((f) => ({ ...f, availability: opt.v }))} className={`rounded-lg border px-3 py-1 text-xs font-medium transition-all ${filters.availability === opt.v ? 'border-accent-400 bg-accent-400/10 text-accent-300' : 'border-white/10 text-white/50 hover:border-white/25'}`}>
              {opt.l}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/40">Color</h4>
        <div className="flex flex-wrap gap-2">
          {['Black', 'White', 'Blue', 'Silver', 'Gray', 'Red', 'Green'].map((color) => (
            <button key={color} onClick={() => toggleArrayFilter('color', color)} className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-all ${filters.color.includes(color) ? 'border-accent-400 bg-accent-400/10 text-accent-300' : 'border-white/10 text-white/50 hover:border-white/25'}`}>
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Storage */}
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/40">Storage</h4>
        <div className="flex flex-wrap gap-2">
          {['128GB', '256GB', '512GB', '1TB'].map((s) => (
            <button key={s} onClick={() => toggleArrayFilter('storage', s)} className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-all ${filters.storage.includes(s) ? 'border-accent-400 bg-accent-400/10 text-accent-300' : 'border-white/10 text-white/50 hover:border-white/25'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <button onClick={clearFilters} className="w-full rounded-xl border border-white/10 py-2.5 text-sm text-white/50 transition-colors hover:border-rose-500/40 hover:text-rose-400">
          Clear all filters ({activeFilterCount})
        </button>
      )}
    </div>
  )

  return (
    <div>
      <PageHeader title="Shop All Products" subtitle="Discover premium electronics engineered for excellence." breadcrumb="Home / Shop" />

      <div className="container-wide section-pad py-10">
        <div className="flex gap-8">
          {/* Desktop sidebar filters */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-white">Filters</h3>
                {activeFilterCount > 0 && <span className="text-xs text-accent-300">{activeFilterCount} active</span>}
              </div>
              <FilterContent />
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="mb-6 flex items-center justify-between gap-4">
              <p className="text-sm text-white/40">{filtered.length} products</p>
              <div className="flex items-center gap-3">
                <button onClick={() => setShowFilters(true)} className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 lg:hidden">
                  <SlidersHorizontal className="h-4 w-4" /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
                </button>
                <div className="relative">
                  <button onClick={() => setShowSort(!showSort)} className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/70">
                    Sort: {sortOptions.find((s) => s.value === sortBy)?.label}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                  <AnimatePresence>
                    {showSort && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 top-full z-20 mt-2 w-48 rounded-xl border border-white/[0.08] bg-ink-900 p-1.5">
                        {sortOptions.map((opt) => (
                          <button key={opt.value} onClick={() => { setSortBy(opt.value); setShowSort(false) }} className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${sortBy === opt.value ? 'bg-accent-400/10 text-accent-300' : 'text-white/60 hover:bg-white/[0.04]'}`}>
                            {opt.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 xl:grid-cols-3 2xl:grid-cols-4">
                {filtered.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} onQuickView={openQuickView} />
                ))}
              </div>
            ) : (
              <EmptyState icon={SlidersHorizontal} title="No products found" description="Try adjusting your filters or search terms to find what you're looking for." action={<button onClick={clearFilters} className="btn-ghost">Clear filters</button>} />
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] lg:hidden">
            <div className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm" onClick={() => setShowFilters(false)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className="absolute right-0 top-0 h-full w-[85%] max-w-sm overflow-y-auto border-l border-white/[0.08] bg-ink-900 p-6">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold text-white">Filters</h3>
                <button onClick={() => setShowFilters(false)} className="text-white/40"><X className="h-5 w-5" /></button>
              </div>
              <FilterContent />
              <button onClick={() => setShowFilters(false)} className="btn-accent mt-6 w-full">Show {filtered.length} results</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
