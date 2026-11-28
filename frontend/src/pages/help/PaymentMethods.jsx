import { Banknote, CreditCard, ShieldCheck, Gift, AlertTriangle } from 'lucide-react'
import { InfoPage, InfoHighlight, OptionCards, InfoPanel, Checklist, Callout } from './InfoKit.jsx'

export default function PaymentMethods() {
  return (
    <InfoPage title="Payment Methods" subtitle="Simple, safe ways to pay for your MINAYSH order.">
      <InfoHighlight icon={Banknote} title="Pay when your parcel arrives">
        Cash on Delivery is available in every city in Pakistan. No card needed: just pay the rider when your order reaches you.
      </InfoHighlight>

      <OptionCards
        items={[
          {
            icon: Banknote,
            title: 'Cash on Delivery',
            tag: 'Available',
            tone: 'ok',
            meta: 'All over Pakistan',
            children: 'Pay in cash to the rider when your parcel arrives. Please keep the exact amount ready.',
          },
          {
            icon: CreditCard,
            title: 'Debit / Credit Card',
            tag: 'Coming soon',
            tone: 'muted',
            meta: 'Online card payment',
            children: 'Online card payment is on its way. If you choose card today, our team confirms your order by phone.',
          },
        ]}
      />

      <InfoPanel icon={Gift} title="Savings at checkout">
        <Checklist
          items={[
            'Discount codes are applied in your bag or at checkout, before you pay.',
            'Bundle offer: any 3 different products worth PKR 3,000 or more get PKR 1,000 off automatically.',
            'The total you see at checkout is the final amount you pay, delivery included.',
          ]}
        />
      </InfoPanel>

      <InfoPanel icon={ShieldCheck} title="Your safety">
        <Checklist
          items={[
            'Your password is encrypted, and your phone number and address are stored encrypted.',
            'We never sell your personal data.',
          ]}
        />
      </InfoPanel>

      <Callout icon={AlertTriangle} tone="warn" title="We will never ask for your card number, OTP or PIN">
        Not in chat, by email or on the phone. If anyone asks for these in MINAYSH&apos;s name, please do not share them and let us know.
      </Callout>
    </InfoPage>
  )
}
