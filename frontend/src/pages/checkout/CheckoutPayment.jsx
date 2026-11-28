import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2, XCircle, Loader2, CreditCard } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader.jsx'
import { confirmCardPayment, startCardPayment } from '../../services/storeApi.js'
import './Checkout.css'

// Stripe se wapas aane ka page: /checkout/payment?order=MN-12&session_id=cs_...  (ya &cancelled=1 / &error=1)
// Paid hai ya nahi, yeh server Stripe se khud poochta hai (URL par yaqeen nahi).
export default function CheckoutPayment() {
  const [params] = useSearchParams()
  const order = params.get('order') || ''
  const sessionId = params.get('session_id')
  const [state, setState] = useState(sessionId ? 'checking' : 'unpaid') // checking | paid | unpaid | error
  const [message, setMessage] = useState('')
  const [retrying, setRetrying] = useState(false)
  const asked = useRef(false)

  useEffect(() => {
    if (!sessionId || asked.current) return
    asked.current = true
    confirmCardPayment(sessionId)
      .then((r) => setState(r?.paid ? 'paid' : 'unpaid'))
      .catch((e) => {
        setMessage(e.message || '')
        setState('error')
      })
  }, [sessionId])

  async function payAgain() {
    setRetrying(true)
    setMessage('')
    try {
      const { url } = await startCardPayment(order)
      window.location.assign(url)
    } catch (e) {
      setMessage(e.message || 'The payment page could not be opened. Please try again.')
      setRetrying(false)
    }
  }

  const orderLink = order ? `/account/orders/${encodeURIComponent(order)}` : '/account/orders'

  return (
    <>
      <PageHeader title="Payment" />
      <section className="container co-pay">
        <div className="co-card co-pay__card">
          {state === 'checking' && (
            <>
              <Loader2 className="co-pay__icon co-pay__spin" size={44} strokeWidth={1.5} aria-hidden="true" />
              <h2>Checking your payment…</h2>
              <p>Please wait a moment and do not close this page.</p>
            </>
          )}

          {state === 'paid' && (
            <>
              <CheckCircle2 className="co-pay__icon co-pay__icon--ok" size={48} strokeWidth={1.5} aria-hidden="true" />
              <h2>Payment received</h2>
              <p>Thank you! Order <strong>{order}</strong> is paid. A confirmation email is on its way.</p>
              <div className="co-pay__actions">
                <Link to={orderLink} className="checkout-form__submit">View my order</Link>
                <Link to="/" className="co-pay__link">Continue shopping</Link>
              </div>
            </>
          )}

          {(state === 'unpaid' || state === 'error') && (
            <>
              <XCircle className="co-pay__icon co-pay__icon--warn" size={48} strokeWidth={1.5} aria-hidden="true" />
              <h2>{params.get('cancelled') ? 'Payment cancelled' : 'Payment not completed'}</h2>
              <p>
                Your order <strong>{order}</strong> is saved, but it is not paid yet. You can try the card again.
                Unpaid card orders are cancelled after 45 minutes.
              </p>
              {message && <p className="checkout-form__error co-alert" role="alert">{message}</p>}
              <div className="co-pay__actions">
                <button type="button" className="checkout-form__submit" onClick={payAgain} disabled={retrying || !order}>
                  <CreditCard size={16} strokeWidth={1.8} aria-hidden="true" />
                  {retrying ? 'Opening secure payment…' : 'Pay with card again'}
                </button>
                <Link to={orderLink} className="co-pay__link">View order</Link>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}
