// Behavioral tracking for churn prediction.
// Currently logs to console + localStorage. Later connects to backend API.

const STORAGE_KEY = 'nova-events'
const SESSION_KEY = 'nova-session-start'

export interface TrackEvent {
  name: string
  data: Record<string, unknown>
  timestamp: string
  sessionId: string
}

function getSessionId() {
  let id = sessionStorage.getItem(SESSION_KEY)
  if (!id) {
    id = `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    sessionStorage.setItem(SESSION_KEY, id)
  }
  return id
}

function getStoredEvents(): TrackEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function trackEvent(name: string, data: Record<string, unknown> = {}) {
  const event: TrackEvent = {
    name,
    data,
    timestamp: new Date().toISOString(),
    sessionId: getSessionId(),
  }

  // Log to console for development visibility
  if (import.meta.env.DEV) {
    console.log(`[Track] ${name}`, data)
  }

  // Store locally (keep last 200 events to avoid overflow)
  try {
    const events = getStoredEvents()
    events.push(event)
    const trimmed = events.slice(-200)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
  } catch {
    // Storage full — ignore
  }
}

// Track session duration on unload
export function initSessionTracking() {
  const start = Date.now()
  trackEvent('session_start', { url: window.location.pathname })

  const trackDuration = () => {
    const duration = Math.round((Date.now() - start) / 1000)
    trackEvent('session_duration', { durationSeconds: duration })
  }

  window.addEventListener('beforeunload', trackDuration)
  return () => window.removeEventListener('beforeunload', trackDuration)
}

export function getEvents(): TrackEvent[] {
  return getStoredEvents()
}
