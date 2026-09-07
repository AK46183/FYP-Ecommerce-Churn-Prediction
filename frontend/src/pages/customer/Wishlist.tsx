import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import { PageHeader, EmptyState } from '@/components/ui'
import { useStore } from '@/context/StoreContext'
import { getProductById } from '@/data/products'
import type { Product } from '@/data/products'

export default function Wishlist() {
  const { wishlist } = useStore()
  const items = wishlist.map((id) => getProductById(id)).filter(Boolean) as Product[]

  return (
    <div>
      <PageHeader title="Wishlist" subtitle={items.length > 0 ? `${items.length} saved items` : 'Your saved products will appear here'} breadcrumb="Home / Wishlist" />
      <div className="container-wide section-pad py-12">
        {items.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Heart}
            title="Your wishlist is empty"
            description="Save products you love by tapping the heart icon. They'll show up here for easy access."
            action={<Link to="/shop" className="btn-accent"><ShoppingBag className="h-4 w-4" /> Start Shopping</Link>}
          />
        )}
      </div>
    </div>
  )
}
