import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <div className="text-center">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
          <p className="font-display text-[clamp(5rem,20vw,12rem)] font-bold leading-none text-gradient">404</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
          <h1 className="font-display text-2xl font-semibold text-white">Page Not Found</h1>
          <p className="mt-3 text-white/50">The page you're looking for doesn't exist or has been moved.</p>
          <Link to="/" className="btn-accent mt-8"><Home className="h-4 w-4" /> Back to Home</Link>
        </motion.div>
      </div>
    </div>
  )
}
