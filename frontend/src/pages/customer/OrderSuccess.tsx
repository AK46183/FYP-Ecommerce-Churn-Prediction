import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Package, Truck, Home } from 'lucide-react'
import { useStore } from '@/context/StoreContext'

export default function OrderSuccess() {
  const { cartTotal } = useStore()
  const orderId = `NOVA-${Date.now().toString().slice(-6)}`

  return (
    <div className="pt-24">
      <div className="container-wide section-pad py-16">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-500/20">
            <Check className="h-12 w-12 text-green-400" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
            <h1 className="mt-8 heading-md">Thank You for Your Order!</h1>
            <p className="mt-3 text-white/50">Your order has been confirmed and is being processed. A confirmation email has been sent.</p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-ink-800/40 px-5 py-2.5">
              <span className="text-sm text-white/40">Order ID:</span>
              <span className="font-display text-sm font-semibold text-accent-300">{orderId}</span>
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }} className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Check, title: 'Order Confirmed', desc: 'Just now', active: true },
              { icon: Package, title: 'Processing', desc: 'Within 24 hours', active: false },
              { icon: Truck, title: 'On the Way', desc: '3-5 business days', active: false },
            ].map((step, i) => (
              <div key={i} className={`rounded-2xl border p-5 ${step.active ? 'border-accent-400/40 bg-accent-400/5' : 'border-white/[0.06] bg-ink-800/30'}`}>
                <step.icon className={`mx-auto h-6 w-6 ${step.active ? 'text-accent-400' : 'text-white/30'}`} />
                <p className="mt-3 text-sm font-medium text-white">{step.title}</p>
                <p className="mt-1 text-xs text-white/40">{step.desc}</p>
              </div>
            ))}
          </motion.div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link to="/orders" className="btn-accent">View My Orders</Link>
            <Link to="/shop" className="btn-ghost"><Home className="h-4 w-4" /> Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
