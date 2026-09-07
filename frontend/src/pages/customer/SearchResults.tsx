import { useSearchParams, useOutletContext, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, SearchX } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import { PageHeader, EmptyState } from '@/components/ui'
import { searchProducts } from '@/data/products'
import type { Product } from '@/data/products'

type OutletCtx = { openQuickView: (p: Product) => void }

export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const { openQuickView } = useOutletContext<OutletCtx>()
  const results = query ? searchProducts(query) : []

  return (
    <div>
      <PageHeader
        title={query ? `Results for "${query}"` : 'Search'}
        subtitle={results.length > 0 ? `${results.length} products found` : 'Search across our entire catalog'}
        breadcrumb="Home / Search"
      />
      <div className="container-wide section-pad py-12">
        {results.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} onQuickView={openQuickView} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={query ? SearchX : Search}
            title={query ? 'No results found' : 'Start searching'}
            description={query ? `We couldn't find any products matching "${query}". Try different keywords.` : 'Use the search bar above to find products.'}
            action={<Link to="/shop" className="btn-ghost">Browse all products</Link>}
          />
        )}
      </div>
    </div>
  )
}
