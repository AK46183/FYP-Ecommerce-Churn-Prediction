// Mock data for admin dashboard, churn prediction, and analytics.
import { formatPKR } from '@/utils/currency'
export interface ChurnCustomer {
  id: string
  name: string
  email: string
  avatar: string
  churnProbability: number
  riskLevel: 'High' | 'Medium' | 'Low'
  reason: string
  lastLogin: string
  lastPurchase: string
  totalOrders: number
  totalSpent: number
  recentActivity: { type: string; detail: string; date: string }[]
  churnFeatures: { feature: string; value: string; impact: number }[]
  recommendedAction: string
  segment: string
  satisfactionScore: number
}

export interface Customer {
  id: string
  name: string
  email: string
  avatar: string
  joined: string
  totalOrders: number
  totalSpent: number
  status: 'Active' | 'At Risk' | 'Churned' | 'New'
  riskLevel: 'High' | 'Medium' | 'Low'
  churnProbability: number
  lastLogin: string
}

export interface AdminOrder {
  id: string
  customer: string
  customerEmail: string
  date: string
  total: number
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
  items: number
  paymentMethod: string
}

export const churnCustomers: ChurnCustomer[] = [
  {
    id: 'c1',
    name: 'Ali Hassan',
    email: 'ali.hassan@email.com',
    avatar: 'AH',
    churnProbability: 85,
    riskLevel: 'High',
    reason: 'No login for 20 days + abandoned cart twice',
    lastLogin: '20 days ago',
    lastPurchase: '45 days ago',
    totalOrders: 3,
    totalSpent: 1240,
    recentActivity: [
      { type: 'cart_abandon', detail: 'Abandoned cart with Sony WH-1000XM5', date: '5 days ago' },
      { type: 'cart_abandon', detail: 'Abandoned cart with iPhone 17 Pro', date: '12 days ago' },
      { type: 'complaint', detail: 'Submitted complaint about delayed shipping', date: '15 days ago' },
      { type: 'login', detail: 'Last login', date: '20 days ago' },
      { type: 'purchase', detail: 'Purchased JBL Flip 6', date: '45 days ago' },
    ],
    churnFeatures: [
      { feature: 'Days since last login', value: '20 days', impact: 92 },
      { feature: 'Cart abandonment count', value: '2 times', impact: 78 },
      { feature: 'Days since last purchase', value: '45 days', impact: 85 },
      { feature: 'Satisfaction score', value: '2.1 / 5', impact: 70 },
      { feature: 'Complaint submitted', value: 'Yes', impact: 65 },
      { feature: 'Session duration trend', value: 'Declining', impact: 60 },
    ],
    recommendedAction: 'Send 20% discount on abandoned cart items + apology for shipping delay',
    segment: 'At-Risk High Spender',
    satisfactionScore: 2.1,
  },
  {
    id: 'c2',
    name: 'Sara Ahmed',
    email: 'sara.ahmed@email.com',
    avatar: 'SA',
    churnProbability: 61,
    riskLevel: 'Medium',
    reason: 'Browsing frequently but no purchase in 30 days',
    lastLogin: '2 days ago',
    lastPurchase: '30 days ago',
    totalOrders: 7,
    totalSpent: 3850,
    recentActivity: [
      {
  type: 'search',
  detail: `Searched for "gaming laptop under ${formatPKR(2000)}"`,
  date: '1 day ago',
},
      { type: 'product_view', detail: 'Viewed ASUS ROG Strix G18', date: '1 day ago' },
      { type: 'product_view', detail: 'Viewed Dell XPS 15', date: '2 days ago' },
      { type: 'chatbot_message', detail: 'Asked chatbot for laptop recommendation', date: '3 days ago' },
      { type: 'purchase', detail: 'Purchased Bose QC Ultra', date: '30 days ago' },
    ],
    churnFeatures: [
      { feature: 'Days since last login', value: '2 days', impact: 15 },
      { feature: 'Days since last purchase', value: '30 days', impact: 55 },
      { feature: 'Browsing frequency', value: 'High', impact: 40 },
      { feature: 'Purchase intent signals', value: 'Strong', impact: 35 },
      { feature: 'Wishlist items', value: '8 items', impact: 25 },
      { feature: 'Chatbot engagement', value: 'Active', impact: 20 },
    ],
    recommendedAction: 'Send personalized reminder with top 3 wishlist items + exclusive offer',
    segment: 'Browsing Non-Buyer',
    satisfactionScore: 3.8,
  },
  {
    id: 'c3',
    name: 'Hamza Khan',
    email: 'hamza.khan@email.com',
    avatar: 'HK',
    churnProbability: 18,
    riskLevel: 'Low',
    reason: 'Recently completed a purchase and active session',
    lastLogin: '1 hour ago',
    lastPurchase: '2 days ago',
    totalOrders: 12,
    totalSpent: 8420,
    recentActivity: [
      { type: 'purchase', detail: 'Purchased Apple Watch Ultra 2', date: '2 days ago' },
      { type: 'login', detail: 'Logged in', date: '1 hour ago' },
      { type: 'product_view', detail: 'Viewed AirPods Pro 2', date: '1 hour ago' },
      { type: 'wishlist_add', detail: 'Added AirPods Pro 2 to wishlist', date: '1 hour ago' },
      { type: 'chatbot_message', detail: 'Asked about order tracking', date: '3 hours ago' },
    ],
    churnFeatures: [
      { feature: 'Days since last login', value: '0 days', impact: 5 },
      { feature: 'Days since last purchase', value: '2 days', impact: 8 },
      { feature: 'Session duration trend', value: 'Stable', impact: 10 },
      { feature: 'Satisfaction score', value: '4.6 / 5', impact: 12 },
      { feature: 'Order frequency', value: 'High', impact: 15 },
      { feature: 'Wishlist engagement', value: 'Active', impact: 18 },
    ],
    recommendedAction: 'No action needed — consider loyalty program invitation',
    segment: 'Loyal High Value',
    satisfactionScore: 4.6,
  },
  {
    id: 'c4',
    name: 'Fatima Noor',
    email: 'fatima.noor@email.com',
    avatar: 'FN',
    churnProbability: 73,
    riskLevel: 'High',
    reason: 'No login for 15 days + negative review + 2 returns',
    lastLogin: '15 days ago',
    lastPurchase: '60 days ago',
    totalOrders: 4,
    totalSpent: 1890,
    recentActivity: [
      { type: 'complaint', detail: 'Negative review on Canon R5 Mark II', date: '18 days ago' },
      { type: 'cart_abandon', detail: 'Abandoned cart with Nikon Z9', date: '20 days ago' },
      { type: 'login', detail: 'Last login', date: '15 days ago' },
      { type: 'purchase', detail: 'Purchased Canon R5 Mark II (returned)', date: '60 days ago' },
    ],
    churnFeatures: [
      { feature: 'Days since last login', value: '15 days', impact: 82 },
      { feature: 'Return count', value: '2 returns', impact: 75 },
      { feature: 'Negative review submitted', value: 'Yes', impact: 80 },
      { feature: 'Days since last purchase', value: '60 days', impact: 88 },
      { feature: 'Satisfaction score', value: '1.8 / 5', impact: 78 },
    ],
    recommendedAction: 'Personalized apology + free return shipping + dedicated support call',
    segment: 'Dissatisfied Returner',
    satisfactionScore: 1.8,
  },
  {
    id: 'c5',
    name: 'Bilal Raza',
    email: 'bilal.raza@email.com',
    avatar: 'BR',
    churnProbability: 45,
    riskLevel: 'Medium',
    reason: 'Reduced session frequency + price sensitivity signals',
    lastLogin: '5 days ago',
    lastPurchase: '20 days ago',
    totalOrders: 5,
    totalSpent: 2150,
    recentActivity: [
      {
  type: 'search',
  detail: `Searched for "deals under ${formatPKR(500)}"`,
  date: '4 days ago',
},
      { type: 'product_view', detail: 'Viewed JBL Flip 6 multiple times', date: '5 days ago' },
      { type: 'login', detail: 'Logged in', date: '5 days ago' },
      { type: 'purchase', detail: 'Purchased Steam Deck OLED', date: '20 days ago' },
    ],
    churnFeatures: [
      { feature: 'Days since last login', value: '5 days', impact: 35 },
      { feature: 'Price comparison signals', value: 'High', impact: 50 },
      { feature: 'Session frequency', value: 'Declining', impact: 45 },
      { feature: 'Days since last purchase', value: '20 days', impact: 40 },
    ],
    recommendedAction: 'Send targeted deal alert for viewed products + price match guarantee',
    segment: 'Price-Sensitive Browser',
    satisfactionScore: 3.2,
  },
  {
    id: 'c6',
    name: 'Ayesha Malik',
    email: 'ayesha.malik@email.com',
    avatar: 'AM',
    churnProbability: 28,
    riskLevel: 'Low',
    reason: 'Steady purchase pattern + active engagement',
    lastLogin: '3 days ago',
    lastPurchase: '10 days ago',
    totalOrders: 9,
    totalSpent: 5240,
    recentActivity: [
      { type: 'purchase', detail: 'Purchased LG OLED C4', date: '10 days ago' },
      { type: 'product_view', detail: 'Viewed Sony BRAVIA 9', date: '3 days ago' },
      { type: 'login', detail: 'Logged in', date: '3 days ago' },
      { type: 'chatbot_message', detail: 'Asked about TV installation', date: '3 days ago' },
    ],
    churnFeatures: [
      { feature: 'Days since last login', value: '3 days', impact: 18 },
      { feature: 'Days since last purchase', value: '10 days', impact: 22 },
      { feature: 'Satisfaction score', value: '4.2 / 5', impact: 20 },
      { feature: 'Purchase frequency', value: 'Regular', impact: 25 },
    ],
    recommendedAction: 'No action needed — upsell premium installation service',
    segment: 'Regular Buyer',
    satisfactionScore: 4.2,
  },
  {
    id: 'c7',
    name: 'Usman Tariq',
    email: 'usman.tariq@email.com',
    avatar: 'UT',
    churnProbability: 91,
    riskLevel: 'High',
    reason: 'No activity for 35 days + single low-value order + no engagement',
    lastLogin: '35 days ago',
    lastPurchase: '50 days ago',
    totalOrders: 1,
    totalSpent: 129,
    recentActivity: [
      { type: 'login', detail: 'Last login', date: '35 days ago' },
      { type: 'purchase', detail: 'Purchased Xbox Controller', date: '50 days ago' },
    ],
    churnFeatures: [
      { feature: 'Days since last login', value: '35 days', impact: 95 },
      { feature: 'Total orders', value: '1 order', impact: 90 },
      { feature: 'Days since last purchase', value: '50 days', impact: 92 },
      { feature: 'Engagement score', value: 'Very Low', impact: 88 },
      { feature: 'Wishlist items', value: '0 items', impact: 85 },
    ],
    recommendedAction: 'Win-back campaign with first-order discount + re-engagement email',
    segment: 'One-Time Buyer',
    satisfactionScore: 3.0,
  },
  {
    id: 'c8',
    name: 'Zainab Ali',
    email: 'zainab.ali@email.com',
    avatar: 'ZA',
    churnProbability: 52,
    riskLevel: 'Medium',
    reason: 'Wishlist activity but no checkout completion',
    lastLogin: '4 days ago',
    lastPurchase: '25 days ago',
    totalOrders: 6,
    totalSpent: 3120,
    recentActivity: [
      { type: 'wishlist_add', detail: 'Added MacBook Pro 16" to wishlist', date: '2 days ago' },
      { type: 'cart_abandon', detail: 'Abandoned cart with Samsung Galaxy Watch Ultra', date: '4 days ago' },
      { type: 'login', detail: 'Logged in', date: '4 days ago' },
      { type: 'purchase', detail: 'Purchased Galaxy S25 Ultra', date: '25 days ago' },
    ],
    churnFeatures: [
      { feature: 'Days since last login', value: '4 days', impact: 30 },
      { feature: 'Cart abandonment count', value: '1 time', impact: 55 },
      { feature: 'Wishlist engagement', value: 'High', impact: 40 },
      { feature: 'Days since last purchase', value: '25 days', impact: 48 },
    ],
    recommendedAction: 'Send wishlist price drop alert + free shipping offer',
    segment: 'Wishlist Browser',
    satisfactionScore: 3.5,
  },
]

