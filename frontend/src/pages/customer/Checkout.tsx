import { useState } from 'react'
import {
  Link,
  useNavigate,
} from 'react-router-dom'
import {
  AnimatePresence,
  motion,
} from 'framer-motion'
import {
  Check,
  ChevronRight,
  CreditCard,
  MapPin,
  ShieldCheck,
  Truck,
} from 'lucide-react'

import {
  useStore,
} from '@/context/StoreContext'

import {
  formatPKR,
} from '@/utils/currency'

import {
  trackEvent,
} from '@/services/tracking'

const steps = [
  'Shipping',
  'Payment',
  'Review',
  'Confirmation',
]

export default function Checkout() {
  const {
    cart,
    cartTotal,
  } = useStore()

  const navigate =
    useNavigate()

  const [
    step,
    setStep,
  ] = useState(0)

  const [
    shipping,
    setShipping,
  ] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    country: 'Pakistan',
    phone: '',
  })

  const [
    delivery,
    setDelivery,
  ] = useState('standard')

  const [
    payment,
    setPayment,
  ] = useState('card')

  const [
    card,
    setCard,
  ] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: '',
  })

  /* =====================================================
     DELIVERY + TOTAL

     Internal amounts remain in base USD.
     Only customer-facing display is converted to PKR.
  ===================================================== */

  const deliveryCost =
    delivery === 'express'
      ? 25
      : delivery === 'same-day'
        ? 40
        : cartTotal > 50
          ? 0
          : 15

  const total =
    cartTotal +
    deliveryCost

  /* =====================================================
     EMPTY CART
  ===================================================== */

  if (
    cart.length === 0 &&
    step < 3
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16">

        <div className="text-center">

          <h1 className="font-display text-2xl font-semibold text-white">
            Your cart is empty
          </h1>

          <Link
            to="/shop"
            className="btn-ghost mt-6"
          >
            Browse Products
          </Link>

        </div>

      </div>
    )
  }

  /* =====================================================
     NEXT STEP
  ===================================================== */

  const handleNext = () => {
    if (step === 2) {
      trackEvent(
        'purchase',
        {
          total,
          items:
            cart.length,
        },
      )

      trackEvent(
        'checkout_start',
        {
          step:
            'complete',
        },
      )
    }

    setStep(
      (currentStep) =>
        Math.min(
          3,
          currentStep + 1,
        ),
    )

    if (step === 2) {
      window.setTimeout(
        () =>
          navigate(
            '/order-success',
          ),
        2000,
      )
    }
  }

  const inputCls =
    'input-field py-2.5'

  /* =====================================================
     DELIVERY OPTIONS
  ===================================================== */

  const deliveryOptions = [
    {
      value: 'standard',
      label:
        'Standard Shipping',
      description:
        '3-5 business days',
      price:
        cartTotal > 50
          ? 'Free'
          : formatPKR(15),
    },

    {
      value: 'express',
      label:
        'Express Shipping',
      description:
        '1-2 business days',
      price:
        formatPKR(25),
    },

    {
      value: 'same-day',
      label:
        'Same-Day Delivery',
      description:
        'Within 4 hours (select areas)',
      price:
        formatPKR(40),
    },
  ]

  /* =====================================================
     PAYMENT OPTIONS
  ===================================================== */

  const paymentOptions = [
    {
      value: 'card',
      label:
        'Credit / Debit Card',
    },

    {
      value: 'paypal',
      label:
        'PayPal',
    },

    {
      value: 'apple-pay',
      label:
        'Apple Pay',
    },

    {
      value: 'cod',
      label:
        'Cash on Delivery',
    },
  ]

  return (
    <div className="pt-16">

      <div className="container-wide section-pad py-8">

        <p className="mb-2 text-sm text-white/40">
          Home / Checkout
        </p>

        <h1 className="heading-lg">
          Checkout
        </h1>

        {/* =================================================
            PROGRESS
        ================================================= */}

        <div className="mt-8 flex items-center gap-2">

          {steps.map(
            (
              stepName,
              index,
            ) => (

              <div
                key={
                  stepName
                }
                className="flex items-center gap-2"
              >

                <div
                  className={`
                    flex
                    items-center
                    gap-2
                    rounded-full
                    px-3
                    py-1.5
                    text-sm
                    font-medium
                    transition-colors

                    ${
                      index ===
                      step
                        ? 'bg-accent-400 text-ink-950'
                        : index <
                            step
                          ? 'bg-accent-400/20 text-accent-300'
                          : 'text-white/30'
                    }
                  `}
                >

                  {index < step ? (

                    <Check className="h-3.5 w-3.5" />

                  ) : (

                    <span className="text-xs">
                      {index + 1}
                    </span>

                  )}

                  <span className="hidden sm:inline">
                    {
                      stepName
                    }
                  </span>

                </div>

                {index <
                  steps.length -
                    1 && (

                  <ChevronRight className="h-4 w-4 text-white/20" />

                )}

              </div>

            ),
          )}

        </div>

        {/* =================================================
            CHECKOUT BODY
        ================================================= */}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">

          {/* =================================================
              FORM / STEPS
          ================================================= */}

          <div>

            <AnimatePresence mode="wait">

              <motion.div
                key={step}
                initial={{
                  opacity: 0,
                  x: 20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: -20,
                }}
                transition={{
                  duration:
                    0.4,
                  ease: [
                    0.16,
                    1,
                    0.3,
                    1,
                  ],
                }}
              >

                {/* =========================================
                    STEP 1 — SHIPPING
                ========================================= */}

                {step === 0 && (

                  <div className="space-y-5">

                    <div className="mb-4 flex items-center gap-2">

                      <MapPin className="h-5 w-5 text-accent-400" />

                      <h2 className="font-display text-xl font-semibold text-white">
                        Shipping Address
                      </h2>

                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">

                      <input
                        className={
                          inputCls
                        }
                        placeholder="Full name"
                        value={
                          shipping.name
                        }
                        onChange={(
                          event,
                        ) =>
                          setShipping(
                            {
                              ...shipping,
                              name:
                                event
                                  .target
                                  .value,
                            },
                          )
                        }
                      />

                      <input
                        className={
                          inputCls
                        }
                        placeholder="Email"
                        type="email"
                        value={
                          shipping.email
                        }
                        onChange={(
                          event,
                        ) =>
                          setShipping(
                            {
                              ...shipping,
                              email:
                                event
                                  .target
                                  .value,
                            },
                          )
                        }
                      />

                    </div>

                    <input
                      className={
                        inputCls
                      }
                      placeholder="Street address"
                      value={
                        shipping.address
                      }
                      onChange={(
                        event,
                      ) =>
                        setShipping(
                          {
                            ...shipping,
                            address:
                              event
                                .target
                                .value,
                          },
                        )
                      }
                    />

                    <div className="grid gap-4 sm:grid-cols-3">

                      <input
                        className={
                          inputCls
                        }
                        placeholder="City"
                        value={
                          shipping.city
                        }
                        onChange={(
                          event,
                        ) =>
                          setShipping(
                            {
                              ...shipping,
                              city:
                                event
                                  .target
                                  .value,
                            },
                          )
                        }
                      />

                      <input
                        className={
                          inputCls
                        }
                        placeholder="ZIP / Postal code"
                        value={
                          shipping.zip
                        }
                        onChange={(
                          event,
                        ) =>
                          setShipping(
                            {
                              ...shipping,
                              zip:
                                event
                                  .target
                                  .value,
                            },
                          )
                        }
                      />

                      <input
                        className={
                          inputCls
                        }
                        placeholder="Phone"
                        value={
                          shipping.phone
                        }
                        onChange={(
                          event,
                        ) =>
                          setShipping(
                            {
                              ...shipping,
                              phone:
                                event
                                  .target
                                  .value,
                            },
                          )
                        }
                      />

                    </div>

                    {/* DELIVERY */}

                    <div className="pt-4">

                      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/40">
                        Delivery Option
                      </h3>

                      <div className="space-y-2">

                        {deliveryOptions.map(
                          (
                            option,
                          ) => (

                            <button
                              key={
                                option.value
                              }
                              type="button"
                              onClick={() =>
                                setDelivery(
                                  option.value,
                                )
                              }
                              className={`
                                flex
                                w-full
                                items-center
                                justify-between
                                gap-4
                                rounded-xl
                                border
                                p-4
                                transition-colors

                                ${
                                  delivery ===
                                  option.value
                                    ? 'border-accent-400 bg-accent-400/5'
                                    : 'border-white/10 hover:border-white/25'
                                }
                              `}
                            >

                              <div className="flex items-center gap-3 text-left">

                                <Truck className="h-5 w-5 shrink-0 text-white/40" />

                                <div>

                                  <p className="text-sm font-medium text-white">
                                    {
                                      option.label
                                    }
                                  </p>

                                  <p className="text-xs text-white/40">
                                    {
                                      option.description
                                    }
                                  </p>

                                </div>

                              </div>

                              <span className="shrink-0 text-sm font-medium text-white">
                                {
                                  option.price
                                }
                              </span>

                            </button>

                          ),
                        )}

                      </div>

                    </div>

                  </div>

                )}

                {/* =========================================
                    STEP 2 — PAYMENT
                ========================================= */}

                {step === 1 && (

                  <div className="space-y-5">

                    <div className="mb-4 flex items-center gap-2">

                      <CreditCard className="h-5 w-5 text-accent-400" />

                      <h2 className="font-display text-xl font-semibold text-white">
                        Payment Method
                      </h2>

                    </div>

                    <div className="space-y-2">

                      {paymentOptions.map(
                        (
                          option,
                        ) => (

                          <button
                            key={
                              option.value
                            }
                            type="button"
                            onClick={() =>
                              setPayment(
                                option.value,
                              )
                            }
                            className={`
                              flex
                              w-full
                              items-center
                              justify-between
                              rounded-xl
                              border
                              p-4
                              transition-colors

                              ${
                                payment ===
                                option.value
                                  ? 'border-accent-400 bg-accent-400/5'
                                  : 'border-white/10 hover:border-white/25'
                              }
                            `}
                          >

                            <span className="text-sm font-medium text-white">
                              {
                                option.label
                              }
                            </span>

                            <div
                              className={`
                                h-4
                                w-4
                                rounded-full
                                border-2

                                ${
                                  payment ===
                                  option.value
                                    ? 'border-accent-400 bg-accent-400'
                                    : 'border-white/20'
                                }
                              `}
                            />

                          </button>

                        ),
                      )}

                    </div>

                    {payment ===
                      'card' && (

                      <div className="space-y-4 rounded-xl border border-white/[0.06] bg-ink-800/40 p-5">

                        <input
                          className={
                            inputCls
                          }
                          placeholder="Card number"
                          value={
                            card.number
                          }
                          onChange={(
                            event,
                          ) =>
                            setCard(
                              {
                                ...card,
                                number:
                                  event
                                    .target
                                    .value,
                              },
                            )
                          }
                        />

                        <input
                          className={
                            inputCls
                          }
                          placeholder="Name on card"
                          value={
                            card.name
                          }
                          onChange={(
                            event,
                          ) =>
                            setCard(
                              {
                                ...card,
                                name:
                                  event
                                    .target
                                    .value,
                              },
                            )
                          }
                        />

                        <div className="grid grid-cols-2 gap-4">

                          <input
                            className={
                              inputCls
                            }
                            placeholder="MM / YY"
                            value={
                              card.expiry
                            }
                            onChange={(
                              event,
                            ) =>
                              setCard(
                                {
                                  ...card,
                                  expiry:
                                    event
                                      .target
                                      .value,
                                },
                              )
                            }
                          />

                          <input
                            className={
                              inputCls
                            }
                            placeholder="CVC"
                            value={
                              card.cvc
                            }
                            onChange={(
                              event,
                            ) =>
                              setCard(
                                {
                                  ...card,
                                  cvc:
                                    event
                                      .target
                                      .value,
                                },
                              )
                            }
                          />

                        </div>

                        <p className="flex items-center gap-1.5 text-xs text-white/30">

                          <ShieldCheck className="h-3.5 w-3.5" />

                          Your payment information is encrypted and secure.

                        </p>

                      </div>

                    )}

                  </div>

                )}

                {/* =========================================
                    STEP 3 — REVIEW
                ========================================= */}

                {step === 2 && (

                  <div className="space-y-5">

                    <h2 className="font-display text-xl font-semibold text-white">
                      Review Your Order
                    </h2>

                    {/* SHIPPING REVIEW */}

                    <div className="rounded-xl border border-white/[0.06] bg-ink-800/40 p-5">

                      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/40">
                        Shipping To
                      </h3>

                      <p className="text-sm text-white/80">
                        {shipping.name ||
                          '—'}
                      </p>

                      <p className="text-sm text-white/60">
                        {shipping.address ||
                          '—'}
                        ,{' '}
                        {shipping.city ||
                          '—'}{' '}
                        {shipping.zip ||
                          '—'}
                      </p>

                      <p className="text-sm text-white/60">
                        {shipping.email ||
                          '—'}{' '}
                        ·{' '}
                        {shipping.phone ||
                          '—'}
                      </p>

                      <p className="mt-1 text-sm text-white/40">
                        {
                          shipping.country
                        }
                      </p>

                    </div>

                    {/* PAYMENT REVIEW */}

                    <div className="rounded-xl border border-white/[0.06] bg-ink-800/40 p-5">

                      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/40">
                        Payment
                      </h3>

                      <p className="text-sm text-white/80">

                        {payment ===
                        'card'
                          ? `Card ending in ${card.number.slice(-4) || '••••'}`
                          : payment ===
                              'paypal'
                            ? 'PayPal'
                            : payment ===
                                'apple-pay'
                              ? 'Apple Pay'
                              : 'Cash on Delivery'}

                      </p>

                    </div>

                    {/* ITEMS REVIEW */}

                    <div className="rounded-xl border border-white/[0.06] bg-ink-800/40 p-5">

                      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/40">
                        Items (
                        {
                          cart.length
                        }
                        )
                      </h3>

                      {cart.map(
                        (
                          item,
                        ) => {

                          const itemTotal =
                            item.price *
                            item.quantity

                          return (
                            <div
                              key={
                                item.productId +
                                JSON.stringify(
                                  item.variant,
                                )
                              }
                              className="flex items-center gap-3 py-2"
                            >

                              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white p-1">

                                <img
                                  src={
                                    item.image
                                  }
                                  alt={
                                    item.name
                                  }
                                  draggable={
                                    false
                                  }
                                  className="h-full w-full object-contain"
                                />

                              </div>

                              <div className="min-w-0 flex-1">

                                <p className="truncate text-sm text-white">
                                  {
                                    item.name
                                  }
                                </p>

                                <p className="text-xs text-white/40">
                                  Qty:{' '}
                                  {
                                    item.quantity
                                  }
                                </p>

                              </div>

                              <span className="shrink-0 text-sm font-medium text-white">

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

                )}

                {/* =========================================
                    STEP 4 — CONFIRMATION
                ========================================= */}

                {step === 3 && (

                  <div className="flex flex-col items-center justify-center py-20 text-center">

                    <motion.div
                      initial={{
                        scale: 0,
                      }}
                      animate={{
                        scale: 1,
                      }}
                      transition={{
                        type:
                          'spring',
                        duration:
                          0.8,
                      }}
                      className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20"
                    >
                      <Check className="h-10 w-10 text-green-400" />
                    </motion.div>

                    <h2 className="mt-6 font-display text-2xl font-semibold text-white">
                      Order Confirmed!
                    </h2>

                    <p className="mt-2 text-white/50">
                      Redirecting to your order confirmation...
                    </p>

                  </div>

                )}

              </motion.div>

            </AnimatePresence>

            {/* =============================================
                NAVIGATION BUTTONS
            ============================================= */}

            {step < 3 && (

              <div className="mt-8 flex gap-3">

                {step > 0 && (

                  <button
                    type="button"
                    onClick={() =>
                      setStep(
                        (
                          currentStep,
                        ) =>
                          currentStep -
                          1,
                      )
                    }
                    className="btn-ghost"
                  >
                    Back
                  </button>

                )}

                <button
                  type="button"
                  onClick={
                    handleNext
                  }
                  className="btn-accent flex-1"
                >

                  {step === 2
                    ? 'Place Order'
                    : 'Continue'}

                  <ChevronRight className="h-4 w-4" />

                </button>

              </div>

            )}

          </div>

          {/* =================================================
              ORDER SUMMARY
          ================================================= */}

          <div className="sticky top-24 h-fit space-y-4 rounded-2xl border border-white/[0.06] bg-ink-800/40 p-6">

            <h3 className="font-display text-base font-semibold text-white">
              Order Summary
            </h3>

            {/* ITEMS */}

            <div className="max-h-60 space-y-3 overflow-y-auto">

              {cart.map(
                (
                  item,
                ) => {

                  const itemTotal =
                    item.price *
                    item.quantity

                  return (
                    <div
                      key={
                        item.productId +
                        JSON.stringify(
                          item.variant,
                        )
                      }
                      className="flex items-center gap-3"
                    >

                      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-white p-1">

                        <img
                          src={
                            item.image
                          }
                          alt={
                            item.name
                          }
                          draggable={
                            false
                          }
                          className="h-full w-full object-contain"
                        />

                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent-400 text-[10px] font-bold text-ink-950">
                          {
                            item.quantity
                          }
                        </span>

                      </div>

                      <div className="min-w-0 flex-1">

                        <p className="truncate text-xs font-medium text-white">
                          {
                            item.name
                          }
                        </p>

                        <p className="text-xs text-white/40">
                          {
                            item.brand
                          }
                        </p>

                      </div>

                      <span className="shrink-0 text-sm text-white">

                        {formatPKR(
                          itemTotal,
                        )}

                      </span>

                    </div>
                  )
                },
              )}

            </div>

            {/* =============================================
                PKR TOTALS
            ============================================= */}

            <div className="space-y-2 border-t border-white/[0.06] pt-4">

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

              <div className="flex justify-between gap-4 text-sm">

                <span className="text-white/50">
                  Delivery
                </span>

                <span
                  className={`text-right ${
                    deliveryCost ===
                    0
                      ? 'text-green-400'
                      : 'text-white'
                  }`}
                >

                  {deliveryCost ===
                  0
                    ? 'Free'
                    : formatPKR(
                        deliveryCost,
                      )}

                </span>

              </div>

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

          </div>

        </div>

      </div>

    </div>
  )
}