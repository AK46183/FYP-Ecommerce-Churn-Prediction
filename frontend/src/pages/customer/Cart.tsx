import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AnimatePresence,
  motion,
} from 'framer-motion'
import {
  ArrowRight,
  Bookmark,
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
} from 'lucide-react'

import {
  useStore,
  variantKey,
} from '@/context/StoreContext'

import { EmptyState } from '@/components/ui'
import { formatPKR } from '@/utils/currency'

export default function Cart() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    saveForLater,
    cartTotal,
    cartCount,
  } = useStore()

  const [promo, setPromo] =
    useState('')

  const [
    promoApplied,
    setPromoApplied,
  ] = useState(false)

  /* =====================================================
     TOTALS

     Internal amounts remain in base USD.
     Only display is converted to PKR.
  ===================================================== */

  const shipping =
    cartTotal > 50 ? 0 : 15

  const discount =
    promoApplied
      ? cartTotal * 0.1
      : 0

  const total =
    Math.max(
      0,
      cartTotal +
        shipping -
        discount,
    )

  /* =====================================================
     PROMO
  ===================================================== */

  const handlePromo = () => {
    const normalized =
      promo.trim().toUpperCase()

    if (normalized === 'NOVA10') {
      setPromoApplied(true)
      return
    }

    setPromoApplied(false)
  }

  /* =====================================================
     MINUS

     2 -> 1
     1 -> remove item
  ===================================================== */

  const handleDecrease = (
    productId: string,
    itemVariantKey: string,
    quantity: number,
  ) => {
    if (quantity <= 1) {
      removeFromCart(
        productId,
        itemVariantKey,
      )

      return
    }

    updateQuantity(
      productId,
      itemVariantKey,
      quantity - 1,
    )
  }

  /* =====================================================
     PLUS
  ===================================================== */

  const handleIncrease = (
    productId: string,
    itemVariantKey: string,
    quantity: number,
    maxStock: number,
  ) => {
    if (quantity >= maxStock) {
      return
    }

    updateQuantity(
      productId,
      itemVariantKey,
      quantity + 1,
    )
  }

  /* =====================================================
     EMPTY CART
  ===================================================== */

  if (cart.length === 0) {
    return (
      <div>

        <div className="border-b border-white/[0.06] bg-ink-900/40">

          <div className="container-wide section-pad py-12">

            <h1 className="heading-lg">
              Your Cart
            </h1>

          </div>

        </div>

        <div className="container-wide section-pad py-12">

          <EmptyState
            icon={ShoppingBag}
            title="Your cart is empty"
            description="Looks like you haven't added anything yet. Explore our premium electronics collection."
            action={
              <Link
                to="/shop"
                className="btn-accent"
              >
                <ShoppingBag className="h-4 w-4" />
                Start Shopping
              </Link>
            }
          />

        </div>

      </div>
    )
  }

  return (
    <div>

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="border-b border-white/[0.06] bg-ink-900/40">

        <div className="container-wide section-pad py-12">

          <p className="mb-2 text-sm text-white/40">
            Home / Cart
          </p>

          <h1 className="heading-lg">
            Your Cart
          </h1>

          <p className="mt-2 text-white/50">
            {cartCount}{' '}
            {cartCount === 1
              ? 'item'
              : 'items'}{' '}
            in your cart
          </p>

        </div>

      </div>

      {/* =================================================
          CART CONTENT
      ================================================= */}

      <div className="container-wide section-pad py-12">

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">

          {/* =============================================
              ITEMS
          ============================================= */}

          <div className="space-y-3">

            <AnimatePresence mode="popLayout">

              {cart.map((item) => {
                const vKey =
                  variantKey(
                    item.productId,
                    item.variant,
                  )

                const atMaxStock =
                  item.quantity >=
                  item.maxStock

                const itemTotal =
                  item.price *
                  item.quantity

                return (
                  <motion.div
                    key={vKey}
                    layout
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
                      x: -20,
                    }}
                    transition={{
                      duration: 0.3,
                    }}
                    className="
                      flex
                      gap-4
                      rounded-2xl
                      border
                      border-white/[0.06]
                      bg-ink-800/40
                      p-4
                    "
                  >

                    {/* PRODUCT IMAGE */}

                    <Link
                      to={`/product/${item.productId}`}
                      className="
                        flex
                        h-24
                        w-24
                        shrink-0
                        items-center
                        justify-center
                        overflow-hidden
                        rounded-xl
                        bg-white
                        p-2
                        sm:h-28
                        sm:w-28
                      "
                    >

                      <img
                        src={item.image}
                        alt={item.name}
                        draggable={false}
                        className="
                          h-full
                          w-full
                          object-contain
                        "
                      />

                    </Link>

                    {/* PRODUCT INFO */}

                    <div className="flex min-w-0 flex-1 flex-col gap-2">

                      <div className="flex items-start justify-between gap-3">

                        <div className="min-w-0">

                          <p className="text-xs font-medium uppercase tracking-wide text-white/40">
                            {item.brand}
                          </p>

                          <Link
                            to={`/product/${item.productId}`}
                            className="
                              font-display
                              text-base
                              font-medium
                              text-white
                              transition-colors
                              hover:text-accent-300
                            "
                          >
                            {item.name}
                          </Link>

                          {/* VARIANT BADGES */}

                          <div className="mt-1 flex flex-wrap gap-2">

                            {Object.entries(
                              item.variant,
                            ).map(
                              ([
                                key,
                                value,
                              ]) => (

                                <span
                                  key={key}
                                  className="
                                    rounded-md
                                    bg-white/[0.04]
                                    px-2
                                    py-0.5
                                    text-xs
                                    text-white/50
                                  "
                                >
                                  {key}: {value}
                                </span>

                              ),
                            )}

                          </div>

                          {/* SKU */}

                          {item.sku && (

                            <p className="mt-1 text-[11px] text-white/25">
                              SKU: {item.sku}
                            </p>

                          )}

                        </div>

                        {/* =================================
                            PKR ITEM TOTAL
                        ================================= */}

                        <span className="shrink-0 font-display text-lg font-semibold text-white">

                          {formatPKR(
                            itemTotal,
                          )}

                        </span>

                      </div>

                      {/* =================================
                          QUANTITY + ACTIONS
                      ================================= */}

                      <div className="mt-auto flex flex-wrap items-center justify-between gap-3">

                        {/* QUANTITY */}

                        <div
                          className="
                            flex
                            items-center
                            gap-1
                            rounded-lg
                            border
                            border-white/10
                            p-0.5
                          "
                        >

                          {/* MINUS */}

                          <button
                            type="button"
                            onClick={() =>
                              handleDecrease(
                                item.productId,
                                vKey,
                                item.quantity,
                              )
                            }
                            aria-label={
                              item.quantity === 1
                                ? `Remove ${item.name}`
                                : `Decrease ${item.name} quantity`
                            }
                            className="
                              flex
                              h-8
                              w-8
                              items-center
                              justify-center
                              rounded-md
                              text-white/60
                              transition-colors
                              hover:bg-white/[0.04]
                              hover:text-white
                            "
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>

                          <span className="w-8 text-center text-sm font-medium text-white">
                            {item.quantity}
                          </span>

                          {/* PLUS */}

                          <button
                            type="button"
                            disabled={
                              atMaxStock
                            }
                            onClick={() =>
                              handleIncrease(
                                item.productId,
                                vKey,
                                item.quantity,
                                item.maxStock,
                              )
                            }
                            aria-label={`Increase ${item.name} quantity`}
                            className="
                              flex
                              h-8
                              w-8
                              items-center
                              justify-center
                              rounded-md
                              text-white/60
                              transition-colors
                              hover:bg-white/[0.04]
                              hover:text-white
                              disabled:cursor-not-allowed
                              disabled:opacity-30
                            "
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>

                        </div>

                        {/* ACTIONS */}

                        <div className="flex items-center gap-3">

                          <button
                            type="button"
                            onClick={() =>
                              saveForLater(
                                item.productId,
                                vKey,
                              )
                            }
                            className="
                              flex
                              items-center
                              gap-1.5
                              text-xs
                              text-white/40
                              transition-colors
                              hover:text-accent-300
                            "
                          >
                            <Bookmark className="h-3.5 w-3.5" />
                            Save
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              removeFromCart(
                                item.productId,
                                vKey,
                              )
                            }
                            className="
                              flex
                              items-center
                              gap-1.5
                              text-xs
                              text-white/40
                              transition-colors
                              hover:text-rose-400
                            "
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Remove
                          </button>

                        </div>

                      </div>

                      {/* MAX STOCK MESSAGE */}

                      {atMaxStock && (

                        <p className="text-[11px] text-amber-300/70">
                          Maximum available quantity reached.
                        </p>

                      )}

                    </div>

                  </motion.div>
                )
              })}

            </AnimatePresence>

          </div>

          {/* =============================================
              ORDER SUMMARY
          ============================================= */}

          <div
            className="
              sticky
              top-24
              h-fit
              space-y-4
              rounded-2xl
              border
              border-white/[0.06]
              bg-ink-800/40
              p-6
            "
          >

            <h3 className="font-display text-lg font-semibold text-white">
              Order Summary
            </h3>

            {/* =============================================
                PROMO CODE
            ============================================= */}

            <div>

              <div className="flex gap-2">

                <div className="relative flex-1">

                  <Tag
                    className="
                      absolute
                      left-3
                      top-1/2
                      h-4
                      w-4
                      -translate-y-1/2
                      text-white/30
                    "
                  />

                  <input
                    value={promo}
                    onChange={(event) => {
                      setPromo(
                        event.target.value,
                      )

                      if (promoApplied) {
                        setPromoApplied(
                          false,
                        )
                      }
                    }}
                    onKeyDown={(event) => {
                      if (
                        event.key ===
                        'Enter'
                      ) {
                        handlePromo()
                      }
                    }}
                    placeholder="Promo code"
                    className="input-field py-2.5 pl-9 text-sm"
                  />

                </div>

                <button
                  type="button"
                  onClick={
                    handlePromo
                  }
                  className="
                    rounded-xl
                    border
                    border-white/10
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-white/70
                    transition-colors
                    hover:border-accent-400/40
                    hover:text-accent-300
                  "
                >
                  Apply
                </button>

              </div>

              {promoApplied ? (

                <p className="mt-2 text-xs text-green-400">
                  NOVA10 applied — 10% off!
                </p>

              ) : (

                <p className="mt-2 text-xs text-white/30">
                  Try code: NOVA10
                </p>

              )}

            </div>

            {/* =============================================
                PKR TOTALS
            ============================================= */}

            <div className="space-y-2 border-t border-white/[0.06] pt-4">

              {/* SUBTOTAL */}

              <div className="flex justify-between gap-4 text-sm">

                <span className="text-white/50">
                  Subtotal
                </span>

                <span className="text-right text-white">
                  {formatPKR(
                    cartTotal,
                  )}
                </span>

              </div>

              {/* SHIPPING */}

              <div className="flex justify-between gap-4 text-sm">

                <span className="text-white/50">
                  Shipping
                </span>

                <span
                  className={`text-right ${
                    shipping === 0
                      ? 'text-green-400'
                      : 'text-white'
                  }`}
                >
                  {shipping === 0
                    ? 'Free'
                    : formatPKR(
                        shipping,
                      )}
                </span>

              </div>

              {/* DISCOUNT */}

              {discount > 0 && (

                <div className="flex justify-between gap-4 text-sm">

                  <span className="text-white/50">
                    Discount
                  </span>

                  <span className="text-right text-green-400">
                    -
                    {formatPKR(
                      discount,
                    )}
                  </span>

                </div>

              )}

              {/* TOTAL */}

              <div className="flex justify-between gap-4 border-t border-white/[0.06] pt-3">

                <span className="font-display text-lg font-semibold text-white">
                  Total
                </span>

                <span className="text-right font-display text-lg font-semibold text-white">
                  {formatPKR(
                    total,
                  )}
                </span>

              </div>

            </div>

            {/* =============================================
                CHECKOUT
            ============================================= */}

            <Link
              to="/checkout"
              className="btn-accent group w-full"
            >
              Checkout

              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              to="/shop"
              className="
                block
                text-center
                text-sm
                text-white/40
                transition-colors
                hover:text-white/70
              "
            >
              Continue shopping
            </Link>

          </div>

        </div>

      </div>

    </div>
  )
}