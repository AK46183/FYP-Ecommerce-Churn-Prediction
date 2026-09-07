const API_BASE = '/api/v1'

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  throw new Error(`API not yet connected: ${endpoint}`)
}

export const churnService = {
  getPredictions: () => request('/churn/predictions'),
  getCustomerChurn: (id: string) => request(`/churn/customers/${id}`),
  getSegments: () => request('/churn/segments'),
  getDistribution: () => request('/churn/distribution'),
}
