import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { Minus, Plus, X, ShoppingBag, Trash2 } from 'lucide-react'
import { useCart } from '../../context/CartContext.jsx'
import { formatPKR } from '../../services/format.js'
import './CartDrawer.css'

const SHIPPING = 250

function shadeLabel(shade) {
  if (!shade) return ''
  return typeof shade === 'string'
    ? shade
    : shade.name || shade.label || shade.title || ''
}

export default function CartDrawer() {
  const {
    items, count, subtotal, isCartOpen, closeCart,
    removeItem, updateQuantity,
  } = useCart()
  const closeRef = useRef(null)

  useEffect(() => {
    if (!isCartOpen) return undefined

    const previousOverflow = document.body.style.overflow
    const previousFocus = document.activeElement
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    function onKeyDown(event) {
      if (event.key === 'Escape') closeCart()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
      previousFocus?.focus?.()
    }
  }, [isCartOpen, closeCart])

  if (!isCartOpen) return null

  const total = items.length ? subtotal + SHIPPING : 0

  return createPortal(
    <div className="minaysh-cart" role="presentation">
      <button
        type="button"
        className="minaysh-cart__backdrop"
        onClick={closeCart}
        aria-label="Close shopping bag"
      />

      <aside
        className="minaysh-cart__drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="minaysh-cart-title"
      >
        <div className="minaysh-cart__header">
          <div>
            <p className="minaysh-cart__eyebrow">MINAYSH</p>
            <h2 id="minaysh-cart-title">Your Shopping Bag <span>({count})</span></h2>
          </div>
          <button
            type="button"
            ref={closeRef}
            className="minaysh-cart__icon-button"
            onClick={closeCart}
            aria-label="Close shopping bag"
          >
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="minaysh-cart__empty">
            <ShoppingBag size={42} strokeWidth={1} />
            <p>Your shopping bag is empty.</p>
            <button type="button" onClick={closeCart}>Continue shopping</button>
          </div>
        ) : (
          <>
            <div className="minaysh-cart__items">
              {items.map((item) => (
                <div className="minaysh-cart__item" key={`${item.id}__${shadeLabel(item.shade)}__${item.size || ''}`}>
                  <Link to={`/product/${item.id}`} onClick={closeCart} className="minaysh-cart__image-link">
                    <img src={item.image} alt={item.name} />
                  </Link>
                  <div className="minaysh-cart__item-info">
                    <div className="minaysh-cart__item-top">
                      <Link to={`/product/${item.id}`} onClick={closeCart} className="minaysh-cart__name">
                        {item.name}
                      </Link>
                      <button
                        type="button"
                        className="minaysh-cart__remove"
                        onClick={() => removeItem(item.id, item.shade, item.size)}
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 size={17} strokeWidth={1.5} />
                      </button>
                    </div>
                    {shadeLabel(item.shade) && <p className="minaysh-cart__variant">Shade: {shadeLabel(item.shade)}</p>}
                    {item.size && <p className="minaysh-cart__variant">Size: {item.size}</p>}
                    <div className="minaysh-cart__item-bottom">
                      <div className="minaysh-cart__quantity">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.shade, item.size, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          aria-label={`Decrease ${item.name} quantity`}
                        >
                          <Minus size={14} />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.shade, item.size, item.quantity + 1)}
                          aria-label={`Increase ${item.name} quantity`}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <strong>{formatPKR(item.price * item.quantity)}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="minaysh-cart__footer">
              <div className="minaysh-cart__total-row"><span>Subtotal</span><span>{formatPKR(subtotal)}</span></div>
              <div className="minaysh-cart__total-row"><span>Delivery</span><span>{formatPKR(SHIPPING)}</span></div>
              <div className="minaysh-cart__total-row minaysh-cart__total-row--grand"><span>Estimated total</span><strong>{formatPKR(total)}</strong></div>
              <Link to="/checkout" className="minaysh-cart__checkout" onClick={closeCart}>Check out</Link>
              <Link to="/cart" className="minaysh-cart__view-bag" onClick={closeCart}>View shopping bag</Link>
            </div>
          </>
        )}
      </aside>
    </div>,
    document.body
  )
}
