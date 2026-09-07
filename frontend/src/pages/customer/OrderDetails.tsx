import {
  Link,
  useParams,
} from 'react-router-dom'

import {
  motion,
} from 'framer-motion'

import {
  CheckCircle,
  Home,
  MapPin,
  Package,
  Truck,
} from 'lucide-react'

import {
  getProductById,
} from '@/data/products'

import {
  getProductImage,
} from '@/data/images'

import {
  formatPKR,
} from '@/utils/currency'

export default function OrderDetails() {
  const { id } = useParams()

  /* =====================================================
     DEMO ORDER DATA

     Values stay internally in base USD.
     Display is converted to PKR.
  ===================================================== */

  const orderItems = [
    {
      productId:
        'applewatchultra2',
      quantity: 1,
      price: 799,
    },
  ]

  const subtotal =
    orderItems.reduce(
      (
        total,
        item,
      ) =>
        total +
        item.price *
          item.quantity,
      0,
    )

  const shippingCost = 0

  const tax = 64

  const total =
    subtotal +
    shippingCost +
    tax

  /* =====================================================
     TIMELINE
  ===================================================== */

  const timeline = [
    {
      icon: CheckCircle,
      title:
        'Order Placed',
      date:
        'Aug 29, 2026 · 2:30 PM',
      desc:
        'Order confirmed and payment received',
      done: true,
    },

    {
      icon: Package,
      title:
        'Processing',
      date:
        'Aug 29, 2026 · 4:00 PM',
      desc:
        'Order is being prepared for shipment',
      done: true,
    },

    {
      icon: Truck,
      title:
        'Shipped',
      date:
        'Aug 30, 2026 · 9:15 AM',
      desc:
        'Package picked up by courier · Tracking: NOVA-TRK-8842',
      done: true,
    },

    {
      icon: Home,
      title:
        'Delivered',
      date:
        'Sep 1, 2026 · 2:45 PM',
      desc:
        'Package delivered to your address',
      done: true,
    },
  ]

  return (
    <div className="pt-20">

      <div className="container-wide section-pad py-8">

        {/* =================================================
            BREADCRUMB
        ================================================= */}

        <div className="mb-6 flex items-center gap-1.5 text-sm text-white/40">

          <Link
            to="/orders"
            className="transition-colors hover:text-white/70"
          >
            Orders
          </Link>

          <span>/</span>

          <span className="text-white/60">
            {id || 'Order'}
          </span>

        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">

          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <div className="space-y-8">

            {/* ORDER HEADER */}

            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
              }}
            >

              <h1 className="font-display text-2xl font-semibold text-white">
                Order {id}
              </h1>

              <p className="mt-1 text-sm text-white/40">
                Placed on Aug 29, 2026
              </p>

              <span
                className="
                  mt-3
                  inline-block
                  rounded-full
                  bg-green-500/10
                  px-3
                  py-1
                  text-xs
                  font-medium
                  text-green-400
                "
              >
                Delivered
              </span>

            </motion.div>

            {/* =================================================
                TIMELINE
            ================================================= */}

            <div className="rounded-2xl border border-white/[0.06] bg-ink-800/40 p-6">

              <h2 className="mb-6 font-display text-lg font-semibold text-white">
                Order Timeline
              </h2>

              <div className="space-y-6">

                {timeline.map(
                  (
                    step,
                    index,
                  ) => (

                    <div
                      key={
                        step.title
                      }
                      className="flex gap-4"
                    >

                      <div className="flex flex-col items-center">

                        <div
                          className={`
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-full

                            ${
                              step.done
                                ? 'bg-accent-400/20 text-accent-300'
                                : 'bg-white/[0.04] text-white/30'
                            }
                          `}
                        >

                          <step.icon className="h-5 w-5" />

                        </div>

                        {index <
                          timeline.length -
                            1 && (

                          <div className="mt-2 h-full w-px flex-1 bg-white/[0.06]" />

                        )}

                      </div>

                      <div className="flex-1 pb-6">

                        <p className="text-sm font-medium text-white">
                          {step.title}
                        </p>

                        <p className="text-xs text-white/40">
                          {step.date}
                        </p>

                        <p className="mt-1 text-sm text-white/50">
                          {step.desc}
                        </p>

                      </div>

                    </div>

                  ),
                )}

              </div>

            </div>

            {/* =================================================
                ITEMS
            ================================================= */}

            <div className="rounded-2xl border border-white/[0.06] bg-ink-800/40 p-6">

              <h2 className="mb-4 font-display text-lg font-semibold text-white">
                Items
              </h2>

              {orderItems.map(
                (item) => {
                  const product =
                    getProductById(
                      item.productId,
                    )

                  if (!product) {
                    return null
                  }

                  const img =
                    getProductImage(
                      item.productId,
                    )

                  const itemTotal =
                    item.price *
                    item.quantity

                  return (
                    <div
                      key={
                        item.productId
                      }
                      className="
                        flex
                        items-center
                        gap-4
                        border-t
                        border-white/[0.06]
                        pt-4
                      "
                    >

                      {/* PRODUCT IMAGE */}

                      <Link
                        to={`/product/${item.productId}`}
                        className="
                          flex
                          h-16
                          w-16
                          shrink-0
                          items-center
                          justify-center
                          overflow-hidden
                          rounded-xl
                          bg-white
                          p-1.5
                        "
                      >

                        <img
                          src={
                            img.detailMain
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
                          "
                        />

                      </Link>

                      {/* PRODUCT INFO */}

                      <div className="min-w-0 flex-1">

                        <p className="text-sm font-medium text-white">
                          {
                            product.name
                          }
                        </p>

                        <p className="text-xs text-white/40">
                          {
                            product.brand
                          }{' '}
                          · Qty:{' '}
                          {
                            item.quantity
                          }
                        </p>

                      </div>

                      {/* PKR PRICE */}

                      <span className="shrink-0 font-display text-base font-semibold text-white">

                        {formatPKR(
                          itemTotal,
                        )}

                      </span>

                    </div>
                  )
                },
              )}

            </div>

          </div>

          {/* =================================================
              RIGHT SIDE — ORDER SUMMARY
          ================================================= */}

          <div
            className="
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

            {/* SHIPPING ADDRESS */}

            <div className="flex items-start gap-3 rounded-xl border border-white/[0.06] p-4">

              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />

              <div>

                <p className="text-xs font-medium uppercase tracking-wide text-white/40">
                  Shipping Address
                </p>

                <p className="mt-1 text-sm text-white/80">
                  John Doe
                </p>

                <p className="text-sm text-white/60">
                  123 Main Street,
                  Apt 4B
                </p>

                <p className="text-sm text-white/60">
                  Lahore, Punjab
                </p>

              </div>

            </div>

            {/* =================================================
                PKR TOTALS
            ================================================= */}

            <div className="space-y-2 border-t border-white/[0.06] pt-4">

              {/* SUBTOTAL */}

              <div className="flex justify-between gap-4 text-sm">

                <span className="text-white/50">
                  Subtotal
                </span>

                <span className="text-right text-white">

                  {formatPKR(
                    subtotal,
                  )}

                </span>

              </div>

              {/* SHIPPING */}

              <div className="flex justify-between gap-4 text-sm">

                <span className="text-white/50">
                  Shipping
                </span>

                <span
                  className={
                    shippingCost ===
                    0
                      ? 'text-green-400'
                      : 'text-white'
                  }
                >

                  {shippingCost ===
                  0
                    ? 'Free'
                    : formatPKR(
                        shippingCost,
                      )}

                </span>

              </div>

              {/* TAX */}

              <div className="flex justify-between gap-4 text-sm">

                <span className="text-white/50">
                  Tax
                </span>

                <span className="text-right text-white">

                  {formatPKR(
                    tax,
                  )}

                </span>

              </div>

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

            {/* PAYMENT */}

            <div className="rounded-xl border border-white/[0.06] p-3">

              <p className="text-xs text-white/40">
                Payment Method
              </p>

              <p className="mt-1 text-sm text-white">
                Visa •• 4242
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}