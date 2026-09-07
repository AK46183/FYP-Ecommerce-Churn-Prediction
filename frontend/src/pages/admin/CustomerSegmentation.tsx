import { PageTitle, AdminCard } from '@/components/admin/AdminUI'
import { customerSegments } from '@/data/admin'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Users } from 'lucide-react'

const tooltipStyle = { backgroundColor: '#0f1015', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '12px', color: '#fff' }

export default function CustomerSegmentation() {
  return (
    <div>
      <PageTitle title="Customer Segmentation" subtitle="AI-generated customer segments based on behavior and purchasing patterns" />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <AdminCard title="Segment Distribution">
          <div className="h-[360px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={customerSegments} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                <XAxis type="number" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={11} tickLine={false} axisLine={false} width={130} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} animationDuration={1000}>{customerSegments.map((s, i) => <Cell key={i} fill={s.color} />)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>

        <div className="space-y-3">
          {customerSegments.map((seg) => (
            <div key={seg.name} className="rounded-2xl border border-white/[0.06] bg-ink-800/40 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${seg.color}20` }}><Users className="h-5 w-5" style={{ color: seg.color }} /></div>
                  <div><p className="text-sm font-medium text-white">{seg.name}</p><p className="text-xs text-white/40">{seg.count} customers · {seg.percentage}%</p></div>
                </div>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full rounded-full" style={{ width: `${seg.percentage}%`, backgroundColor: seg.color }} /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
