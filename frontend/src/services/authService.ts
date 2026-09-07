const API_BASE = '/api/v1'

// API service placeholders. Currently returns mock data.
// Later these will make real fetch calls to the backend.

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  // Placeholder — when backend is ready, uncomment:
  // const res = await fetch(`${API_BASE}${endpoint}`, {
  //   headers: { 'Content-Type': 'application/json' },
  //   ...options,
  // })
  // if (!res.ok) throw new Error(`API Error: ${res.status}`)
  // return res.json()
  throw new Error(`API not yet connected: ${endpoint}`)
}

export const authService = {
  login: (email: string, password: string) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (name: string, email: string, password: string) => request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  me: () => request('/auth/me'),
}
