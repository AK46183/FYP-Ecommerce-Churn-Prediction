import ContentPage from './ContentPage.jsx'

const pages = {
  'delivery-options': {
    title: 'Delivery Options',
    body: 'Standard delivery within Pakistan is PKR 250 and arrives in 3-5 business days. Express delivery (1-2 business days) is available at checkout for PKR 600.',
  },
  'payment-methods': {
    title: 'Payment Methods',
    body: 'MINAYSH accepts Cash on Delivery across Pakistan, along with major debit and credit cards processed securely at checkout.',
  },
  'return-policy': {
    title: 'Return Policy',
    body: 'Items may be exchanged within 7 days of delivery if unused and in original packaging. Refunds are issued to your original payment method once the returned item is inspected.',
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    body: 'MINAYSH respects your privacy. We collect only the information needed to process your orders and improve your shopping experience, and we never sell your personal data to third parties.',
  },
  'terms-conditions': {
    title: 'Terms & Conditions',
    body: 'By using the MINAYSH website, you agree to our terms of use, including accurate order information, respectful use of the platform, and compliance with applicable consumer protection laws.',
  },
  careers: {
    title: 'Careers',
    body: "We're always looking for passionate people to join the MINAYSH team. Check back soon for open roles, or send your CV to careers@minaysh.com.",
  },
  press: {
    title: 'Press',
    body: 'For press inquiries, brand partnerships, or media assets, please reach out to press@minaysh.com.',
  },
  stores: {
    title: 'Store Locations',
    body: 'MINAYSH is currently available online across Pakistan. Physical store locations will be announced here as they open.',
  },
  'track-order': {
    title: 'Track Your Order',
    body: 'Enter your order number from your confirmation email to view live tracking status. Registered customers can also view order status under My Account → Orders.',
  },
}

export default function SimplePage({ slug }) {
  const page = pages[slug] || { title: 'MINAYSH', body: 'This page is coming soon.' }
  return (
    <ContentPage title={page.title}>
      <p>{page.body}</p>
    </ContentPage>
  )
}
