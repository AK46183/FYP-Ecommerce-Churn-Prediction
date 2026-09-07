import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Mail, ShoppingBag, DollarSign, Clock, Activity, AlertTriangle, Sparkles, MessageSquare } from 'lucide-react'
import { PageTitle, RiskBadge } from '@/components/admin/AdminUI'
import { churnCustomers } from '@/data/admin'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const tooltipStyle = { backgroundColor: '#0f1015', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '12px', color: '#fff' }

export default function CustomerDetails() {
  const { id } = useParams()
  const customer = churnCustomers.find((c) => c.id === id)

  if (!customer) return <div className="text-center py-20"><p className="text-white/40">Customer not found</p><Link to="/admin/customers" className="btn-ghost mt-4">Back to Customers</Link></div>

  return (
    <div>
      <Link to="/admin/customers" className="mb-4 inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70"><ArrowLeft className="h-4 w-4" /> Back to Customers</Link>

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-white/[0.06] bg-ink-800/40 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-400/20 text-xl font-semibold text-accent-300">{customer.avatar}</div>
          <div><h1 className="font-display text-xl font-semibold text-white">{customer.name}</h1><p className="text-sm text-white/40">{customer.email}</p><div className="mt-2 flex gap-2"><RiskBadge level={customer.riskLevel} /><span className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-white/50">{customer.segment}</span></div></div>
        </div>
        <div className="flex gap-4">
          <div className="text-center"><p className="font-display text-2xl font-bold text-white">{customer.churnProbability}%</p><p className="text-xs text-white/40">Churn Risk</p></div>
          <div className="text-center"><p className="font-display text-2xl font-bold text-white">{customer.satisfactionScore}/5</p><p className="text-xs text-white/40">Satisfaction</p></div>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: ShoppingBag, label: 'Total Orders', value: customer.totalOrders },
          { icon: DollarSign, label: 'Total Spent', value: `$${customer.totalSpent.toLocaleString()}` },
          { icon: Clock, label: 'Last Login', value: customer.lastLogin },
          { icon: Activity, label: 'Last Purchase', value: customer.lastPurchase },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-white/[0.06] bg-ink-800/40 p-5">
            <stat.icon className="h-5 w-5 text-accent-300" />
            <p className="mt-3 font-display text-xl font-semibold text-white">{stat.value}</p>
            <p className="mt-0.5 text-xs text-white/40">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Why churn? */}
        <div className="rounded-2xl border border-white/[0.06] bg-ink-800/40 p-6">
          <div className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-amber-400" /><h2 className="font-display text-lg font-semibold text-white">Why is this customer likely to churn?</h2></div>
          <p className="mt-3 text-sm text-white/60">{customer.reason}</p>
          <div className="mt-6">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/40">Churn Feature Breakdown</h3>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={customer.churnFeatures} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="feature" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} width={100} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="impact" radius={[0, 6, 6, 0]} animationDuration={1000}>
                    {customer.churnFeatures.map((f, i) => (<Bar key={i} dataKey="impact" fill={f.impact > 70 ? '#f43f5e' : f.impact > 40 ? '#fbbf24' : '#22d3ee'} />))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {customer.churnFeatures.map((f, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-white/[0.04] bg-ink-800/30 p-3">
                  <div><p className="text-sm text-white">{f.feature}</p><p className="text-xs text-white/40">{f.value}</p></div>
                  <span className={`text-sm font-medium ${f.impact > 70 ? 'text-rose-400' : f.impact > 40 ? 'text-amber-400' : 'text-green-400'}`}>{f.impact}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity + Action */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/[0.06] bg-ink-800/40 p-6">
            <div className="flex items-center gap-2"><Activity className="h-5 w-5 text-accent-300" /><h2 className="font-display text-lg font-semibold text-white">Behavior Timeline</h2></div>
            <div className="mt-5 space-y-4">
              {customer.recentActivity.map((act, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] text-xs">{i + 1}</div>{i < customer.recentActivity.length - 1 && <div className="mt-1 h-full w-px flex-1 bg-white/[0.06]" />}</div>
                  <div className="flex-1 pb-4"><div className="flex items-center gap-2"><span className="rounded-md bg-accent-400/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-accent-300">{act.type.replace('_', ' ')}</span><span className="text-xs text-white/30">{act.date}</span></div><p className="mt-1 text-sm text-white/70">{act.detail}</p></div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-accent-400/20 bg-accent-400/5 p-6">
            <div className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-accent-400" /><h2 className="font-display text-lg font-semibold text-white">Recommended Action</h2></div>
            <p className="mt-3 text-sm text-white/70">{customer.recommendedAction}</p>
            <div className="mt-4 flex gap-2">
              <button className="btn-accent flex-1 text-xs">Execute Action</button>
              <button className="btn-ghost text-xs">Dismiss</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
