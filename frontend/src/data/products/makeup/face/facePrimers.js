// ============================================================
// MINAYSH — FACE PRIMERS
// 19 SEPARATE PRODUCTS
// ============================================================

const catalog = [

  [
    'fp-001',
    'Maybelline',
    'Maybelline Fit Me Dewy & Smooth Primer',
    [],
    [],
  ],

  [
    'fp-002',
    'Revolution',
    'Revolution H2O Hydrate Primer',
    [],
    [],
  ],

  [
    'fp-003',
    'ELF',
    'ELF Power Grip Primer + 4% Niacinamide',
    [],
    ['24ml'],
  ],

  [
    'fp-004',
    'Benton',
    'Benton Guava Hydrating Make Up Base Prep Primer',
    [],
    ['1.2g'],
  ],

  [
    'fp-005',
    'GOSH',
    'GOSH Chameleon Primer',
    ['001'],
    ['30ml'],
  ],

  [
    'fp-006',
    'BOB',
    'BOB Silky Blur Silicon Primer',
    [],
    [],
  ],

  [
    'fp-007',
    'Trouble Maker',
    'Trouble Maker No Sweat Mattifying Primer',
    [],
    [],
  ],

  [
    'fp-008',
    'Miss Rose',
    'Miss Rose Photo Finish Foundation Primer',
    [],
    ['25ml'],
  ],

  [
    'fp-009',
    'Trouble Maker',
    'Trouble Maker Make Space Pore Blur Primer',
    [],
    [],
  ],

  [
    'fp-010',
    'BOB',
    'BOB 24K Gold Serum Face Primer',
    [],
    [],
  ],

  [
    'fp-011',
    'Trouble Maker',
    'Trouble Maker Genius Grip Hydrating Primer',
    [],
    [],
  ],

  [
    'fp-012',
    'Bourjois',
    'Bourjois Mix Hydrating Primer',
    [],
    [],
  ],

  [
    'fp-013',
    'Lamel',
    'Lamel Glow Illuminating Gel Face Primer',
    ['402'],
    [],
  ],

  [
    'fp-014',
    'GOSH',
    'GOSH Primer Plus',
    ['004', '008 Anti-Redness'],
    ['30ml'],
  ],

  [
    'fp-015',
    'ELF',
    'ELF Power Grip Matte Primer',
    [],
    ['26ml'],
  ],

  [
    'fp-016',
    'Dr Rashel',
    'Dr Rashel Vitamin C Niacinamide & Brightening Primer Serum',
    [],
    ['100ml'],
  ],

  [
    'fp-017',
    'Huda Beauty',
    'Huda Beauty Easy Blur Silicone-Free Smoothing Primer',
    [],
    ['10ml'],
  ],

  [
    'fp-018',
    'Dr Rashel',
    'Dr Rashel Hyaluronic Acid Instant Hydration Primer Serum',
    [],
    ['100ml'],
  ],

  [
    'fp-019',
    'Milk Makeup',
    'Milk Makeup Hydro Grip Primer',
    [],
    ['45ml'],
  ],

]


export const facePrimerProducts = catalog.map(
  ([id, brand, name, shades, sizes]) => {

    const image =
      '/images/products/foundation-secondskin.svg'

    return {

      id,
      brand,
      name,

      tagline: brand,

      category: 'makeup',
      subCategory: 'Face Primers',

      price: 0,
      oldPrice: null,

      rating: 0,
      reviews: 0,

      badge: 'COMING SOON',

      image,
      gallery: [image],

      shades,
      sizes,

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


// MINAYSH_FACE_PRIMER_IMAGES_19_V1

const minayshFacePrimerImageMap = {
    "fp-001":  "/images/products/makeup/face/primers/fp-001.jpg",
    "fp-002":  "/images/products/makeup/face/primers/fp-002.jpg",
    "fp-003":  "/images/products/makeup/face/primers/fp-003.jpg",
    "fp-004":  "/images/products/makeup/face/primers/fp-004.png",
    "fp-005":  "/images/products/makeup/face/primers/fp-005.jpg",
    "fp-006":  "/images/products/makeup/face/primers/fp-006.jpg",
    "fp-007":  "/images/products/makeup/face/primers/fp-007.jpg",
    "fp-008":  "/images/products/makeup/face/primers/fp-008.jpg",
    "fp-009":  "/images/products/makeup/face/primers/fp-009.jpg",
    "fp-010":  "/images/products/makeup/face/primers/fp-010.jpg",
    "fp-011":  "/images/products/makeup/face/primers/fp-011.jpg",
    "fp-012":  "/images/products/makeup/face/primers/fp-012.jpg",
    "fp-013":  "/images/products/makeup/face/primers/fp-013.jpg",
    "fp-014":  "/images/products/makeup/face/primers/fp-014.jpg",
    "fp-015":  "/images/products/makeup/face/primers/fp-015.png",
    "fp-016":  "/images/products/makeup/face/primers/fp-016.jpg",
    "fp-017":  "/images/products/makeup/face/primers/fp-017.png",
    "fp-018":  "/images/products/makeup/face/primers/fp-018.jpg",
    "fp-019":  "/images/products/makeup/face/primers/fp-019.jpg"
};

for (const product of facePrimerProducts) {

    const approvedImage =
        minayshFacePrimerImageMap[product.id];

    if (approvedImage) {

        product.image = approvedImage;

        product.gallery = [approvedImage];

    }

}