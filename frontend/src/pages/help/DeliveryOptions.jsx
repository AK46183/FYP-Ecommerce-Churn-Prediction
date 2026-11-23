import { Link } from 'react-router-dom'
import { Truck, Zap, MapPin, ClipboardList, PackageCheck, Home, Info } from 'lucide-react'
import { formatPKR } from '../../services/format.js'
import { SHIPPING_STANDARD, SHIPPING_EXPRESS } from '../../config/store.js'
import { InfoPage, InfoHighlight, OptionCards, InfoPanel, Steps, Checklist } from './InfoKit.jsx'

export default function DeliveryOptions() {
  return (
    <InfoPage title="Delivery Options" subtitle="Fast, tracked delivery to your doorstep, anywhere in Pakistan.">
      <InfoHighlight icon={MapPin} title="We deliver all over Pakistan">
        From Lahore to Karachi, Quetta to Gilgit: choose standard or express at checkout and track your parcel until it reaches you.
      </InfoHighlight>

      <OptionCards
        items={[
          {
            icon: Truck,
            title: 'Standard Delivery',
            price: formatPKR(SHIPPING_STANDARD),
            meta: '3 to 5 business days',
            tag: 'Most popular',
            tone: 'brand',
            children: 'Our everyday option for every city in Pakistan.',
          },
          {
            icon: Zap,
            title: 'Express Delivery',
            price: formatPKR(SHIPPING_EXPRESS),
            meta: '1 to 2 business days',
            tag: 'Fastest',
            tone: 'ok',
            children: 'For when you need your favourites in a hurry.',
          },
        ]}
      />

      <InfoPanel icon={PackageCheck} title="How your order travels">
        <Steps
          items={[
            { icon: ClipboardList, title: 'Order placed', text: 'You get a confirmation email with your order number, e.g. MN-12.' },
            { icon: PackageCheck, title: 'Processing', text: 'Our team checks and carefully packs your products.' },
            { icon: Truck, title: 'Shipped', text: 'Your parcel is on its way. We email you as soon as it leaves.' },
            { icon: Home, title: 'Delivered', text: 'Your order arrives at your door. Enjoy!' },
          ]}
        />
      </InfoPanel>

      <InfoPanel icon={Info} title="Good to know">
        <Checklist
          items={[
            'You choose standard or express delivery at checkout.',
            'The delivery fee is charged once per order, however many items you buy.',
            'We email you every time your order status changes.',
            <span key="track">You can track any order under <Link to="/account/orders">My Account, then Orders</Link>, or ask the Help Bot &quot;where is my order&quot;.</span>,
          ]}
        />
      </InfoPanel>
    </InfoPage>
  )
}
