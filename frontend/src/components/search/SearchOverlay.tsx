import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, TrendingUp } from 'lucide-react'

import {
  searchProducts,
  getMinPrice,
} from '@/data/products'

import { getProductImage } from '@/data/images'
import { useStore } from '@/context/StoreContext'
import { trackEvent } from '@/services/tracking'
import { formatPKR } from '@/utils/currency'

interface SearchOverlayProps {
  open: boolean
  onClose: () => void
}

const trendingSearches = [
  'iPhone 17 Pro',
  'Sony WH-1000XM5',
  'MacBook Pro',
  'Gaming Laptop',
  'PS5 Pro',
  'OLED TV',
]

export default function SearchOverlay({
  open,
  onClose,
}: SearchOverlayProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] =
    useState<ReturnType<typeof searchProducts>>([])

  const inputRef =
    useRef<HTMLInputElement>(null)

  const navigate =
    useNavigate()

  const {
    setSearchQuery,
  } = useStore()

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    } else {
      setQuery('')
      setResults([])
    }
  }, [open])

  useEffect(() => {
    if (query.trim().length >= 2) {
      setResults(
        searchProducts(query),
      )

      trackEvent(
        'search',
        {
          query,
        },
      )
    } else {
      setResults([])
    }
  }, [query])

  const handleSubmit = (
    e: React.FormEvent,
  ) => {
    e.preventDefault()

    if (query.trim()) {
      setSearchQuery(
        query,
      )

      navigate(
        `/search?q=${encodeURIComponent(
          query,
        )}`,
      )

      onClose()
    }
  }

  return (
    <AnimatePresence>

      {open && (

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
          className="fixed inset-0 z-[90]"
        >

          <div
            className="absolute inset-0 bg-ink-950/90 backdrop-blur-xl"
            onClick={
              onClose
            }
          />

          <motion.div
            initial={{
              y: -20,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: -20,
              opacity: 0,
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
            className="relative z-10 mx-auto mt-20 max-w-2xl px-4"
          >

            <form
              onSubmit={
                handleSubmit
              }
              className="relative"
            >

              <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />

              <input
                ref={
                  inputRef
                }
                value={
                  query
                }
                onChange={(
                  e,
                ) =>
                  setQuery(
                    e.target.value,
                  )
                }
                placeholder="Search products, brands, categories..."
                className="w-full rounded-2xl border border-white/[0.08] bg-ink-900 py-4 pl-14 pr-12 text-lg text-white placeholder:text-white/30 focus:border-accent-400/40 focus:outline-none"
              />

              <button
                type="button"
                onClick={
                  onClose
                }
                className="absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-white/40 hover:text-white"
              >

                <X className="h-5 w-5" />

              </button>

            </form>

            {/* Results */}

            {results.length >
              0 && (

              <div className="mt-4 max-h-[50vh] overflow-y-auto rounded-2xl border border-white/[0.08] bg-ink-900 p-2">

                {results
                  .slice(
                    0,
                    6,
                  )
                  .map(
                    (
                      product,
                    ) => {

                      const img =
                        getProductImage(
                          product.id,
                        )

                      const price =
                        getMinPrice(
                          product,
                        )

                      return (

                        <Link
                          key={
                            product.id
                          }
                          to={`/product/${product.id}`}
                          onClick={
                            onClose
                          }
                          className="flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-white/[0.04]"
                        >

                          <img
                            src={
                              img.listing
                            }
                            alt={
                              product.name
                            }
                            className="h-12 w-12 rounded-lg object-cover"
                          />

                          <div className="flex-1">

                            <p className="text-sm font-medium text-white">
                              {
                                product.name
                              }
                            </p>

                            <p className="text-xs text-white/40">
                              {
                                product.brand
                              }{' '}
                              ·{' '}
                              {
                                product.shortSpec
                              }
                            </p>

                          </div>

                          <span className="font-display text-sm font-semibold text-white">

                            {formatPKR(
                              price,
                            )}

                          </span>

                        </Link>

                      )
                    },
                  )}

              </div>

            )}

            {/* Trending */}

            {query.trim()
              .length <
              2 && (

              <div className="mt-6">

                <p className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-white/40">

                  <TrendingUp className="h-3.5 w-3.5" />

                  Trending Searches

                </p>

                <div className="flex flex-wrap gap-2">

                  {trendingSearches.map(
                    (
                      term,
                    ) => (

                      <button
                        key={
                          term
                        }
                        onClick={() => {
                          setQuery(
                            term,
                          )

                          inputRef.current?.focus()
                        }}
                        className="rounded-full border border-white/[0.08] px-4 py-2 text-sm text-white/60 transition-colors hover:border-accent-400/40 hover:text-accent-300"
                      >

                        {
                          term
                        }

                      </button>

                    ),
                  )}

                </div>

              </div>

            )}

          </motion.div>

        </motion.div>

      )}

    </AnimatePresence>
  )
}