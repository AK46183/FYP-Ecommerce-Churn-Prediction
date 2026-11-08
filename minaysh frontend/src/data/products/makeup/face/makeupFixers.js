// ============================================================
// MINAYSH - MAKEUP FIXERS
// 22 SETTING SPRAY PRODUCTS
// ============================================================

const catalog = [

  // NYX

  [
    'mf-001',
    'NYX',
    'NYX Makeup Setting Spray 02 Dewy Finish Long Lasting',
    [],
    [],
  ],

  [
    'mf-002',
    'NYX',
    'NYX Makeup Setting Spray 01 Matte Finish Long Lasting',
    [],
    [],
  ],


  // REVOLUTION

  [
    'mf-003',
    'Revolution',
    'Revolution Glow Fix Illuminating Setting Spray',
    [],
    ['100ml'],
  ],

  [
    'mf-004',
    'Revolution',
    'Revolution Matte Fix Oil Control Setting Spray',
    [],
    ['100ml'],
  ],

  [
    'mf-005',
    'Revolution',
    'Revolution Fix & Glow Fixing Spray',
    [],
    [],
  ],

  [
    'mf-006',
    'Revolution',
    'Revolution Hyaluronic Fixing Spray',
    [],
    [],
  ],


  // ST LONDON

  [
    'mf-007',
    'ST London',
    'ST London All Day Set Hydrating Makeup Setting Spray',
    [],
    [],
  ],


  // MAYBELLINE

  [
    'mf-008',
    'Maybelline',
    'Maybelline Fit Me Matte Poreless Setting Spray',
    [],
    ['60ml'],
  ],

  [
    'mf-009',
    'Maybelline',
    'Maybelline Fit Me Matte + Poreless Setting Spray',
    [],
    [],
  ],


  // RIMMEL LONDON

  [
    'mf-010',
    'Rimmel London',
    'Rimmel London Insta Fix & Go Setting Spray',
    [],
    [],
  ],

  [
    'mf-011',
    'Rimmel London',
    'Rimmel London Multi-tasker Primer Mist & Setting Spray',
    [],
    ['100ml'],
  ],


  // ESSENCE

  [
    'mf-012',
    'Essence',
    'Essence Keep It Perfect Make-Up Fixing Spray',
    [],
    [],
  ],

  [
    'mf-013',
    'Essence',
    'Essence Fix & Last 18H Make-Up Fixing Spray',
    [],
    [],
  ],


  // BBA BY SULEMAN

  [
    'mf-014',
    'BBA By Suleman',
    'BBA By Suleman Mist & Fix Setting Spray',
    [],
    ['30ml', '100ml'],
  ],


  // MISS ROSE

  [
    'mf-015',
    'Miss Rose',
    'Miss Rose Fixt Stay Over Setting Spray',
    [],
    ['80ml'],
  ],

  [
    'mf-016',
    'Miss Rose',
    'Miss Rose Mist & Fix Spray 02',
    [],
    ['125ml'],
  ],


  // MAX FACTOR

  [
    'mf-017',
    'Max Factor',
    'Max Factor Setting Spray Promo Kit',
    [],
    ['2 Pcs'],
  ],

  [
    'mf-018',
    'Max Factor',
    'Max Factor Lasting Performance Setting Spray',
    [],
    ['100ml'],
  ],


  // ELF

  [
    'mf-019',
    'ELF',
    'ELF Power Grip Dewy Setting Spray',
    [],
    ['80ml'],
  ],


  // LUSCIOUS

  [
    'mf-020',
    'Luscious',
    'Luscious Wonder Glass Makeup Setting Spray',
    [],
    ['60ml', '120ml'],
  ],


  // MAC

  [
    'mf-021',
    'MAC',
    'MAC Fix Setting Spray',
    [],
    [],
  ],


  // TROUBLE MAKER

  [
    'mf-022',
    'Trouble Maker',
    'Trouble Maker No Sweat Mattifying Setting Spray',
    [],
    ['45ml'],
  ],

]


// ============================================================
// CONVERT TO MINAYSH PRODUCT FORMAT
// ============================================================

export const makeupFixerProducts = catalog.map(
  ([id, brand, name, shades, sizes]) => {

    const image =
      '/images/products/foundation-secondskin.svg'

    return {

      id,

      brand,

      name,

      tagline: brand,

      category: 'makeup',

      subCategory: 'Makeup Fixers',

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
        `${name}. Product details will be added soon.`,

      benefits: [],

      howToUse: '',

      ingredients: '',

      draft: true,

      available: false,

    }

  }
)


// MINAYSH_MAKEUP_FIXER_IMAGES_22_V1

const minayshMakeupFixerImageMap = {
    "mf-001":  "/images/products/makeup/face/makeup-fixers/mf-001.jpg",
    "mf-002":  "/images/products/makeup/face/makeup-fixers/mf-002.jpg",
    "mf-003":  "/images/products/makeup/face/makeup-fixers/mf-003.png",
    "mf-004":  "/images/products/makeup/face/makeup-fixers/mf-004.jpg",
    "mf-005":  "/images/products/makeup/face/makeup-fixers/mf-005.jpg",
    "mf-006":  "/images/products/makeup/face/makeup-fixers/mf-006.jpg",
    "mf-007":  "/images/products/makeup/face/makeup-fixers/mf-007.jpg",
    "mf-008":  "/images/products/makeup/face/makeup-fixers/mf-008.jpg",
    "mf-009":  "/images/products/makeup/face/makeup-fixers/mf-009.jpg",
    "mf-010":  "/images/products/makeup/face/makeup-fixers/mf-010.jpg",
    "mf-011":  "/images/products/makeup/face/makeup-fixers/mf-011.png",
    "mf-012":  "/images/products/makeup/face/makeup-fixers/mf-012.jpg",
    "mf-013":  "/images/products/makeup/face/makeup-fixers/mf-013.jpg",
    "mf-014":  "/images/products/makeup/face/makeup-fixers/mf-014.jpg",
    "mf-015":  "/images/products/makeup/face/makeup-fixers/mf-015.jpg",
    "mf-016":  "/images/products/makeup/face/makeup-fixers/mf-016.jpg",
    "mf-017":  "/images/products/makeup/face/makeup-fixers/mf-017.jpg",
    "mf-018":  "/images/products/makeup/face/makeup-fixers/mf-018.jpg",
    "mf-019":  "/images/products/makeup/face/makeup-fixers/mf-019.png",
    "mf-020":  "/images/products/makeup/face/makeup-fixers/mf-020.jpg",
    "mf-021":  "/images/products/makeup/face/makeup-fixers/mf-021.png",
    "mf-022":  "/images/products/makeup/face/makeup-fixers/mf-022.jpg"
};

for (const product of makeupFixerProducts) {

    const approvedImage =
        minayshMakeupFixerImageMap[product.id];

    if (approvedImage) {

        product.image = approvedImage;

        product.gallery = [approvedImage];

    }
}