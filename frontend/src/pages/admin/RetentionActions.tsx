import { PageTitle, AdminCard, StatusBadge } from '@/components/admin/AdminUI'
import { retentionActions } from '@/data/admin'
import { Send, Mail, Smartphone, Gift, Bell } from 'lucide-react'

const iconMap: Record<string, typeof Send> = { Email: Mail, Push: Smartphone, 'Push + Email': Smartphone, 'In-App': Gift }
const rate = (sent: number, opened: number) => sent > 0 ? Math.round((opened / sent) * 100) : 0

export default function RetentionActions() {
  return (
    <div>
      <PageTitle title="Retention Actions" subtitle="Automated campaigns to reduce churn and re-engage at-risk customers" action={<button className="btn-accent"><Send className="h-4 w-4" /> New Campaign</button>} />
      <div className="grid gap-4 lg:grid-cols-2">
        {retentionActions.map((action) => {
          const Icon = iconMap[action.channel] || Bell
          return (
            <AdminCard key={action.id}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-400/10"><Icon className="h-5 w-5 text-accent-300" /></div>
                  <div><h3 className="font-display text-base font-medium text-white">{action.action}</h3><p className="text-xs text-white/40">{action.target} · {action.customers} customers</p></div>
                </div>
                <StatusBadge status={action.status} />
              </div>
              <div className="mt-5 grid grid-cols-4 gap-2">
                {[
                  { label: 'Sent', value: action.sent },
                  { label: 'Opened', value: action.opened, pct: rate(action.sent, action.opened) },
                  { label: 'Clicked', value: action.clicked, pct: rate(action.sent, action.clicked) },
                  { label: 'Converted', value: action.converted, pct: rate(action.sent, action.converted) },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-white/[0.04] bg-ink-800/30 p-3 text-center">
                    <p className="font-display text-lg font-semibold text-white">{stat.value}</p>
                    {stat.pct !== undefined && <p className="text-[10px] text-white/30">{stat.pct}%</p>}
                    <p className="mt-0.5 text-[10px] uppercase tracking-wide text-white/40">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2"><button className="btn-ghost flex-1 text-xs">View Details</button><button className="btn-accent text-xs">Edit</button></div>
            </AdminCard>
          )
        })}
      </div>
    </div>
  )
}
