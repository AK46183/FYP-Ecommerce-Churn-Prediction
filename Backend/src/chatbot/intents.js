// MINAYSH Help Bot: predefined intents + response mapping (rule-based, koi AI nahi).
//
// Har intent ke paas:
//   keywords  -> woh lafz / jumle jo is intent ki nishani hain (English + Roman Urdu)
//                har keyword ka weight hai: zyada weight = zyada pakki nishani
//   reply     -> fixed jawab (FAQ). Jin intents ka jawab database se banta hai
//                (order status, complaint) un ka handler helpbot.service.js mein hai.
//   quickReplies / links -> jawab ke neeche buttons
//
// Naya FAQ add karna ho to bas yahan ek object add karein. Code badalne ki zaroorat nahi.

// Menu jo greeting aur fallback par dikhta hai
const MAIN_MENU = [
  { label: 'Track my order', intent: 'order_status' },
  { label: 'Delivery & charges', intent: 'faq_delivery' },
  { label: 'Returns & exchange', intent: 'faq_returns' },
  { label: 'Payment methods', intent: 'faq_payment' },
  { label: 'Make a complaint', intent: 'complaint' },
  { label: 'Talk to a person', intent: 'human_support' },
];

const INTENTS = [
  /* ------------------------------ Small talk ------------------------------ */
  {
    name: 'greeting',
    keywords: [
      ['hi', 2], ['hello', 2], ['hey', 2], ['salam', 2], ['assalam', 2], ['aoa', 2],
      ['good morning', 2], ['good evening', 2], ['help', 2], ['menu', 2], ['madad', 2],
    ],
    reply: "Hi! I'm the MINAYSH Help Bot. I can track your order, answer questions about delivery, returns and payment, or take a complaint. What do you need?",
    quickReplies: MAIN_MENU,
  },
  {
    name: 'thanks',
    keywords: [['thank', 3], ['thanks', 3], ['shukriya', 3], ['shukria', 3], ['jazakallah', 3], ['thx', 2], ['great', 1], ['ok thanks', 3]],
    reply: "You're welcome! Is there anything else I can help you with?",
    quickReplies: MAIN_MENU,
  },
  {
    name: 'goodbye',
    keywords: [['bye', 3], ['goodbye', 3], ['allah hafiz', 3], ['khuda hafiz', 3], ['see you', 2]],
    reply: 'Thank you for visiting MINAYSH. Have a lovely day!',
  },

  /* -------------------- Database wale intents (handler) -------------------- */
  {
    name: 'order_status',
    handler: 'orderStatus', // helpbot.service.js
    keywords: [
      ['track', 3], ['tracking', 3], ['order status', 4], ['where is my order', 4], ['my order', 2],
      ['mera order', 3], ['order kahan', 4], ['order kaha', 4], ['order kab', 3], ['kab aye ga', 2], ['kab ayega', 2],
      ['parcel', 2], ['shipped', 2], ['status', 2], ['late', 2], ['delay', 2], ['delayed', 2], ['abhi tak', 2], ['order', 2],
    ],
  },
  {
    name: 'complaint',
    handler: 'complaint', // helpbot.service.js (multi-step)
    keywords: [
      ['complaint', 4], ['complain', 4], ['shikayat', 4], ['damaged', 4], ['broken', 3], ['leaked', 3], ['leaking', 3],
      ['wrong item', 4], ['wrong product', 4], ['wrong shade', 4], ['missing item', 4], ['not received', 4],
      ['kharab', 4], ['toota', 3], ['tuta', 3], ['galat', 3], ['ghalat', 3], ['nahi mila', 3], ['nai mila', 3], ['nahi aya', 3], ['nai aya', 3], ['nahi pohancha', 3], ['nahi pohncha', 3],
      ['fake', 3], ['expired', 4], ['bad experience', 4], ['rude', 3], ['unhappy', 3], ['disappointed', 3], ['problem', 2], ['issue', 2],
    ],
  },

  /* --------------------------------- FAQs --------------------------------- */
  {
    name: 'faq_delivery',
    keywords: [
      ['delivery', 3], ['shipping', 3], ['deliver', 2], ['charges', 2], ['delivery charges', 4], ['shipping fee', 4],
      ['how many days', 3], ['kitne din', 3], ['kitny din', 3], ['express', 2], ['courier', 2], ['outside lahore', 2], ['all over pakistan', 2],
    ],
    reply: 'We deliver all over Pakistan.\n• Standard: PKR 250, arrives in 3–5 business days\n• Express: PKR 600, arrives in 1–2 business days\nYou choose the option at checkout.',
    quickReplies: [{ label: 'Track my order', intent: 'order_status' }, { label: 'Payment methods', intent: 'faq_payment' }],
  },
  {
    name: 'faq_returns',
    keywords: [
      ['return', 3], ['returns', 3], ['refund', 4], ['exchange', 4], ['replace', 3], ['replacement', 3], ['money back', 4],
      ['wapas', 3], ['wapsi', 3], ['badal', 3], ['paise wapas', 4],
    ],
    reply: 'You can exchange an item within 7 days of delivery if it is unused and in its original packaging. Refunds go back to your original payment method after we inspect the item.\n\nIf the product arrived damaged or wrong, choose "Make a complaint" and we will sort it out.',
    quickReplies: [{ label: 'Make a complaint', intent: 'complaint' }, { label: 'Talk to a person', intent: 'human_support' }],
    links: [{ label: 'Return policy', to: '/help/returns' }],
  },
  {
    name: 'faq_payment',
    keywords: [
      ['payment', 3], ['pay', 2], ['cod', 4], ['cash on delivery', 4], ['card', 2], ['credit card', 3], ['debit card', 3],
      ['jazzcash', 3], ['easypaisa', 3], ['bank transfer', 3], ['paise', 1], ['payment kaise', 4],
    ],
    reply: 'Cash on Delivery is available all over Pakistan. Card payment is coming soon; if you choose card now, we confirm your order by phone.\n\nWe never ask for card numbers, OTP or PIN codes in chat.',
  },
  {
    name: 'faq_cancel',
    keywords: [['cancel', 4], ['cancellation', 4], ['cancel order', 5], ['change order', 4], ['change my order', 4], ['order change', 4], ['address change', 3]],
    reply: 'You can change or cancel an order while it is still Pending or Processing. Send us your order number (for example MN-12) on the Contact Us page, or on WhatsApp, and we will update it before it ships.',
    quickReplies: [{ label: 'Track my order', intent: 'order_status' }, { label: 'Talk to a person', intent: 'human_support' }],
    links: [{ label: 'Contact Us', to: '/contact' }],
  },
  {
    name: 'faq_offers',
    keywords: [
      ['bundle', 4], ['discount', 3], ['coupon', 4], ['promo', 3], ['promo code', 4], ['voucher', 3], ['offer', 2], ['offers', 2],
      ['sale', 2], ['deal', 2], ['code', 1],
    ],
    reply: 'Current offers:\n• Bundle: pick any 3 different products; if the bundle is PKR 3,000 or more you get PKR 1,000 off. It applies automatically.\n• Discount codes: type the code in the "Discount code" box in your bag or at checkout. Each code works once per customer.',
    links: [{ label: 'Bundle offer', to: '/bundle-offer' }],
  },
  {
    name: 'faq_account',
    keywords: [
      ['password', 4], ['forgot password', 5], ['reset password', 5], ['login', 3], ['log in', 3], ['sign in', 3], ['sign up', 3],
      ['register', 3], ['account', 2], ['password bhool', 5], ['bhool gaya', 3], ['bhool gai', 3],
    ],
    reply: 'Forgot your password? Use "Forgot password" on the sign-in page and we will email you a reset link that works for 30 minutes.\nNew here? You can create an account in a minute from the Sign Up page.',
    links: [{ label: 'Forgot password', to: '/forgot-password' }, { label: 'Sign up', to: '/register' }],
  },
  {
    name: 'faq_contact',
    keywords: [['contact', 3], ['phone number', 3], ['email address', 3], ['timing', 3], ['timings', 3], ['working hours', 4], ['office', 2], ['store location', 3], ['shop address', 3]],
    reply: 'You can reach us on WhatsApp at 0332 8649439, or through the Contact Us page. Our team replies within 1–2 business days.',
    links: [{ label: 'Contact Us', to: '/contact' }],
  },
  {
    name: 'faq_skincare',
    keywords: [
      ['skin', 3], ['skincare', 4], ['acne', 4], ['pimple', 4], ['oily', 3], ['dry skin', 4], ['routine', 3], ['serum', 2],
      ['sunscreen', 2], ['which product', 3], ['suggest', 2], ['recommend', 3], ['daane', 4], ['chehra', 3],
    ],
    reply: 'For skin questions and product picks, our Skincare Assistant can help. Open it with the "Skincare Assistant" button in the corner and tell it your skin type and concern.',
  },
  {
    name: 'human_support',
    keywords: [
      ['human', 4], ['agent', 4], ['real person', 5], ['talk to someone', 5], ['customer care', 4], ['customer service', 4],
      ['representative', 4], ['whatsapp', 4], ['call me', 4], ['insaan', 4], ['kisi se baat', 5], ['baat karni', 4],
    ],
    reply: 'Sure! You can talk to our team on WhatsApp (0332 8649439) or send a message on the Contact Us page.',
    links: [{ label: 'Open WhatsApp', href: 'https://wa.me/923328649439' }, { label: 'Contact Us', to: '/contact' }],
  },
];

// Koi intent match na ho
const FALLBACK = {
  name: 'fallback',
  reply: "Sorry, I didn't quite get that. I can help with these topics:",
  quickReplies: MAIN_MENU,
};

module.exports = { INTENTS, FALLBACK, MAIN_MENU };
