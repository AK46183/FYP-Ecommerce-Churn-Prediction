// ============================================================
// MINAYSH FOUNDATION PRODUCTS
// 32 SEPARATE PRODUCTS
// Shades belong to individual product detail pages.
// ============================================================

const foundationCatalog = [

  // MAYBELLINE — 6 PRODUCTS

  [
    'fd-001',
    'Maybelline',
    'Maybelline Fit Me Matte + Poreless Foundation',
    [
      '110',
      '112',
      '115 Ivory',
      '118 Light Beige',
      '120 Classic Ivory',
      '124 Soft Sand',
      '125 Nude Beige',
      '128',
      '130 Buff Beige',
      '220',
      '228 Soft Tan',
      '230 Natural Buff',
      '310 Sun Beige',
    ],
  ],

  [
    'fd-002',
    'Maybelline',
    'Maybelline Fit Me Matte + Poreless Mini Tube',
    [
      '115 Ivory',
      '120 Classic Ivory',
      '128 Warm Nude',
      '130 Buff Beige',
      '220 Natural Beige',
    ],
  ],

  [
    'fd-003',
    'Maybelline',
    'Maybelline Fit Me Dewy + Smooth Foundation SPF 30',
    [],
  ],

  [
    'fd-004',
    'Maybelline',
    'Maybelline Super Stay Up to 30hr Lumi Matte Foundation',
    [],
  ],

  [
    'fd-005',
    'Maybelline',
    'Maybelline SuperStay Lumi Mate Foundation Tube 18ml',
    ['110', '115', '120', '128', '220'],
  ],

  [
    'fd-006',
    'Maybelline',
    'Maybelline Fit Me BB Nude Glow Cream',
    ['20', '30', '40'],
  ],


  // KRYOLAN — 4 PRODUCTS

  

  

  [
    'fd-009',
    'Kryolan',
    'Kryolan Ultra Fluid Foundation',
    [],
  ],

  [
    'fd-010',
    'Kryolan',
    'Kryolan Derma Color Camouflage Fluid',
    [],
  ],


  // ST LONDON — 3 PRODUCTS

  [
    'fd-011',
    'ST London',
    'ST London Imperfection Eraser',
    ['IE 01', 'IE 02'],
  ],

  [
    'fd-012',
    'ST London',
    'ST London Silk Effect Foundation',
    ['Ivory', 'FS38'],
  ],

  [
    'fd-013',
    'ST London',
    'ST London Youthfull Young Skin Foundation',
    [],
  ],


  // GOSH

  [
    'fd-014',
    'GOSH',
    'GOSH X-ceptional Wear Makeup',
    [],
  ],


  // ELF

  [
    'fd-015',
    'ELF',
    'ELF Halo Glow Liquid Filter',
    [],
  ],


  // LAMEL

  [
    'fd-016',
    'Lamel',
    'Lamel Smart Skin Serum Tinted Foundation',
    ['401 Porcelain', '402'],
  ],


  // ESSENCE — 2 PRODUCTS

  [
    'fd-017',
    'Essence',
    'Essence Natural Matte Mousse Foundation',
    ['01', '02'],
  ],

  [
    'fd-018',
    'Essence',
    'Essence I LOVE FLAWLESS Foundation',
    ['20'],
  ],


  // L'OREAL PARIS

  [
    'fd-019',
    "L'Oréal Paris",
    "L'Oréal Paris Infallible 24h Liquid Foundation",
    ['200 Golden Sand'],
  ],


  // REVOLUTION — 2 PRODUCTS

  [
    'fd-020',
    'Revolution',
    'Revolution Superdewy Tinted Moisturiser',
    ['Fair', 'Medium Light'],
  ],

  [
    'fd-021',
    'Revolution',
    'Revolution Conceal & Define Foundation',
    [
      'F0.3',
      'F2.5',
      'F5',
      'F7',
      'F8.5',
      'F10',
      'F10.5',
    ],
  ],


  // BBA BY SULEMAN — 7 PRODUCTS

  [
    'fd-022',
    'BBA By Suleman',
    'BBA By Suleman 24K Gold & Roses Stick Foundation',
    ['03 Natural', '07 Warm Beige'],
  ],

  [
    'fd-023',
    'BBA By Suleman',
    'BBA By Suleman Be Beauty Soft Skin HD Foundation',
    ['01 Alabaster', '06 Sand'],
  ],

  [
    'fd-024',
    'BBA By Suleman',
    'BBA By Suleman SH 2X Wear Liquid Foundation',
    [
      'Fair 2',
      'Light 3',
      'Light 4',
      'Medium 5.5',
    ],
  ],

  [
    'fd-025',
    'BBA By Suleman',
    'BBA By Suleman SH 2X Wear Stick Foundation',
    ['Creamy Porcelain Medium'],
  ],

  [
    'fd-026',
    'BBA By Suleman',
    'BBA By Suleman Luminous Foundation',
    ['Warm Beige', 'Cool Natural'],
  ],

  [
    'fd-027',
    'BBA By Suleman',
    'BBA By Suleman Sweat Resistant Foundation',
    ['06 Beige'],
  ],

  [
    'fd-028',
    'BBA By Suleman',
    'BBA By Suleman Moisture Restore Serum Foundation',
    ['08 Golden Beige'],
  ],


  // MAX FACTOR

  [
    'fd-029',
    'Max Factor',
    'Max Factor Miracle Pure Skin Reset Foundation',
    ['80–85 Medium'],
  ],


  // RIMMEL LONDON — 3 PRODUCTS

  [
    'fd-030',
    'Rimmel London',
    'Rimmel London Lasting Finish Compact Powder Foundation',
    ['007 Golden Beige'],
  ],

  [
    'fd-031',
    'Rimmel London',
    'Rimmel London Lasting Finish Hyaluronic Acid Foundation',
    ['303 Honey'],
  ],

  [
    'fd-032',
    'Rimmel London',
    'Rimmel London Multi Tasker Better Than Filters',
    ['006 Medium Deep'],
  ],

]


