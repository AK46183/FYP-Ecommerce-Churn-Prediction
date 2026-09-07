import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package, ChevronRight } from 'lucide-react'
import { PageHeader, EmptyState } from '@/components/ui'
import { formatPKR } from '@/utils/currency'

const mockOrders = [
  {
    id: 'NOVA-7841',
    date: 'Aug 29, 2026',
    total: 799,
    status: 'Delivered',
    items: 1,
    product: 'Apple Watch Ultra 2',
  },
  {
    id: 'NOVA-7320',
    date: 'Aug 15, 2026',
    total: 2499,
    status: 'Delivered',
    items: 1,
    product: 'LG OLED evo C4 65"',
  },
  {
    id: 'NOVA-6890',
    date: 'Jul 22, 2026',
    total: 1899,
    status: 'Delivered',
    items: 1,
    product: 'Dell XPS 15',
  },
  {
    id: 'NOVA-6451',
    date: 'Jun 30, 2026',
    total: 449,
    status: 'Delivered',
    items: 2,
    product: 'Sony WH-1000XM5',
  },
]

const statusColors: Record<string, string> = {
  Delivered: 'text-green-400 bg-green-500/10',
  Shipped: 'text-accent-300 bg-accent-400/10',
  Processing: 'text-amber-400 bg-amber-500/10',
  Cancelled: 'text-rose-400 bg-rose-500/10',
}

export default function MyOrders() {
  return (
    <div>
      <PageHeader
        title="My Orders"
        subtitle="Track and manage your purchases"
        breadcrumb="Home / Orders"
      />

      <div className="container-wide section-pad py-12">
        {mockOrders.length > 0 ? (
          <div className="space-y-3">
            {mockOrders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: i * 0.08,
                  duration: 0.5,
                }}
              >
                <Link
                  to={`/orders/${order.id}`}
                  className="group flex flex-col gap-4 rounded-2xl border border-white/[0.06] bg-ink-800/40 p-5 transition-colors hover:border-white/15 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent-400/10">
                      <Package className="h-6 w-6 text-accent-300" />
                    </div>

                    <div>
                      <p className="font-display text-base font-medium text-white">
                        {order.id}
                      </p>

                      <p className="text-sm text-white/40">
                        {order.product} · {order.items} item
                        {order.items > 1 ? 's' : ''}
                      </p>

                      <p className="mt-0.5 text-xs text-white/30">
                        {order.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[order.status]}`}
                    >
                      {order.status}
                    </span>

                    <span className="font-display text-lg font-semibold text-white">
                      {formatPKR(order.total)}
                    </span>

                    <ChevronRight className="h-5 w-5 text-white/20 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Package}
            title="No orders yet"
            description="When you place your first order, it will appear here."
            action={
              <Link
                to="/shop"
                className="btn-accent"
              >
                Start Shopping
              </Link>
            }
          />
        )}
      </div>
    </div>
  )
}