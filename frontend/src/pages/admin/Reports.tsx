import { PageTitle, AdminCard } from '@/components/admin/AdminUI'
import { revenueTrend, customerActivity, churnDistribution, customerSegments } from '@/data/admin'
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Download, FileText } from 'lucide-react'

const tooltipStyle = { backgroundColor: '#0f1015', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '12px', color: '#fff' }

export default function Reports() {
  return (
    <div>
      <PageTitle title="Reports" subtitle="Comprehensive analytics and performance reports" action={<button className="btn-accent"><Download className="h-4 w-4" /> Export PDF</button>} />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {['Monthly Revenue Report', 'Customer Churn Report', 'Order Performance Report', 'Inventory Status Report'].map((report, i) => (
          <div key={i} className="rounded-2xl border border-white/[0.06] bg-ink-800/40 p-5 transition-colors hover:border-accent-400/30">
            <FileText className="h-6 w-6 text-accent-300" />
            <p className="mt-3 text-sm font-medium text-white">{report}</p>
            <p className="mt-1 text-xs text-white/40">Aug 2026</p>
            <button className="mt-3 text-xs text-accent-300 hover:text-accent-200">Download →</button>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminCard title="Revenue & Orders (12 months)">
          <div className="h-[300px]"><ResponsiveContainer width="100%" height="100%"><AreaChart data={revenueTrend} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs><linearGradient id="r1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22d3ee" stopOpacity={0.3} /><stop offset="100%" stopColor="#22d3ee" stopOpacity={0} /></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" /><XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} /><YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} /><Tooltip contentStyle={tooltipStyle} /><Area type="monotone" dataKey="revenue" stroke="#22d3ee" strokeWidth={2} fill="url(#r1)" /></AreaChart></ResponsiveContainer></div>
        </AdminCard>

        <AdminCard title="Customer Segments">
          <div className="h-[300px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={customerSegments} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={90} paddingAngle={3}>{customerSegments.map((s, i) => <Cell key={i} fill={s.color} />)}</Pie><Tooltip contentStyle={tooltipStyle} /><Legend wrapperStyle={{ fontSize: '11px' }} /></PieChart></ResponsiveContainer></div>
        </AdminCard>

        <AdminCard title="Customer Activity (8 weeks)">
          <div className="h-[300px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={customerActivity} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" /><XAxis dataKey="week" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} /><YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="active" fill="#22d3ee" radius={[4, 4, 0, 0]} /><Bar dataKey="new" fill="#fbbf24" radius={[4, 4, 0, 0]} /><Bar dataKey="churned" fill="#f43f5e" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div>
        </AdminCard>

        <AdminCard title="Churn Risk Distribution">
          <div className="h-[300px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={churnDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4}>{churnDistribution.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><Tooltip contentStyle={tooltipStyle} /><Legend wrapperStyle={{ fontSize: '11px' }} /></PieChart></ResponsiveContainer></div>
        </AdminCard>
      </div>
    </div>
  )
}
