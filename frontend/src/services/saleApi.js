// Sales / events + posters ka data service.
// Abhi sab browser (localStorage) mein save hota hai.
// Backend ready ho to USE_MOCK = false kar dein aur API_URL sahi kar dein.
import { defaultEvents } from '../data/saleEvents.js'

const USE_MOCK = true
const API_URL = 'http://localhost:5000/api/admin/sales'
const EVENTS_KEY = 'minaysh_custom_events'
const POSTERS_KEY = 'minaysh_event_posters'

const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}
const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false // storage full ya band
  }
}

// Is mahine se le kar saal ke aakhir tak ke events, tareekh ke hisaab se
export async function getUpcomingEvents(today = new Date()) {
  if (!USE_MOCK) {
    const res = await fetch(`${API_URL}/upcoming`)
    return res.json()
  }
  const from = new Date(today.getFullYear(), today.getMonth(), 1)
  const to = new Date(today.getFullYear(), 11, 31, 23, 59)
  return [...read(EVENTS_KEY, []), ...defaultEvents]
    .filter((e) => {
      const d = new Date(e.end || e.start)
      return d >= from && new Date(e.start) <= to
    })
    .sort((a, b) => new Date(a.start) - new Date(b.start))
}

export async function addEvent(event) {
  const item = { ...event, id: `my-ev-${Date.now()}`, custom: true }
  if (!USE_MOCK) {
    const res = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(event) })
    return res.json()
  }
  write(EVENTS_KEY, [item, ...read(EVENTS_KEY, [])])
  return item
}

// Posters (event ke hisaab se)
export async function getPosters(eventId) {
  return read(POSTERS_KEY, {})[eventId] || []
}

export async function savePoster(eventId, dataUrl) {
  const all = read(POSTERS_KEY, {})
  const poster = { id: `p-${Date.now()}`, dataUrl, createdAt: new Date().toISOString() }
  all[eventId] = [poster, ...(all[eventId] || [])]
  if (!write(POSTERS_KEY, all)) throw new Error('Storage full — purane posters delete karein.')
  return poster
}

export async function deletePoster(eventId, posterId) {
  const all = read(POSTERS_KEY, {})
  all[eventId] = (all[eventId] || []).filter((p) => p.id !== posterId)
  write(POSTERS_KEY, all)
}