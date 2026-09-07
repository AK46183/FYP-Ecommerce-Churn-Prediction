const API_BASE = '/api/v1'

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  throw new Error(`API not yet connected: ${endpoint}`)
}

export const customerService = {
  getProfile: () => request('/customers/me'),
  updateProfile: (data: Record<string, unknown>) => request('/customers/me', { method: 'PUT', body: JSON.stringify(data) }),
  getAddresses: () => request('/customers/me/addresses'),
  addAddress: (data: Record<string, unknown>) => request('/customers/me/addresses', { method: 'POST', body: JSON.stringify(data) }),
}
