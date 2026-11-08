import {
  createContext,
  useContext,
  useState,
  useCallback,
} from 'react'
import { api } from '../services/api.js'

const AuthContext = createContext(null)

const STORAGE_KEY = 'minaysh_auth'

function readStoredUser() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const stored = JSON.parse(raw)

    // Sirf backend se mila hua (token wala) session maana jayega.
    // Purana demo session (bina token) khud hi khatam ho jata hai.
    if (
      !stored ||
      !stored.token ||
      !stored.email ||
      !['customer', 'admin'].includes(stored.role)
    ) {
      window.localStorage.removeItem(STORAGE_KEY)
      return null
    }

    return stored
  } catch {
    return null
  }
}

function saveUser(user) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  } catch {
    // Browser storage may be unavailable.
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)

  // Backend: POST /api/auth/login -> { token, user }
  const login = useCallback(async ({ email, password }) => {
    const result = await api('/auth/login', {
      method: 'POST',
      body: { email: email.trim(), password },
    })

    const nextUser = { ...result.user, token: result.token }
    saveUser(nextUser)
    setUser(nextUser)
    return nextUser
  }, [])

  // Backend: POST /api/auth/register, phir khud login
  const register = useCallback(async ({ name, email, password }) => {
    await api('/auth/register', {
      method: 'POST',
      body: { name: name.trim(), email: email.trim(), password },
    })
    return login({ email, password })
  }, [login])

  // Google popup se mila access token backend ko -> { token, user }
  const loginWithGoogle = useCallback(async (accessToken) => {
    const result = await api('/auth/google', { method: 'POST', body: { accessToken } })
    const nextUser = { ...result.user, token: result.token }
    saveUser(nextUser)
    setUser(nextUser)
    return { user: nextUser, isNew: result.isNew }
  }, [])

  // Profile save hone ke baad naam / phone waghera update
  const updateUser = useCallback((changes) => {
    setUser((prev) => {
      if (!prev) return prev
      const next = { ...prev, ...changes, token: prev.token, role: prev.role }
      saveUser(next)
      return next
    })
  }, [])

  const logout = useCallback(() => {
    setUser(null)

    try {
      window.localStorage.removeItem(STORAGE_KEY)
      window.sessionStorage.removeItem('minaysh_show_welcome')
    } catch {
      // Ignore browser storage errors.
    }
  }, [])

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'admin',
    login,
    loginWithGoogle,
    register,
    updateUser,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error(
      'useAuth must be used within AuthProvider'
    )
  }

  return context
}
