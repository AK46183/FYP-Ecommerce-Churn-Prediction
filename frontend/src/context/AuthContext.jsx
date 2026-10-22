import {
  createContext,
  useContext,
  useState,
  useCallback,
} from 'react'

const AuthContext = createContext(null)

const STORAGE_KEY = 'minaysh_auth'

function readStoredUser() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)

    if (!raw) return null

    const stored = JSON.parse(raw)

    // FRONTEND DEMO ONLY:
    // Allow both customer and admin demo sessions.
    if (
      !stored ||
      !stored.email ||
      !['customer', 'admin'].includes(stored.role)
    ) {
      return null
    }

    return stored
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)

  const login = useCallback(
    ({ email, name, role = 'customer' }) => {
      // FRONTEND DEMO ONLY.
      // Backend will verify the password and role later.

      const cleanEmail = email.trim()

      const nextUser = {
        email: cleanEmail,
        name: name?.trim() || cleanEmail.split('@')[0],
        role: role === 'admin' ? 'admin' : 'customer',
      }

      setUser(nextUser)

      try {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(nextUser)
        )
      } catch {
        // Browser storage may be unavailable.
      }

      return nextUser
    },
    []
  )

  const logout = useCallback(() => {
    setUser(null)

    try {
      window.localStorage.removeItem(STORAGE_KEY)

      window.sessionStorage.removeItem(
        'minaysh_show_welcome'
      )
    } catch {
      // Ignore browser storage errors.
    }
  }, [])

  const value = {
    user,

    isAuthenticated: Boolean(user),

    isAdmin: user?.role === 'admin',

    login,

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