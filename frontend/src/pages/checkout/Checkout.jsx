import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart, couponDiscount } from '../../context/CartContext.jsx'
import CouponBox from '../../components/cart/CouponBox.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { formatPKR } from '../../services/format.js'
import { SHIPPING_STANDARD, SHIPPING_EXPRESS } from '../../config/store.js'
import PageHeader from '../../components/common/PageHeader.jsx'
import { placeOrder, getAddresses, addAddress } from '../../services/storeApi.js'
import './Checkout.css'

// Pakistani mobile: 03xxxxxxxxx or +923xxxxxxxxx (spaces / dashes allowed)
const PHONE_RE = /^(\+92|0)3\d{9}$/

export default function Checkout() {
  const { items, subtotal, clearCart, coupon, hasBlockingIssue } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [placing, setPlacing] = useState(false)
  const [delivery, setDelivery] = useState('standard')
  const [payment, setPayment] = useState('cod')
  const [phoneError, setPhoneError] = useState('')
  const [orderError, setOrderError] = useState('')
  const [saveAddress, setSaveAddress] = useState(true)
  const [hasSavedAddress, setHasSavedAddress] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    postal: '',
    province: '',
  })

  // Saved default address ho to form khud bhar do
  useEffect(() => {
    let alive = true
    getAddresses()
      .then((list) => {
        if (!alive || !list.length) return
        const a = list.find((x) => x.isDefault) || list[0]
        setHasSavedAddress(true)
        setSaveAddress(false)
        setForm((f) => ({
          ...f,
          name: f.name || a.fullName || '',
          phone: f.phone || a.phone || '',
          street: a.street || '',
          city: a.city || '',
          postal: a.postal || '',
          province: a.province || '',
        }))
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  const shipping = delivery === 'express' ? SHIPPING_EXPRESS : SHIPPING_STANDARD
  const discount = couponDiscount(coupon, subtotal, shipping)
  const total = items.length > 0 ? Math.max(0, subtotal - discount + shipping) : 0

  function update(field) {
    return (e) => {
      setForm((f) => ({ ...f, [field]: e.target.value }))
      if (field === 'phone') setPhoneError('')
    }
  }

  async function handlePlaceOrder(e) {
    e.preventDefault()
    if (items.length === 0) return
    setOrderError('')

    const phone = form.phone.replace(/[\s-]/g, '')
    if (!PHONE_RE.test(phone)) {
      setPhoneError('Please enter a valid mobile number, e.g. 03001234567')
      return
    }

    setPlacing(true)
    try {
      // Backend price, stock aur total khud check karta hai, phir confirmation email bhejta hai
      const order = await placeOrder({
        items: items.map((it) => ({ sku: it.id, quantity: it.quantity, shade: it.shade, size: it.size })),
        customer: { ...form, phone },
        delivery,
        payment,
        couponCode: coupon?.code || undefined,
      })

      if (saveAddress && !hasSavedAddress) {
        addAddress({
          label: 'Home',
          fullName: form.name,
          phone,
          street: form.street,
          city: form.city,
          province: form.province,
          postal: form.postal,
          isDefault: true,
        }).catch(() => {})
      }

      clearCart()
      navigate('/account/orders', { state: { justPlaced: true, orderId: order.id } })
    } catch (err) {
      setOrderError(err.message || 'Order could not be placed. Please try again.')
    } finally {
      setPlacing(false)
    }
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
              {!hasSavedAddress && (
                <label className="checkout-form__radio">
                  <input type="checkbox" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} />
                  Save this address to my account
                </label>
              )}
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

            {orderError && <p className="checkout-form__error" role="alert">{orderError}</p>}

            {hasBlockingIssue && (
              <p className="checkout-form__error" role="alert">
                Some items in your bag are sold out or low in stock — please update your bag first.
              </p>
            )}

            <button type="submit" className="checkout-form__submit" disabled={placing || items.length === 0 || hasBlockingIssue}>
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
            {discount > 0 && (
              <div className="checkout-summary__row cart-discount-row">
                <span>Discount ({coupon.code})</span>
                <span>− {formatPKR(discount)}</span>
              </div>
            )}
            <CouponBox shipping={shipping} />
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
