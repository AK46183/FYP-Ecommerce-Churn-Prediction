import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, MessageSquare, Send } from 'lucide-react'
import { PageHeader } from '@/components/ui'

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSent(true) }

  return (
    <div>
      <PageHeader title="Get in Touch" subtitle="Questions, feedback, or just want to say hello? We're here to help." breadcrumb="Home / Contact" />
      <div className="container-wide section-pad py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* Form */}
          <div className="rounded-2xl border border-white/[0.06] bg-ink-800/40 p-6 sm:p-8">
            {sent ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20"><Send className="h-8 w-8 text-green-400" /></div>
                <h2 className="mt-6 font-display text-xl font-semibold text-white">Message Sent!</h2>
                <p className="mt-2 text-sm text-white/50">We'll get back to you within 24 hours.</p>
                <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }} className="btn-ghost mt-6">Send Another</button>
              </motion.div>
            ) : (
              <>
                <h2 className="font-display text-xl font-semibold text-white">Send us a message</h2>
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div><label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/40">Name</label><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" /></div>
                    <div><label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/40">Email</label><input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" /></div>
                  </div>
                  <div><label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/40">Subject</label><input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="input-field" /></div>
                  <div><label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/40">Message</label><textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input-field resize-none" /></div>
                  <button type="submit" className="btn-accent">Send Message <Send className="h-4 w-4" /></button>
                </form>
              </>
            )}
          </div>

          {/* Info */}
          <div className="space-y-4">
            {[
              { icon: Mail, title: 'Email Us', value: 'support@nova-electronics.com', desc: '24/7 response within 24 hours' },
              { icon: Phone, title: 'Call Us', value: '+1 (800) 668-2436', desc: 'Mon–Fri, 9 AM – 6 PM EST' },
              { icon: MapPin, title: 'Visit Us', value: '123 Tech Boulevard, New York, NY 10001', desc: 'Flagship showroom open daily' },
              { icon: MessageSquare, title: 'AI Assistant', value: 'Available 24/7', desc: 'Tap the NOVA AI button at bottom right' },
            ].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }} className="rounded-2xl border border-white/[0.06] bg-ink-800/40 p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-400/10"><item.icon className="h-5 w-5 text-accent-300" /></div>
                  <div><p className="text-xs font-medium uppercase tracking-wide text-white/40">{item.title}</p><p className="mt-1 text-sm font-medium text-white">{item.value}</p><p className="mt-0.5 text-xs text-white/40">{item.desc}</p></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
