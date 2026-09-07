const API_BASE = '/api/v1'

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  throw new Error(`API not yet connected: ${endpoint}`)
}

export const orderService = {
  create: (order: Record<string, unknown>) => request('/orders', { method: 'POST', body: JSON.stringify(order) }),
  getById: (id: string) => request(`/orders/${id}`),
  getMyOrders: () => request('/orders/my'),
  track: (id: string) => request(`/orders/${id}/track`),
}
