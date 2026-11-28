import { Link } from 'react-router-dom'
import { RotateCcw, ClipboardCheck, MessageCircle, Clock, PackageSearch, RefreshCw, AlertTriangle, XCircle } from 'lucide-react'
import { InfoPage, InfoHighlight, InfoPanel, Steps, Checklist, Callout } from './InfoKit.jsx'

export default function ReturnPolicy() {
  return (
    <InfoPage title="Return Policy" subtitle="Not quite right? We make exchanges simple.">
      <InfoHighlight icon={RotateCcw} title="7-day easy exchange">
        You can exchange an item within 7 days of delivery. Refunds go back to your original payment method after we inspect the item.
      </InfoHighlight>

      <InfoPanel icon={ClipboardCheck} title="An item can be exchanged if">
        <Checklist
          items={[
            'It is within 7 days of delivery.',
            'It is unused.',
            'It is in its original packaging.',
          ]}
        />
      </InfoPanel>

      <InfoPanel icon={RefreshCw} title="How to exchange">
        <Steps
          items={[
            { icon: MessageCircle, title: 'Tell us', text: 'Send your order number (e.g. MN-12) and what you would like to exchange on the Contact Us page.' },
            { icon: Clock, title: 'We reply', text: 'Our team gets back to you within 1 to 2 business days.' },
            { icon: PackageSearch, title: 'We inspect', text: 'Once we receive the item, we check that it is unused and in its packaging.' },
            { icon: RefreshCw, title: 'Exchange or refund', text: 'You get your new item, or a refund to your original payment method.' },
          ]}
        />
      </InfoPanel>

      <Callout icon={AlertTriangle} tone="warn" title="Received a damaged or wrong item?">
        We are sorry! Open the <strong>Help &amp; Orders</strong> chat and choose &quot;Make a complaint&quot;, or write to us on the{' '}
        <Link to="/contact">Contact Us</Link> page with your order number and a photo. We will sort it out for you.
      </Callout>

      <Callout icon={XCircle} title="Want to cancel instead?">
        You can change or cancel an order while it is still Pending or Processing. Send us your order number and we will update it before it ships.
      </Callout>
    </InfoPage>
  )
}
