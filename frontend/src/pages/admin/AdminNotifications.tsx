import {
  AlertTriangle,
  MessageSquare,
  Package,
  Tag,
} from 'lucide-react'

import {
  PageTitle,
} from '@/components/admin/AdminUI'

import {
  getProductById,
} from '@/data/products'

import {
  formatPKR,
} from '@/utils/currency'

const appleWatch =
  getProductById(
    'applewatchultra2',
  )

const sonyHeadphones =
  getProductById(
    'sonywh1000xm5',
  )

const notifications = [
  {
    id: 1,
    icon: Package,
    title:
      'New Order Received',

    desc:
      `Order NOVA-7841 from Hamza Khan — ${
        appleWatch
          ? formatPKR(
              appleWatch.price,
            )
          : formatPKR(799)
      }`,

    time:
      '5 min ago',

    type:
      'order',
  },

  {
    id: 2,
    icon:
      AlertTriangle,

    title:
      'Low Stock Alert',

    desc:
      'Canon EOS R5 Mark II has only 8 units left',

    time:
      '1 hour ago',

    type:
      'inventory',
  },

  {
    id: 3,
    icon:
      AlertTriangle,

    title:
      'High Churn Risk Detected',

    desc:
      'Usman Tariq has 91% churn probability',

    time:
      '2 hours ago',

    type:
      'churn',
  },

  {
    id: 4,
    icon: Tag,
    title:
      'Price Drop Request',

    desc:
      `Competitor price match needed for ${
        sonyHeadphones?.name ??
        'Sony WH-1000XM5'
      }`,

    time:
      '3 hours ago',

    type:
      'pricing',
  },

  {
    id: 5,
    icon:
      MessageSquare,

    title:
      'Unresolved Chatbot Conversation',

    desc:
      'Fatima Noor has an unresolved complaint',

    time:
      '5 hours ago',

    type:
      'chatbot',
  },

  {
    id: 6,
    icon: Package,
    title:
      'Order Cancelled',

    desc:
      'Order NOVA-7835 was cancelled by Fatima Noor',

    time:
      '1 day ago',

    type:
      'order',
  },
]

export default function AdminNotifications() {
  return (
    <div>

      <PageTitle
        title="Notifications"
        subtitle="System alerts and updates"
        action={
          <button
            type="button"
            className="btn-ghost text-xs"
          >
            Mark all as read
          </button>
        }
      />

      <div className="space-y-2">

        {notifications.map(
          (
            notification,
          ) => {

            const isAlert =
              notification.type ===
                'churn' ||
              notification.type ===
                'inventory'

            const isOrder =
              notification.type ===
              'order'

            return (

              <div
                key={
                  notification.id
                }
                className="
                  flex
                  items-start
                  gap-4
                  rounded-2xl
                  border
                  border-white/[0.06]
                  bg-ink-800/40
                  p-4
                  transition-colors
                  hover:border-white/10
                "
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
                      isAlert
                        ? 'bg-rose-500/10'
                        : isOrder
                          ? 'bg-accent-400/10'
                          : 'bg-white/[0.04]'
                    }
                  `}
                >

                  <notification.icon
                    className={`
                      h-5
                      w-5

                      ${
                        isAlert
                          ? 'text-rose-400'
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

              </div>

            )
          },
        )}

      </div>

    </div>
  )
}