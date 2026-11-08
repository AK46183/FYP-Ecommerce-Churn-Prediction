import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from 'react'
import { isPurchasable } from '../services/product.js'
import {
  trackActivity,
  getServerCart,
  saveServerCart,
  checkCart,
  validateCoupon,
} from '../services/storeApi.js'
import { useAuth } from './AuthContext.jsx'
import { shadeLabel } from '../utils/shadeColor.js'

const CartContext = createContext(null)

const STORAGE_KEY = 'minaysh_cart'
const COUPON_KEY = 'minaysh_coupon'

function lineKey(item) {
  return `${item.id}__${item.shade || 'default'}__${item.size || 'default'}`
}

// Backend ko bhejne wali shape
const toServer = (it) => ({ sku: it.id, shade: it.shade || null, size: it.size || null, quantity: it.quantity })

// Backend ki shape -> cart item
const fromServer = (it) => ({
  id: it.sku,
  name: it.name,
  image: it.image,
  price: it.price,
  oldPrice: it.oldPrice || undefined,
  shade: it.shade || undefined,
  size: it.size || undefined,
  quantity: it.quantity,
})

const serverKey = (it) => `${it.sku}__${it.shade || 'default'}__${it.size || 'default'}`

function readStoredCoupon() {
  try {
    const c = JSON.parse(window.localStorage.getItem(COUPON_KEY))
    return c && c.code ? c : null
  } catch {
    return null
  }
}

/** Coupon ka discount (display ke liye; asli hisaab server checkout pe karta hai) */
export function couponDiscount(coupon, subtotal, shipping = 0) {
  if (!coupon) return 0
  if (coupon.type === 'percent') return Math.min(subtotal, Math.round((subtotal * coupon.value) / 100))
  if (coupon.type === 'fixed') return Math.min(subtotal, Math.round(coupon.value))
  if (coupon.type === 'shipping') return shipping
  return 0
}

