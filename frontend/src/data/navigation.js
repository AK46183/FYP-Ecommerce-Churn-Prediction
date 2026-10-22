// Top-level category navigation bar
export const primaryNav = [
  { label: 'MAKEUP', path: '/makeup', key: 'makeup' },
  { label: 'SKIN CARE', path: '/skincare', key: 'skinCare' },
  { label: 'ACCESSORIES', path: '/accessories', key: 'accessories' },
  { label: 'SUN CARE', path: '/sun-care', key: 'sunCare' },
  { label: 'FRAGRANCES', path: '/fragrances', key: 'fragrances' },
  { label: 'HAIR', path: '/hair', key: 'hair' },
  { label: 'NEW', path: '/new', key: 'new' },
  { label: 'BUNDLE OFFER', path: '/bundle-offer', key: 'bundle' },
  { label: 'SALE', path: '/sale', key: 'sale' },
]

// Multi-level mega menu content, keyed by primaryNav[].key
export const megaMenu = {
  makeup: [
    {
      label: 'FACE MAKEUP',
      path: '/makeup/face',
      items: [
        { label: 'Foundations', path: '/makeup/face/foundations' },
        { label: 'Bronzers & Contours', path: '/makeup/face/bronzers-contours' },
        { label: 'Face Highlighters', path: '/makeup/face/highlighters' },
        { label: 'Face Powders', path: '/makeup/face/powders' },
        { label: 'Blush', path: '/makeup/face/blush' },
        { label: 'Concealers', path: '/makeup/face/concealers' },
        { label: 'Makeup Fixers', path: '/makeup/face/fixers' },
        { label: 'Face Primers', path: '/makeup/face/primers' },
      ],
    },
    {
      label: 'EYE MAKEUP',
      path: '/makeup/eye',
      items: [
        { label: 'Eyeshadow', path: '/makeup/eye/eyeshadow' },
        { label: 'Eyeliner', path: '/makeup/eye/eyeliner' },
        { label: 'Mascara', path: '/makeup/eye/mascara' },
        { label: 'Brow Products', path: '/makeup/eye/brows' },
        { label: 'False Lashes', path: '/makeup/eye/lashes' },
      ],
    },
    {
      label: 'LIP MAKEUP',
      path: '/makeup/lip',
      items: [
        { label: 'Lipstick', path: '/makeup/lip/lipstick' },
        { label: 'Lip Gloss', path: '/makeup/lip/gloss' },
        { label: 'Lip Liner', path: '/makeup/lip/liner' },
        { label: 'Lip Tints', path: '/makeup/lip/tints' },
        { label: 'Lip Care', path: '/makeup/lip/care' },
      ],
    },
    {
      label: 'HANDS',
      path: '/makeup/hands',
      items: [
        { label: 'Nail Polish', path: '/makeup/hands/nail-polish' },
        { label: 'Hand Cream', path: '/makeup/hands/hand-cream' },
      ],
    },
    {
      label: 'PALETTES',
      path: '/makeup/palettes',
      items: [
        { label: 'Eyeshadow Palettes', path: '/makeup/palettes/eyeshadow' },
      ],
    },
  ],
  skinCare: [
    {
      label: 'CLEANSERS',
      path: '/skincare/cleansers',
      items: [
        { label: 'Face Wash', path: '/skincare/cleansers/face-wash' },
        { label: 'Exfoliators', path: '/skincare/cleansers/exfoliators' },
      ],
    },
    {
      label: 'MOISTURIZERS',
      path: '/skincare/moisturizers',
      items: [
        { label: 'Day Cream', path: '/skincare/moisturizers/day-cream' },
        { label: 'Night Cream', path: '/skincare/moisturizers/night-cream' },
      ],
    },
    {
      label: 'TREATMENTS',
      path: '/skincare/treatments',
      items: [
        { label: 'Serums', path: '/skincare/treatments/serums' },
        { label: 'Masks', path: '/skincare/treatments/masks' },
        { label: 'Eye Care', path: '/skincare/treatments/eye-care' },
      ],
    },
  ],
  sunCare: [
    {
      label: 'SUN PROTECTION',
      path: '/sun-care/protection',
      items: [
        { label: 'Face SPF', path: '/sun-care/protection/face-spf' },
      ],
    },
  ],
  fragrances: [
    {
      label: 'FOR HER',
      path: '/fragrances/her',
      items: [
      ],
    },
  ],
  hair: [
    {
      label: 'HAIR CARE',
      path: '/hair/care',
      items: [
        { label: 'Shampoo', path: '/hair/care/shampoo' },
        { label: 'Conditioner', path: '/hair/care/conditioner' },
        { label: 'Hair Treatments', path: '/hair/care/treatments' },
        { label: 'Hair Oils & Serums', path: '/hair/care/oils' },
      ],
    },
  ],
}

export const footerLinks = {
  help: [
    { label: 'Help Center', path: '/help' },
    { label: 'Track Your Order', path: '/account/track-order' },
    { label: 'Your Account', path: '/account' },
    { label: 'Delivery Options', path: '/help/delivery' },
    { label: 'Payment Methods', path: '/help/payment' },
    { label: 'Return Policy', path: '/help/returns' },
    { label: 'Privacy Policy', path: '/help/privacy' },
    { label: 'Terms & Conditions', path: '/help/terms' },
  ],
  about: [
    { label: 'Our Brand', path: '/our-brand' },
    { label: 'Contact Us', path: '/contact' },
    { label: 'Store Locations', path: '/stores' },
    { label: 'Careers', path: '/careers' },
    { label: 'Press', path: '/press' },
  ],
}

