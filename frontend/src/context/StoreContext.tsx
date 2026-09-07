import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

import {
  type Product,
  getDefaultVariantSelection,
  getVariantPrice,
  getVariantSku,
  getVariantStock,
  isVariantConfigAvailable,
} from '@/data/products'

import {
  getProductImageForColor,
} from '@/data/images'

import { trackEvent } from '@/services/tracking'

export interface CartItem {
  productId: string
  name: string
  brand: string
  price: number
  image: string
  variant: Record<string, string>
  quantity: number
  maxStock: number
  sku: string
}

interface StoreContextType {
  // Cart
  cart: CartItem[]

  addToCart: (
    product: Product,
    variant: Record<string, string>,
    quantity?: number,
  ) => void

  removeFromCart: (
    productId: string,
    variantKey: string,
  ) => void

  updateQuantity: (
    productId: string,
    variantKey: string,
    quantity: number,
  ) => void

  saveForLater: (
    productId: string,
    variantKey: string,
  ) => void

  cartTotal: number
  cartCount: number

  // Wishlist
  wishlist: string[]
  toggleWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean

  // Auth
  user: {
    name: string
    email: string
    role: 'customer' | 'admin'
  } | null

  login: (
    email: string,
    password: string,
  ) => boolean

  register: (
    name: string,
    email: string,
    password: string,
  ) => boolean

  logout: () => void

  // Search
  searchQuery: string
  setSearchQuery: (q: string) => void
}

const StoreContext =
  createContext<StoreContextType | null>(null)

/* =====================================================
   STABLE VARIANT KEY

   Sorting keys means:
   { Storage: '1TB', Color: 'Black' }

   and

   { Color: 'Black', Storage: '1TB' }

   are treated as the same cart item.
===================================================== */

function makeVariantKey(
  productId: string,
  variant: Record<string, string>,
) {
  const normalizedVariant =
    Object.fromEntries(
      Object.entries(variant).sort(
        ([keyA], [keyB]) =>
          keyA.localeCompare(keyB),
      ),
    )

  return (
    productId +
    JSON.stringify(normalizedVariant)
  )
}

