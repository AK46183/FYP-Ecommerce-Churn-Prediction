// ============================================================
// MINAYSH — BRONZERS & CONTOURS
// 13 SEPARATE PRODUCTS
// ============================================================

const catalog = [

  [
    'bc-001',
    'Revolution',
    'Revolution Contour Kit Ultra',
    ['Fair C01', 'Light/Medium C04'],
  ],

  [
    'bc-002',
    'Revolution',
    'Revolution Fast Contour Stick',
    ['Medium'],
  ],

  [
    'bc-003',
    'ST London',
    'ST London Glam & Shine Bronzer',
    ['Bronzed'],
  ],

  [
    'bc-004',
    'Lamel',
    'Lamel Sunkissed Matte Bronzer',
    ['401 Tone'],
  ],

  [
    'bc-005',
    'Rimmel London',
    'Rimmel London Natural Bronzer',
    ['001 Sunlight', '002 Sunbronze'],
  ],

  [
    'bc-006',
    'BBA By Suleman',
    'BBA By Suleman SH Contour Stick',
    ['Cinnamon'],
  ],

  [
    'bc-007',
    'BBA By Suleman',
    'BBA By Suleman 24K Gold & Roses Contour Stick',
    ['Warm Contour', 'Cool Contour'],
  ],

  [
    'bc-008',
    'Trouble Maker',
    'Trouble Maker Rascal Powder Bronzer',
    ['Creature', 'Trickster'],
  ],

  [
    'bc-009',
    'NYX',
    'NYX Buttermelt Bronzer',
    [],
  ],

  [
    'bc-010',
    'Lamel',
    'Lamel BB Contour',
    ['401'],
  ],

  [
    'bc-011',
    'Trouble Maker',
    'Trouble Maker Overcooked Baked Bronzer',
    [
      'Ginger Snap Light-Medium',
      'Cinnamon Twist Light',
    ],
  ],

  [
    'bc-012',
    'L.A. Girl',
    'L.A. Girl Matte Bronzer',
    [],
  ],

  [
    'bc-013',
    'L.A. Girl',
    'L.A. Girl Pro Contour Cream',
    [],
  ],

]


export const bronzerProducts = catalog.map(
  ([id, brand, name, shades]) => {

    const image =
      '/images/products/foundation-secondskin.svg'

    return {

      id,
      brand,
      name,

      tagline: brand,

      category: 'makeup',
      subCategory: 'Bronzers & Contours',

      price: 0,
      oldPrice: null,

      rating: 0,
      reviews: 0,

      badge: 'COMING SOON',

      image,
      gallery: [image],

      shades,

      description:
        `${name}. Product details coming soon.`,

      benefits: [],
      howToUse: '',
      ingredients: '',

      draft: true,
      available: false,

    }

  }
)


// MINAYSH_BRONZER_IMAGES_13_V1
const minayshBronzerImageMap = {
    "bc-001":  "/images/products/makeup/face/bronzers/bc-001.jpg",
    "bc-002":  "/images/products/makeup/face/bronzers/bc-002.jpg",
    "bc-003":  "/images/products/makeup/face/bronzers/bc-003.jpg",
    "bc-004":  "/images/products/makeup/face/bronzers/bc-004.jpg",
    "bc-005":  "/images/products/makeup/face/bronzers/bc-005.jpg",
    "bc-006":  "/images/products/makeup/face/bronzers/bc-006.jpg",
    "bc-007":  "/images/products/makeup/face/bronzers/bc-007.jpg",
    "bc-008":  "/images/products/makeup/face/bronzers/bc-008.jpg",
    "bc-009":  "/images/products/makeup/face/bronzers/bc-009.jpg",
    "bc-010":  "/images/products/makeup/face/bronzers/bc-010.jpg",
    "bc-011":  "/images/products/makeup/face/bronzers/bc-011.jpg",
    "bc-012":  "/images/products/makeup/face/bronzers/bc-012.jpg",
    "bc-013":  "/images/products/makeup/face/bronzers/bc-013.jpg"
};

for (const product of bronzerProducts) {
    const approvedImage = minayshBronzerImageMap[product.id];

    if (approvedImage) {
        product.image = approvedImage;
        product.gallery = [approvedImage];
    }
}