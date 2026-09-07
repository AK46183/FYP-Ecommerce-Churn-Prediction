const API_BASE = '/api/v1'

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  // const res = await fetch(`${API_BASE}${endpoint}`, { headers: { 'Content-Type': 'application/json' }, ...options })
  // if (!res.ok) throw new Error(`API Error: ${res.status}`)
  // return res.json()
  throw new Error(`API not yet connected: ${endpoint}`)
}

export const productService = {
  getAll: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return request(`/products${qs}`)
  },
  getById: (id: string) => request(`/products/${id}`),
  getByCategory: (slug: string) => request(`/products/category/${slug}`),
  search: (q: string) => request(`/products/search?q=${encodeURIComponent(q)}`),
  getFeatured: () => request('/products/featured'),
  getNew: () => request('/products/new'),
  getDeals: () => request('/products/deals'),
}
