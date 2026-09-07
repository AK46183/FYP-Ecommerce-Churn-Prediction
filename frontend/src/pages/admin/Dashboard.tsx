import { Link } from 'react-router-dom'

import {
  AlertTriangle,
  DollarSign,
  Percent,
  ShoppingBag,
  TrendingDown,
  Users,
} from 'lucide-react'

import {
  StatCard,
  AdminCard,
  StatusBadge,
  RiskBadge,
  PageTitle,
} from '@/components/admin/AdminUI'

import {
  dashboardStats,
  revenueTrend,
  customerActivity,
  churnDistribution,
  adminOrders,
  churnCustomers,
} from '@/data/admin'

import { useInView } from '@/hooks'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'

import {
  formatPKR,
  usdToPkr,
} from '@/utils/currency'

const tooltipStyle = {
  backgroundColor: '#0f1015',
  border:
    '1px solid rgba(255,255,255,0.08)',
  borderRadius: '12px',
  fontSize: '12px',
  color: '#fff',
}

/* =====================================================
   CHART PKR FORMATTER
===================================================== */

function formatCompactPKR(
  usdValue: number,
) {
  const pkr =
    usdToPkr(
      usdValue,
    )

  if (
    pkr >=
    1_000_000
  ) {
    return `Rs. ${(pkr / 1_000_000).toFixed(1)}M`
  }

  if (
    pkr >=
    1_000
  ) {
    return `Rs. ${(pkr / 1_000).toFixed(0)}K`
  }

  return `Rs. ${pkr}`
}

