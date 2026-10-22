import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from 'react'
import { isPurchasable } from '../services/product.js'

const CartContext = createContext(null)

const STORAGE_KEY = 'minaysh_cart'

function lineKey(item) {
  return `${item.id}__${item.shade || 'default'}__${item.size || 'default'}`
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
    )
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredCart)
  const [isCartOpen, setIsCartOpen] = useState(false)

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

    const { shade, size, quantity = 1 } = options

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

  const value = {
    items,
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
