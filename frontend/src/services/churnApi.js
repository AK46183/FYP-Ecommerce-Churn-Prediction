// Churn data service.
// Abhi USE_MOCK = true hai (sample data). Churn model / backend ready ho to
// USE_MOCK = false kar dein aur API_URL sahi kar dein.
import { buildChurnMonth } from '../data/churnData.js'

const USE_MOCK = true
const API_URL = 'http://localhost:5000/api/admin/churn'

// month: 0-11
export async function getChurn(year, month) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300))
    return buildChurnMonth(year, month)
  }
  const res = await fetch(`${API_URL}?year=${year}&month=${month + 1}`)
  if (!res.ok) throw new Error('Churn data load nahi hua')
  return res.json()
}