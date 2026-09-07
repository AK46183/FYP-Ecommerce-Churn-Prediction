import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { categories, getProductsByCategory } from '@/data/products'
import { categoryImages } from '@/data/images'
import { trackEvent } from '@/services/tracking'

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {categories.map((cat, i) => {
        const products = getProductsByCategory(cat.slug)
        const img = categoryImages[cat.slug as keyof typeof categoryImages]
        return (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: (i % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className={i === 0 || i === 5 ? 'col-span-2 sm:col-span-1' : ''}
          >
            <Link
              to={`/category/${cat.slug}`}
              onClick={() => trackEvent('product_click', { category: cat.slug, action: 'category_view' })}
              className="group relative block aspect-[4/5] overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-800"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.2s] ease-premium group-hover:scale-110"
                style={{ backgroundImage: `url(${img})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" />

              {/* Animated label */}
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-accent-300/80">
                  {products.length} products
                </p>
                <h3 className="mt-1 font-display text-lg font-semibold tracking-tight text-white sm:text-xl">
                  {cat.name}
                </h3>
                <div className="mt-2 flex items-center gap-1.5 text-sm text-white/50 transition-all duration-500 group-hover:gap-3 group-hover:text-accent-300">
                  Explore
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" />
                </div>
              </div>

              {/* Hover border glow */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-accent-400/0 transition-all duration-500 group-hover:ring-accent-400/30" />
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}
