import { Link } from 'react-router-dom'
import { ScrollText } from 'lucide-react'
import { InfoPage, InfoHighlight, InfoPanel } from './InfoKit.jsx'

const TERMS = [
  ['Using MINAYSH', 'By using the MINAYSH website you agree to these terms. Please use the site respectfully and give accurate information when you create an account or place an order.'],
  ['Your account', 'Keep your password private. You are responsible for orders placed from your account. If you think someone else has used it, change your password and contact us.'],
  ['Products and prices', 'All prices are in Pakistani Rupees (PKR). Prices and stock are checked again when you place your order, so the amount at checkout is the final amount you pay.'],
  ['Payment', <>Cash on Delivery is available all over Pakistan. See <Link to="/help/payment">Payment Methods</Link> for details.</>],
  ['Delivery', <>Delivery times and charges are listed on our <Link to="/help/delivery">Delivery Options</Link> page. Delivery times are estimates.</>],
  ['Cancellations', 'You can change or cancel an order while it is still Pending or Processing.'],
  ['Returns and exchanges', <>Unused items in their original packaging can be exchanged within 7 days of delivery. See our <Link to="/help/returns">Return Policy</Link>.</>],
  ['Offers and discount codes', 'Each discount code can be used once per customer. Some codes need a minimum order amount or have an end date.'],
  ['Skincare advice', 'Tips from our Skincare Assistant and skin scan are a general guide, not a medical diagnosis. For any skin condition, please see a dermatologist.'],
  ['Changes to these terms', 'We may update these terms from time to time. The latest version is always on this page.'],
]

export default function TermsConditions() {
  return (
    <InfoPage title="Terms & Conditions" subtitle="The simple rules for shopping with MINAYSH." updated="November 2026">
      <InfoHighlight icon={ScrollText} title="Shopping with MINAYSH">
        These terms explain how ordering, payment, delivery and returns work on our website. We have kept them short and clear.
      </InfoHighlight>

      <InfoPanel>
        <div className="info-terms">
          {TERMS.map(([title, text]) => (
            <div key={title} className="info-term">
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </InfoPanel>
    </InfoPage>
  )
}
