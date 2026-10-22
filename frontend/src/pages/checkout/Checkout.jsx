import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { formatPKR } from '../../services/format.js'
import { SHIPPING_STANDARD, SHIPPING_EXPRESS } from '../../config/store.js'
import PageHeader from '../../components/common/PageHeader.jsx'
import './Checkout.css'

const ORDERS_KEY = 'minaysh_orders'

// Pakistani mobile: 03xxxxxxxxx or +923xxxxxxxxx (spaces / dashes allowed)
const PHONE_RE = /^(\+92|0)3\d{9}$/

function saveOrder(order) {
  try {
    const raw = window.localStorage.getItem(ORDERS_KEY)
    const list = raw ? JSON.parse(raw) : []
    window.localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...(Array.isArray(list) ? list : [])]))
  } catch {
    /* ignore */
  }
}

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [placing, setPlacing] = useState(false)
  const [delivery, setDelivery] = useState('standard')
  const [payment, setPayment] = useState('cod')
  const [phoneError, setPhoneError] = useState('')
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    street: '',
    city: '',
    postal: '',
    province: '',
  })

  const shipping = delivery === 'express' ? SHIPPING_EXPRESS : SHIPPING_STANDARD
  const total = items.length > 0 ? subtotal + shipping : 0

  function update(field) {
    return (e) => {
      setForm((f) => ({ ...f, [field]: e.target.value }))
      if (field === 'phone') setPhoneError('')
    }
  }

  function handlePlaceOrder(e) {
    e.preventDefault()
    if (items.length === 0) return

    const phone = form.phone.replace(/[\s-]/g, '')
    if (!PHONE_RE.test(phone)) {
      setPhoneError('Please enter a valid mobile number, e.g. 03001234567')
      return
    }

    setPlacing(true)

    const order = {
      id: `MN-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Processing',
      items: items.map((it) => ({ id: it.id, name: it.name, shade: it.shade, quantity: it.quantity, price: it.price, image: it.image })),
      subtotal,
      shipping,
      total,
      delivery,
      payment,
      customer: { ...form, phone },
    }

    setTimeout(() => {
      saveOrder(order)
      clearCart()
      navigate('/account/orders', { state: { justPlaced: true, orderId: order.id } })
    }, 900)
  }

  return (
    <>
      <PageHeader title="Checkout" />
      <section className="checkout-page">
        <div className="container checkout-page__layout">
          <form className="checkout-form" onSubmit={handlePlaceOrder}>
            <div className="checkout-form__section">
              <h3>Contact Information</h3>
              <div className="checkout-form__row">
                <input type="text" placeholder="Full name" value={form.name} onChange={update('name')} required />
                <input type="email" placeholder="Email address" value={form.email} onChange={update('email')} required />
              </div>
              <input
                type="tel"
                placeholder="Phone number (03001234567)"
                value={form.phone}
                onChange={update('phone')}
                inputMode="tel"
                required
                aria-invalid={Boolean(phoneError)}
              />
              {phoneError && <p className="checkout-form__error" role="alert">{phoneError}</p>}
            </div>

            <div className="checkout-form__section">
              <h3>Delivery Address</h3>
              <input type="text" placeholder="Street address" value={form.street} onChange={update('street')} required />
              <div className="checkout-form__row">
                <input type="text" placeholder="City" value={form.city} onChange={update('city')} required />
                <input type="text" placeholder="Postal code" value={form.postal} onChange={update('postal')} />
              </div>
              <input type="text" placeholder="Province" value={form.province} onChange={update('province')} required />
            </div>

            <div className="checkout-form__section">
              <h3>Delivery Method</h3>
              <label className="checkout-form__radio">
                <input type="radio" name="delivery" checked={delivery === 'standard'} onChange={() => setDelivery('standard')} />
                Standard Delivery (3-5 business days) — {formatPKR(SHIPPING_STANDARD)}
              </label>
              <label className="checkout-form__radio">
                <input type="radio" name="delivery" checked={delivery === 'express'} onChange={() => setDelivery('express')} />
                Express Delivery (1-2 business days) — {formatPKR(SHIPPING_EXPRESS)}
              </label>
            </div>

            <div className="checkout-form__section">
              <h3>Payment</h3>
              <label className="checkout-form__radio">
                <input type="radio" name="payment" checked={payment === 'cod'} onChange={() => setPayment('cod')} />
                Cash on Delivery
              </label>
              <label className="checkout-form__radio">
                <input type="radio" name="payment" checked={payment === 'card'} onChange={() => setPayment('card')} />
                Credit / Debit Card
              </label>
              {payment === 'card' && (
                <p className="checkout-form__note">
                  Card payment is coming soon. For now your order will be confirmed by phone.
                </p>
              )}
            </div>

            <button type="submit" className="checkout-form__submit" disabled={placing || items.length === 0}>
              {placing ? 'Placing Order…' : `Place Order · ${formatPKR(total)}`}
            </button>
          </form>

          <aside className="checkout-summary">
            <h3>Order Summary</h3>
            <div className="checkout-summary__items">
              {items.map((item) => (
                <div className="checkout-summary__item" key={`${item.id}-${item.shade}`}>
                  <img src={item.image} alt={item.name} />
                  <div>
                    <p>{item.name}</p>
                    <span>Qty {item.quantity}{item.shade ? ` · ${item.shade}` : ''}</span>
                  </div>
                  <span className="checkout-summary__item-price">
                    {formatPKR(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="checkout-summary__row">
              <span>Subtotal</span>
              <span>{formatPKR(subtotal)}</span>
            </div>
            <div className="checkout-summary__row">
              <span>Shipping ({delivery === 'express' ? 'Express' : 'Standard'})</span>
              <span>{formatPKR(shipping)}</span>
            </div>
            <div className="checkout-summary__row checkout-summary__row--total">
              <span>Total</span>
              <span>{formatPKR(total)}</span>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
