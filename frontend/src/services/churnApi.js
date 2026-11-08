// Churn data service — backend (jo Python churn model ko call karta hai) se.
import { api } from './api.js'

// month: 0-11 (JS wala). Backend 1-12 leta hai.
export function getChurn(year, month) {
  return api(`/admin/churn?year=${year}&month=${month + 1}`)
}

// Saare customers ko dobara score karo (+ at-risk ko auto message)
export function runScoring(autoEngage = true) {
  return api('/admin/churn/run', { method: 'POST', body: { autoEngage } })
}

// Bheje gaye messages + converted / conversion rate
export function getEngagements(limit = 50) {
  return api(`/admin/churn/engagements?limit=${limit}`)
}

// Admin ka manual "Send message"
export function sendEngagement(userId) {
  return api(`/admin/churn/engagements/${userId}`, { method: 'POST' })
}

// Customer pe complaint ka flag (model ka "complain" feature)
export function setComplaint(userId, hasComplaint) {
  return api(`/admin/customers/${userId}/complaint`, { method: 'PATCH', body: { hasComplaint } })
}

export function getAlerts() {
  return api('/admin/churn/alerts')
}
