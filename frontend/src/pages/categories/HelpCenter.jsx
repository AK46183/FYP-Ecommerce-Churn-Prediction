import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Package, RotateCcw, MessageCircle, Sparkles, Truck, CreditCard, Gift, User, ChevronDown, Mail } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader.jsx'
import './HelpCenter.css'

// Skincare Assistant (chat) khol do: wohi button dabao jo kone mein hai
const openAssistant = () => document.querySelector('button[aria-label="Open skin assistant"]')?.click()

const TOPICS = [
  {
    id: 'orders', title: 'Orders and delivery', icon: Truck,
    faqs: [
      ['How much does delivery cost?', 'Standard delivery anywhere in Pakistan is PKR 250 and arrives in 3 to 5 business days. Express delivery is PKR 600 and arrives in 1 to 2 business days. You choose the option at checkout.'],
      ['How can I track my order?', <>Sign in and open <Link to="/account/orders">My Account, then Orders</Link>. Every order shows its live status: Order placed, Processing, Shipped, Delivered. We also email you when the status changes.</>],
      ['Can I change or cancel my order?', <>Yes, while it is still Pending or Processing. Send us a message on the <Link to="/contact">Contact Us</Link> page with your order number (for example MN-12) and we will update it before it ships.</>],
      ['I did not get a confirmation email', 'Check your spam or promotions folder first. Your order is also saved under My Account, then Orders, so you can always see it there.'],
    ],
  },
  {
    id: 'returns', title: 'Returns and exchanges', icon: RotateCcw,
    faqs: [
      ['What is your return policy?', 'You can exchange an item within 7 days of delivery if it is unused and in its original packaging. Refunds go back to your original payment method after we inspect the item.'],
      ['How do I start an exchange?', <>Open the <Link to="/contact">Contact Us</Link> page, choose your order number and tell us what you would like to exchange. Our team replies within 1 to 2 business days.</>],
      ['My product arrived damaged', <>We are sorry! Take a photo of the item and the box and send it to us on the <Link to="/contact">Contact Us</Link> page with your order number, and our team will help you with an exchange.</>],
    ],
  },
  {
    id: 'payment', title: 'Payment', icon: CreditCard,
    faqs: [
      ['Which payment methods do you accept?', 'Cash on delivery is available across Pakistan. Card payment is coming soon; if you choose it now, we confirm your order by phone.'],
      ['Is my information safe?', 'Yes. Your password is encrypted, we never ask for card numbers or OTP codes in chat or email, and we never sell your personal data.'],
    ],
  },
  {
    id: 'offers', title: 'Offers, coupons and bundles', icon: Gift,
    faqs: [
      ['How does the bundle offer work?', <>Pick any 3 different products on the <Link to="/bundle-offer">Bundle Offer</Link> page. If the bundle total is PKR 3,000 or more, you get PKR 1,000 off. Every 3 products is a new bundle, so 6 products can save PKR 2,000. The discount appears automatically in your bag and at checkout.</>],
      ['How do I use a discount code?', 'Type the code in the "Discount code" box in your bag or at checkout and press Apply. Each code can be used once per customer and some codes need a minimum order amount.'],
      ['How do I hear about new launches?', <>See the countdown on the <Link to="/new">New</Link> page and press "Notify me", or subscribe to our newsletter at the bottom of any page.</>],
    ],
  },
  {
    id: 'skincare', title: 'Skincare help', icon: Sparkles,
    faqs: [
      ['Which products are right for my skin?', 'Ask our Skincare Assistant (the button in the corner). Tell it your skin type and concern, for example "oily skin with acne", and it suggests products from our store with a simple routine.'],
      ['How does the face scan work?', 'In the Skincare Assistant you can take a live scan or upload a selfie. It looks at oiliness, dryness, redness and spots and suggests products. Your photo is never saved. The scan is a guide, not a medical diagnosis.'],
      ['I am pregnant or have allergies', 'Tell the Skincare Assistant and it avoids unsuitable ingredients, such as retinoids during pregnancy. For any skin condition, please see a dermatologist.'],
    ],
  },
  {
    id: 'account', title: 'My account', icon: User,
    faqs: [
      ['I forgot my password', <>Use <Link to="/forgot-password">Forgot password</Link> on the sign-in page. We email you a reset link that works for 30 minutes.</>],
      ['How do I save my address?', <>Tick "Save this address to my account" at checkout, or add it under <Link to="/account/addresses">My Account, then Addresses</Link>.</>],
      ['Where is my wishlist?', <>Tap the heart on any product. Everything you save is in <Link to="/account/wishlist">My Account, then Wishlist</Link>.</>],
    ],
  },
]

