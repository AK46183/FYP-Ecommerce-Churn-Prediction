export const exfoliatorProducts = []


// ==========================================================
// MINAYSH_CLEANSERS_BATCH_01
// Exfoliators
// ==========================================================

const catalog = [
    {
        "id":  "mc-ex-001",
        "brand":  "Bioaqua",
        "name":  "Bioaqua Rice Exfoliating Face Scrub for Pore Cleansing",
        "sizes":  [
                      "140g"
                  ]
    },
    {
        "id":  "mc-ex-002",
        "brand":  "Janssen",
        "name":  "Janssen Enzyme Peeling Powder",
        "sizes":  [
                      "100g"
                  ]
    },
    {
        "id":  "mc-ex-003",
        "brand":  "The Ordinary",
        "name":  "The Ordinary AHA 30% + BHA 2% Peeling Solution",
        "sizes":  [
                      "30ml"
                  ]
    },
    {
        "id":  "mc-ex-004",
        "brand":  "The Ordinary",
        "name":  "The Ordinary Lactic Acid 10% + HA",
        "sizes":  [
                      "30ml"
                  ]
    },
    {
        "id":  "mc-ex-005",
        "brand":  "The Ordinary",
        "name":  "The Ordinary Lactic Acid 5% + HA",
        "sizes":  [
                      "30ml"
                  ]
    },
    {
        "id":  "mc-ex-006",
        "brand":  "Garnier",
        "name":  "Garnier Pure Active 3-in-1 Face Wash Mask \u0026 Scrub",
        "sizes":  [
                      "100ml"
                  ]
    },
    {
        "id":  "mc-ex-007",
        "brand":  "Garnier",
        "name":  "Garnier Pure Active 3-in-1 Charcoal Blackhead Face Wash Mask \u0026 Scrub",
        "sizes":  [
                      "100ml"
                  ]
    }
]

export const minayshExfoliatorBatchProducts = catalog.map((item) => {

  const image =
    '/images/products/product-placeholder.svg'

  return {

    ...item,

    tagline: item.brand,

    category: 'skinCare',

    subCategory: 'Exfoliators',

    price: null,

    oldPrice: null,

    currency: 'PKR',

    rating: 0,

    reviews: 0,

    badge: 'COMING SOON',

    image,

    gallery: [image],

    shades: [],

    variants: item.sizes.map((size, index) => ({

      sku: `${item.id}-${String(index + 1).padStart(2, '0')}`,

      size,

      shade: null,

      price: null,

      stock: null,

    })),

    description:
      `${item.name}. Additional product details will be added after verification.`,

    benefits: [],

    howToUse: '',

    ingredients: '',

    draft: true,

    available: false,

  }

})



// MINAYSH_SKINSUN_IMAGE_MAP_40c9a91879
const minayshSkinSunImages_40c9a91879 =
{
  "mc-ex-001": "/images/products/skincare/exfoliators/mc-ex-001.jpg",
  "mc-ex-002": "/images/products/skincare/exfoliators/mc-ex-002.jpg",
  "mc-ex-006": "/images/products/skincare/exfoliators/mc-ex-006.jpg"
};

for (const product of [exfoliatorProducts, minayshExfoliatorBatchProducts].flatMap(items => Array.isArray(items) ? items : [])) {
  const approvedImage =
    minayshSkinSunImages_40c9a91879[product.id];

  if (approvedImage) {
    product.image = approvedImage;
    product.gallery = [approvedImage];
  }
}



// MINAYSH_SKINSUN_IMAGE_MAP_a75c3e7b16
const minayshSkinSunImages_a75c3e7b16 =
{
  "mc-ex-001": "/images/products/skincare/exfoliators/mc-ex-001.jpg",
  "mc-ex-002": "/images/products/skincare/exfoliators/mc-ex-002.jpg",
  "mc-ex-003": "/images/products/skincare/exfoliators/mc-ex-003.jpg",
  "mc-ex-004": "/images/products/skincare/exfoliators/mc-ex-004.jpg",
  "mc-ex-005": "/images/products/skincare/exfoliators/mc-ex-005.jpg",
  "mc-ex-006": "/images/products/skincare/exfoliators/mc-ex-006.jpg",
  "mc-ex-007": "/images/products/skincare/exfoliators/mc-ex-007.jpg"
};

for (const product of [exfoliatorProducts, minayshExfoliatorBatchProducts].flatMap(items => Array.isArray(items) ? items : [])) {
  const approvedImage =
    minayshSkinSunImages_a75c3e7b16[product.id];

  if (approvedImage) {
    product.image = approvedImage;
    product.gallery = [approvedImage];
  }
}
