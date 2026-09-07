import { useState } from 'react'
import { Search } from 'lucide-react'
import { PageTitle, StatusBadge } from '@/components/admin/AdminUI'
import { chatbotLogs } from '@/data/admin'
import { Star } from 'lucide-react'

export default function ChatbotLogs() {
  const [search, setSearch] = useState('')
  const filtered = chatbotLogs.filter((l) => l.customer.toLowerCase().includes(search.toLowerCase()) || l.intent.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <PageTitle title="Chatbot Logs" subtitle={`${chatbotLogs.length} AI conversations logged`} />
      <div className="mb-4 relative"><Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by customer or intent..." className="input-field pl-10" /></div>
      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-800/40">
        <div className="overflow-x-auto"><table className="w-full text-sm">
          <thead><tr className="border-b border-white/[0.06] text-left text-xs font-medium uppercase tracking-wide text-white/40"><th className="px-4 py-3">Customer</th><th className="px-4 py-3 hidden sm:table-cell">Date</th><th className="px-4 py-3">Intent</th><th className="px-4 py-3 hidden md:table-cell">Messages</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Rating</th></tr></thead>
          <tbody>{filtered.map((log) => (
            <tr key={log.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
              <td className="px-4 py-3 font-medium text-white">{log.customer}</td>
              <td className="px-4 py-3 hidden sm:table-cell text-white/60">{log.date}</td>
              <td className="px-4 py-3 text-white/70">{log.intent}</td>
              <td className="px-4 py-3 hidden md:table-cell text-white/60">{log.messages}</td>
              <td className="px-4 py-3"><StatusBadge status={log.resolved ? 'Delivered' : 'Cancelled'} />{log.resolved ? <span className="ml-2 text-xs text-green-400">Resolved</span> : <span className="ml-2 text-xs text-rose-400">Unresolved</span>}</td>
              <td className="px-4 py-3"><div className="flex items-center gap-1"><Star className={`h-3.5 w-3.5 ${log.satisfaction >= 4 ? 'fill-accent-400 text-accent-400' : 'fill-white/10 text-white/10'}`} /><span className="text-white/60">{log.satisfaction}/5</span></div></td>
            </tr>
          ))}</tbody>
        </table></div>
      </div>
    </div>
  )
}
