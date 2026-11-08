// Customer side ki saari backend calls
import { api, getToken } from './api.js'

/* Orders */
export const placeOrder = (payload) => api('/orders', { method: 'POST', body: payload })
export const getMyOrders = () => api('/orders')
export const getMyOrder = (id) => api(`/orders/${encodeURIComponent(id)}`)

/* Profile */
export const getMe = () => api('/auth/me')
export const updateMe = (data) => api('/auth/me', { method: 'PATCH', body: data })
export const changePassword = (currentPassword, newPassword) =>
  api('/auth/change-password', { method: 'POST', body: { currentPassword, newPassword } })

/* Forgot / reset password */
export const requestPasswordReset = (email) => api('/auth/forgot-password', { method: 'POST', body: { email } })
export const resetPassword = (token, password) => api('/auth/reset-password', { method: 'POST', body: { token, password } })

/* Wishlist */
export const getWishlist = () => api('/account/wishlist')
export const addWishlist = (sku) => api('/account/wishlist', { method: 'POST', body: { sku } })
export const removeWishlist = (sku) => api(`/account/wishlist/${encodeURIComponent(sku)}`, { method: 'DELETE' })
export const mergeWishlist = (skus) => api('/account/wishlist/merge', { method: 'POST', body: { skus } })

/* Addresses */
export const getAddresses = () => api('/account/addresses')
export const addAddress = (data) => api('/account/addresses', { method: 'POST', body: data })
export const updateAddress = (id, data) => api(`/account/addresses/${id}`, { method: 'PATCH', body: data })
export const deleteAddress = (id) => api(`/account/addresses/${id}`, { method: 'DELETE' })

/* Contact + newsletter */
export const sendContact = (data) => api('/contact', { method: 'POST', body: data })
export const subscribeNewsletter = (email) => api('/newsletter', { method: 'POST', body: { email, source: 'footer' } })

/**
 * Website activity (sirf logged-in customer) — churn model ke liye.
 * Kabhi error nahi dikhata; fail ho jaye to chup chaap chhod deta hai.
 */
export function trackActivity(eventType, sku, quantity) {
  if (!getToken()) return
  api('/account/activity', { method: 'POST', body: { eventType, sku, quantity } }).catch(() => {})
}

/* Cart (account mein save + live stock/price check) */
export const getServerCart = () => api('/cart/items')
export const saveServerCart = (items) => api('/cart/items', { method: 'PUT', body: { items } })
export const checkCart = (items) => api('/cart/check', { method: 'POST', body: { items } })

/* Coupons */
export const validateCoupon = (code, subtotal, shipping) =>
  api('/coupons/validate', { method: 'POST', body: { code, subtotal, shipping } })
