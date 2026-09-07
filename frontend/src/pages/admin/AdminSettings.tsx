import { useState } from 'react'
import { PageTitle } from '@/components/admin/AdminUI'
import { Save, Store, Bell, Shield, Database } from 'lucide-react'

export default function AdminSettings() {
  const [tab, setTab] = useState('general')
  const tabs = [{ id: 'general', label: 'General', icon: Store }, { id: 'notifications', label: 'Notifications', icon: Bell }, { id: 'security', label: 'Security', icon: Shield }, { id: 'api', label: 'API & Integration', icon: Database }]

  return (
    <div>
      <PageTitle title="Settings" subtitle="Manage your admin portal configuration" />
      <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
        <aside className="space-y-1">
          {tabs.map((t) => <button key={t.id} onClick={() => setTab(t.id)} className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${tab === t.id ? 'bg-accent-400/10 text-accent-300' : 'text-white/50 hover:bg-white/[0.04] hover:text-white'}`}><t.icon className="h-4 w-4" /> {t.label}</button>)}
        </aside>
        <div className="space-y-5 rounded-2xl border border-white/[0.06] bg-ink-800/40 p-6">
          {tab === 'general' && (<><h2 className="font-display text-lg font-semibold text-white">Store Settings</h2><div className="space-y-4"><div><label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/40">Store Name</label><input defaultValue="NOVA Electronics" className="input-field" /></div><div><label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/40">Support Email</label><input defaultValue="support@nova-electronics.com" className="input-field" /></div><div><label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/40">Currency</label><select className="input-field"><option>USD ($)</option><option>EUR (€)</option><option>GBP (£)</option></select></div><button className="btn-accent"><Save className="h-4 w-4" /> Save Changes</button></div></>)}
          {tab === 'notifications' && (<><h2 className="font-display text-lg font-semibold text-white">Notification Preferences</h2><div className="space-y-3">{['New orders', 'Low stock alerts', 'High churn risk detected', 'Unresolved chatbot conversations', 'Daily summary report'].map((label) => (<label key={label} className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-ink-800/30 p-4"><span className="text-sm text-white/70">{label}</span><input type="checkbox" defaultChecked className="h-5 w-5 accent-accent-400" /></label>))}<button className="btn-accent"><Save className="h-4 w-4" /> Save Preferences</button></div></>)}
          {tab === 'security' && (<><h2 className="font-display text-lg font-semibold text-white">Security</h2><div className="space-y-4"><div><label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/40">Current Password</label><input type="password" className="input-field" /></div><div><label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/40">New Password</label><input type="password" className="input-field" /></div><label className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-ink-800/30 p-4"><span className="text-sm text-white/70">Two-Factor Authentication</span><input type="checkbox" className="h-5 w-5 accent-accent-400" /></label><button className="btn-accent"><Save className="h-4 w-4" /> Update Security</button></div></>)}
          {tab === 'api' && (<><h2 className="font-display text-lg font-semibold text-white">API & Integration</h2><div className="space-y-4"><div><label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/40">API Base URL</label><input defaultValue="/api/v1" className="input-field" disabled /></div><div><label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/40">Churn Prediction Endpoint</label><input defaultValue="/api/v1/churn/predict" className="input-field" disabled /></div><div><label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/40">Chatbot Endpoint</label><input defaultValue="/api/v1/chatbot/message" className="input-field" disabled /></div><p className="text-xs text-white/40">Backend integration is prepared. Update endpoints when the API is deployed.</p></div></>)}
        </div>
      </div>
    </div>
  )
}
