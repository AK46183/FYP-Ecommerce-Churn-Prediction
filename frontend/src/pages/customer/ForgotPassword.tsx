import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, ArrowRight, Check } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-24">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-400"><span className="font-display text-lg font-bold text-ink-950">N</span></div>
          <span className="font-display text-xl font-bold tracking-tight text-white">NOVA</span>
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="rounded-3xl border border-white/[0.06] bg-ink-900/60 p-8 backdrop-blur-xl">
          {sent ? (
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20"><Check className="h-8 w-8 text-green-400" /></div>
              <h1 className="mt-6 font-display text-2xl font-semibold text-white">Check your email</h1>
              <p className="mt-2 text-sm text-white/50">We've sent a password reset link to <span className="text-accent-300">{email}</span></p>
              <Link to="/login" className="btn-ghost mt-6">Back to Login</Link>
            </div>
          ) : (
            <>
              <h1 className="font-display text-2xl font-semibold text-white">Forgot Password?</h1>
              <p className="mt-2 text-sm text-white/40">Enter your email and we'll send you a reset link</p>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/40">Email</label>
                  <div className="relative"><Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" /><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="input-field pl-10" /></div>
                </div>
                <button type="submit" className="btn-accent w-full">Send Reset Link <ArrowRight className="h-4 w-4" /></button>
              </form>
              <p className="mt-6 text-center text-sm text-white/40">Remember your password? <Link to="/login" className="font-medium text-accent-300">Sign in</Link></p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}
