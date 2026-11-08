// Backend se baat karne ka ek hi helper.
// - URL .env ke VITE_API_URL se (default: http://localhost:5000/api)
// - Login ho to token khud Authorization header mein lagta hai
// - Backend ka jawab { statusCode, data, message } hota hai — yeh seedha `data` lauta deta hai
export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '')

const AUTH_KEY = 'minaysh_auth'

export function getToken() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY) || 'null')?.token || null
  } catch {
    return null
  }
}

export async function api(path, { method = 'GET', body, headers } = {}) {
  const token = getToken()
  let res
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
        ...(token && { Authorization: `Bearer ${token}` }),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new Error('Server se raabta nahi ho saka. Backend (npm run dev) chal raha hai?')
  }

  let json = null
  try {
    json = await res.json()
  } catch {
    // khaali ya non-JSON jawab
  }

  if (!res.ok) {
    if (res.status === 401 && token) {
      // token expire ho gaya — dobara login karna hoga
      try {
        localStorage.removeItem(AUTH_KEY)
      } catch {
        // ignore
      }
    }
    const message = json?.message || json?.errors?.[0] || `Request failed (${res.status})`
    const error = new Error(message)
    error.status = res.status
    throw error
  }

  return json && 'data' in json ? json.data : json
}
