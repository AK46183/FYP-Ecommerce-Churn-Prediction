import { Truck, ShieldCheck, RotateCcw } from 'lucide-react'
import './TrustStrip.css'

const items = [
  {
    icon: Truck,
    title: 'PKR 250/- Delivery Charges',
    text: 'Within Pakistan',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Payments',
    text: 'Purchases are secure and guaranteed',
  },
  {
    icon: RotateCcw,
    title: 'Easy Exchange',
    text: 'Up to 7 days after order delivery',
  },
]

export default function TrustStrip() {
  return (
    <section className="trust-strip">
      <div className="container trust-strip__grid">
        {items.map((item) => (
          <div className="trust-strip__item" key={item.title}>
            <item.icon size={30} strokeWidth={1.2} />
            <p className="trust-strip__title">{item.title}</p>
            <p className="trust-strip__text">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
