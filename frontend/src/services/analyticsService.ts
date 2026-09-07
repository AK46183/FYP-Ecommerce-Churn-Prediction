const API_BASE = '/api/v1'

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  throw new Error(`API not yet connected: ${endpoint}`)
}

export const analyticsService = {
  getDashboard: () => request('/analytics/dashboard'),
  getRevenue: () => request('/analytics/revenue'),
  getOrders: () => request('/analytics/orders'),
  getCustomerActivity: () => request('/analytics/customer-activity'),
  getConversion: () => request('/analytics/conversion'),
}
