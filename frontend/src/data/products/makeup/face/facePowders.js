// ============================================================
// MINAYSH — FACE POWDERS
// 18 SEPARATE PRODUCTS
// ============================================================

const catalog = [

  [
    'pw-001',
    'ST London',
    'ST London Dual Wet & Dry Compact Powder',
    [],
  ],

  [
    'pw-002',
    'Kryolan',
    'Kryolan Dry Cake',
    [],
  ],

  [
    'pw-003',
    'Kryolan',
    'Kryolan Translucent Powder',
    [],
  ],

  [
    'pw-004',
    'ST London',
    'ST London Mineralz Loose Powder',
    [],
  ],

  [
    'pw-005',
    'ST London',
    'ST London Mineralz Compact Powder',
    [],
  ],

  [
    'pw-006',
    'Maybelline',
    'Maybelline Fit Me Matte + Poreless Powder',
    [],
  ],

  [
    'pw-007',
    'Femina',
    'Femina Twin Cake Refill',
    [],
  ],

  [
    'pw-008',
    'Revolution',
    'Revolution Loose Baking Powder 32gm',
    ['Banana', 'Translucent'],
  ],

  [
    'pw-009',
    'Rimmel London',
    'Rimmel London Stay Matte Pressed Powder',
    ['Silky Beige 034-005'],
  ],

  [
    'pw-010',
    'Revolution',
    'Revolution Relove Super Matte Pressed Powder',
    ['Translucent'],
  ],

  [
    'pw-011',
    'GOSH',
    'GOSH BB Powder',
    [],
  ],

  [
    'pw-012',
    'GOSH',
    'GOSH Waterproof Setting Powder',
    ['001'],
  ],

  [
    'pw-013',
    'Kryolan',
    'Kryolan Dermacolor Fixing Powder',
    ['P5'],
  ],

  [
    'pw-014',
    'Lamel',
    'Lamel Oh My Clear Face Powder',
    [
      '401 Light Natural',
      '402 Vanilla',
      '403 Rosy Beige',
    ],
  ],

  [
    'pw-015',
    'GOSH',
    'GOSH Pressed Powder',
    [],
  ],

  [
    'pw-016',
    'Lamel',
    'Lamel Smart Skin Compact Powder',
    [
      '401 Vanilla',
      '402',
    ],
  ],

  [
    'pw-017',
    'Rimmel London',
    'Rimmel London Kind & Free Pressed Powder',
    ['Translucent'],
  ],

  [
    'pw-018',
    'Luscious',
    'Luscious Softlight Powder Foundation',
    ['Ivory 1'],
  ],

]


export const facePowderProducts = catalog.map(
  ([id, brand, name, shades]) => {

    const image =
      '/images/products/foundation-secondskin.svg'

    return {

      id,
      brand,
      name,

      tagline: brand,

      category: 'makeup',
      subCategory: 'Face Powders',

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


// MINAYSH_FACE_POWDER_IMAGES_18_V1

const minayshFacePowderImageMap = {
    "pw-001":  "/images/products/makeup/face/powders/pw-001.jpg",
    "pw-002":  "/images/products/makeup/face/powders/pw-002.jpg",
    "pw-003":  "/images/products/makeup/face/powders/pw-003.jpg",
    "pw-004":  "/images/products/makeup/face/powders/pw-004.jpg",
    "pw-005":  "/images/products/makeup/face/powders/pw-005.jpg",
    "pw-006":  "/images/products/makeup/face/powders/pw-006.jpg",
    "pw-007":  "/images/products/makeup/face/powders/pw-007.jpg",
    "pw-008":  "/images/products/makeup/face/powders/pw-008.jpg",
    "pw-009":  "/images/products/makeup/face/powders/pw-009.jpg",
    "pw-010":  "/images/products/makeup/face/powders/pw-010.jpg",
    "pw-011":  "/images/products/makeup/face/powders/pw-011.jpg",
    "pw-012":  "/images/products/makeup/face/powders/pw-012.jpg",
    "pw-013":  "/images/products/makeup/face/powders/pw-013.jpg",
    "pw-014":  "/images/products/makeup/face/powders/pw-014.jpg",
    "pw-015":  "/images/products/makeup/face/powders/pw-015.jpg",
    "pw-016":  "/images/products/makeup/face/powders/pw-016.jpg",
    "pw-017":  "/images/products/makeup/face/powders/pw-017.jpg",
    "pw-018":  "/images/products/makeup/face/powders/pw-018.jpg"
};

for (const product of facePowderProducts) {

    const approvedImage =
        minayshFacePowderImageMap[product.id];

    if (approvedImage) {

        product.image = approvedImage;

        product.gallery = [approvedImage];

    }

}