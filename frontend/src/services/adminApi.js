// Admin data service
// Abhi USE_MOCK = true hai, is liye fake data aata hai.
// Backend ready hone pe USE_MOCK = false kar dein aur API_URL sahi kar dein.
const USE_MOCK = true
const API_URL = 'http://localhost:5000/api/admin'

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

// range: '7d' | '30d' | '90d'
function mockDashboard(range) {
  const scale = range === '7d' ? 0.25 : range === '90d' ? 2.8 : 1

  return {
    revenue: {
      total: Math.round(842500 * scale),
      change: range === '7d' ? 4.2 : range === '90d' ? 18.6 : 12.4,
      bars: [
        { label: 'Mon', value: 62 },
        { label: 'Tue', value: 48 },
        { label: 'Wed', value: 75 },
        { label: 'Thu', value: 54 },
        { label: 'Fri', value: 88 },
        { label: 'Sat', value: 96 },
        { label: 'Sun', value: 70 },
      ],
    },
    orders: { total: Math.round(318 * scale), change: 8.1, fulfilled: 86 },
    customers: { total: Math.round(1204 * Math.max(scale, 0.6)), newThisPeriod: Math.round(96 * scale) },
    churn: {
      highRisk: 128,
      mediumRisk: 346,
      lowRisk: 1027,
      rate: 6.8,
      trend: [7.9, 7.4, 7.8, 7.1, 6.6, 7.0, 6.8, 6.4, 6.8],
    },
    avgOrderValue: { value: 5565, target: 7000 },
    topProducts: [
      { name: 'Vitamin C Glow Serum', sold: 214, revenue: 642000 },
      { name: 'Hydra Gel Moisturizer', sold: 186, revenue: 465000 },
      { name: 'SPF 50 Sun Shield', sold: 152, revenue: 334400 },
      { name: 'Matte Velvet Lipstick', sold: 131, revenue: 196500 },
    ],
    recentOrders: [
      { id: 'MN-10231', customer: 'Ayesha Malik', items: 3, total: 6200, status: 'Delivered' },
      { id: 'MN-10230', customer: 'Hina Raza', items: 1, total: 3400, status: 'Processing' },
      { id: 'MN-10229', customer: 'Sara Khan', items: 4, total: 8900, status: 'Pending' },
      { id: 'MN-10228', customer: 'Zainab Tariq', items: 2, total: 2100, status: 'Delivered' },
      { id: 'MN-10227', customer: 'Mahnoor Aslam', items: 2, total: 4750, status: 'Cancelled' },
    ],
  }
}

export async function getDashboard(range = '30d') {
  if (USE_MOCK) {
    await wait(400)
    return mockDashboard(range)
  }
  const res = await fetch(`${API_URL}/dashboard?range=${range}`)
  if (!res.ok) throw new Error('Dashboard data load nahi hua')
  return res.json()
}