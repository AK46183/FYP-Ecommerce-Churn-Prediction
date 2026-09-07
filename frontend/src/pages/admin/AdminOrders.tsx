import { useState } from 'react'
import { Search } from 'lucide-react'

import {
  PageTitle,
  StatusBadge,
} from '@/components/admin/AdminUI'

import { adminOrders } from '@/data/admin'
import { formatPKR } from '@/utils/currency'

export default function AdminOrders() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = adminOrders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase())

    const matchesStatus =
      statusFilter === 'all' ||
      o.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div>
      <PageTitle
        title="Orders"
        subtitle={`${adminOrders.length} total orders`}
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">

        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID or customer..."
            className="input-field pl-10"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-field sm:w-44"
        >
          <option value="all">All Status</option>
          <option>Pending</option>
          <option>Processing</option>
          <option>Shipped</option>
          <option>Delivered</option>
          <option>Cancelled</option>
        </select>

      </div>

      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-800/40">

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead>
              <tr className="border-b border-white/[0.06] text-left text-xs font-medium uppercase tracking-wide text-white/40">

                <th className="px-4 py-3">
                  Order ID
                </th>

                <th className="px-4 py-3">
                  Customer
                </th>

                <th className="px-4 py-3 hidden sm:table-cell">
                  Date
                </th>

                <th className="px-4 py-3 hidden md:table-cell">
                  Items
                </th>

                <th className="px-4 py-3">
                  Total
                </th>

                <th className="px-4 py-3">
                  Status
                </th>

              </tr>
            </thead>

            <tbody>

              {filtered.map((o) => (

                <tr
                  key={o.id}
                  className="border-b border-white/[0.04] hover:bg-white/[0.02]"
                >

                  <td className="px-4 py-3 font-medium text-white">
                    {o.id}
                  </td>

                  <td className="px-4 py-3">
                    <p className="text-white">
                      {o.customer}
                    </p>

                    <p className="text-xs text-white/40">
                      {o.customerEmail}
                    </p>
                  </td>

                  <td className="px-4 py-3 hidden sm:table-cell text-white/60">
                    {o.date}
                  </td>

                  <td className="px-4 py-3 hidden md:table-cell text-white/60">
                    {o.items}
                  </td>

                  <td className="px-4 py-3 font-medium text-white">
                    {formatPKR(o.total)}
                  </td>

                  <td className="px-4 py-3">
                    <StatusBadge
                      status={o.status}
                    />
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>
    </div>
  )
}