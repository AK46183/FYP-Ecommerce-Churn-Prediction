import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from 'react'
import {
  Link,
  useNavigate,
  useOutletContext,
  useParams,
} from 'react-router-dom'
import {
  AnimatePresence,
  motion,
} from 'framer-motion'
import {
  Check,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Truck,
  ZoomIn,
} from 'lucide-react'

import {
  getDefaultVariantSelection,
  getProductById,
  getRelatedProducts,
  getVariantOldPrice,
  getVariantPrice,
  getVariantSku,
  getVariantStock,
  isVariantConfigAvailable,
} from '@/data/products'

import {
  getProductGallery,
  getProductImage,
  getProductImageForColor,
} from '@/data/images'

import { formatPKR } from '@/utils/currency'

import { useStore } from '@/context/StoreContext'
import { Badge, Rating } from '@/components/ui'
import ProductCard from '@/components/ProductCard'
import Product360Preview from '@/components/Product360Preview'
import { trackEvent } from '@/services/tracking'

import type { Product } from '@/data/products'

type OutletCtx = {
  openQuickView: (product: Product) => void
}

type Tab =
  | 'overview'
  | 'specifications'
  | 'reviews'
  | 'shipping'

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>()

  const { openQuickView } =
    useOutletContext<OutletCtx>()

  const navigate = useNavigate()

  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
  } = useStore()

  const product =
    getProductById(id || '')

  const [activeImage, setActiveImage] =
    useState(0)

  const [
    selectedVariants,
    setSelectedVariants,
  ] = useState<Record<string, string>>({})

  const [quantity, setQuantity] =
    useState(1)

  const [activeTab, setActiveTab] =
    useState<Tab>('overview')

  const [zoomOpen, setZoomOpen] =
    useState(false)

  const [added, setAdded] =
    useState(false)

  const zoomRef =
    useRef<HTMLDivElement>(null)

  const addedTimerRef =
    useRef<number | null>(null)

  const trackedProductRef =
    useRef<string | null>(null)

  const [zoomPos, setZoomPos] =
    useState({
      x: 50,
      y: 50,
    })

  /* =====================================================
     RELATED PRODUCTS
  ===================================================== */

  const related = useMemo(
    () =>
      product
        ? getRelatedProducts(product)
        : [],
    [product],
  )

  /* =====================================================
     DEFAULT VARIANT SELECTION
  ===================================================== */

  const defaultVariants = useMemo(
    () =>
      product
        ? getDefaultVariantSelection(
            product,
          )
        : {},
    [product],
  )

  const currentVariants = useMemo(
    () => ({
      ...defaultVariants,
      ...selectedVariants,
    }),
    [
      defaultVariants,
      selectedVariants,
    ],
  )

  const selectedColor =
    currentVariants.Color

  /* =====================================================
     RESET WHEN PRODUCT CHANGES
  ===================================================== */

  useEffect(() => {
    setSelectedVariants({})
    setActiveImage(0)
    setQuantity(1)
    setActiveTab('overview')
    setZoomOpen(false)
    setAdded(false)

    if (addedTimerRef.current) {
      window.clearTimeout(
        addedTimerRef.current,
      )

      addedTimerRef.current = null
    }
  }, [product?.id])

  /* =====================================================
     RESET IMAGE WHEN COLOR CHANGES
  ===================================================== */

  useEffect(() => {
    setActiveImage(0)
  }, [
    product?.id,
    selectedColor,
  ])

  /* =====================================================
     PRODUCT VIEW TRACKING
  ===================================================== */

  useEffect(() => {
    if (!product) return

    if (
      trackedProductRef.current ===
      product.id
    ) {
      return
    }

    trackedProductRef.current =
      product.id

    trackEvent('product_view', {
      productId: product.id,
      name: product.name,
      category: product.category,
    })
  }, [product])

  /* =====================================================
     CLEAN TIMER
  ===================================================== */

  useEffect(() => {
    return () => {
      if (addedTimerRef.current) {
        window.clearTimeout(
          addedTimerRef.current,
        )
      }
    }
  }, [])

  /* =====================================================
     PRODUCT NOT FOUND
  ===================================================== */

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl font-semibold text-white">
            Product not found
          </h1>

          <Link
            to="/shop"
            className="btn-ghost mt-6"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    )
  }

  /* =====================================================
     IMAGE SYSTEM
  ===================================================== */

  const imageSet =
    getProductImage(product.id)

  const selectedMainImage =
    getProductImageForColor(
      product.id,
      selectedColor,
    )

  const baseGallery =
    getProductGallery(product.id)

  const galleryImages =
    Array.from(
      new Set([
        selectedMainImage,
        ...baseGallery,
      ]),
    ).filter(Boolean)

  const frames =
    imageSet.frames ?? []

  const has360 =
    frames.length >= 4

  /* =====================================================
     CURRENT VARIANT INFORMATION
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

  const currentSku =
    getVariantSku(
      product,
      currentVariants,
    )

  const isAvailable =
    isVariantConfigAvailable(
      product,
      currentVariants,
    )

  const discount =
    currentOldPrice &&
    currentOldPrice > currentPrice
      ? Math.round(
          ((currentOldPrice -
            currentPrice) /
            currentOldPrice) *
            100,
        )
      : 0

  const inWishlist =
    isInWishlist(product.id)

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
        config.values[variantName] ===
          value,
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
          [variantName]: value,
        }),
      )

      setQuantity(1)
      return
    }

    const desiredSelection = {
      ...currentVariants,
      [variantName]: value,
    }

    const exactConfig =
      product.variantConfigs.find(
        (config) =>
          config.stock > 0 &&
          Object.entries(
            config.values,
          ).every(
            ([key, configValue]) =>
              desiredSelection[key] ===
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

      setQuantity(1)
      return
    }

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

    setQuantity(1)
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
        Color: colorName,
      }),
    )

    setActiveImage(0)
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
      quantity,
    )

    setAdded(true)

    if (addedTimerRef.current) {
      window.clearTimeout(
        addedTimerRef.current,
      )
    }

    addedTimerRef.current =
      window.setTimeout(() => {
        setAdded(false)
        addedTimerRef.current = null
      }, 2000)
  }

  /* =====================================================
     BUY NOW
  ===================================================== */

  const handleBuyNow = () => {
    if (
      !isAvailable ||
      currentStock <= 0
    ) {
      return
    }

    addToCart(
      product,
      currentVariants,
      quantity,
    )

    navigate('/checkout')
  }

  /* =====================================================
     ZOOM
  ===================================================== */

  const handleZoomMove = (
    event: MouseEvent<HTMLDivElement>,
  ) => {
    if (!zoomRef.current) {
      return
    }

    const rect =
      zoomRef.current.getBoundingClientRect()

    setZoomPos({
      x:
        ((event.clientX -
          rect.left) /
          rect.width) *
        100,

      y:
        ((event.clientY -
          rect.top) /
          rect.height) *
        100,
    })
  }

  /* =====================================================
     MOCK REVIEWS
  ===================================================== */

  const reviews = [
    {
      name: 'Michael R.',
      rating: 5,
      date: '2 weeks ago',
      text:
        'Absolutely incredible product. Exceeds expectations in every way.',
    },
    {
      name: 'Sarah K.',
      rating: 5,
      date: '1 month ago',
      text:
        'Premium build quality and the performance is unmatched. Worth every penny.',
    },
    {
      name: 'James L.',
      rating: 4,
      date: '2 months ago',
      text:
        'Great device overall, though I wish the battery lasted a bit longer.',
    },
  ]

  return (
    <div className="pt-16">

      {/* =================================================
          BREADCRUMB
      ================================================= */}

      <div className="container-wide section-pad py-6">
        <div className="flex items-center gap-1.5 text-sm text-white/40">

          <Link
            to="/"
            className="hover:text-white/70"
          >
            Home
          </Link>

          <ChevronRight className="h-3 w-3" />

          <Link
            to="/shop"
            className="hover:text-white/70"
          >
            Shop
          </Link>

          <ChevronRight className="h-3 w-3" />

          <Link
            to={`/category/${product.category}`}
            className="capitalize hover:text-white/70"
          >
            {product.category}
          </Link>

          <ChevronRight className="h-3 w-3" />

          <span className="text-white/60">
            {product.name}
          </span>

        </div>
      </div>

      {/* =================================================
          MAIN PRODUCT SECTION
      ================================================= */}

      <div className="container-wide section-pad pb-16">

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">

          {/* =============================================
              PRODUCT GALLERY
          ============================================= */}

          <div className="flex flex-col gap-4">

            <div
              ref={zoomRef}
              onMouseMove={
                handleZoomMove
              }
              onMouseEnter={() =>
                setZoomOpen(true)
              }
              onMouseLeave={() =>
                setZoomOpen(false)
              }
              className="
                group
                relative
                aspect-square
                overflow-hidden
                rounded-3xl
                border
                border-black/10
                bg-white
                p-8
                sm:p-10
              "
            >

              <AnimatePresence mode="wait">

                <motion.img
                  key={`${product.id}-${selectedColor ?? 'default'}-${activeImage}`}
                  src={
                    galleryImages[
                      activeImage
                    ] ??
                    selectedMainImage
                  }
                  alt={product.name}
                  draggable={false}
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
                    duration: 0.25,
                  }}
                  className="
                    h-full
                    w-full
                    select-none
                    object-contain
                  "
                  style={
                    zoomOpen
                      ? {
                          transformOrigin:
                            `${zoomPos.x}% ${zoomPos.y}%`,
                          transform:
                            'scale(1.7)',
                        }
                      : undefined
                  }
                />

              </AnimatePresence>

              <div
                className="
                  absolute
                  right-4
                  top-4
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-black/70
                  backdrop-blur-sm
                "
              >
                <ZoomIn className="h-4 w-4 text-white" />
              </div>

              <div className="absolute left-4 top-4 flex flex-col gap-1.5">

                {product.isNew && (
                  <Badge variant="new">
                    New
                  </Badge>
                )}

                {discount > 0 && (
                  <Badge variant="deal">
                    -{discount}%
                  </Badge>
                )}

              </div>

            </div>

            {/* THUMBNAILS */}

            <div className="flex gap-3 overflow-x-auto no-scrollbar">

              {galleryImages.map(
                (source, index) => (

                  <button
                    key={`${source}-${index}`}
                    type="button"
                    onClick={() =>
                      setActiveImage(
                        index,
                      )
                    }
                    aria-label={`Show ${product.name} image ${index + 1}`}
                    className={`
                      relative
                      h-20
                      w-20
                      shrink-0
                      overflow-hidden
                      rounded-xl
                      border-2
                      bg-white
                      p-1.5
                      transition-all

                      ${
                        activeImage ===
                        index
                          ? 'border-accent-400'
                          : 'border-white/10 hover:border-white/30'
                      }
                    `}
                  >

                    <img
                      src={source}
                      alt={`${product.name} view ${index + 1}`}
                      loading="lazy"
                      draggable={false}
                      className="
                        h-full
                        w-full
                        object-contain
                      "
                    />

                  </button>

                ),
              )}

              {has360 && (
                <div
                  className="
                    flex
                    h-20
                    w-20
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    border-2
                    border-white/10
                    bg-ink-800
                  "
                >
                  <span className="text-xs font-semibold text-white/60">
                    360°
                  </span>
                </div>
              )}

            </div>

            {/* 360 */}

            {has360 && (
              <div
                className="
                  group
                  relative
                  aspect-square
                  overflow-hidden
                  rounded-3xl
                  border
                  border-white/[0.06]
                  bg-white
                "
              >

                <Product360Preview
                  frames={frames}
                  mainImage={
                    selectedMainImage
                  }
                  alt={`${product.name} 360 view`}
                  className="h-full w-full"
                />

                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-x-0
                    bottom-4
                    flex
                    justify-center
                  "
                >
                  <p
                    className="
                      rounded-full
                      bg-black/60
                      px-4
                      py-1.5
                      text-xs
                      text-white/80
                      backdrop-blur-sm
                    "
                  >
                    Hover to rotate 360°
                  </p>
                </div>

              </div>
            )}

          </div>

          {/* =============================================
              PRODUCT INFORMATION
          ============================================= */}

          <div className="flex flex-col gap-5">

            <div>

              <p className="text-sm font-medium uppercase tracking-wide text-white/40">
                {product.brand}
              </p>

              <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {product.name}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-4">

                <Rating
                  rating={
                    product.rating
                  }
                  count={
                    product.reviewCount
                  }
                  size="md"
                />

                <span
                  className={`text-sm ${
                    currentStock > 0
                      ? 'text-green-400'
                      : 'text-rose-400'
                  }`}
                >
                  {currentStock > 0
                    ? `In Stock (${currentStock})`
                    : 'Out of Stock'}
                </span>

                {currentSku && (
                  <span className="text-xs text-white/30">
                    SKU: {currentSku}
                  </span>
                )}

              </div>

            </div>

            <p className="text-white/50">
              {product.shortSpec}
            </p>

            {/* =============================================
                PKR PRICE
            ============================================= */}

            <div className="flex flex-wrap items-baseline gap-3">

              <span className="font-display text-3xl font-semibold text-white">
                {formatPKR(
                  currentPrice,
                )}
              </span>

              {currentOldPrice &&
                currentOldPrice >
                  currentPrice && (

                  <span className="text-xl text-white/30 line-through">
                    {formatPKR(
                      currentOldPrice,
                    )}
                  </span>

                )}

              {discount > 0 &&
                currentOldPrice && (

                  <span
                    className="
                      rounded-full
                      bg-rose-500/15
                      px-2.5
                      py-0.5
                      text-sm
                      font-medium
                      text-rose-400
                    "
                  >
                    Save{' '}
                    {formatPKR(
                      currentOldPrice -
                        currentPrice,
                    )}
                  </span>

                )}

            </div>

            <div className="h-px bg-white/[0.06]" />

            {/* =============================================
                VARIANTS
            ============================================= */}

            {product.variants.map(
              (variant) => (

                <div key={variant.name}>

                  <div className="mb-2.5 flex items-center justify-between">

                    <label className="text-xs font-semibold uppercase tracking-wide text-white/40">
                      {variant.name}
                    </label>

                    <span className="text-xs text-white/50">
                      {
                        currentVariants[
                          variant.name
                        ]
                      }
                    </span>

                  </div>

                  <div className="flex flex-wrap gap-2">

                    {variant.values.map(
                      (value) => {

                        const available =
                          isVariantValueAvailable(
                            variant.name,
                            value,
                          )

                        const selected =
                          currentVariants[
                            variant.name
                          ] === value

                        return (
                          <button
                            key={value}
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
                              rounded-xl
                              border
                              px-4
                              py-2
                              text-sm
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
                            {value}
                          </button>
                        )
                      },
                    )}

                  </div>

                </div>

              ),
            )}

            {/* COLOR */}

            {product.colors.length > 0 && (
              <div>

                <div className="mb-2.5 flex items-center justify-between">

                  <label className="text-xs font-semibold uppercase tracking-wide text-white/40">
                    Color
                  </label>

                  <span className="text-xs text-white/50">
                    {selectedColor}
                  </span>

                </div>

                <div className="flex flex-wrap gap-3">

                  {product.colors.map(
                    (color) => {

                      const selected =
                        selectedColor ===
                        color.name

                      return (
                        <button
                          key={color.name}
                          type="button"
                          onClick={() =>
                            handleColorChange(
                              color.name,
                            )
                          }
                          title={color.name}
                          aria-label={color.name}
                          className={`
                            relative
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
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
                        >

                          {selected && (
                            <Check
                              className="
                                h-4
                                w-4
                                text-white
                                mix-blend-difference
                              "
                            />
                          )}

                        </button>
                      )
                    },
                  )}

                </div>

              </div>
            )}

            {!isAvailable && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
                This configuration is currently unavailable. Please select another option.
              </div>
            )}

            {/* ACTIONS */}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

              <div className="flex items-center gap-1 rounded-xl border border-white/10 p-1">

                <button
                  type="button"
                  onClick={() =>
                    setQuantity(
                      (current) =>
                        Math.max(
                          1,
                          current - 1,
                        ),
                    )
                  }
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    text-white/60
                    hover:bg-white/[0.04]
                  "
                >
                  <Minus className="h-4 w-4" />
                </button>

                <span className="w-10 text-center text-sm font-medium text-white">
                  {quantity}
                </span>

                <button
                  type="button"
                  disabled={
                    currentStock <= 0 ||
                    quantity >=
                      currentStock
                  }
                  onClick={() =>
                    setQuantity(
                      (current) =>
                        Math.min(
                          currentStock,
                          current + 1,
                        ),
                    )
                  }
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    text-white/60
                    hover:bg-white/[0.04]
                    disabled:cursor-not-allowed
                    disabled:opacity-30
                  "
                >
                  <Plus className="h-4 w-4" />
                </button>

              </div>

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
                    currentStock <= 0
                      ? 'cursor-not-allowed opacity-50'
                      : ''
                  }
                `}
              >

                {added ? (
                  <>
                    <Check className="h-4 w-4" />
                    Added!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </>
                )}

              </button>

              <button
                type="button"
                onClick={
                  handleBuyNow
                }
                disabled={
                  !isAvailable ||
                  currentStock <= 0
                }
                className={`
                  btn-primary
                  flex-1
                  ${
                    !isAvailable ||
                    currentStock <= 0
                      ? 'cursor-not-allowed opacity-50'
                      : ''
                  }
                `}
              >
                Buy Now
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
                  rounded-xl
                  border
                  border-white/10
                  transition-colors
                  hover:border-rose-500/40
                "
              >
                <Heart
                  className={`h-5 w-5 ${
                    inWishlist
                      ? 'fill-rose-500 text-rose-500'
                      : 'text-white/70'
                  }`}
                />
              </button>

            </div>

            {/* TRUST BADGES */}

            <div className="grid grid-cols-3 gap-3 border-t border-white/[0.06] pt-5">

              {[
                {
                  icon: Truck,
                  label:
                    'Free Shipping',
                },
                {
                  icon: ShieldCheck,
                  label:
                    '2-Year Warranty',
                },
                {
                  icon: RotateCcw,
                  label:
                    '30-Day Returns',
                },
              ].map((item) => (

                <div
                  key={item.label}
                  className="flex flex-col items-center gap-2 text-center"
                >
                  <item.icon className="h-5 w-5 text-accent-300" />

                  <span className="text-xs text-white/50">
                    {item.label}
                  </span>
                </div>

              ))}

            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          TABS
      ================================================= */}

      <div className="container-wide section-pad pb-16">

        <div className="flex flex-wrap gap-1 border-b border-white/[0.06]">

          {[
            {
              id: 'overview' as Tab,
              label: 'Overview',
            },
            {
              id: 'specifications' as Tab,
              label: 'Specifications',
            },
            {
              id: 'reviews' as Tab,
              label:
                `Reviews (${product.reviewCount})`,
            },
            {
              id: 'shipping' as Tab,
              label: 'Shipping',
            },
          ].map((tab) => (

            <button
              key={tab.id}
              type="button"
              onClick={() =>
                setActiveTab(
                  tab.id,
                )
              }
              className={`
                relative
                px-5
                py-3
                text-sm
                font-medium
                transition-colors

                ${
                  activeTab ===
                  tab.id
                    ? 'text-white'
                    : 'text-white/40 hover:text-white/70'
                }
              `}
            >

              {tab.label}

              {activeTab ===
                tab.id && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute inset-x-0 -bottom-px h-0.5 bg-accent-400"
                />
              )}

            </button>

          ))}

        </div>

        <div className="py-8">

          <AnimatePresence mode="wait">

            <motion.div
              key={activeTab}
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -10,
              }}
              transition={{
                duration: 0.3,
              }}
            >

              {/* OVERVIEW */}

              {activeTab ===
                'overview' && (
                <div className="max-w-3xl">

                  <p className="text-lg leading-relaxed text-white/70">
                    {product.description}
                  </p>

                  <div className="mt-8 grid gap-4 sm:grid-cols-2">

                    {Object.entries(
                      product.specifications,
                    )
                      .slice(0, 4)
                      .map(
                        ([
                          key,
                          value,
                        ]) => (

                          <div
                            key={key}
                            className="rounded-xl border border-white/[0.06] bg-ink-800/40 p-4"
                          >
                            <p className="text-xs font-medium uppercase tracking-wide text-white/40">
                              {key}
                            </p>

                            <p className="mt-1 text-sm text-white/80">
                              {value}
                            </p>
                          </div>

                        ),
                      )}

                  </div>

                </div>
              )}

              {/* SPECIFICATIONS */}

              {activeTab ===
                'specifications' && (
                <div className="max-w-3xl overflow-hidden rounded-xl border border-white/[0.06]">

                  {Object.entries(
                    product.specifications,
                  ).map(
                    ([
                      key,
                      value,
                    ], index) => (

                      <div
                        key={key}
                        className={`
                          grid
                          grid-cols-2
                          gap-4
                          p-4

                          ${
                            index % 2 ===
                            0
                              ? 'bg-ink-800/30'
                              : ''
                          }
                        `}
                      >
                        <span className="text-sm font-medium text-white/40">
                          {key}
                        </span>

                        <span className="text-sm text-white/80">
                          {value}
                        </span>
                      </div>

                    ),
                  )}

                </div>
              )}

              {/* REVIEWS */}

              {activeTab ===
                'reviews' && (
                <div className="max-w-3xl space-y-6">

                  <div className="flex items-center gap-8 rounded-2xl border border-white/[0.06] bg-ink-800/40 p-6">

                    <div className="text-center">
                      <p className="font-display text-4xl font-semibold text-white">
                        {product.rating}
                      </p>

                      <div className="mt-2 flex justify-center">
                        <Rating
                          rating={
                            product.rating
                          }
                        />
                      </div>

                      <p className="mt-1 text-xs text-white/40">
                        {product.reviewCount}{' '}
                        reviews
                      </p>
                    </div>

                    <div className="flex-1 space-y-1.5">

                      {[5, 4, 3, 2, 1].map(
                        (star) => (

                          <div
                            key={star}
                            className="flex items-center gap-2"
                          >

                            <span className="w-3 text-xs text-white/40">
                              {star}
                            </span>

                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.06]">

                              <div
                                className="h-full rounded-full bg-accent-400"
                                style={{
                                  width:
                                    `${
                                      star === 5
                                        ? 72
                                        : star === 4
                                          ? 20
                                          : star === 3
                                            ? 5
                                            : 2
                                    }%`,
                                }}
                              />

                            </div>

                          </div>

                        ),
                      )}

                    </div>

                  </div>

                  {reviews.map(
                    (
                      review,
                      index,
                    ) => (

                      <div
                        key={index}
                        className="rounded-2xl border border-white/[0.06] bg-ink-800/30 p-5"
                      >

                        <div className="flex items-center justify-between">

                          <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-400/20 text-sm font-semibold text-accent-300">
                              {
                                review
                                  .name[0]
                              }
                            </div>

                            <div>
                              <p className="text-sm font-medium text-white">
                                {review.name}
                              </p>

                              <p className="text-xs text-white/40">
                                {review.date}
                              </p>
                            </div>

                          </div>

                          <Rating
                            rating={
                              review.rating
                            }
                          />

                        </div>

                        <p className="mt-3 text-sm text-white/60">
                          {review.text}
                        </p>

                      </div>

                    ),
                  )}

                </div>
              )}

              {/* SHIPPING */}

              {activeTab ===
                'shipping' && (
                <div className="max-w-3xl space-y-4">

                  {[
                    {
                      title:
                        'Free Standard Shipping',

                      desc:
                        `On all orders over ${formatPKR(50)}. Delivered in 3-5 business days.`,
                    },

                    {
                      title:
                        'Express Shipping',

                      desc:
                        `${formatPKR(15)} flat rate. Delivered in 1-2 business days. Order before 2 PM for same-day dispatch.`,
                    },

                    {
                      title:
                        '30-Day Return Policy',

                      desc:
                        'Not satisfied? Return within 30 days for a full refund. Items must be in original condition.',
                    },

                    {
                      title:
                        '2-Year Warranty',

                      desc:
                        'All NOVA products come with a comprehensive 2-year manufacturer warranty.',
                    },
                  ].map((item) => (

                    <div
                      key={item.title}
                      className="rounded-xl border border-white/[0.06] bg-ink-800/30 p-5"
                    >

                      <h4 className="font-display text-base font-medium text-white">
                        {item.title}
                      </h4>

                      <p className="mt-1.5 text-sm text-white/50">
                        {item.desc}
                      </p>

                    </div>

                  ))}

                </div>
              )}

            </motion.div>

          </AnimatePresence>

        </div>

      </div>

      {/* =================================================
          RELATED PRODUCTS
      ================================================= */}

      {related.length > 0 && (
        <div className="container-wide section-pad pb-20">

          <h2 className="heading-md mb-8">
            You may also like
          </h2>

          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">

            {related.map(
              (
                relatedProduct,
                index,
              ) => (

                <ProductCard
                  key={
                    relatedProduct.id
                  }
                  product={
                    relatedProduct
                  }
                  index={index}
                  onQuickView={
                    openQuickView
                  }
                />

              ),
            )}

          </div>

        </div>
      )}

    </div>
  )
}