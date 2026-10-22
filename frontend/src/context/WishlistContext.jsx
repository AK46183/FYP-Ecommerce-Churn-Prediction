import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const WishlistContext = createContext(null)
const STORAGE_KEY = 'minaysh_wishlist'

// read saved wishlist (survives page refresh)
function readStoredWishlist() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function WishlistProvider({ children }) {
  const [ids, setIds] = useState(readStoredWishlist)

  // save every change
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
    } catch {
      /* storage full or blocked - ignore */
    }
  }, [ids])

  const toggle = useCallback((id) => {
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }, [])

  const isWishlisted = useCallback((id) => ids.includes(id), [ids])

  const value = { ids, toggle, isWishlisted, count: ids.length }

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