export const customers: Customer[] = churnCustomers.map((c) => ({
  id: c.id,
  name: c.name,
  email: c.email,
  avatar: c.avatar,
  joined: '2024-0' + (Math.floor(Math.random() * 9) + 1) + '-15',
  totalOrders: c.totalOrders,
  totalSpent: c.totalSpent,
  status: c.riskLevel === 'High' ? 'At Risk' : c.riskLevel === 'Low' ? 'Active' : 'At Risk',
  riskLevel: c.riskLevel,
  churnProbability: c.churnProbability,
  lastLogin: c.lastLogin,
}))

export const adminOrders: AdminOrder[] = [
  { id: 'ORD-7841', customer: 'Hamza Khan', customerEmail: 'hamza.khan@email.com', date: '2026-08-29', total: 799, status: 'Delivered', items: 1, paymentMethod: 'Visa •• 4242' },
  { id: 'ORD-7840', customer: 'Ayesha Malik', customerEmail: 'ayesha.malik@email.com', date: '2026-08-28', total: 2499, status: 'Shipped', items: 1, paymentMethod: 'Mastercard •• 5555' },
  { id: 'ORD-7839', customer: 'Sara Ahmed', customerEmail: 'sara.ahmed@email.com', date: '2026-08-28', total: 429, status: 'Processing', items: 1, paymentMethod: 'PayPal' },
  { id: 'ORD-7838', customer: 'Zainab Ali', customerEmail: 'zainab.ali@email.com', date: '2026-08-27', total: 1099, status: 'Delivered', items: 2, paymentMethod: 'Visa •• 1881' },
  { id: 'ORD-7837', customer: 'Bilal Raza', customerEmail: 'bilal.raza@email.com', date: '2026-08-27', total: 549, status: 'Delivered', items: 1, paymentMethod: 'Apple Pay' },
  { id: 'ORD-7836', customer: 'Ali Hassan', customerEmail: 'ali.hassan@email.com', date: '2026-08-26', total: 129, status: 'Delivered', items: 1, paymentMethod: 'Visa •• 4242' },
  { id: 'ORD-7835', customer: 'Fatima Noor', customerEmail: 'fatima.noor@email.com', date: '2026-08-25', total: 4299, status: 'Cancelled', items: 1, paymentMethod: 'Mastercard •• 5555' },
  { id: 'ORD-7834', customer: 'Usman Tariq', customerEmail: 'usman.tariq@email.com', date: '2026-08-24', total: 64, status: 'Delivered', items: 1, paymentMethod: 'Cash on Delivery' },
  { id: 'ORD-7833', customer: 'Hamza Khan', customerEmail: 'hamza.khan@email.com', date: '2026-08-23', total: 279, status: 'Delivered', items: 1, paymentMethod: 'Visa •• 4242' },
  { id: 'ORD-7832', customer: 'Ayesha Malik', customerEmail: 'ayesha.malik@email.com', date: '2026-08-22', total: 1899, status: 'Delivered', items: 2, paymentMethod: 'PayPal' },
]

