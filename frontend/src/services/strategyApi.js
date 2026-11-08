// Marketing strategies ka data service.
// Abhi banai hui strategies browser (localStorage) mein save hoti hain.
// Backend ready ho to USE_MOCK = false kar dein aur API_URL sahi kar dein.
import { seasons } from '../data/marketingSeasons.js'

const USE_MOCK = true
const API_URL = 'http://localhost:5000/api/admin/strategies'
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
  if (USE_MOCK) {
    const base = seasons.find((s) => s.key === seasonKey)?.strategies || []
    const mine = readSaved().filter((s) => s.season === seasonKey)
    return [...mine, ...base]
  }
  const res = await fetch(`${API_URL}?season=${seasonKey}`)
  return res.json()
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
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(strategy),
  })
  return res.json()
}