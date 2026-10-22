// ============================================================
// MINAYSH — FACE HIGHLIGHTERS
// 19 INDIVIDUAL PRODUCT FAMILIES
// ============================================================

const highlighterCatalog = [

  // LAMEL

  {
    id: 'hl-001',
    brand: 'Lamel',
    name: 'Lamel Glow Highlighter',

    shades: [
      '402',
    ],
  },


  // GOSH

  {
    id: 'hl-002',
    brand: 'GOSH',
    name: 'GOSH Lumi Drops 15ml',

    shadeCount: 3,
    shades: [],
  },


  // LAMEL

  {
    id: 'hl-003',
    brand: 'Lamel',
    name: 'Lamel BB Highlighter 10ml',

    shades: [
      '401',
    ],
  },


  // KRYOLAN

  {
    id: 'hl-004',
    brand: 'Kryolan',
    name: 'Kryolan Illusion',

    shades: [],
  },


  // ESSENCE

  {
    id: 'hl-005',
    brand: 'Essence',
    name: 'Essence Baby Got Diamond Highlighter Stick',

    shades: [],
  },

  {
    id: 'hl-006',
    brand: 'Essence',
    name: 'Essence Emily In Paris Blushlighter',

    shades: [
      '01',
    ],
  },


  // TROUBLE MAKER

  {
    id: 'hl-007',
    brand: 'Trouble Maker',
    name: 'Trouble Maker Gloie Lighter Highlight',

    shades: [
      'Holo Bebe White',
      'Beam Town Pink',
      'Lil Lumi Light Pink',
    ],
  },


  // GOSH

  {
    id: 'hl-008',
    brand: 'GOSH',
    name: 'GOSH IM Sparkling',

    shades: [],
  },


  // ESSENCE

  {
    id: 'hl-009',
    brand: 'Essence',
    name: 'Essence Baby Got Blush Liquid Highlighter',

    shades: [
      '30',
    ],
  },


  // REVOLUTION

  {
    id: 'hl-010',
    brand: 'Revolution',
    name: 'Revolution Beam Bright Highlighter',

    shades: [
      'Diamond Glow',
    ],
  },


  // RIMMEL LONDON

  {
    id: 'hl-011',
    brand: 'Rimmel London',
    name: 'Rimmel London Clear Highlighter',

    shades: [
      '001 Stardust',
    ],
  },


  // BBA BY SULEMAN

  {
    id: 'hl-012',
    brand: 'BBA By Suleman',
    name: 'BBA By Suleman 24K Gold & Roses Liquid Highlighter',

    shades: [
      'Peach Splash',
    ],
  },


  // MISS ROSE

  {
    id: 'hl-013',
    brand: 'Miss Rose',
    name: 'Miss Rose Liquid Highlighter',

    shades: [],
  },


  // BBA BY SULEMAN

  {
    id: 'hl-014',
    brand: 'BBA By Suleman',
    name: 'BBA By Suleman Sh Star Show Pressed Highlighter',

    shades: [
      'Pale Pink',
      'Moon Dust',
    ],
  },


  // TROUBLE MAKER

  {
    id: 'hl-015',
    brand: 'Trouble Maker',
    name: 'Trouble Maker Ziggy Stick Glass Highlight',

    shades: [
      'Stardust Gold',
      'Earthling Pink',
    ],
  },


  // ESSENCE

  {
    id: 'hl-016',
    brand: 'Essence',
    name: 'Essence Everlasting Blooms Duo Highlighters',

    shades: [
      '01',
    ],
  },

  {
    id: 'hl-017',
    brand: 'Essence',
    name: 'Essence Soft Touch Bouncy Glow',

    shades: [
      '20',
    ],
  },


  // CHARLOTTE TILBURY

  {
    id: 'hl-018',
    brand: 'Charlotte Tilbury',
    name: 'Charlotte Tilbury Glow Glide Face Architect Highlighter',

    shades: [],
  },


  // ESSENCE

  {
    id: 'hl-019',
    brand: 'Essence',
    name: 'Essence Baby Got Glow Liquid Highlighter',

    shades: [
      '20',
    ],
  },

]


// ============================================================
// CONVERT INTO MINAYSH PRODUCT STRUCTURE
// ============================================================

export const highlighterProducts = highlighterCatalog.map(
  (product) => {

    const image =
      '/images/products/foundation-secondskin.svg'

    return {

      ...product,

      tagline: product.brand,

      category: 'makeup',

      subCategory: 'Face Highlighters',

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


// MINAYSH_FACE_HIGHLIGHTER_IMAGES_19_V1

const minayshHighlighterImageMap = {
    "hl-001":  "/images/products/makeup/face/highlighters/hl-001.jpg",
    "hl-002":  "/images/products/makeup/face/highlighters/hl-002.jpg",
    "hl-003":  "/images/products/makeup/face/highlighters/hl-003.png",
    "hl-004":  "/images/products/makeup/face/highlighters/hl-004.jpg",
    "hl-005":  "/images/products/makeup/face/highlighters/hl-005.png",
    "hl-006":  "/images/products/makeup/face/highlighters/hl-006.jpg",
    "hl-007":  "/images/products/makeup/face/highlighters/hl-007.jpg",
    "hl-008":  "/images/products/makeup/face/highlighters/hl-008.jpg",
    "hl-009":  "/images/products/makeup/face/highlighters/hl-009.jpg",
    "hl-010":  "/images/products/makeup/face/highlighters/hl-010.jpg",
    "hl-011":  "/images/products/makeup/face/highlighters/hl-011.jpg",
    "hl-012":  "/images/products/makeup/face/highlighters/hl-012.jpg",
    "hl-013":  "/images/products/makeup/face/highlighters/hl-013.jpg",
    "hl-014":  "/images/products/makeup/face/highlighters/hl-014.jpg",
    "hl-015":  "/images/products/makeup/face/highlighters/hl-015.jpg",
    "hl-016":  "/images/products/makeup/face/highlighters/hl-016.jpg",
    "hl-017":  "/images/products/makeup/face/highlighters/hl-017.png",
    "hl-018":  "/images/products/makeup/face/highlighters/hl-018.jpg",
    "hl-019":  "/images/products/makeup/face/highlighters/hl-019.png"
};

for (const product of highlighterProducts) {

    const approvedImage =
        minayshHighlighterImageMap[product.id];

    if (approvedImage) {

        product.image = approvedImage;

        product.gallery = [approvedImage];

    }
}