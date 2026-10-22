import { Link } from 'react-router-dom'
import { Minus, Plus, X, Heart } from 'lucide-react'
import { useCart } from '../../context/CartContext.jsx'
import { useWishlist } from '../../context/WishlistContext.jsx'
import { formatPKR } from '../../services/format.js'
import PageHeader from '../../components/common/PageHeader.jsx'
import './Cart.css'

const SHIPPING = 250

export default function Cart() {
  const { items, removeItem, updateQuantity, subtotal } = useCart()
  const { toggle } = useWishlist()

  const total = items.length > 0 ? subtotal + SHIPPING : 0

  return (
    <>
      <PageHeader title="Shopping Bag" />

      <section className="cart-page">
        <div className="container">
          {items.length === 0 ? (
            <div className="cart-page__empty">
              <p>Your bag is empty.</p>
              <Link to="/skincare" className="cart-page__empty-link">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="cart-page__layout">
              <div className="cart-page__items">
                {items.map((item) => (
                  <div className="cart-item" key={`${item.id}-${item.shade}-${item.size}`}>
                    <img src={item.image} alt={item.name} className="cart-item__image" />
                    <div className="cart-item__details">
                      <div className="cart-item__top">
                        <div>
                          <h3>{item.name}</h3>
                          {item.shade && <p className="cart-item__variant">Shade: {item.shade}</p>}
                          {item.size && <p className="cart-item__variant">Size: {item.size}</p>}
                        </div>
                        <button
                          className="cart-item__remove"
                          onClick={() => removeItem(item.id, item.shade, item.size)}
                          aria-label="Remove item"
                        >
                          <X size={17} strokeWidth={1.5} />
                        </button>
                      </div>

                      <div className="cart-item__bottom">
                        <div className="cart-item__qty">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.shade, item.size, item.quantity - 1)
                            }
                            aria-label="Decrease quantity"
                          >
                            <Minus size={13} />
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.shade, item.size, item.quantity + 1)
                            }
                            aria-label="Increase quantity"
                          >
                            <Plus size={13} />
                          </button>
                        </div>

                        <div className="cart-item__right">
                          <button
                            className="cart-item__save"
                            onClick={() => {
                              toggle(item.id)
                              removeItem(item.id, item.shade, item.size)
                            }}
                          >
                            <Heart size={14} strokeWidth={1.5} /> Save for later
                          </button>
                          <span className="cart-item__price">
                            {formatPKR(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <aside className="cart-summary">
                <h3>Order Summary</h3>
                <div className="cart-summary__row">
                  <span>Subtotal</span>
                  <span>{formatPKR(subtotal)}</span>
                </div>
                <div className="cart-summary__row">
                  <span>Shipping</span>
                  <span>{formatPKR(SHIPPING)}</span>
                </div>
                <div className="cart-summary__row cart-summary__row--total">
                  <span>Total</span>
                  <span>{formatPKR(total)}</span>
                </div>
                <Link to="/checkout" className="cart-summary__checkout">
                  Proceed to Checkout
                </Link>
              </aside>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
