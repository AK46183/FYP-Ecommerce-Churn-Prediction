// ============================================================
// MINAYSH — FACE BLUSH
// 12 INDIVIDUAL PRODUCT FAMILIES
// ============================================================

const blushCatalog = [

  // SHEGLAM

  {
    id: 'bl-001',
    brand: 'Sheglam',
    name: 'Sheglam Color Bloom Matte Liquid Blush',

    shades: [
      'Love Cake',
      'Risky Business',
    ],
  },


  // FEMINA

  {
    id: 'bl-002',
    brand: 'Femina',
    name: 'Femina Sparkling Blusher',

    shadeCount: 5,
    shades: [],
  },


  // ST LONDON

  {
    id: 'bl-003',
    brand: 'ST London',
    name: 'ST London Glam N Shine Blusher',

    shadeCount: 3,
    shades: [],
  },

  {
    id: 'bl-004',
    brand: 'ST London',
    name: 'ST London Blush-On',

    shades: [
      'Dusty Pink',
      'Light Peach',
      'Rusty Brown',
      'Malt',
    ],
  },


  // LAMEL

  {
    id: 'bl-005',
    brand: 'Lamel',
    name: 'Lamel Blush Cheek Colour',

    shades: [
      '403',
      '407',
      '408',
    ],
  },

  {
    id: 'bl-006',
    brand: 'Lamel',
    name: 'Lamel BB Blush',

    shades: [
      '401 Tea Rose',
    ],
  },


  // REVOLUTION

  {
    id: 'bl-007',
    brand: 'Revolution',
    name: 'Revolution Mousse Blusher',

    shades: [
      'Blossom Rose Pink',
      'Squeeze Me Soft Pink',
    ],
  },

  {
    id: 'bl-008',
    brand: 'Revolution',
    name: 'Revolution Fast Base Blush Stick 14gm',

    shades: [
      'Rose',
      'Blush',
    ],
  },

  {
    id: 'bl-009',
    brand: 'Revolution',
    name: 'Revolution Blusher Reloaded',

    shades: [
      'Coral Dream',
    ],
  },


  // GOSH

  {
    id: 'bl-010',
    brand: 'GOSH',
    name: 'GOSH IM Blushing',

    shades: [],
  },


  // REVOLUTION BLUSH DUO

  {
    id: 'bl-011',
    brand: 'Revolution',
    name: 'Revolution Relove Colour Play Blushed Duo',

    shades: [
      'Cute',
      'Daydream',
      'Kindness',
    ],
  },


  // REVOLUTION BLUSH PALETTE
  // Kept inside Blush as requested.

  {
    id: 'bl-012',
    brand: 'Revolution',
    name: 'Revolution Ultra Blush Palette',

    shades: [
      'Sugar & Spice',
      'Hot Spice',
    ],

    productType: 'Blush Palette',
  },

]


// ============================================================
// CONVERT INTO MINAYSH PRODUCT STRUCTURE
// ============================================================

export const blushProducts = blushCatalog.map((product) => {

  const image =
    '/images/products/blush-signature-rose.svg'

  return {

    ...product,

    tagline: product.brand,

    category: 'makeup',

    subCategory: 'Blush',

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

})


// MINAYSH_BRANDED_BLUSH_IMAGES_12_V1

const minayshBlushImageMap = {
    "bl-001":  "/images/products/makeup/face/blush/bl-001.jpg",
    "bl-002":  "/images/products/makeup/face/blush/bl-002.jpg",
    "bl-003":  "/images/products/makeup/face/blush/bl-003.jpg",
    "bl-004":  "/images/products/makeup/face/blush/bl-004.jpg",
    "bl-005":  "/images/products/makeup/face/blush/bl-005.jpg",
    "bl-006":  "/images/products/makeup/face/blush/bl-006.jpg",
    "bl-007":  "/images/products/makeup/face/blush/bl-007.jpg",
    "bl-008":  "/images/products/makeup/face/blush/bl-008.jpg",
    "bl-009":  "/images/products/makeup/face/blush/bl-009.jpg",
    "bl-010":  "/images/products/makeup/face/blush/bl-010.jpg",
    "bl-011":  "/images/products/makeup/face/blush/bl-011.jpg",
    "bl-012":  "/images/products/makeup/face/blush/bl-012.jpg"
};

for (const product of blushProducts) {

    const approvedImage =
        minayshBlushImageMap[product.id];

    if (approvedImage) {

        product.image = approvedImage;

        product.gallery = [approvedImage];

    }

}