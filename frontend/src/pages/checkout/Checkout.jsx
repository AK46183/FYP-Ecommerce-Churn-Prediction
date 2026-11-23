import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart, couponDiscount } from '../../context/CartContext.jsx'
import CouponBox from '../../components/cart/CouponBox.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { formatPKR } from '../../services/format.js'
import { SHIPPING_STANDARD, SHIPPING_EXPRESS } from '../../config/store.js'
import PageHeader from '../../components/common/PageHeader.jsx'
import { placeOrder, getAddresses, addAddress } from '../../services/storeApi.js'
import { Truck, Zap, Banknote, CreditCard, Lock, ShieldCheck, RotateCcw } from 'lucide-react'
import './Checkout.css'

// Pakistani mobile: 03xxxxxxxxx or +923xxxxxxxxx (spaces / dashes allowed)
const PHONE_RE = /^(\+92|0)3\d{9}$/

// ek option card (delivery / payment): poora dabba click hota hai
function Option({ name, value, current, onPick, icon: Icon, title, sub, price }) {
  return (
    <label className={`co-option${current === value ? ' is-active' : ''}`}>
      <input type="radio" name={name} checked={current === value} onChange={onPick} />
      <span className="co-option__icon" aria-hidden="true"><Icon size={18} strokeWidth={1.6} /></span>
      <span className="co-option__text">
        <strong>{title}</strong>
        {sub && <small>{sub}</small>}
      </span>
      {price && <span className="co-option__price">{price}</span>}
    </label>
  )
}

