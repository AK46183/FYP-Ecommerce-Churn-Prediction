import { type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Eye,
  Heart,
  ShoppingCart,
  Star,
} from 'lucide-react'

import {
  useStore,
} from '@/context/StoreContext'

import {
  getProductImage,
} from '@/data/images'

import {
  getDefaultVariantSelection,
  getMinPrice,
  hasVariantPricing,
} from '@/data/products'

import {
  formatPKR,
} from '@/utils/currency'

import {
  trackEvent,
} from '@/services/tracking'

import type {
  Product,
} from '@/data/products'

interface ProductCardProps {
  product: Product
  index?: number
  onQuickView?: (
    product: Product,
  ) => void
}

export default function ProductCard({
  product,
  index = 0,
  onQuickView,
}: ProductCardProps) {
  const {
    toggleWishlist,
    isInWishlist,
    addToCart,
  } = useStore()

  const img =
    getProductImage(product.id)

  const inWishlist =
    isInWishlist(product.id)

  const hasVariants =
    hasVariantPricing(product)

  const displayPrice =
    getMinPrice(product)

  const discount =
    product.oldPrice &&
    product.oldPrice >
      product.price
      ? Math.round(
          ((product.oldPrice -
            product.price) /
            product.oldPrice) *
            100,
        )
      : 0

  /* =====================================================
     ADD TO CART

     Uses a REAL valid default configuration.
  ===================================================== */

  const handleAddToCart = (
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    const defaultVariant =
      getDefaultVariantSelection(
        product,
      )

    addToCart(
      product,
      defaultVariant,
      1,
    )
  }

  /* =====================================================
     WISHLIST
  ===================================================== */

  const handleWishlist = (
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    toggleWishlist(product.id)
  }

  /* =====================================================
     QUICK VIEW
  ===================================================== */

  const handleQuickView = (
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    trackEvent(
      'product_click',
      {
        productId:
          product.id,

        action:
          'quick_view',
      },
    )

    onQuickView?.(product)
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        margin: '-50px',
      }}
      transition={{
        duration: 0.6,
        delay:
          (index % 4) *
          0.08,
        ease: [
          0.16,
          1,
          0.3,
          1,
        ],
      }}
      className="group"
    >
      <Link
        to={`/product/${product.id}`}
        onClick={() =>
          trackEvent(
            'product_view',
            {
              productId:
                product.id,
            },
          )
        }
        className="block"
      >

        {/* =================================================
            PRODUCT IMAGE
        ================================================= */}

        <div
          className="
            relative
            aspect-square
            overflow-hidden
            rounded-2xl
            border
            border-white/[0.06]
            bg-white
          "
        >
          <img
            src={img.listing}
            alt={product.name}
            loading="lazy"
            draggable={false}
            className="
              h-full
              w-full
              object-contain
              p-6
              transition-transform
              duration-700
              ease-premium
              group-hover:scale-105
            "
          />

          {/* =============================================
              BADGES
          ============================================= */}

          <div className="absolute left-3 top-3 flex flex-col gap-1.5">

            {product.isNew && (
              <span
                className="
                  rounded-full
                  bg-accent-400
                  px-2.5
                  py-0.5
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-wide
                  text-ink-950
                "
              >
                New
              </span>
            )}

            {discount > 0 && (
              <span
                className="
                  rounded-full
                  bg-rose-500
                  px-2.5
                  py-0.5
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-wide
                  text-white
                "
              >
                -{discount}%
              </span>
            )}

          </div>

          {/* =============================================
              WISHLIST
          ============================================= */}

          <button
            type="button"
            onClick={
              handleWishlist
            }
            className="
              absolute
              right-3
              top-3
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              bg-black/40
              backdrop-blur-sm
              transition-all
              duration-300
              hover:bg-black/60
            "
            aria-label={
              inWishlist
                ? 'Remove from wishlist'
                : 'Add to wishlist'
            }
          >
            <Heart
              className={`
                h-4
                w-4
                transition-colors

                ${
                  inWishlist
                    ? 'fill-rose-500 text-rose-500'
                    : 'text-white'
                }
              `}
            />
          </button>

          {/* =============================================
              HOVER ACTIONS
          ============================================= */}

          <div
            className="
              absolute
              inset-x-3
              bottom-3
              flex
              translate-y-3
              gap-2
              opacity-0
              transition-all
              duration-500
              ease-premium
              group-hover:translate-y-0
              group-hover:opacity-100
            "
          >
            <button
              type="button"
              onClick={
                handleQuickView
              }
              className="
                flex
                flex-1
                items-center
                justify-center
                gap-1.5
                rounded-full
                bg-white/95
                py-2.5
                text-xs
                font-semibold
                text-ink-950
                backdrop-blur-sm
                transition-colors
                hover:bg-white
              "
            >
              <Eye className="h-3.5 w-3.5" />

              Quick View
            </button>

            <button
              type="button"
              onClick={
                handleAddToCart
              }
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-accent-400
                text-ink-950
                transition-colors
                hover:bg-accent-300
              "
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingCart className="h-4 w-4" />
            </button>

          </div>

        </div>

        {/* =================================================
            PRODUCT INFO
        ================================================= */}

        <div className="mt-4 space-y-1">

          <div className="flex items-center justify-between">

            <span className="text-xs font-medium uppercase tracking-wide text-white/40">
              {product.brand}
            </span>

            <div className="flex items-center gap-1">

              <Star className="h-3 w-3 fill-accent-400 text-accent-400" />

              <span className="text-xs font-medium text-white/60">
                {product.rating}
              </span>

              <span className="text-xs text-white/30">
                ({product.reviewCount})
              </span>

            </div>

          </div>

          <h3 className="font-display text-base font-medium tracking-tight text-white">
            {product.name}
          </h3>

          <p className="text-xs text-white/40">
            {product.shortSpec}
          </p>

          {/* =============================================
              PKR PRICE
          ============================================= */}

          <div className="flex flex-wrap items-center gap-2 pt-1">

            <span className="font-display text-lg font-semibold text-white">

              {hasVariants && (
                <span className="mr-1 text-sm font-medium text-white/50">
                  From
                </span>
              )}

              {formatPKR(
                displayPrice,
              )}

            </span>

            {product.oldPrice &&
              !hasVariants && (

              <span className="text-sm text-white/30 line-through">

                {formatPKR(
                  product.oldPrice,
                )}

              </span>

            )}

          </div>

        </div>

      </Link>
    </motion.div>
  )
}