// Revenue trend (last 12 months)
export const revenueTrend = [
  { month: 'Sep', revenue: 142000, orders: 320 },
  { month: 'Oct', revenue: 168000, orders: 380 },
  { month: 'Nov', revenue: 215000, orders: 510 },
  { month: 'Dec', revenue: 298000, orders: 680 },
  { month: 'Jan', revenue: 185000, orders: 420 },
  { month: 'Feb', revenue: 172000, orders: 390 },
  { month: 'Mar', revenue: 198000, orders: 445 },
  { month: 'Apr', revenue: 225000, orders: 510 },
  { month: 'May', revenue: 241000, orders: 560 },
  { month: 'Jun', revenue: 268000, orders: 620 },
  { month: 'Jul', revenue: 289000, orders: 670 },
  { month: 'Aug', revenue: 312000, orders: 715 },
]

// Customer activity over time
export const customerActivity = [
  { week: 'W1', active: 1240, new: 180, churned: 45 },
  { week: 'W2', active: 1310, new: 210, churned: 38 },
  { week: 'W3', active: 1380, new: 195, churned: 52 },
  { week: 'W4', active: 1420, new: 240, churned: 41 },
  { week: 'W5', active: 1490, new: 175, churned: 58 },
  { week: 'W6', active: 1550, new: 220, churned: 47 },
  { week: 'W7', active: 1620, new: 260, churned: 39 },
  { week: 'W8', active: 1680, new: 190, churned: 63 },
]

