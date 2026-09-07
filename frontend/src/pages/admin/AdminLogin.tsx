import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Mail, ArrowRight, Shield, Eye, EyeOff } from 'lucide-react'
import { useStore } from '@/context/StoreContext'

export default function AdminLogin() {
  const { login } = useStore()
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@nova.com')
  const [password, setPassword] = useState('admin')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setTimeout(() => {
      const success = login(email, password)
      if (success && email === 'admin@nova.com') navigate('/admin')
      else { setError('Invalid admin credentials') }
      setLoading(false)
    }, 600)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-5">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }} className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-500/10 blur-[120px]" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative z-10 w-full max-w-md rounded-3xl border border-white/[0.06] bg-ink-900/80 p-8 backdrop-blur-xl">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-400"><span className="font-display text-lg font-bold text-ink-950">N</span></div>
          <span className="font-display text-xl font-bold tracking-tight text-white">NOVA</span>
        </Link>

        <div className="mb-6 flex items-center justify-center gap-2 text-sm text-accent-300"><Shield className="h-4 w-4" /><span>Admin Portal Access</span></div>

        {error && <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/40">Admin Email</label>
            <div className="relative"><Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" /><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pl-10" /></div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/40">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              <input type={showPass ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pl-10 pr-10" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">{showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-accent w-full">{loading ? 'Authenticating...' : <>Access Dashboard <ArrowRight className="h-4 w-4" /></>}</button>
        </form>

        <div className="mt-6 rounded-xl border border-white/[0.06] bg-ink-800/40 p-3 text-center">
          <p className="text-xs text-white/40">Demo credentials: <span className="text-accent-300">admin@nova.com / admin</span></p>
        </div>
        <Link to="/" className="mt-4 block text-center text-xs text-white/30 hover:text-white/60">← Back to store</Link>
      </motion.div>
    </div>
  )
}