export default function Dashboard() {
  const {
    ref: chartRef,
    inView,
  } = useInView()

  const recentOrders =
    adminOrders.slice(
      0,
      5,
    )

  const atRisk =
    churnCustomers
      .filter(
        (c) =>
          c.riskLevel !==
          'Low',
      )
      .slice(
        0,
        4,
      )

  return (
    <div>

      <PageTitle
        title="Dashboard"
        subtitle="Overview of your store performance and customer health"
      />

      {/* =================================================
          STATS GRID
      ================================================= */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={usdToPkr(
            dashboardStats.revenue,
          )}
          prefix="Rs. "
          change={
            dashboardStats.revenueChange
          }
          index={0}
        />

        <StatCard
          icon={ShoppingBag}
          label="Orders"
          value={
            dashboardStats.orders
          }
          change={
            dashboardStats.ordersChange
          }
          index={1}
        />

        <StatCard
          icon={Users}
          label="Customers"
          value={
            dashboardStats.customers
          }
          change={
            dashboardStats.customersChange
          }
          index={2}
        />

        <StatCard
          icon={Percent}
          label="Conversion Rate"
          value={
            dashboardStats.conversionRate
          }
          suffix="%"
          change={
            dashboardStats.conversionChange
          }
          index={3}
        />

        <StatCard
          icon={
            TrendingDown
          }
          label="At-Risk Customers"
          value={
            dashboardStats.atRiskCustomers
          }
          index={4}
        />

        <StatCard
          icon={
            AlertTriangle
          }
          label="High-Risk Churn"
          value={
            dashboardStats.highRiskCustomers
          }
          index={5}
        />

      </div>

      {/* =================================================
          CHARTS
      ================================================= */}

      <div className="mt-6 grid gap-4 lg:grid-cols-2">

        {/* REVENUE TREND */}

        <AdminCard title="Revenue Trend">

          <div
            ref={
              chartRef
            }
            className="h-[280px] w-full"
          >

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <AreaChart
                data={
                  revenueTrend
                }
                margin={{
                  top: 10,
                  right: 0,
                  left: -20,
                  bottom: 0,
                }}
              >

                <defs>

                  <linearGradient
                    id="revGrad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="0%"
                      stopColor="#22d3ee"
                      stopOpacity={
                        0.3
                      }
                    />

                    <stop
                      offset="100%"
                      stopColor="#22d3ee"
                      stopOpacity={
                        0
                      }
                    />

                  </linearGradient>

                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.04)"
                />

                <XAxis
                  dataKey="month"
                  stroke="rgba(255,255,255,0.3)"
                  fontSize={
                    11
                  }
                  tickLine={
                    false
                  }
                  axisLine={
                    false
                  }
                />

                <YAxis
                  stroke="rgba(255,255,255,0.3)"
                  fontSize={
                    11
                  }
                  tickLine={
                    false
                  }
                  axisLine={
                    false
                  }
                  tickFormatter={(
                    value,
                  ) =>
                    formatCompactPKR(
                      Number(
                        value,
                      ),
                    )
                  }
                />

                <Tooltip
                  contentStyle={
                    tooltipStyle
                  }
                  formatter={(
                    value,
                  ) => [
                    formatPKR(
                      Number(
                        value,
                      ),
                    ),
                    'Revenue',
                  ]}
                />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#22d3ee"
                  strokeWidth={
                    2
                  }
                  fill="url(#revGrad)"
                  animationDuration={
                    inView
                      ? 1200
                      : 0
                  }
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>

        </AdminCard>

        {/* ORDERS TREND */}

        <AdminCard title="Orders Trend">

          <div className="h-[280px] w-full">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={
                  revenueTrend
                }
                margin={{
                  top: 10,
                  right: 0,
                  left: -20,
                  bottom: 0,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.04)"
                />

                <XAxis
                  dataKey="month"
                  stroke="rgba(255,255,255,0.3)"
                  fontSize={
                    11
                  }
                  tickLine={
                    false
                  }
                  axisLine={
                    false
                  }
                />

                <YAxis
                  stroke="rgba(255,255,255,0.3)"
                  fontSize={
                    11
                  }
                  tickLine={
                    false
                  }
                  axisLine={
                    false
                  }
                />

                <Tooltip
                  contentStyle={
                    tooltipStyle
                  }
                  cursor={{
                    fill:
                      'rgba(255,255,255,0.03)',
                  }}
                />

                <Bar
                  dataKey="orders"
                  fill="#22d3ee"
                  radius={[
                    6,
                    6,
                    0,
                    0,
                  ]}
                  animationDuration={
                    inView
                      ? 1200
                      : 0
                  }
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </AdminCard>

      </div>

      {/* =================================================
          CUSTOMER ACTIVITY + CHURN
      ================================================= */}

      <div className="mt-6 grid gap-4 lg:grid-cols-3">

        {/* CUSTOMER ACTIVITY */}

        <AdminCard
          title="Customer Activity"
          className="lg:col-span-2"
        >

          <div className="h-[260px] w-full">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <AreaChart
                data={
                  customerActivity
                }
                margin={{
                  top: 10,
                  right: 0,
                  left: -20,
                  bottom: 0,
                }}
              >

                <defs>

                  <linearGradient
                    id="actGrad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="0%"
                      stopColor="#22d3ee"
                      stopOpacity={
                        0.2
                      }
                    />

                    <stop
                      offset="100%"
                      stopColor="#22d3ee"
                      stopOpacity={
                        0
                      }
                    />

                  </linearGradient>

                  <linearGradient
                    id="newGrad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="0%"
                      stopColor="#fbbf24"
                      stopOpacity={
                        0.2
                      }
                    />

                    <stop
                      offset="100%"
                      stopColor="#fbbf24"
                      stopOpacity={
                        0
                      }
                    />

                  </linearGradient>

                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.04)"
                />

                <XAxis
                  dataKey="week"
                  stroke="rgba(255,255,255,0.3)"
                  fontSize={
                    11
                  }
                  tickLine={
                    false
                  }
                  axisLine={
                    false
                  }
                />

                <YAxis
                  stroke="rgba(255,255,255,0.3)"
                  fontSize={
                    11
                  }
                  tickLine={
                    false
                  }
                  axisLine={
                    false
                  }
                />

                <Tooltip
                  contentStyle={
                    tooltipStyle
                  }
                />

                <Area
                  type="monotone"
                  dataKey="active"
                  stroke="#22d3ee"
                  strokeWidth={
                    2
                  }
                  fill="url(#actGrad)"
                  animationDuration={
                    inView
                      ? 1000
                      : 0
                  }
                />

                <Area
                  type="monotone"
                  dataKey="new"
                  stroke="#fbbf24"
                  strokeWidth={
                    2
                  }
                  fill="url(#newGrad)"
                  animationDuration={
                    inView
                      ? 1200
                      : 0
                  }
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>

        </AdminCard>

        {/* CHURN DISTRIBUTION */}

        <AdminCard title="Churn Risk Distribution">

          <div className="h-[260px] w-full">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <PieChart>

                <Pie
                  data={
                    churnDistribution
                  }
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={
                    50
                  }
                  outerRadius={
                    80
                  }
                  paddingAngle={
                    4
                  }
                  animationDuration={
                    inView
                      ? 1000
                      : 0
                  }
                >

                  {churnDistribution.map(
                    (
                      entry,
                      index,
                    ) => (

                      <Cell
                        key={
                          index
                        }
                        fill={
                          entry.color
                        }
                      />

                    ),
                  )}

                </Pie>

                <Tooltip
                  contentStyle={
                    tooltipStyle
                  }
                />

                <Legend
                  wrapperStyle={{
                    fontSize:
                      '12px',
                    color:
                      'rgba(255,255,255,0.5)',
                  }}
                />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </AdminCard>

      </div>

      {/* =================================================
          TABLES
      ================================================= */}

      <div className="mt-6 grid gap-4 lg:grid-cols-2">

        {/* RECENT ORDERS */}

        <AdminCard
          title="Recent Orders"
          action={
            <Link
              to="/admin/orders"
              className="text-xs text-accent-300 hover:text-accent-200"
            >
              View all →
            </Link>
          }
        >

          <div className="space-y-2">

            {recentOrders.map(
              (
                order,
              ) => (

                <div
                  key={
                    order.id
                  }
                  className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-ink-800/30 p-3"
                >

                  <div>

                    <p className="text-sm font-medium text-white">
                      {
                        order.id
                      }
                    </p>

                    <p className="text-xs text-white/40">
                      {
                        order.customer
                      }{' '}
                      ·{' '}
                      {
                        order.date
                      }
                    </p>

                  </div>

                  <div className="flex items-center gap-3">

                    <StatusBadge
                      status={
                        order.status
                      }
                    />

                    <span className="text-sm font-medium text-white">

                      {formatPKR(
                        order.total,
                      )}

                    </span>

                  </div>

                </div>

              ),
            )}

          </div>

        </AdminCard>

        {/* AT-RISK CUSTOMERS */}

        <AdminCard
          title="At-Risk Customers"
          action={
            <Link
              to="/admin/churn"
              className="text-xs text-accent-300 hover:text-accent-200"
            >
              View all →
            </Link>
          }
        >

          <div className="space-y-2">

            {atRisk.map(
              (c) => (

                <Link
                  key={
                    c.id
                  }
                  to={`/admin/customers/${c.id}`}
                  className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-ink-800/30 p-3 transition-colors hover:border-white/10"
                >

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-400/20 text-xs font-semibold text-accent-300">
                      {
                        c.avatar
                      }
                    </div>

                    <div>

                      <p className="text-sm font-medium text-white">
                        {
                          c.name
                        }
                      </p>

                      <p className="text-xs text-white/40">
                        {
                          c.churnProbability
                        }
                        % churn risk
                      </p>

                    </div>

                  </div>

                  <RiskBadge
                    level={
                      c.riskLevel
                    }
                  />

                </Link>

              ),
            )}

          </div>

        </AdminCard>

      </div>

    </div>
  )
}