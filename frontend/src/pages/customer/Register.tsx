import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Lock, ArrowRight } from 'lucide-react'
import { useStore } from '@/context/StoreContext'

export default function Register() {
  const { register } = useStore()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    setTimeout(() => {
      const success = register(name, email, password)
      if (success) navigate('/profile')
      else { setError('Registration failed') }
      setLoading(false)
    }, 600)
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-24">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-400"><span className="font-display text-lg font-bold text-ink-950">N</span></div>
          <span className="font-display text-xl font-bold tracking-tight text-white">NOVA</span>
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="rounded-3xl border border-white/[0.06] bg-ink-900/60 p-8 backdrop-blur-xl">
          <h1 className="font-display text-2xl font-semibold text-white">Create account</h1>
          <p className="mt-2 text-sm text-white/40">Join NOVA for a premium shopping experience</p>

          {error && <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</div>}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/40">Full Name</label>
              <div className="relative"><User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" /><input required value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="input-field pl-10" /></div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/40">Email</label>
              <div className="relative"><Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" /><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="input-field pl-10" /></div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/40">Password</label>
              <div className="relative"><Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" /><input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" className="input-field pl-10" /></div>
            </div>
            <button type="submit" disabled={loading} className="btn-accent w-full">{loading ? 'Creating...' : <>Create Account <ArrowRight className="h-4 w-4" /></>}</button>
          </form>
          <p className="mt-6 text-center text-sm text-white/40">Already have an account? <Link to="/login" className="font-medium text-accent-300 hover:text-accent-200">Sign in</Link></p>
        </motion.div>
      </div>
    </div>
  )
}
