// Seasons aur un ki ready-made marketing strategies.
// Pictures store ki apni hain (public/ folder se).
// Baad mein yeh data backend / churn model se aa sakta hai.

export const seasons = [
  {
    key: 'spring',
    name: 'Spring',
    tagline: 'Fresh skin, fresh start',
    image: '/images/brand/story2-b.jpg',
    description:
      'Light moisturizers, cleansers and green skincare sell best. Bring back customers who went quiet over winter with a fresh-start routine.',
    strategies: [
      { id: 'sp1', title: 'Fresh Start Bundle', type: 'Bundle', target: 'Medium risk', offer: 'Cleanser + toner + gel at 25% off', channel: 'Email', uplift: '+14%' },
      { id: 'sp2', title: 'Win-back Coupon', type: 'Discount', target: 'High risk', offer: 'PKR 500 off on next order', channel: 'SMS', uplift: '+18%' },
      { id: 'sp3', title: 'Skin Quiz Push', type: 'Engagement', target: 'All customers', offer: 'Free routine after beauty quiz', channel: 'Push', uplift: '+9%' },
      { id: 'sp4', title: 'Refer a Friend', type: 'Loyalty', target: 'Loyal customers', offer: 'Both get 15% off', channel: 'Instagram', uplift: '+11%' },
      { id: 'sp5', title: 'Green Week', type: 'Campaign', target: 'New customers', offer: 'Free shipping on natural range', channel: 'Email', uplift: '+7%' },
    ],
  },
  {
    key: 'summer',
    name: 'Summer',
    tagline: 'Sun-safe and glowing',
    image: '/videos/sea-bg-poster.jpg',
    description:
      'Sunscreen, mists and oil-free products lead sales. Remind at-risk customers to restock SPF before the heat peaks.',
    strategies: [
      { id: 'su1', title: 'SPF Restock Reminder', type: 'Reminder', target: 'High risk', offer: '20% off sunscreens', channel: 'SMS', uplift: '+21%' },
      { id: 'su2', title: 'Beat the Heat Kit', type: 'Bundle', target: 'Medium risk', offer: 'SPF + mist + gel at 30% off', channel: 'Email', uplift: '+15%' },
      { id: 'su3', title: 'Flash Friday', type: 'Discount', target: 'All customers', offer: '6-hour flash sale', channel: 'Push', uplift: '+12%' },
      { id: 'su4', title: 'Double Points', type: 'Loyalty', target: 'Loyal customers', offer: '2x points on summer range', channel: 'Email', uplift: '+8%' },
      { id: 'su5', title: 'Mini Travel Sizes', type: 'Campaign', target: 'New customers', offer: 'Free travel mini over PKR 3,000', channel: 'Instagram', uplift: '+10%' },
    ],
  },
  {
    key: 'monsoon',
    name: 'Monsoon',
    tagline: 'Clear skin in humid days',
    image: '/images/brand/story2-main.jpg',
    description:
      'Humidity brings breakouts. Push face washes, clay masks and oil-control care to customers who stopped buying.',
    strategies: [
      { id: 'mo1', title: 'Rainy Day Glow', type: 'Bundle', target: 'Medium risk', offer: 'Face wash + mask at 25% off', channel: 'Email', uplift: '+13%' },
      { id: 'mo2', title: 'We Miss You', type: 'Discount', target: 'High risk', offer: '30% off one order', channel: 'SMS', uplift: '+19%' },
      { id: 'mo3', title: 'Monsoon Care Tips', type: 'Engagement', target: 'All customers', offer: 'Free skin guide with order', channel: 'Push', uplift: '+6%' },
      { id: 'mo4', title: 'Free Delivery Week', type: 'Campaign', target: 'New customers', offer: 'No delivery charges', channel: 'Instagram', uplift: '+9%' },
    ],
  },
  {
    key: 'autumn',
    name: 'Autumn',
    tagline: 'Repair and nourish',
    image: '/images/brand/story2-a.jpg',
    description:
      'Serums and face oils move fastest as skin gets drier. A good time for premium upsells and loyalty rewards.',
    strategies: [
      { id: 'au1', title: 'Serum Upgrade', type: 'Upsell', target: 'Loyal customers', offer: 'Free serum mini with any oil', channel: 'Email', uplift: '+12%' },
      { id: 'au2', title: 'Comeback Offer', type: 'Discount', target: 'High risk', offer: 'PKR 700 off over PKR 4,000', channel: 'SMS', uplift: '+17%' },
      { id: 'au3', title: 'Golden Hour Bundle', type: 'Bundle', target: 'Medium risk', offer: 'Serum + oil at 20% off', channel: 'Push', uplift: '+11%' },
      { id: 'au4', title: 'Review & Earn', type: 'Loyalty', target: 'All customers', offer: '100 points per review', channel: 'Email', uplift: '+5%' },
      { id: 'au5', title: 'First Order Gift', type: 'Campaign', target: 'New customers', offer: 'Free gift box', channel: 'Instagram', uplift: '+8%' },
    ],
  },
  {
    key: 'winter',
    name: 'Winter',
    tagline: 'Deep hydration season',
    image: '/videos/hero-beauty-poster.jpg',
    description:
      'Night creams, lip care and rich moisturizers peak. Biggest season to save customers before they switch brands.',
    strategies: [
      { id: 'wi1', title: 'Winter Rescue Kit', type: 'Bundle', target: 'High risk', offer: 'Night cream + lip balm at 35% off', channel: 'SMS', uplift: '+22%' },
      { id: 'wi2', title: 'Cozy Points', type: 'Loyalty', target: 'Loyal customers', offer: '3x points in December', channel: 'Email', uplift: '+10%' },
      { id: 'wi3', title: 'Lip Care Freebie', type: 'Gift', target: 'Medium risk', offer: 'Free lip balm over PKR 2,500', channel: 'Push', uplift: '+14%' },
      { id: 'wi4', title: 'Year-end Sale', type: 'Discount', target: 'All customers', offer: 'Up to 40% off', channel: 'Instagram', uplift: '+16%' },
    ],
  },
  {
    key: 'eid',
    name: 'Eid Festive',
    tagline: 'Glam for the celebrations',
    image: '/images/brand/story1-main.jpg',
    description:
      'Makeup, lipsticks and gift sets lead the festive rush. Re-engage lapsed customers with Eid gifting offers.',
    strategies: [
      { id: 'ed1', title: 'Eidi Gift Sets', type: 'Bundle', target: 'All customers', offer: 'Gift sets at 25% off', channel: 'Instagram', uplift: '+20%' },
      { id: 'ed2', title: 'Chand Raat Flash', type: 'Discount', target: 'High risk', offer: '35% off for one night', channel: 'SMS', uplift: '+24%' },
      { id: 'ed3', title: 'Glam Look Kits', type: 'Bundle', target: 'Medium risk', offer: 'Lipstick + liner + highlighter', channel: 'Email', uplift: '+15%' },
      { id: 'ed4', title: 'VIP Early Access', type: 'Loyalty', target: 'Loyal customers', offer: 'Shop the sale 24h early', channel: 'Push', uplift: '+9%' },
    ],
  },
  {
    key: 'wedding',
    name: 'Wedding Season',
    tagline: 'Bridal glow and gifting',
    image: '/images/brand/story1-a.jpg',
    description:
      'Bridal makeup, perfumes and prep skincare. High-value orders — reward big spenders and bring back old bridal clients.',
    strategies: [
      { id: 'we1', title: 'Bridal Prep Plan', type: 'Bundle', target: 'Medium risk', offer: '4-week skincare plan at 20% off', channel: 'Email', uplift: '+13%' },
      { id: 'we2', title: 'Guest Glam Offer', type: 'Discount', target: 'All customers', offer: 'Buy 2 get 1 on makeup', channel: 'Instagram', uplift: '+17%' },
      { id: 'we3', title: 'Perfume Gifting', type: 'Gift', target: 'Loyal customers', offer: 'Free gift wrap + card', channel: 'Push', uplift: '+8%' },
      { id: 'we4', title: 'Come Back Bride', type: 'Win-back', target: 'High risk', offer: 'PKR 1,000 off bridal kits', channel: 'SMS', uplift: '+19%' },
    ],
  },
]

export const strategyTypes = ['Discount', 'Bundle', 'Loyalty', 'Gift', 'Campaign', 'Reminder', 'Upsell', 'Engagement', 'Win-back']
export const targetGroups = ['High risk', 'Medium risk', 'Low risk', 'Loyal customers', 'New customers', 'All customers']
export const channels = ['Email', 'SMS', 'Push', 'Instagram']