// ============================================================
// CONVERT RECORDS INTO MINAYSH PRODUCT STRUCTURE
// ============================================================

export const foundationProducts = foundationCatalog.map(
  ([id, brand, name, shades]) => {

    const image =
      '/images/products/foundation-secondskin.svg'

    return {

      id,

      brand,

      name,

      tagline: brand,

      category: 'makeup',

      subCategory: 'Foundations',

      price: 0,

      oldPrice: null,

      rating: 0,

      reviews: 0,

      badge: 'COMING SOON',

      image,

      gallery: [image],

      shades,

      description:
        `${name}. Product details will be added soon.`,

      benefits: [],

      howToUse: '',

      ingredients: '',

      draft: true,

      available: false,

    }

  }
)


// ============================================================
// MINAYSH_FOUNDATION_IMAGES_32_V1
// Foundation product-specific image mapping
// ============================================================

const minayshFoundationImageMap = {
    "fd-001":  "/images/products/makeup/face/foundations/fd-001.jpg",
    "fd-002":  "/images/products/makeup/face/foundations/fd-002.png",
    "fd-003":  "/images/products/makeup/face/foundations/fd-003.jpg",
    "fd-004":  "/images/products/makeup/face/foundations/fd-004.jpg",
    "fd-005":  "/images/products/makeup/face/foundations/fd-005.jpg",
    "fd-006":  "/images/products/makeup/face/foundations/fd-006.jpg",
    "fd-007":  "/images/products/makeup/face/foundations/fd-007.jpg",
    "fd-008":  "/images/products/makeup/face/foundations/fd-008.jpg",
    "fd-009":  "/images/products/makeup/face/foundations/fd-009.jpg",
    "fd-010":  "/images/products/makeup/face/foundations/fd-010.jpg",
    "fd-011":  "/images/products/makeup/face/foundations/fd-011.jpg",
    "fd-012":  "/images/products/makeup/face/foundations/fd-012.jpg",
    "fd-013":  "/images/products/makeup/face/foundations/fd-013.jpg",
    "fd-014":  "/images/products/makeup/face/foundations/fd-014.jpg",
    "fd-015":  "/images/products/makeup/face/foundations/fd-015.jpg",
    "fd-016":  "/images/products/makeup/face/foundations/fd-016.jpg",
    "fd-017":  "/images/products/makeup/face/foundations/fd-017.jpg",
    "fd-018":  "/images/products/makeup/face/foundations/fd-018.jpg",
    "fd-019":  "/images/products/makeup/face/foundations/fd-019.jpg",
    "fd-020":  "/images/products/makeup/face/foundations/fd-020.jpg",
    "fd-021":  "/images/products/makeup/face/foundations/fd-021.jpg",
    "fd-022":  "/images/products/makeup/face/foundations/fd-022.jpg",
    "fd-023":  "/images/products/makeup/face/foundations/fd-023.jpg",
    "fd-024":  "/images/products/makeup/face/foundations/fd-024.png",
    "fd-025":  "/images/products/makeup/face/foundations/fd-025.png",
    "fd-026":  "/images/products/makeup/face/foundations/fd-026.jpg",
    "fd-027":  "/images/products/makeup/face/foundations/fd-027.jpg",
    "fd-028":  "/images/products/makeup/face/foundations/fd-028.png",
    "fd-029":  "/images/products/makeup/face/foundations/fd-029.jpg",
    "fd-030":  "/images/products/makeup/face/foundations/fd-030.jpg",
    "fd-031":  "/images/products/makeup/face/foundations/fd-031.jpg",
    "fd-032":  "/images/products/makeup/face/foundations/fd-032.jpg"
}

// Keep the existing foundationProducts export.
// Only replace image and gallery for matching IDs.

for (const product of foundationProducts) {

  const image =
    minayshFoundationImageMap[product.id]

  if (!image) {
    continue
  }

  product.image = image

  product.gallery = [image]

}
// ============================================================
// MINAYSH — VERIFIED MAYBELLINE FOUNDATION PRICES
// Source: Makeup City Pakistan
// ============================================================

const verifiedMaybellineFoundationData = {
  'fd-001': {
    price: 2624,
    oldPrice: 3499,
    sourceURL:
      'https://www.makeupcityshop.com/products/6902395774211',
  },

  'fd-002': {
    price: 1499,
    oldPrice: 1999,
    sourceURL:
      'https://www.makeupcityshop.com/products/6902395722403',
  },

  'fd-003': {
    price: 2699,
    oldPrice: 3599,
    sourceURL:
      'https://www.makeupcityshop.com/collections/fit-me',
  },
}

for (const product of foundationProducts) {
  const verified = verifiedMaybellineFoundationData[product.id]

  if (!verified) continue

  product.price = verified.price
  product.oldPrice = verified.oldPrice
  product.sourceURL = verified.sourceURL
  product.badge = 'SALE'
  product.draft = false
  product.available = true
}