// Refresh ke baad purana cart localStorage se wapas lao
function readStoredCart() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY))
    if (!Array.isArray(stored)) return []

    // Sirf sahi items rakho (price aur quantity number honi chahiye)
    return stored.filter(
      (it) =>
        it &&
        it.id &&
        Number.isFinite(it.price) &&
        Number.isFinite(it.quantity) &&
        it.quantity > 0
    ).map((it) => ({ ...it, shade: shadeLabel(it.shade) || undefined }))
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [items, setItems] = useState(readStoredCart)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [issues, setIssues] = useState({}) // lineKey -> { status, message, stock }
  const [coupon, setCoupon] = useState(readStoredCoupon)
  const [couponError, setCouponError] = useState('')
  const itemsRef = useRef(items)
  itemsRef.current = items
  const syncedFor = useRef(null) // kis user ka server cart load ho chuka
  const serverReady = useRef(false)

  // Login: account wala cart lao, browser wale items saath mila do
  useEffect(() => {
    if (!user) {
      if (syncedFor.current !== null) {
        // logout: account ka cart is browser pe na rahe
        setItems([])
        setCoupon(null)
      }
      syncedFor.current = null
      serverReady.current = false
      return
    }
    if (syncedFor.current === user.id) return
    syncedFor.current = user.id
    serverReady.current = false

    getServerCart()
      .then((serverItems) => {
        const merged = serverItems.filter((i) => i.status !== 'unknown').map(fromServer)
        const keys = new Set(merged.map((m) => lineKey(m)))
        itemsRef.current.forEach((local) => {
          if (!keys.has(lineKey(local))) merged.push(local)
        })
        serverReady.current = true
        setItems(merged)
      })
      .catch(() => {
        // backend band — browser cart hi chalta rahe
      })
  }, [user])

  // Har change ke baad (thora ruk kar): login ho to account mein save, warna sirf check.
  // Jawab mein har item ka stock / price status aata hai.
  useEffect(() => {
    const loggedInReady = Boolean(user) && serverReady.current && syncedFor.current === user.id
    if (!items.length) {
      setIssues({})
      if (loggedInReady) saveServerCart([]).catch(() => {})
      return undefined
    }
    const timer = setTimeout(() => {
      const payload = items.map(toServer)
      const request = loggedInReady ? saveServerCart(payload) : checkCart(payload)
      request
        .then((list) => {
          const next = {}
          list.forEach((i) => {
            next[serverKey(i)] = { status: i.status, message: i.message, stock: i.stock, price: i.price }
          })
          setIssues(next)
          // Price badal gayi ho to cart mein bhi update
          setItems((cur) => {
            let changed = false
            const updated = cur.map((it) => {
              const info = next[lineKey(it)]
              if (info && typeof info.price === 'number' && info.price !== it.price) {
                changed = true
                return { ...it, price: info.price }
              }
              return it
            })
            return changed ? updated : cur
          })
        })
        .catch(() => {})
    }, 700)
    return () => clearTimeout(timer)
  }, [items, user])

  // Coupon browser mein yaad rahe
  useEffect(() => {
    try {
      if (coupon) window.localStorage.setItem(COUPON_KEY, JSON.stringify(coupon))
      else window.localStorage.removeItem(COUPON_KEY)
    } catch {
      // ignore
    }
  }, [coupon])

  // Har change par cart save karo
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // Browser storage may be unavailable.
    }
  }, [items])

  const openCart = useCallback(() => {
    setIsCartOpen(true)
  }, [])

  const closeCart = useCallback(() => {
    setIsCartOpen(false)
  }, [])

  const addItem = useCallback((product, options = {}) => {
    // Draft, out of stock ya bina price wala product cart mein nahi jayega
    if (!isPurchasable(product)) return false

    const { size, quantity = 1 } = options
    const shade = shadeLabel(options.shade) || undefined

    setItems((prev) => {
      const key = lineKey({ id: product.id, shade, size })
      const existing = prev.find((it) => lineKey(it) === key)

      if (existing) {
        return prev.map((it) =>
          lineKey(it) === key
            ? { ...it, quantity: it.quantity + quantity }
            : it
        )
      }

      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          oldPrice: product.oldPrice,
          shade,
          size,
          quantity,
        },
      ]
    })

    // Churn model ke liye: logged-in customer ne cart mein daala
    trackActivity('cart_add', product.id, quantity)

    // Fly-to-cart animation + "Added to bag" message (FlyToCart.jsx listens)
    window.dispatchEvent(
      new CustomEvent('minaysh:added-to-cart', {
        detail: {
          id: product.id,
          name: product.name,
          image: product.image,
          shade,
          quantity,
        },
      })
    )

    return true
  }, [])

  const removeItem = useCallback((id, shade, size) => {
    trackActivity('cart_remove', id)
    setItems((prev) =>
      prev.filter(
        (it) => lineKey(it) !== lineKey({ id, shade, size })
      )
    )
  }, [])

  const updateQuantity = useCallback((id, shade, size, quantity) => {
    setItems((prev) =>
      prev.map((it) =>
        lineKey(it) === lineKey({ id, shade, size })
          ? { ...it, quantity: Math.max(1, quantity) }
          : it
      )
    )
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    setCoupon(null)
    setCouponError('')
  }, [])

  const { subtotal, count } = useMemo(() => {
    return items.reduce(
      (acc, it) => ({
        subtotal: acc.subtotal + it.price * it.quantity,
        count: acc.count + it.quantity,
      }),
      { subtotal: 0, count: 0 }
    )
  }, [items])

  // Coupon lagao (server check karta hai)
  const applyCoupon = useCallback(async (code, shipping = 0) => {
    setCouponError('')
    const sub = itemsRef.current.reduce((s, it) => s + it.price * it.quantity, 0)
    try {
      const result = await validateCoupon(code, sub, shipping)
      setCoupon(result)
      return result
    } catch (err) {
      setCouponError(err.message)
      throw err
    }
  }, [])

  const removeCoupon = useCallback(() => {
    setCoupon(null)
    setCouponError('')
  }, [])

  // Cart badla (subtotal) to coupon dobara check — shart poori na ho to hata do
  useEffect(() => {
    if (!coupon || !items.length) return undefined
    const timer = setTimeout(() => {
      validateCoupon(coupon.code, subtotal, 0)
        .then((r) => setCoupon((c) => (c && c.code === r.code ? { ...c, ...r } : c)))
        .catch((err) => {
          setCoupon(null)
          setCouponError(`${coupon.code} removed: ${err.message}`)
        })
    }, 800)
    return () => clearTimeout(timer)
  }, [subtotal]) // eslint-disable-line react-hooks/exhaustive-deps

  const issueFor = useCallback((item) => issues[lineKey(item)] || null, [issues])
  const hasBlockingIssue = items.some((it) => ['soldout', 'low', 'unknown'].includes(issues[lineKey(it)]?.status))

  const value = {
    items,
    issues,
    issueFor,
    hasBlockingIssue,
    coupon,
    couponError,
    applyCoupon,
    removeCoupon,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    count,
    isCartOpen,
    openCart,
    closeCart,
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)

  if (!ctx) {
    throw new Error('useCart must be used within CartProvider')
  }

  return ctx
}
