import { useParams, useOutletContext, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import { PageHeader, EmptyState } from '@/components/ui'
import { getCategoryBySlug, getProductsByCategory, categories } from '@/data/products'
import { categoryImages } from '@/data/images'
import type { Product } from '@/data/products'

type OutletCtx = { openQuickView: (p: Product) => void }

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const { openQuickView } = useOutletContext<OutletCtx>()

  const category = getCategoryBySlug(slug || '')
  const products = getProductsByCategory(slug || '')

  if (!category) {
    return (
      <PageHeader title="Category Not Found" breadcrumb="Home / Category">
        <EmptyState icon={ChevronRight} title="This category doesn't exist" description="Browse all categories from the shop page." action={<Link to="/shop" className="btn-ghost">Go to Shop</Link>} />
      </PageHeader>
    )
  }

  const img = categoryImages[slug as keyof typeof categoryImages]

  return (
    <div>
      {/* Hero banner */}
      <div className="relative h-[40vh] min-h-[300px] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${img})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/60 to-ink-950/30" />
        <div className="relative z-10 flex h-full items-end">
          <div className="container-wide section-pad pb-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
              <p className="mb-3 text-sm text-white/40">Home / Categories / {category.name}</p>
              <h1 className="heading-lg text-white">{category.name}</h1>
              <p className="mt-3 max-w-xl text-white/50">{category.description}</p>
              <p className="mt-2 text-sm text-accent-300/80">{products.length} products available</p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container-wide section-pad py-12">
        {/* Other categories */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.filter((c) => c.slug !== slug).map((cat) => (
            <Link key={cat.id} to={`/category/${cat.slug}`} className="rounded-full border border-white/[0.08] px-4 py-2 text-sm text-white/50 transition-colors hover:border-accent-400/40 hover:text-accent-300">
              {cat.name}
            </Link>
          ))}
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} onQuickView={openQuickView} />
            ))}
          </div>
        ) : (
          <EmptyState icon={ChevronRight} title="No products yet" description="Products in this category are coming soon." />
        )}
      </div>
    </div>
  )
}
