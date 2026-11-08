import { useState } from 'react'
import { Tag, X } from 'lucide-react'
import { useCart } from '../../context/CartContext.jsx'
import './CouponBox.css'

// Cart aur Checkout dono pe: discount code lagao / hatao
export default function CouponBox({ shipping = 0 }) {
  const { coupon, couponError, applyCoupon, removeCoupon } = useCart()
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    if (!code.trim()) return
    setBusy(true)
    try {
      await applyCoupon(code.trim(), shipping)
      setCode('')
    } catch {
      // error CartContext mein dikhaya jata hai
    } finally {
      setBusy(false)
    }
  }

  if (coupon) {
    return (
      <div className="coupon-box coupon-box--applied">
        <Tag size={14} />
        <div>
          <b>{coupon.code}</b>
          <small>{coupon.description}</small>
        </div>
        <button type="button" onClick={removeCoupon} aria-label="Remove code">
          <X size={14} />
        </button>
      </div>
    )
  }

  return (
    <form className="coupon-box" onSubmit={submit}>
      <input
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder="Discount code"
        aria-label="Discount code"
      />
      <button type="submit" disabled={busy || !code.trim()}>
        {busy ? '…' : 'Apply'}
      </button>
      {couponError && <p className="coupon-box__error" role="alert">{couponError}</p>}
    </form>
  )
}