export function StoreProvider({
  children,
}: {
  children: ReactNode
}) {
  /* =====================================================
     CART
  ===================================================== */

  const [cart, setCart] =
    useState<CartItem[]>(() => {
      try {
        const saved =
          localStorage.getItem('nova-cart')

        return saved
          ? JSON.parse(saved)
          : []
      } catch {
        return []
      }
    })

  /* =====================================================
     SAVED FOR LATER
  ===================================================== */

  const [savedItems, setSavedItems] =
    useState<CartItem[]>([])

  /* =====================================================
     WISHLIST
  ===================================================== */

  const [wishlist, setWishlist] =
    useState<string[]>(() => {
      try {
        const saved =
          localStorage.getItem(
            'nova-wishlist',
          )

        return saved
          ? JSON.parse(saved)
          : []
      } catch {
        return []
      }
    })

  /* =====================================================
     USER
  ===================================================== */

  const [user, setUser] =
    useState<StoreContextType['user']>(
      () => {
        try {
          const saved =
            localStorage.getItem(
              'nova-user',
            )

          return saved
            ? JSON.parse(saved)
            : null
        } catch {
          return null
        }
      },
    )

  /* =====================================================
     SEARCH
  ===================================================== */

  const [
    searchQuery,
    setSearchQuery,
  ] = useState('')

  /* =====================================================
     LOCAL STORAGE
  ===================================================== */

  useEffect(() => {
    localStorage.setItem(
      'nova-cart',
      JSON.stringify(cart),
    )
  }, [cart])

  useEffect(() => {
    localStorage.setItem(
      'nova-wishlist',
      JSON.stringify(wishlist),
    )
  }, [wishlist])

  useEffect(() => {
    if (user) {
      localStorage.setItem(
        'nova-user',
        JSON.stringify(user),
      )
    } else {
      localStorage.removeItem(
        'nova-user',
      )
    }
  }, [user])

  /* =====================================================
     ADD TO CART
  ===================================================== */

  const addToCart:
    StoreContextType['addToCart'] = (
      product,
      variant,
      quantity = 1,
    ) => {
      /*
       * Start from a REAL configuration rather
       * than trusting callers to provide every
       * option.
       */
      const defaultSelection =
        getDefaultVariantSelection(product)

      const selectedVariant = {
        ...defaultSelection,
        ...variant,
      }

      /*
       * Product has variantConfigs:
       * selected combination must actually exist
       * and must have stock.
       */
      if (
        product.variantConfigs?.length &&
        !isVariantConfigAvailable(
          product,
          selectedVariant,
        )
      ) {
        console.warn(
          `Cannot add invalid/out-of-stock configuration for ${product.name}`,
          selectedVariant,
        )

        return
      }

      const variantPrice =
        getVariantPrice(
          product,
          selectedVariant,
        )

      const variantStock =
        getVariantStock(
          product,
          selectedVariant,
        )

      const sku =
        getVariantSku(
          product,
          selectedVariant,
        )

      /*
       * Never add zero-stock products.
       */
      if (variantStock <= 0) {
        return
      }

      /*
       * Variant products must have a genuine SKU.
       */
      if (
        product.variantConfigs?.length &&
        !sku
      ) {
        return
      }

      const safeQuantity =
        Math.max(
          1,
          Math.min(
            quantity,
            variantStock,
          ),
        )

      /*
       * Color-specific image when available.
       * Otherwise helper safely returns detailMain.
       */
      const image =
        getProductImageForColor(
          product.id,
          selectedVariant.Color,
        )

      const key =
        makeVariantKey(
          product.id,
          selectedVariant,
        )

      setCart((previousCart) => {
        const existing =
          previousCart.find(
            (item) =>
              makeVariantKey(
                item.productId,
                item.variant,
              ) === key,
          )

        if (existing) {
          return previousCart.map(
            (item) => {
              const itemKey =
                makeVariantKey(
                  item.productId,
                  item.variant,
                )

              if (itemKey !== key) {
                return item
              }

              return {
                ...item,

                /*
                 * Update these too so old
                 * localStorage cart data cannot
                 * keep stale price/stock/image.
                 */
                price: variantPrice,
                maxStock:
                  variantStock,
                sku,
                image,

                quantity:
                  Math.min(
                    item.quantity +
                      safeQuantity,
                    variantStock,
                  ),
              }
            },
          )
        }

        return [
          ...previousCart,

          {
            productId:
              product.id,

            name:
              product.name,

            brand:
              product.brand,

            price:
              variantPrice,

            image,

            variant: {
              ...selectedVariant,
            },

            quantity:
              safeQuantity,

            maxStock:
              variantStock,

            sku,
          },
        ]
      })

      trackEvent(
        'cart_add',
        {
          productId:
            product.id,

          name:
            product.name,

          quantity:
            safeQuantity,

          sku,

          price:
            variantPrice,

          variant:
            selectedVariant,
        },
      )
    }

  /* =====================================================
     REMOVE FROM CART
  ===================================================== */

  const removeFromCart:
    StoreContextType['removeFromCart'] = (
      productId,
      itemVariantKey,
    ) => {
      setCart((previousCart) =>
        previousCart.filter(
          (item) =>
            makeVariantKey(
              item.productId,
              item.variant,
            ) !==
            itemVariantKey,
        ),
      )

      trackEvent(
        'cart_remove',
        {
          productId,
        },
      )
    }

  /* =====================================================
     UPDATE QUANTITY
  ===================================================== */

  const updateQuantity:
    StoreContextType['updateQuantity'] = (
      _productId,
      itemVariantKey,
      quantity,
    ) => {
      if (quantity < 1) {
        return
      }

      setCart((previousCart) =>
        previousCart.map(
          (item) => {
            const itemKey =
              makeVariantKey(
                item.productId,
                item.variant,
              )

            if (
              itemKey !==
              itemVariantKey
            ) {
              return item
            }

            return {
              ...item,

              quantity:
                Math.min(
                  quantity,
                  item.maxStock,
                ),
            }
          },
        ),
      )
    }

  /* =====================================================
     SAVE FOR LATER
  ===================================================== */

  const saveForLater:
    StoreContextType['saveForLater'] = (
      _productId,
      itemVariantKey,
    ) => {
      const item =
        cart.find(
          (cartItem) =>
            makeVariantKey(
              cartItem.productId,
              cartItem.variant,
            ) ===
            itemVariantKey,
        )

      if (!item) {
        return
      }

      setSavedItems(
        (previous) => {
          const exists =
            previous.some(
              (savedItem) =>
                makeVariantKey(
                  savedItem.productId,
                  savedItem.variant,
                ) ===
                itemVariantKey,
            )

          if (exists) {
            return previous
          }

          return [
            ...previous,
            item,
          ]
        },
      )

      setCart(
        (previousCart) =>
          previousCart.filter(
            (cartItem) =>
              makeVariantKey(
                cartItem.productId,
                cartItem.variant,
              ) !==
              itemVariantKey,
          ),
      )
    }

  /* =====================================================
     CART TOTALS
  ===================================================== */

  const cartTotal =
    cart.reduce(
      (total, item) =>
        total +
        item.price *
          item.quantity,
      0,
    )

  const cartCount =
    cart.reduce(
      (total, item) =>
        total +
        item.quantity,
      0,
    )

  /* =====================================================
     WISHLIST
  ===================================================== */

  const toggleWishlist:
    StoreContextType['toggleWishlist'] = (
      productId,
    ) => {
      setWishlist((previous) => {
        if (
          previous.includes(
            productId,
          )
        ) {
          trackEvent(
            'wishlist_remove',
            {
              productId,
            },
          )

          return previous.filter(
            (id) =>
              id !== productId,
          )
        }

        trackEvent(
          'wishlist_add',
          {
            productId,
          },
        )

        return [
          ...previous,
          productId,
        ]
      })
    }

  const isInWishlist:
    StoreContextType['isInWishlist'] = (
      productId,
    ) =>
      wishlist.includes(
        productId,
      )

  /* =====================================================
     LOGIN
  ===================================================== */

  const login:
    StoreContextType['login'] = (
      email,
      password,
    ) => {
      /*
       * Temporary frontend/demo authentication.
       * Backend auth will replace this later.
       */

      if (
        email ===
          'admin@nova.com' &&
        password ===
          'admin'
      ) {
        setUser({
          name: 'Admin',
          email,
          role: 'admin',
        })

        trackEvent(
          'login',
          {
            email,
            role: 'admin',
          },
        )

        return true
      }

      if (email && password) {
        const name =
          email
            .split('@')[0]
            .replace(
              /[._]/g,
              ' ',
            )
            .replace(
              /\b\w/g,
              (character) =>
                character.toUpperCase(),
            )

        setUser({
          name,
          email,
          role: 'customer',
        })

        trackEvent(
          'login',
          {
            email,
            role: 'customer',
          },
        )

        return true
      }

      return false
    }

  /* =====================================================
     REGISTER
  ===================================================== */

  const register:
    StoreContextType['register'] = (
      name,
      email,
      password,
    ) => {
      if (
        name &&
        email &&
        password
      ) {
        setUser({
          name,
          email,
          role: 'customer',
        })

        trackEvent(
          'login',
          {
            email,
            role: 'customer',
            isNew: true,
          },
        )

        return true
      }

      return false
    }

  /* =====================================================
     LOGOUT
  ===================================================== */

  const logout = () => {
    trackEvent(
      'logout',
      {
        email: user?.email,
      },
    )

    setUser(null)
  }

  /* =====================================================
     PROVIDER
  ===================================================== */

  return (
    <StoreContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        saveForLater,
        cartTotal,
        cartCount,

        wishlist,
        toggleWishlist,
        isInWishlist,

        user,
        login,
        register,
        logout,

        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

/* =====================================================
   STORE HOOK
===================================================== */

export function useStore() {
  const context =
    useContext(StoreContext)

  if (!context) {
    throw new Error(
      'useStore must be used within StoreProvider',
    )
  }

  return context
}

/* =====================================================
   VARIANT KEY

   Kept exported because Cart.tsx or other existing
   components may already import it.
===================================================== */

export function variantKey(
  productId: string,
  variant: Record<string, string>,
) {
  return makeVariantKey(
    productId,
    variant,
  )
}