const textOf = (node) => (typeof node === 'string' ? node : Array.isArray(node) ? node.map(textOf).join(' ') : node?.props?.children ? textOf(node.props.children) : '')

export default function HelpCenter() {
  const [query, setQuery] = useState('')
  const [topic, setTopic] = useState('all')
  const q = query.trim().toLowerCase()

  const shown = useMemo(
    () =>
      TOPICS.filter((t) => topic === 'all' || t.id === topic)
        .map((t) => ({ ...t, faqs: t.faqs.filter(([qq, a]) => !q || `${qq} ${textOf(a)}`.toLowerCase().includes(q)) }))
        .filter((t) => t.faqs.length),
    [q, topic],
  )

  return (
    <>
      <PageHeader title="Help Center" subtitle="How can we help you today?" />
      <section className="help-page">
        <div className="container help-wrap">
          <label className="help-search">
            <Search size={18} aria-hidden="true" />
            <input
              type="search"
              placeholder="Search for help, e.g. delivery, return, bundle"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setTopic('all') }}
            />
          </label>

          <div className="help-actions">
            <Link to="/account/orders" className="help-action">
              <span><Package size={20} strokeWidth={1.6} /></span>
              <strong>Track my order</strong>
              <small>See the status of your orders</small>
            </Link>
            <button type="button" className="help-action" onClick={() => { setTopic('returns'); setQuery('') }}>
              <span><RotateCcw size={20} strokeWidth={1.6} /></span>
              <strong>Returns and exchanges</strong>
              <small>7-day exchange policy</small>
            </button>
            <button type="button" className="help-action" onClick={openAssistant}>
              <span><Sparkles size={20} strokeWidth={1.6} /></span>
              <strong>Skincare Assistant</strong>
              <small>Get product advice for your skin</small>
            </button>
            <Link to="/contact" className="help-action">
              <span><MessageCircle size={20} strokeWidth={1.6} /></span>
              <strong>Contact us</strong>
              <small>We reply in 1 to 2 business days</small>
            </Link>
          </div>

          <div className="help-topics" role="tablist" aria-label="Help topics">
            <button type="button" role="tab" aria-selected={topic === 'all'} className={topic === 'all' ? 'is-active' : ''} onClick={() => setTopic('all')}>All topics</button>
            {TOPICS.map((t) => (
              <button key={t.id} type="button" role="tab" aria-selected={topic === t.id} className={topic === t.id ? 'is-active' : ''} onClick={() => setTopic(t.id)}>
                {t.title}
              </button>
            ))}
          </div>

          {shown.length === 0 ? (
            <div className="help-empty">
              <p>No answers found for &ldquo;{query}&rdquo;.</p>
              <Link to="/contact" className="help-btn">Ask our team</Link>
            </div>
          ) : (
            <div className="help-groups">
              {shown.map((t) => {
                const Icon = t.icon
                return (
                  <section key={t.id} className="help-group" id={t.id}>
                    <h2><Icon size={17} strokeWidth={1.7} aria-hidden="true" />{t.title}</h2>
                    {t.faqs.map(([question, answer]) => (
                      <details key={question} className="help-faq" open={Boolean(q)}>
                        <summary>
                          {question}
                          <ChevronDown size={18} aria-hidden="true" />
                        </summary>
                        <div className="help-faq__a">{answer}</div>
                      </details>
                    ))}
                  </section>
                )
              })}
            </div>
          )}

          <div className="help-more">
            <div>
              <h3>Still need help?</h3>
              <p>Our team is here for you. Send us a message and we will get back to you within 1 to 2 business days.</p>
            </div>
            <div className="help-more__btns">
              <Link to="/contact" className="help-btn"><Mail size={16} aria-hidden="true" />Contact us</Link>
              <button type="button" className="help-btn help-btn--ghost" onClick={openAssistant}>
                <Sparkles size={16} aria-hidden="true" />Ask the Skincare Assistant
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