// Churn risk distribution
export const churnDistribution = [
  { name: 'Low Risk', value: 1240, color: '#22d3ee' },
  { name: 'Medium Risk', value: 380, color: '#fbbf24' },
  { name: 'High Risk', value: 142, color: '#f43f5e' },
]

// Customer segments
export const customerSegments = [
  { name: 'Loyal High Value', count: 420, percentage: 19, color: '#22d3ee' },
  { name: 'Regular Buyers', count: 680, percentage: 31, color: '#0e7490' },
  { name: 'Browsing Non-Buyers', count: 520, percentage: 24, color: '#fbbf24' },
  { name: 'At-Risk High Spenders', count: 280, percentage: 13, color: '#f97316' },
  { name: 'One-Time Buyers', count: 180, percentage: 8, color: '#f43f5e' },
  { name: 'Churned', count: 102, percentage: 5, color: '#7f1d1d' },
]

export const dashboardStats = {
  revenue: 312000,
  revenueChange: 8.2,
  orders: 715,
  ordersChange: 6.5,
  customers: 2182,
  customersChange: 4.1,
  conversionRate: 3.8,
  conversionChange: 0.6,
  atRiskCustomers: 142,
  highRiskCustomers: 52,
}

export const retentionActions = [
  { id: 'ra1', action: 'Send 20% discount', target: 'At-Risk High Spenders', customers: 280, channel: 'Email', status: 'Active', sent: 280, opened: 198, clicked: 87, converted: 42 },
  { id: 'ra2', action: 'Personalized reminder', target: 'Browsing Non-Buyers', customers: 520, channel: 'Push + Email', status: 'Active', sent: 520, opened: 341, clicked: 156, converted: 89 },
  { id: 'ra3', action: 'Win-back campaign', target: 'One-Time Buyers', customers: 180, channel: 'Email', status: 'Scheduled', sent: 0, opened: 0, clicked: 0, converted: 0 },
  { id: 'ra4', action: 'Loyalty invitation', target: 'Loyal High Value', customers: 420, channel: 'In-App', status: 'Active', sent: 420, opened: 380, clicked: 210, converted: 145 },
  { id: 'ra5', action: 'Price drop alert', target: 'Wishlist Browsers', customers: 310, channel: 'Push', status: 'Active', sent: 310, opened: 224, clicked: 98, converted: 56 },
]

