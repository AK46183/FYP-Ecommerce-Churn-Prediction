// ============================================
// MINAYSH - FACE CONCEALERS
// 6 INDIVIDUAL PRODUCTS
// ============================================

const concealerCatalog = [

  {
    id: 'cc-001',
    brand: 'ELF',
    name: 'ELF Camo Color Corrector',
    shadeCount: 3,
    shades: [],
  },

  {
    id: 'cc-002',
    brand: 'Miss Rose',
    name: 'Miss Rose Liquid Concealer Oil Free 5ml',
    shadeCount: 6,
    shades: [],
  },

  {
    id: 'cc-003',
    brand: 'Lamel',
    name: 'Lamel Smart Skin Brightening Concealer',
    shadeCount: 3,
    shades: [
      '401 Light Beige',
      '402 Natural Beige',
      '403',
    ],
  },

  {
    id: 'cc-004',
    brand: 'BBA By Suleman',
    name: 'BBA By Suleman Radiant Concealer',
    shadeCount: 2,
    shades: [
      '2 Ivory',
      '4 Cool Natural',
    ],
  },

  {
    id: 'cc-005',
    brand: 'Maybelline',
    name: 'Maybelline Instant Age Rewind Concealer',
    shadeCount: 4,
    shades: [],
  },

  {
    id: 'cc-006',
    brand: 'Maybelline',
    name: 'Maybelline Fit Me Concealer',
    shadeCount: 4,
    shades: [],
  },

]


// Convert into existing MINAYSH product format

export const concealerProducts = concealerCatalog.map(
  (product) => {

    // Temporary illustration until individual images are added
    const image =
      '/images/products/foundation-secondskin.svg'

    return {

      ...product,

      tagline: product.brand,

      category: 'makeup',

      subCategory: 'Concealers',

      price: 0,

      oldPrice: null,

      rating: 0,

      reviews: 0,

      badge: 'COMING SOON',

      image,

      gallery: [image],

      description:
        `${product.name}. Product details will be added soon.`,

      benefits: [],

      howToUse: '',

      ingredients: '',

      draft: true,

      available: false,

    }

  }
)


// MINAYSH_CONCEALER_IMAGES_06_V1
const minayshConcealerImageMap = {
    "cc-001":  "/images/products/makeup/face/concealers/cc-001.png",
    "cc-002":  "/images/products/makeup/face/concealers/cc-002.jpg",
    "cc-003":  "/images/products/makeup/face/concealers/cc-003.jpg",
    "cc-004":  "/images/products/makeup/face/concealers/cc-004.png",
    "cc-005":  "/images/products/makeup/face/concealers/cc-005.jpg",
    "cc-006":  "/images/products/makeup/face/concealers/cc-006.jpg"
};

for (const product of concealerProducts) {
    const approvedImage = minayshConcealerImageMap[product.id];

    if (approvedImage) {
        product.image = approvedImage;
        product.gallery = [approvedImage];
    }
}