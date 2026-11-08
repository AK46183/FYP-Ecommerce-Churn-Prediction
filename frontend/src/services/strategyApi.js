// Marketing strategies ka data service.
// Admin ki banai strategies backend (MongoDB) mein save hoti hain;
// ready-made season strategies frontend mein hi hain aur saath mila di jati hain.
import { seasons } from '../data/marketingSeasons.js'
import { api } from './api.js'

const USE_MOCK = false
const KEY = 'minaysh_custom_strategies'

function readSaved() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || []
  } catch {
    return []
  }
}

// Kisi season ki saari strategies (ready-made + admin ki banai hui)
export async function getStrategies(seasonKey) {
  const base = seasons.find((s) => s.key === seasonKey)?.strategies || []
  const mine = USE_MOCK
    ? readSaved().filter((s) => s.season === seasonKey)
    : await api(`/admin/strategies?season=${seasonKey}`).catch(() => []) // backend band ho to sirf ready-made
  return [...mine, ...base]
}

// Nayi strategy save karo
export async function saveStrategy(strategy) {
  const item = { ...strategy, id: `my-${Date.now()}`, custom: true }
  if (USE_MOCK) {
    try {
      localStorage.setItem(KEY, JSON.stringify([item, ...readSaved()]))
    } catch {
      // storage band ho to bhi page na tootay
    }
    return item
  }
  return api('/admin/strategies', { method: 'POST', body: strategy })
}