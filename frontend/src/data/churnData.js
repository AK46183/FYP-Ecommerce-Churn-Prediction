// Churn ka sample (mock) data — har mahine ke liye alag customers.
// Backend / churn model ready hone pe yeh data API se aayega
// (dekhein src/services/churnApi.js).

const names = [
  'Ayesha Malik', 'Hina Raza', 'Sara Khan', 'Zainab Tariq', 'Mahnoor Aslam',
  'Fatima Noor', 'Iqra Shah', 'Maryam Javed', 'Areeba Ali', 'Sana Butt',
  'Komal Iqbal', 'Hira Qureshi', 'Amna Sheikh', 'Rabia Anwar', 'Laiba Hassan',
  'Noor Fatima', 'Alina Saeed', 'Mehwish Akram', 'Anaya Farooq', 'Zoha Imran',
]
const cities = ['Lahore', 'Karachi', 'Islamabad', 'Faisalabad', 'Multan', 'Rawalpindi']
const favourites = ['Vitamin C Serum', 'SPF 50 Sunscreen', 'Matte Lipstick', 'Night Cream', 'Hydra Gel', 'Face Wash']

// har mahine ke liye same "random" numbers (taake data badalta na rahe)
function seeded(seed) {
  let s = (seed * 2654435761) % 2147483647
  if (s <= 0) s += 2147483646
  const next = () => (s = (s * 16807) % 2147483647) / 2147483647
  for (let i = 0; i < 5; i++) next() // shuru ke numbers mila do
  return next
}

// High risk ki wajahen + un ke hisaab se wapas laane ki strategy
const highReasons = [
  {
    why: 'No order in {days} days — usually orders every 3 weeks',
    strategy: 'Send a "We miss you" SMS with 30% off her favourite {fav}. Follow up by email after 3 days.',
    channel: 'SMS + Email',
  },
  {
    why: 'Only buys during sales — left after the last discount ended',
    strategy: 'Give her early access to the next sale and a PKR 500 coupon valid for 7 days.',
    channel: 'Push',
  },
  {
    why: 'Last order was delayed and she left a 2-star review',
    strategy: 'Personal apology call + free delivery for 3 months and a free {fav} mini.',
    channel: 'Call + SMS',
  },
  {
    why: 'Browsing competitor-like products, cart abandoned 3 times',
    strategy: 'Cart reminder with a small bundle deal: {fav} + matching product at 20% off.',
    channel: 'Email',
  },
  {
    why: 'Order frequency dropped by 70% in the last 2 months',
    strategy: 'Invite her to the loyalty program with 2x points on her next 2 orders.',
    channel: 'Email + Push',
  },
]
const lowReasons = [
  'Orders every {gap} days on time — very regular buyer',
  'High satisfaction: left 5-star reviews on last orders',
  'Loyalty member, buys at full price (not discount-driven)',
  'Recently ordered {fav} again — strong repeat habit',
]

function makeCustomer(rand, i, type) {
  const name = names[Math.floor(rand() * names.length)]
  const fav = favourites[Math.floor(rand() * favourites.length)]
  const city = cities[Math.floor(rand() * cities.length)]
  const orders = 3 + Math.floor(rand() * 18)
  const avgOrder = 1800 + Math.floor(rand() * 60) * 100
  const initials = name.split(' ').map((p) => p[0]).join('')

  if (type === 'high') {
    const days = 35 + Math.floor(rand() * 60)
    const r = highReasons[Math.floor(rand() * highReasons.length)]
    const risk = 96 - i * 4 - Math.floor(rand() * 3)
    return {
      id: `h${i}-${name}`,
      type,
      name,
      initials,
      city,
      orders,
      avgOrder,
      lastOrderDays: days,
      lifetimeValue: orders * avgOrder,
      risk,
      reason: r.why.replace('{days}', days).replace('{fav}', fav),
      action: r.strategy.replace('{fav}', fav),
      channel: r.channel,
    }
  }

  const gap = 14 + Math.floor(rand() * 14)
  const risk = 3 + i * 2 + Math.floor(rand() * 2)
  return {
    id: `l${i}-${name}`,
    type,
    name,
    initials,
    city,
    orders: orders + 8,
    avgOrder,
    lastOrderDays: 2 + Math.floor(rand() * 10),
    lifetimeValue: (orders + 8) * avgOrder,
    risk,
    reason: lowReasons[Math.floor(rand() * lowReasons.length)].replace('{gap}', gap).replace('{fav}', fav),
    // kitne hafte bina offer ke chhod sakte hain
    ignoreWeeks: 4 + Math.floor(rand() * 5) - i,
    action: 'No discount needed. Only send new arrivals and a thank-you note — offers here would just cut profit.',
    channel: 'Newsletter',
  }
}

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// month: 0-11
export function buildChurnMonth(year, month) {
  const rand = seeded(year * 100 + month + 7)

  // har customer ka naam poore mahine mein ek hi baar aaye
  const used = new Set()
  const pick = (type, count) => {
    const list = []
    let i = 0
    while (list.length < count && i < 60) {
      const c = makeCustomer(rand, list.length, type)
      if (!used.has(c.name)) {
        used.add(c.name)
        list.push(c)
      }
      i++
    }
    return list
  }
  const high = pick('high', 5)
  const low = pick('low', 4)

  const total = 1400 + Math.floor(rand() * 300)
  const highCount = 90 + Math.floor(rand() * 70)
  const mediumCount = 260 + Math.floor(rand() * 120)
  const lowCount = total - highCount - mediumCount
  const rate = +((highCount / total) * 100 * 1.1).toFixed(1)

  // pichle 6 mahine ka trend
  const trend = Array.from({ length: 6 }, (_, k) => {
    const m = (month - 5 + k + 12) % 12
    const r = seeded(year * 100 + m + 3)
    return { label: monthNames[m], value: +(5 + r() * 4).toFixed(1) }
  })
  trend[5].value = rate

  const drivers = [
    { label: 'No order in 60+ days', value: 34 + Math.floor(rand() * 8) },
    { label: 'Only buys on discount', value: 20 + Math.floor(rand() * 6) },
    { label: 'Delivery delays', value: 12 + Math.floor(rand() * 8) },
    { label: 'Bad review / complaint', value: 8 + Math.floor(rand() * 6) },
    { label: 'Cart abandoned', value: 6 + Math.floor(rand() * 5) },
  ]

  return {
    label: `${monthNames[month]} ${year}`,
    total,
    rate,
    counts: { high: highCount, medium: mediumCount, low: lowCount },
    revenueAtRisk: high.reduce((s, c) => s + c.avgOrder * 3, 0) * 22,
    high,
    low,
    trend,
    drivers,
  }
}