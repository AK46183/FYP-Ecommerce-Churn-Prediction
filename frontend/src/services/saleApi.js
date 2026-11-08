// Sales / events + posters ka data service.
// Admin ke banaye events backend (MongoDB) mein save hote hain;
// ready-made defaultEvents frontend mein hi rehte hain aur saath mila diye jate hain.
// Posters abhi bhi browser (localStorage) mein hain.
import { defaultEvents } from '../data/saleEvents.js'
import { api } from './api.js'

const USE_MOCK = false
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
  const from = new Date(today.getFullYear(), today.getMonth(), 1)
  const to = new Date(today.getFullYear(), 11, 31, 23, 59)
  const mine = USE_MOCK
    ? read(EVENTS_KEY, [])
    : await api('/admin/sales/upcoming').catch(() => []) // backend band ho to sirf default events
  return [...mine, ...defaultEvents]
    .filter((e) => {
      const d = new Date(e.end || e.start)
      return d >= from && new Date(e.start) <= to
    })
    .sort((a, b) => new Date(a.start) - new Date(b.start))
}

export async function addEvent(event) {
  const item = { ...event, id: `my-ev-${Date.now()}`, custom: true }
  if (!USE_MOCK) {
    return api('/admin/sales', { method: 'POST', body: event })
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