export default function Checkout() {
  const { items, subtotal, clearCart, coupon, hasBlockingIssue, bundle } = useCart()
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
  const total = items.length > 0 ? Math.max(0, subtotal - discount - bundle.discount + shipping) : 0

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

  const itemCount = items.reduce((n, it) => n + it.quantity, 0)

  return (
    <>
      <PageHeader title="Checkout" />
      <section className="checkout-page">
        <div className="container checkout-page__layout">
          <form id="checkout-form" className="checkout-form" onSubmit={handlePlaceOrder}>
            <div className="co-card">
              <h3 className="co-card__title"><span>1</span>Contact information</h3>
              <div className="co-grid">
                <label className="co-field">
                  <span>Full name</span>
                  <input type="text" value={form.name} onChange={update('name')} autoComplete="name" required />
                </label>
                <label className="co-field">
                  <span>Email</span>
                  <input type="email" value={form.email} onChange={update('email')} autoComplete="email" required />
                </label>
              </div>
              <label className="co-field">
                <span>Phone number</span>
                <input
                  type="tel"
                  placeholder="03001234567"
                  value={form.phone}
                  onChange={update('phone')}
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  aria-invalid={Boolean(phoneError)}
                />
              </label>
              {phoneError && <p className="checkout-form__error" role="alert">{phoneError}</p>}
            </div>

            <div className="co-card">
              <h3 className="co-card__title"><span>2</span>Delivery address</h3>
              <label className="co-field">
                <span>Street address</span>
                <input type="text" placeholder="House, street, area" value={form.street} onChange={update('street')} autoComplete="street-address" required />
              </label>
              <div className="co-grid co-grid--3">
                <label className="co-field">
                  <span>City</span>
                  <input type="text" value={form.city} onChange={update('city')} autoComplete="address-level2" required />
                </label>
                <label className="co-field">
                  <span>Province</span>
                  <input type="text" value={form.province} onChange={update('province')} autoComplete="address-level1" required />
                </label>
                <label className="co-field">
                  <span>Postal code <em>(optional)</em></span>
                  <input type="text" value={form.postal} onChange={update('postal')} autoComplete="postal-code" />
                </label>
              </div>
              {!hasSavedAddress && (
                <label className="co-check">
                  <input type="checkbox" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} />
                  Save this address to my account
                </label>
              )}
            </div>

            <div className="co-card">
              <h3 className="co-card__title"><span>3</span>Delivery method</h3>
              <div className="co-options">
                <Option name="delivery" value="standard" current={delivery} onPick={() => setDelivery('standard')}
                  icon={Truck} title="Standard delivery" sub="3 to 5 business days" price={formatPKR(SHIPPING_STANDARD)} />
                <Option name="delivery" value="express" current={delivery} onPick={() => setDelivery('express')}
                  icon={Zap} title="Express delivery" sub="1 to 2 business days" price={formatPKR(SHIPPING_EXPRESS)} />
              </div>
            </div>

            <div className="co-card">
              <h3 className="co-card__title"><span>4</span>Payment</h3>
              <div className="co-options">
                <Option name="payment" value="cod" current={payment} onPick={() => setPayment('cod')}
                  icon={Banknote} title="Cash on delivery" sub="Pay when your order arrives" />
                <Option name="payment" value="card" current={payment} onPick={() => setPayment('card')}
                  icon={CreditCard} title="Credit / debit card" sub="Coming soon" />
              </div>
              {payment === 'card' && (
                <p className="checkout-form__note">
                  Card payment is coming soon. For now your order will be confirmed by phone.
                </p>
              )}
            </div>

            {orderError && <p className="checkout-form__error co-alert" role="alert">{orderError}</p>}

            {hasBlockingIssue && (
              <p className="checkout-form__error co-alert" role="alert">
                Some items in your bag are sold out or low in stock. Please update your bag first.
              </p>
            )}
          </form>

          <aside className="checkout-summary co-card">
            <h3 className="checkout-summary__title">
              Order summary <small>{itemCount} item{itemCount === 1 ? '' : 's'}</small>
            </h3>
            <div className="checkout-summary__items">
              {items.map((item) => (
                <div className="checkout-summary__item" key={`${item.id}-${item.shade}-${item.size}`}>
                  <span className="checkout-summary__thumb">
                    <img src={item.image} alt="" />
                    <b>{item.quantity}</b>
                  </span>
                  <div>
                    <p>{item.name}</p>
                    {(item.shade || item.size) && <span>{[item.shade, item.size].filter(Boolean).join(' · ')}</span>}
                  </div>
                  <span className="checkout-summary__item-price">{formatPKR(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <CouponBox shipping={shipping} />
            <div className="checkout-summary__rows">
              <div className="checkout-summary__row">
                <span>Subtotal</span>
                <span>{formatPKR(subtotal)}</span>
              </div>
              <div className="checkout-summary__row">
                <span>Delivery ({delivery === 'express' ? 'Express' : 'Standard'})</span>
                <span>{formatPKR(shipping)}</span>
              </div>
              {discount > 0 && (
                <div className="checkout-summary__row cart-discount-row">
                  <span>Discount ({coupon.code})</span>
                  <span>−{formatPKR(discount)}</span>
                </div>
              )}
              {bundle.discount > 0 && (
                <div className="checkout-summary__row cart-discount-row">
                  <span>Bundle deal ({bundle.bundles} × 3 items)</span>
                  <span>−{formatPKR(bundle.discount)}</span>
                </div>
              )}
              <div className="checkout-summary__row checkout-summary__row--total">
                <span>Total</span>
                <span>{formatPKR(total)}</span>
              </div>
            </div>
            <button
              type="submit"
              form="checkout-form"
              className="checkout-form__submit"
              disabled={placing || items.length === 0 || hasBlockingIssue}
            >
              <Lock size={15} strokeWidth={2} aria-hidden="true" />
              {placing ? 'Placing order…' : `Place order · ${formatPKR(total)}`}
            </button>
            <ul className="checkout-trust">
              <li><ShieldCheck size={15} strokeWidth={1.6} aria-hidden="true" />Secure checkout</li>
              <li><Banknote size={15} strokeWidth={1.6} aria-hidden="true" />Cash on delivery</li>
              <li><RotateCcw size={15} strokeWidth={1.6} aria-hidden="true" />Easy returns</li>
            </ul>
          </aside>
        </div>
      </section>
    </>
  )
}
