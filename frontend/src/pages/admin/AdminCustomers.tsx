import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ChevronRight } from 'lucide-react'

import {
  PageTitle,
  RiskBadge,
} from '@/components/admin/AdminUI'

import { customers } from '@/data/admin'
import { formatPKR } from '@/utils/currency'

export default function AdminCustomers() {
  const [search, setSearch] = useState('')
  const [riskFilter, setRiskFilter] = useState('all')

  const filtered = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())

    const matchesRisk =
      riskFilter === 'all' ||
      c.riskLevel === riskFilter

    return matchesSearch && matchesRisk
  })

  return (
    <div>
      <PageTitle
        title="Customers"
        subtitle={`${customers.length} registered customers`}
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers..."
            className="input-field pl-10"
          />
        </div>

        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
          className="input-field sm:w-40"
        >
          <option value="all">
            All Risk Levels
          </option>

          <option>
            High
          </option>

          <option>
            Medium
          </option>

          <option>
            Low
          </option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-800/40">
        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead>
              <tr className="border-b border-white/[0.06] text-left text-xs font-medium uppercase tracking-wide text-white/40">

                <th className="px-4 py-3">
                  Customer
                </th>

                <th className="px-4 py-3 hidden sm:table-cell">
                  Orders
                </th>

                <th className="px-4 py-3 hidden md:table-cell">
                  Total Spent
                </th>

                <th className="px-4 py-3 hidden lg:table-cell">
                  Last Login
                </th>

                <th className="px-4 py-3">
                  Churn Risk
                </th>

                <th className="px-4 py-3">
                </th>

              </tr>
            </thead>

            <tbody>
              {filtered.map((c) => (

                <tr
                  key={c.id}
                  className="border-b border-white/[0.04] hover:bg-white/[0.02]"
                >

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-400/20 text-xs font-semibold text-accent-300">
                        {c.avatar}
                      </div>

                      <div>
                        <p className="font-medium text-white">
                          {c.name}
                        </p>

                        <p className="text-xs text-white/40">
                          {c.email}
                        </p>
                      </div>

                    </div>
                  </td>

                  <td className="px-4 py-3 hidden sm:table-cell text-white/60">
                    {c.totalOrders}
                  </td>

                  <td className="px-4 py-3 hidden md:table-cell font-medium text-white">
                    {formatPKR(c.totalSpent)}
                  </td>

                  <td className="px-4 py-3 hidden lg:table-cell text-white/60">
                    {c.lastLogin}
                  </td>

                  <td className="px-4 py-3">
                    <RiskBadge
                      level={c.riskLevel}
                    />
                  </td>

                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/admin/customers/${c.id}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:text-accent-300"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Link>
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