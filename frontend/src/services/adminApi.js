// Admin data service — ab backend se aata hai.
// Backend: GET /api/admin/dashboard?range=7d|30d|90d (shape wahi jo pehle mock ki thi)
import { api } from './api.js'

// range: '7d' | '30d' | '90d'
export function getDashboard(range = '30d') {
  return api(`/admin/dashboard?range=${range}`)
}

// Orders page
export function getOrders() {
  return api('/admin/orders')
}

export function updateOrderStatus(orderId, status) {
  return api(`/admin/orders/${orderId}/status`, { method: 'PATCH', body: { status } })
}

// Customers page
export function getCustomers() {
  return api('/admin/customers')
}

// Products / inventory (backend database — 512 catalog products)
export function getProducts(search = '') {
  return api(`/products${search ? `?search=${encodeURIComponent(search)}` : ''}`)
}

// id = sku (maslan 'sun-001') ya number
export function updateProduct(id, data) {
  return api(`/products/${encodeURIComponent(id)}`, { method: 'PATCH', body: data })
}

export function getCategorySummary() {
  return api('/products/categories/summary')
}

// Contact Us messages + newsletter subscribers
export function getMessages() {
  return api('/admin/messages')
}

export function setMessageStatus(id, status) {
  return api(`/admin/messages/${id}`, { method: 'PATCH', body: { status } })
}

export function getSubscribers() {
  return api('/admin/subscribers')
}

// Email setup check
export function getEmailStatus() {
  return api('/admin/email/status')
}

export function sendTestEmail(to) {
  return api('/admin/email/test', { method: 'POST', body: to ? { to } : {} })
}

// Coupons (Promotions page)
export function getCoupons(all = false) {
  return api(`/admin/coupons${all ? '?all=1' : ''}`)
}

export function createCoupon(data) {
  return api('/admin/coupons', { method: 'POST', body: data })
}

export function updateCoupon(id, data) {
  return api(`/admin/coupons/${id}`, { method: 'PATCH', body: data })
}

// Abandoned carts
export function getAbandonedCarts() {
  return api('/admin/carts/abandoned')
}

export function sendCartReminders() {
  return api('/admin/carts/remind', { method: 'POST' })
}

// Admin Inbox (naya order, delivery, naya customer, complaint, low stock ...)
export function getNotifications(params = {}) {
  const q = new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString()
  return api(`/admin/notifications${q ? `?${q}` : ''}`)
}

export function getUnreadCount() {
  return api('/admin/notifications/count')
}

export function markNotification(id, read = true) {
  return api(`/admin/notifications/${id}`, { method: 'PATCH', body: { read } })
}

export function markAllNotifications() {
  return api('/admin/notifications/read-all', { method: 'POST' })
}

// Customers ko gayi emails ka record
export function getEmailLog(type = '') {
  return api(`/admin/emails${type ? `?type=${type}` : ''}`)
}
