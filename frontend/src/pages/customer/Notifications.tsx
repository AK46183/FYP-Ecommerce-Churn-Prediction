import {
  motion,
} from 'framer-motion'

import {
  Bell,
  Heart,
  MessageSquare,
  Package,
  Tag,
} from 'lucide-react'

import {
  EmptyState,
  PageHeader,
} from '@/components/ui'

import {
  getProductById,
} from '@/data/products'

import {
  formatPKR,
} from '@/utils/currency'

/* =====================================================
   CURRENT PRODUCT DATA
===================================================== */

const appleWatch =
  getProductById(
    'applewatchultra2',
  )

const sonyHeadphones =
  getProductById(
    'sonywh1000xm5',
  )

const boseHeadphones =
  getProductById(
    'boseqcultra',
  )

const pixel =
  getProductById(
    'pixel9pro',
  )

const lgTv =
  getProductById(
    'lgoledc4',
  )

/* =====================================================
   NOTIFICATIONS
===================================================== */

const notifications = [
  {
    id: 1,
    icon: Package,
    title:
      'Order Delivered',

    desc:
      `Your ${
        appleWatch?.name ??
        'Apple Watch Ultra 2'
      } has been delivered.`,

    time:
      '2 hours ago',

    read:
      false,
  },

  {
    id: 2,
    icon: Tag,
    title:
      'Price Drop Alert',

    desc:
      sonyHeadphones
        ? `${sonyHeadphones.name} is now ${formatPKR(
            sonyHeadphones.price,
          )}${
            sonyHeadphones.oldPrice
              ? ` (was ${formatPKR(
                  sonyHeadphones.oldPrice,
                )})`
              : ''
          }.`
        : 'Sony WH-1000XM5 is now available at a reduced price.',

    time:
      '5 hours ago',

    read:
      false,
  },

  {
    id: 3,
    icon: Heart,
    title:
      'Wishlist Item on Sale',

    desc:
      boseHeadphones
        ? `${boseHeadphones.name} is now ${formatPKR(
            boseHeadphones.price,
          )}. Grab it before it's gone!`
        : 'Bose QuietComfort Ultra is currently on sale.',

    time:
      '1 day ago',

    read:
      true,
  },

  {
    id: 4,
    icon: MessageSquare,
    title:
      'NOVA AI Recommendation',

    desc:
      `Based on your browsing, you might like the ${
        pixel?.name ??
        'Google Pixel 9 Pro'
      }.`,

    time:
      '2 days ago',

    read:
      true,
  },

  {
    id: 5,
    icon: Package,
    title:
      'Order Shipped',

    desc:
      `Your ${
        lgTv?.name ??
        'LG OLED evo C4'
      } 65" is on the way. Tracking: NOVA-TRK-8842`,

    time:
      '3 days ago',

    read:
      true,
  },
]

export default function Notifications() {
  return (
    <div>

      <PageHeader
        title="Notifications"
        subtitle="Stay updated on your orders and offers"
        breadcrumb="Home / Notifications"
      />

      <div className="container-wide section-pad py-12">

        {notifications.length >
        0 ? (

          <div className="space-y-2">

            {notifications.map(
              (
                notification,
                index,
              ) => (

                <motion.div
                  key={
                    notification.id
                  }
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay:
                      index *
                      0.06,
                    duration:
                      0.4,
                  }}
                  className={`
                    flex
                    items-start
                    gap-4
                    rounded-2xl
                    border
                    p-5

                    ${
                      notification.read
                        ? 'border-white/[0.06] bg-ink-800/30'
                        : 'border-accent-400/20 bg-accent-400/5'
                    }
                  `}
                >

                  {/* ICON */}

                  <div
                    className={`
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl

                      ${
                        notification.read
                          ? 'bg-white/[0.04]'
                          : 'bg-accent-400/15'
                      }
                    `}
                  >

                    <notification.icon
                      className={`
                        h-5
                        w-5

                        ${
                          notification.read
                            ? 'text-white/40'
                            : 'text-accent-300'
                        }
                      `}
                    />

                  </div>

                  {/* CONTENT */}

                  <div className="flex-1">

                    <p className="text-sm font-medium text-white">
                      {
                        notification.title
                      }
                    </p>

                    <p className="mt-0.5 text-sm text-white/50">
                      {
                        notification.desc
                      }
                    </p>

                    <p className="mt-1 text-xs text-white/30">
                      {
                        notification.time
                      }
                    </p>

                  </div>

                  {/* UNREAD DOT */}

                  {!notification.read && (

                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent-400" />

                  )}

                </motion.div>

              ),
            )}

          </div>

        ) : (

          <EmptyState
            icon={Bell}
            title="No notifications"
            description="You're all caught up!"
          />

        )}

      </div>

    </div>
  )
}