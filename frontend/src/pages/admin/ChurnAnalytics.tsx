import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ChevronRight, Download } from 'lucide-react'
import { PageTitle, RiskBadge, AdminCard } from '@/components/admin/AdminUI'
import { churnCustomers, churnDistribution } from '@/data/admin'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const tooltipStyle = { backgroundColor: '#0f1015', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '12px', color: '#fff' }

export default function ChurnAnalytics() {
  const [search, setSearch] = useState('')
  const [riskFilter, setRiskFilter] = useState('all')

  const filtered = churnCustomers.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.reason.toLowerCase().includes(search.toLowerCase())
    const matchesRisk = riskFilter === 'all' || c.riskLevel === riskFilter
    return matchesSearch && matchesRisk
  })

  const high = churnCustomers.filter((c) => c.riskLevel === 'High').length
  const medium = churnCustomers.filter((c) => c.riskLevel === 'Medium').length
  const low = churnCustomers.filter((c) => c.riskLevel === 'Low').length

  return (
    <div>
      <PageTitle title="Churn Analytics" subtitle="AI-powered customer churn prediction and risk analysis" action={<button className="btn-ghost"><Download className="h-4 w-4" /> Export Report</button>} />

      {/* Summary */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5"><p className="font-display text-3xl font-bold text-rose-400">{high}</p><p className="mt-1 text-xs text-white/40">High Risk</p></div>
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5"><p className="font-display text-3xl font-bold text-amber-400">{medium}</p><p className="mt-1 text-xs text-white/40">Medium Risk</p></div>
        <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5"><p className="font-display text-3xl font-bold text-green-400">{low}</p><p className="mt-1 text-xs text-white/40">Low Risk</p></div>
        <AdminCard><div className="h-[80px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={churnDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={20} outerRadius={35} paddingAngle={3}>{churnDistribution.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie></PieChart></ResponsiveContainer></div></AdminCard>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1"><Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or reason..." className="input-field pl-10" /></div>
        <div className="flex gap-2">
          {[{ v: 'all', l: 'All' }, { v: 'High', l: 'High Risk' }, { v: 'Medium', l: 'Medium Risk' }, { v: 'Low', l: 'Low Risk' }].map((opt) => (
            <button key={opt.v} onClick={() => setRiskFilter(opt.v)} className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all ${riskFilter === opt.v ? 'border-accent-400 bg-accent-400/10 text-accent-300' : 'border-white/10 text-white/50 hover:border-white/25'}`}>{opt.l}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-800/40">
        <div className="overflow-x-auto"><table className="w-full text-sm">
          <thead><tr className="border-b border-white/[0.06] text-left text-xs font-medium uppercase tracking-wide text-white/40"><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Churn %</th><th className="px-4 py-3 hidden md:table-cell">Reason</th><th className="px-4 py-3 hidden lg:table-cell">Segment</th><th className="px-4 py-3">Action</th><th className="px-4 py-3"></th></tr></thead>
          <tbody>{filtered.map((c) => (
            <tr key={c.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
              <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-400/20 text-xs font-semibold text-accent-300">{c.avatar}</div><div><p className="font-medium text-white">{c.name}</p><p className="text-xs text-white/40">{c.lastLogin}</p></div></div></td>
              <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="h-2 w-16 overflow-hidden rounded-full bg-white/[0.06]"><div className={`h-full ${c.riskLevel === 'High' ? 'bg-rose-500' : c.riskLevel === 'Medium' ? 'bg-amber-500' : 'bg-green-500'}`} style={{ width: `${c.churnProbability}%` }} /></div><span className="text-sm font-medium text-white">{c.churnProbability}%</span></div></td>
              <td className="px-4 py-3 hidden md:table-cell text-white/60 max-w-xs truncate">{c.reason}</td>
              <td className="px-4 py-3 hidden lg:table-cell text-white/50">{c.segment}</td>
              <td className="px-4 py-3"><RiskBadge level={c.riskLevel} /></td>
              <td className="px-4 py-3 text-right"><Link to={`/admin/customers/${c.id}`} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:text-accent-300"><ChevronRight className="h-4 w-4" /></Link></td>
            </tr>
          ))}</tbody>
        </table></div>
      </div>
    </div>
  )
}