export const chatbotLogs = [
  { id: 'cl1', customer: 'Sara Ahmed', date: '2026-08-29 14:32', messages: 8, intent: 'Product Recommendation', resolved: true, satisfaction: 4 },
  { id: 'cl2', customer: 'Hamza Khan', date: '2026-08-29 11:15', messages: 4, intent: 'Order Tracking', resolved: true, satisfaction: 5 },
  { id: 'cl3', customer: 'Ali Hassan', date: '2026-08-28 19:45', messages: 12, intent: 'Complaint', resolved: false, satisfaction: 2 },
  { id: 'cl4', customer: 'Bilal Raza', date: '2026-08-28 16:20', messages: 6, intent: 'Price Comparison', resolved: true, satisfaction: 4 },
  { id: 'cl5', customer: 'Ayesha Malik', date: '2026-08-28 10:05', messages: 5, intent: 'Product Inquiry', resolved: true, satisfaction: 5 },
  { id: 'cl6', customer: 'Zainab Ali', date: '2026-08-27 22:10', messages: 9, intent: 'Product Comparison', resolved: true, satisfaction: 4 },
  { id: 'cl7', customer: 'Fatima Noor', date: '2026-08-27 15:30', messages: 7, intent: 'Return Request', resolved: false, satisfaction: 1 },
  { id: 'cl8', customer: 'Usman Tariq', date: '2026-08-26 09:15', messages: 3, intent: 'General Query', resolved: true, satisfaction: 4 },
]
