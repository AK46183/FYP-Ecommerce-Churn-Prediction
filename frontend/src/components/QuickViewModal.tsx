import {
  useMemo,
  useState,
} from 'react'

import {
  AnimatePresence,
  motion,
} from 'framer-motion'

import {
  Eye,
  Heart,
  ShoppingCart,
  X,
} from 'lucide-react'

import {
  Link,
} from 'react-router-dom'

import {
  Rating,
} from './ui'

import {
  useStore,
} from '@/context/StoreContext'

import {
  getProductImage,
} from '@/data/images'

import {
  getDefaultVariantSelection,
  getVariantOldPrice,
  getVariantPrice,
  getVariantStock,
  isVariantConfigAvailable,
} from '@/data/products'

import {
  formatPKR,
} from '@/utils/currency'

import type {
  Product,
} from '@/data/products'

interface QuickViewModalProps {
  product: Product | null
  onClose: () => void
}

export default function QuickViewModal({
  product,
  onClose,
}: QuickViewModalProps) {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
  } = useStore()

  const [
    selectedVariants,
    setSelectedVariants,
  ] = useState<Record<string, string>>({})

  if (!product) {
    return null
  }

  const img =
    getProductImage(product.id)

  const inWishlist =
    isInWishlist(product.id)

  /* =====================================================
     DEFAULT VARIANT
  ===================================================== */

  const defaultVariants =
    getDefaultVariantSelection(
      product,
    )

  const currentVariants = {
    ...defaultVariants,
    ...selectedVariants,
  }

  /* =====================================================
     CURRENT PRICE / STOCK
  ===================================================== */

  const currentPrice =
    getVariantPrice(
      product,
      currentVariants,
    )

  const currentOldPrice =
    getVariantOldPrice(
      product,
      currentVariants,
    )

  const currentStock =
    getVariantStock(
      product,
      currentVariants,
    )

  const isAvailable =
    isVariantConfigAvailable(
      product,
      currentVariants,
    )

  /* =====================================================
     VARIANT AVAILABILITY
  ===================================================== */

  const isVariantValueAvailable = (
    variantName: string,
    value: string,
  ) => {
    if (
      !product.variantConfigs?.length
    ) {
      return true
    }

    return product.variantConfigs.some(
      (config) =>
        config.stock > 0 &&
        config.values[
          variantName
        ] === value,
    )
  }

  /* =====================================================
     VARIANT CHANGE
  ===================================================== */

  const handleVariantChange = (
    variantName: string,
    value: string,
  ) => {
    if (
      !product.variantConfigs?.length
    ) {
      setSelectedVariants(
        (previous) => ({
          ...previous,
          [variantName]:
            value,
        }),
      )

      return
    }

    const desiredSelection = {
      ...currentVariants,
      [variantName]:
        value,
    }

    /*
     * First try to keep the current
     * combination.
     */
    const exactConfig =
      product.variantConfigs.find(
        (config) =>
          config.stock > 0 &&
          Object.entries(
            config.values,
          ).every(
            ([
              key,
              configValue,
            ]) =>
              desiredSelection[
                key
              ] ===
              configValue,
          ),
      )

    if (exactConfig) {
      setSelectedVariants(
        (previous) => ({
          ...previous,
          ...exactConfig.values,
        }),
      )

      return
    }

    /*
     * Otherwise move to a valid
     * real configuration containing
     * the selected option.
     */
    const compatibleConfig =
      product.variantConfigs.find(
        (config) =>
          config.stock > 0 &&
          config.values[
            variantName
          ] === value,
      )

    if (!compatibleConfig) {
      return
    }

    setSelectedVariants(
      (previous) => ({
        ...previous,
        ...compatibleConfig.values,
      }),
    )
  }

  /* =====================================================
     COLOR CHANGE
  ===================================================== */

  const handleColorChange = (
    colorName: string,
  ) => {
    setSelectedVariants(
      (previous) => ({
        ...previous,
        Color:
          colorName,
      }),
    )
  }

  /* =====================================================
     ADD TO CART
  ===================================================== */

  const handleAddToCart = () => {
    if (
      !isAvailable ||
      currentStock <= 0
    ) {
      return
    }

    addToCart(
      product,
      currentVariants,
      1,
    )

    onClose()
  }

  return (
    <AnimatePresence>

      {product && (

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.3,
          }}
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            p-4
          "
          onClick={
            onClose
          }
        >

          {/* =============================================
              OVERLAY
          ============================================= */}

          <div className="absolute inset-0 bg-ink-950/80 backdrop-blur-md" />

          {/* =============================================
              MODAL
          ============================================= */}

          <motion.div
            initial={{
              scale: 0.95,
              opacity: 0,
              y: 20,
            }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
            }}
            exit={{
              scale: 0.95,
              opacity: 0,
              y: 20,
            }}
            transition={{
              duration: 0.4,
              ease: [
                0.16,
                1,
                0.3,
                1,
              ],
            }}
            className="
              relative
              z-10
              grid
              max-h-[90vh]
              w-full
              max-w-4xl
              grid-cols-1
              gap-0
              overflow-hidden
              rounded-3xl
              border
              border-white/[0.08]
              bg-ink-900
              sm:grid-cols-2
            "
            onClick={(
              event,
            ) =>
              event.stopPropagation()
            }
          >

            {/* CLOSE */}

            <button
              type="button"
              onClick={
                onClose
              }
              aria-label="Close quick view"
              className="
                absolute
                right-4
                top-4
                z-20
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                bg-black/40
                text-white/70
                backdrop-blur-sm
                transition-colors
                hover:bg-black/60
                hover:text-white
              "
            >
              <X className="h-4 w-4" />
            </button>

            {/* =============================================
                IMAGE
            ============================================= */}

            <div className="group relative aspect-square bg-white sm:aspect-auto">

              <img
                src={
                  img.listing
                }
                alt={
                  product.name
                }
                draggable={
                  false
                }
                className="
                  h-full
                  w-full
                  object-contain
                  p-8
                "
              />

            </div>

            {/* =============================================
                DETAILS
            ============================================= */}

            <div className="flex flex-col gap-4 overflow-y-auto p-6 sm:p-8">

              <div>

                <p className="text-xs font-medium uppercase tracking-wide text-white/40">
                  {
                    product.brand
                  }
                </p>

                <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight text-white">
                  {
                    product.name
                  }
                </h2>

                <div className="mt-2">

                  <Rating
                    rating={
                      product.rating
                    }
                    count={
                      product.reviewCount
                    }
                    size="md"
                  />

                </div>

              </div>

              <p className="text-sm text-white/50">
                {
                  product.shortSpec
                }
              </p>

              {/* =========================================
                  PKR PRICE
              ========================================= */}

              <div className="flex flex-wrap items-baseline gap-3">

                <span className="font-display text-2xl font-semibold text-white">

                  {formatPKR(
                    currentPrice,
                  )}

                </span>

                {currentOldPrice &&
                  currentOldPrice >
                    currentPrice && (

                  <span className="text-base text-white/30 line-through">

                    {formatPKR(
                      currentOldPrice,
                    )}

                  </span>

                )}

              </div>

              {/* STOCK */}

              <span
                className={`
                  text-xs

                  ${
                    currentStock >
                    0
                      ? 'text-green-400'
                      : 'text-rose-400'
                  }
                `}
              >

                {currentStock > 0
                  ? `In Stock (${currentStock})`
                  : 'Out of Stock'}

              </span>

              {/* =========================================
                  VARIANTS
              ========================================= */}

              {product.variants.map(
                (
                  variant,
                ) => (

                  <div
                    key={
                      variant.name
                    }
                  >

                    <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-white/40">

                      {
                        variant.name
                      }

                    </label>

                    <div className="flex flex-wrap gap-2">

                      {variant.values.map(
                        (
                          value,
                        ) => {

                          const available =
                            isVariantValueAvailable(
                              variant.name,
                              value,
                            )

                          const selected =
                            currentVariants[
                              variant.name
                            ] ===
                            value

                          return (

                            <button
                              key={
                                value
                              }
                              type="button"
                              disabled={
                                !available
                              }
                              onClick={() =>
                                handleVariantChange(
                                  variant.name,
                                  value,
                                )
                              }
                              className={`
                                rounded-lg
                                border
                                px-3
                                py-1.5
                                text-xs
                                font-medium
                                transition-all
                                duration-300

                                ${
                                  selected
                                    ? 'border-accent-400 bg-accent-400/10 text-accent-300'
                                    : available
                                      ? 'border-white/10 text-white/60 hover:border-white/25'
                                      : 'cursor-not-allowed border-white/5 text-white/20 opacity-40'
                                }
                              `}
                            >
                              {
                                value
                              }
                            </button>

                          )

                        },
                      )}

                    </div>

                  </div>

                ),
              )}

              {/* =========================================
                  COLORS
              ========================================= */}

              {product.colors.length >
                0 && (

                <div>

                  <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-white/40">
                    Color
                  </label>

                  <div className="flex flex-wrap gap-2.5">

                    {product.colors.map(
                      (
                        color,
                      ) => {

                        const selected =
                          currentVariants.Color ===
                          color.name

                        return (

                          <button
                            key={
                              color.name
                            }
                            type="button"
                            onClick={() =>
                              handleColorChange(
                                color.name,
                              )
                            }
                            className={`
                              h-8
                              w-8
                              rounded-full
                              border-2
                              transition-all

                              ${
                                selected
                                  ? 'scale-110 border-accent-400'
                                  : 'border-white/15 hover:border-white/40'
                              }
                            `}
                            style={{
                              backgroundColor:
                                color.hex,
                            }}
                            aria-label={
                              color.name
                            }
                            title={
                              color.name
                            }
                          />

                        )

                      },
                    )}

                  </div>

                </div>

              )}

              {/* =========================================
                  UNAVAILABLE
              ========================================= */}

              {!isAvailable && (

                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs text-amber-300">

                  This configuration is currently unavailable.

                </div>

              )}

              {/* =========================================
                  ACTIONS
              ========================================= */}

              <div className="mt-auto flex gap-3 pt-4">

                <button
                  type="button"
                  onClick={
                    handleAddToCart
                  }
                  disabled={
                    !isAvailable ||
                    currentStock <= 0
                  }
                  className={`
                    btn-accent
                    flex-1

                    ${
                      !isAvailable ||
                      currentStock <=
                        0
                        ? 'cursor-not-allowed opacity-50'
                        : ''
                    }
                  `}
                >

                  <ShoppingCart className="h-4 w-4" />

                  Add to Cart

                </button>

                <button
                  type="button"
                  onClick={() =>
                    toggleWishlist(
                      product.id,
                    )
                  }
                  aria-label={
                    inWishlist
                      ? 'Remove from wishlist'
                      : 'Add to wishlist'
                  }
                  className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/10
                    transition-colors
                    hover:border-rose-500/40
                  "
                >

                  <Heart
                    className={`
                      h-5
                      w-5

                      ${
                        inWishlist
                          ? 'fill-rose-500 text-rose-500'
                          : 'text-white/70'
                      }
                    `}
                  />

                </button>

              </div>

              {/* FULL DETAILS */}

              <Link
                to={`/product/${product.id}`}
                onClick={
                  onClose
                }
                className="
                  flex
                  items-center
                  justify-center
                  gap-1.5
                  text-sm
                  font-medium
                  text-white/50
                  transition-colors
                  hover:text-accent-300
                "
              >

                <Eye className="h-4 w-4" />

                View Full Details

              </Link>

            </div>

          </motion.div>

        </motion.div>

      )}

    </AnimatePresence>
  )
}