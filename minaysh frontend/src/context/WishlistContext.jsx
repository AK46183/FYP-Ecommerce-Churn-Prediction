import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { useAuth } from './AuthContext.jsx'
import { getWishlist, addWishlist, removeWishlist, mergeWishlist } from '../services/storeApi.js'

const WishlistContext = createContext(null)
const STORAGE_KEY = 'minaysh_wishlist'

// read saved wishlist (survives page refresh) — guest ke liye
function readStoredWishlist() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeStoredWishlist(ids) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch {
    /* storage full or blocked - ignore */
  }
}

export function WishlistProvider({ children }) {
  const { user } = useAuth()
  const [ids, setIds] = useState(readStoredWishlist)
  const syncedFor = useRef(null)

  // Login hote hi: browser wali wishlist backend mein mila do, phir backend wali list use karo
  useEffect(() => {
    if (!user) {
      // logout: account wali wishlist screen se hata do
      if (syncedFor.current !== null) setIds([])
      syncedFor.current = null
      return
    }
    if (syncedFor.current === user.id) return
    syncedFor.current = user.id

    const local = readStoredWishlist()
    const request = local.length ? mergeWishlist(local) : getWishlist()
    request
      .then((serverIds) => {
        setIds(serverIds)
        writeStoredWishlist([]) // ab account mein save hai
      })
      .catch(() => {
        // backend band ho to browser wali list hi chalti rahe
      })
  }, [user])

  // Guest: har change browser mein save
  useEffect(() => {
    if (!user) writeStoredWishlist(ids)
  }, [ids, user])

  const idsRef = useRef(ids)
  idsRef.current = ids

  const toggle = useCallback((id) => {
    const has = idsRef.current.includes(id)
    setIds((prev) => (has ? prev.filter((x) => x !== id) : prev.includes(id) ? prev : [...prev, id]))
    if (user) {
      // backend update; fail ho to wapas pehli halat
      const call = has ? removeWishlist(id) : addWishlist(id)
      call.catch(() => setIds((cur) => (has ? [...cur, id] : cur.filter((x) => x !== id))))
    }
  }, [user])

  const isWishlisted = useCallback((id) => ids.includes(id), [ids])

  const value = { ids, toggle, isWishlisted, count: ids.length }

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
