import {
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  Link,
  useOutletContext,
} from 'react-router-dom'

import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from 'framer-motion'

import {
  ArrowRight,
  Cpu,
  Headphones,
  ShieldCheck,
  Sparkles,
  Truck,
} from 'lucide-react'

import CategoryGrid from '@/components/CategoryGrid'
import ProductCard from '@/components/ProductCard'
import { SectionHeader } from '@/components/ui'

import {
  getDeals,
  getFeaturedProducts,
  getMinPrice,
  getNewArrivals,
  hasVariantPricing,
  products,
} from '@/data/products'

import {
  getProductImage,
} from '@/data/images'

import {
  formatPKR,
} from '@/utils/currency'

import {
  trackEvent,
} from '@/services/tracking'

import type {
  Product,
} from '@/data/products'

type OutletCtx = {
  openQuickView: (
    product: Product,
  ) => void
}

export default function Home() {
  const {
    openQuickView,
  } = useOutletContext<OutletCtx>()

  const featured =
    getFeaturedProducts()

  const newArrivals =
    getNewArrivals()

  const deals =
    getDeals()

  const {
    scrollY,
  } = useScroll()

  const heroOpacity =
    useTransform(
      scrollY,
      [0, 600],
      [1, 0],
    )

  const heroY =
    useTransform(
      scrollY,
      [0, 600],
      [0, 100],
    )

  /* =====================================================
     CINEMATIC SHOWCASE
  ===================================================== */

  const showcaseRef =
    useRef<HTMLDivElement>(null)

  const [
    showcaseIndex,
    setShowcaseIndex,
  ] = useState(0)

  const showcaseProducts = [
    products[0],
    products[4],
    products[8],
    products[14],
  ]

  const showcaseImages =
    showcaseProducts.map(
      (product) =>
        getProductImage(
          product.id,
        ).detailMain,
    )

  /* =====================================================
     SHOWCASE SCROLL
  ===================================================== */

  useEffect(() => {
    const onScroll = () => {
      if (!showcaseRef.current) {
        return
      }

      const rect =
        showcaseRef.current.getBoundingClientRect()

      const scrollDistance =
        Math.max(
          1,
          rect.height -
            window.innerHeight,
        )

      const progress =
        Math.max(
          0,
          Math.min(
            1,
            -rect.top /
              scrollDistance,
          ),
        )

      const index =
        Math.min(
          showcaseProducts.length -
            1,

          Math.floor(
            progress *
              showcaseProducts.length,
          ),
        )

      setShowcaseIndex(index)
    }

    window.addEventListener(
      'scroll',
      onScroll,
      {
        passive: true,
      },
    )

    return () =>
      window.removeEventListener(
        'scroll',
        onScroll,
      )
  }, [showcaseProducts.length])

  const currentShowcaseProduct =
    showcaseProducts[
      showcaseIndex
    ]

  const currentShowcasePrice =
    getMinPrice(
      currentShowcaseProduct,
    )

  const currentHasVariants =
    hasVariantPricing(
      currentShowcaseProduct,
    )

  return (
    <div className="overflow-hidden">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">

        {/* Background grid */}

        <div className="absolute inset-0 bg-grid opacity-40" />

        {/* Glow */}

        <motion.div
          className="
            absolute
            left-1/2
            top-1/2
            h-[700px]
            w-[700px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-accent-500/10
            blur-[120px]
          "
          animate={{
            scale: [
              1,
              1.1,
              1,
            ],
            opacity: [
              0.6,
              0.8,
              0.6,
            ],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* HERO TEXT */}

        <motion.div
          style={{
            opacity:
              heroOpacity,
            y:
              heroY,
          }}
          className="relative z-20 px-5 text-center"
        >

          <motion.p
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.3,
              duration: 0.8,
            }}
            className="eyebrow mb-6"
          >
            NOVA Electronics —
            The Future, Today
          </motion.p>

          <motion.h1
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.4,
              duration: 1,
              ease: [
                0.16,
                1,
                0.3,
                1,
              ],
            }}
            className="heading-xl text-white"
          >
            Sound Reimagined.
          </motion.h1>

          <motion.p
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.6,
              duration: 0.8,
            }}
            className="mx-auto mt-6 max-w-md text-base text-white/50 sm:text-lg"
          >
            Experience premium
            electronics engineered
            for those who demand
            the extraordinary.
          </motion.p>

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.8,
              duration: 0.8,
            }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >

            <Link
              to="/shop"
              className="btn-primary group"
              onClick={() =>
                trackEvent(
                  'product_click',
                  {
                    action:
                      'hero_shop',
                  },
                )
              }
            >
              Explore Collection

              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              to="/category/audio"
              className="btn-ghost"
            >
              Discover Audio
            </Link>

          </motion.div>

        </motion.div>

        {/* SCROLL INDICATOR */}

        <motion.div
          style={{
            opacity:
              heroOpacity,
          }}
          className="
            absolute
            bottom-8
            left-1/2
            z-20
            -translate-x-1/2
          "
        >

          <div className="flex flex-col items-center gap-2">

            <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">
              Scroll
            </span>

            <div className="flex h-10 w-6 justify-center rounded-full border border-white/15 pt-2">

              <span className="h-2 w-1 animate-scroll-indicator rounded-full bg-accent-400" />

            </div>

          </div>

        </motion.div>

      </section>

      {/* =================================================
          TRUST BAR
      ================================================= */}

      <section className="border-y border-white/[0.06] bg-ink-900/40">

        <div className="container-wide section-pad grid grid-cols-2 gap-4 py-8 sm:grid-cols-4">

          {[
            {
              icon: Truck,
              title:
                'Free Shipping',
              desc:
                `On orders over ${formatPKR(50)}`,
            },

            {
              icon:
                ShieldCheck,
              title:
                '2-Year Warranty',
              desc:
                'On all products',
            },

            {
              icon:
                Headphones,
              title:
                '24/7 Support',
              desc:
                'AI + human assistance',
            },

            {
              icon:
                Sparkles,
              title:
                'AI Powered',
              desc:
                'Personalized recommendations',
            },
          ].map(
            (
              item,
              index,
            ) => (

              <motion.div
                key={
                  item.title
                }
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay:
                    index *
                    0.1,
                  duration:
                    0.6,
                }}
                className="flex items-center gap-3"
              >

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-400/10">

                  <item.icon className="h-5 w-5 text-accent-300" />

                </div>

                <div>

                  <p className="text-sm font-medium text-white">
                    {
                      item.title
                    }
                  </p>

                  <p className="text-xs text-white/40">
                    {
                      item.desc
                    }
                  </p>

                </div>

              </motion.div>

            ),
          )}

        </div>

      </section>

      {/* =================================================
          CATEGORIES
      ================================================= */}

      <section className="container-wide section-pad py-20 sm:py-28">

        <SectionHeader
          eyebrow="Browse"
          title="Shop by Category"
          subtitle="From flagship smartphones to cinematic displays — find your next upgrade."
          link={{
            to: '/shop',
            label:
              'View all',
          }}
        />

        <div className="mt-10">
          <CategoryGrid />
        </div>

      </section>

      {/* =================================================
          CINEMATIC SHOWCASE
      ================================================= */}

      <section
        ref={showcaseRef}
        className="relative h-screen"
      >

        <div className="sticky top-0 flex h-screen items-center overflow-hidden">

          <div className="container-wide section-pad grid h-full items-center gap-8 lg:grid-cols-2">

            {/* =============================================
                LEFT TEXT
            ============================================= */}

            <div className="z-10 order-2 lg:order-1">

              <AnimatePresence mode="wait">

                <motion.div
                  key={
                    showcaseIndex
                  }
                  initial={{
                    opacity: 0,
                    x: -30,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: 30,
                  }}
                  transition={{
                    duration:
                      0.6,
                    ease: [
                      0.16,
                      1,
                      0.3,
                      1,
                    ],
                  }}
                >

                  <p className="eyebrow mb-4">
                    Featured Spotlight
                  </p>

                  <p className="text-xs font-medium uppercase tracking-wide text-white/40">
                    {
                      currentShowcaseProduct.brand
                    }
                  </p>

                  <h2 className="heading-lg mt-2 text-white">
                    {
                      currentShowcaseProduct.name
                    }
                  </h2>

                  <p className="mt-4 max-w-md text-white/50">
                    {
                      currentShowcaseProduct.description
                    }
                  </p>

                  {/* =====================================
                      PKR PRICE
                  ===================================== */}

                  <div className="mt-6 flex flex-wrap items-center gap-4">

                    <span className="font-display text-3xl font-semibold text-white">

                      {currentHasVariants && (

                        <span className="mr-2 text-base font-medium text-white/50">
                          From
                        </span>

                      )}

                      {formatPKR(
                        currentShowcasePrice,
                      )}

                    </span>

                    <Link
                      to={`/product/${currentShowcaseProduct.id}`}
                      className="btn-accent"
                    >
                      View Product

                      <ArrowRight className="h-4 w-4" />
                    </Link>

                  </div>

                </motion.div>

              </AnimatePresence>

              {/* PROGRESS DOTS */}

              <div className="mt-10 flex gap-2">

                {showcaseProducts.map(
                  (
                    _,
                    index,
                  ) => (

                    <div
                      key={
                        index
                      }
                      className={`
                        h-1
                        rounded-full
                        transition-all
                        duration-500

                        ${
                          index ===
                          showcaseIndex
                            ? 'w-8 bg-accent-400'
                            : 'w-2 bg-white/15'
                        }
                      `}
                    />

                  ),
                )}

              </div>

            </div>

            {/* =============================================
                RIGHT IMAGE
            ============================================= */}

            <div className="relative order-1 h-[50vh] lg:order-2 lg:h-[80vh]">

              <AnimatePresence mode="wait">

                <motion.div
                  key={
                    showcaseIndex
                  }
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 1.05,
                  }}
                  transition={{
                    duration:
                      0.8,
                    ease: [
                      0.16,
                      1,
                      0.3,
                      1,
                    ],
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >

                  <div className="absolute h-[400px] w-[400px] rounded-full bg-accent-500/10 blur-[100px]" />

                  <img
                    src={
                      showcaseImages[
                        showcaseIndex
                      ]
                    }
                    alt={
                      currentShowcaseProduct.name
                    }
                    draggable={false}
                    className="
                      relative
                      z-10
                      h-full
                      w-full
                      rounded-3xl
                      object-contain
                    "
                  />

                </motion.div>

              </AnimatePresence>

            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          FEATURED PRODUCTS
      ================================================= */}

      <section className="container-wide section-pad py-20 sm:py-28">

        <SectionHeader
          eyebrow="Curated"
          title="Featured Products"
          subtitle="Handpicked electronics that define premium."
          link={{
            to: '/shop',
            label:
              'Shop all',
          }}
        />

        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">

          {featured
            .slice(0, 8)
            .map(
              (
                product,
                index,
              ) => (

                <ProductCard
                  key={
                    product.id
                  }
                  product={
                    product
                  }
                  index={
                    index
                  }
                  onQuickView={
                    openQuickView
                  }
                />

              ),
            )}

        </div>

      </section>

      {/* =================================================
          NEW ARRIVALS
      ================================================= */}

      <section className="container-wide section-pad py-20 sm:py-28">

        <SectionHeader
          eyebrow="Just Landed"
          title="New Arrivals"
          subtitle="The latest tech, fresh off the line."
          link={{
            to:
              '/shop?filter=new',
            label:
              'See more',
          }}
        />

        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">

          {newArrivals
            .slice(0, 4)
            .map(
              (
                product,
                index,
              ) => (

                <ProductCard
                  key={
                    product.id
                  }
                  product={
                    product
                  }
                  index={
                    index
                  }
                  onQuickView={
                    openQuickView
                  }
                />

              ),
            )}

        </div>

      </section>

      {/* =================================================
          DEALS BANNER
      ================================================= */}

      <section className="container-wide section-pad py-20 sm:py-28">

        <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-br from-ink-800 to-ink-900 p-8 sm:p-12 lg:p-16">

          <div className="absolute -right-20 -top-20 h-[400px] w-[400px] rounded-full bg-rose-500/10 blur-[100px]" />

          <div className="relative z-10 max-w-xl">

            <p className="eyebrow mb-4 text-rose-400/80">
              Limited Time
            </p>

            <h2 className="heading-lg text-white">
              Deals that move fast.
            </h2>

            <p className="mt-4 text-white/50">
              Save big on premium
              electronics. These
              offers won't last —
              grab them before
              they're gone.
            </p>

            <Link
              to="/shop?filter=deals"
              className="btn-primary group mt-8"
            >
              Shop Deals

              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

          </div>

        </div>

        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">

          {deals
            .slice(0, 4)
            .map(
              (
                product,
                index,
              ) => (

                <ProductCard
                  key={
                    product.id
                  }
                  product={
                    product
                  }
                  index={
                    index
                  }
                  onQuickView={
                    openQuickView
                  }
                />

              ),
            )}

        </div>

      </section>

      {/* =================================================
          AI BANNER
      ================================================= */}

      <section className="container-wide section-pad py-20 sm:py-28">

        <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-ink-900">

          <div className="grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-2 lg:p-16">

            <div>

              <div className="mb-4 flex items-center gap-2">

                <Cpu className="h-5 w-5 text-accent-400" />

                <span className="eyebrow">
                  AI-Powered Shopping
                </span>

              </div>

              <h2 className="heading-lg text-white">
                Meet NOVA AI.
              </h2>

              <p className="mt-4 text-white/50">
                Your intelligent
                shopping companion.
                Get personalized
                product
                recommendations,
                compare devices
                instantly, track
                orders in real-time,
                and let our AI find
                the perfect match
                for your needs —
                all through natural
                conversation.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">

                <Link
                  to="/shop"
                  className="btn-accent"
                >
                  Try AI Assistant

                  <Sparkles className="h-4 w-4" />
                </Link>

              </div>

            </div>

            <div className="relative aspect-square rounded-2xl border border-white/[0.06] bg-ink-800 p-6">

              <div className="flex h-full flex-col justify-center gap-4">

                {[
                  `Find me headphones under ${formatPKR(300)}`,

                  'Compare iPhone 17 Pro vs Galaxy S25 Ultra',

                  'Recommend a laptop for programming',
                ].map(
                  (
                    message,
                    index,
                  ) => (

                    <motion.div
                      key={
                        index
                      }
                      initial={{
                        opacity: 0,
                        x: 20,
                      }}
                      whileInView={{
                        opacity: 1,
                        x: 0,
                      }}
                      viewport={{
                        once: true,
                      }}
                      transition={{
                        delay:
                          index *
                          0.15,
                        duration:
                          0.6,
                      }}
                      className="rounded-2xl border border-white/[0.06] bg-ink-700/60 px-4 py-3 text-sm text-white/70"
                    >
                      {
                        message
                      }
                    </motion.div>

                  ),
                )}

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay: 0.6,
                    duration: 0.6,
                  }}
                  className="flex items-center gap-2 rounded-2xl bg-accent-400 px-4 py-3 text-sm font-medium text-ink-950"
                >

                  <Sparkles className="h-4 w-4" />

                  NOVA AI is ready
                  to help!

                </motion.div>

              </div>

            </div>

          </div>

        </div>

      </section>

    </div>
  )
}