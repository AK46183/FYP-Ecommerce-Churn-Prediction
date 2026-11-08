export const serumProducts = []


// ============================================================
// MINAYSH_SKINCARE_BATCH_02
// Serums
// ============================================================

const minayshSerumsBatch02ProductsCatalog = [
    {
        "id":  "mc-sr-001",
        "brand":  "The Ordinary",
        "name":  "The Ordinary Hyaluronic Acid 2% + B5",
        "sizes":  [
                      "30ml"
                  ]
    },
    {
        "id":  "mc-sr-002",
        "brand":  "The Ordinary",
        "name":  "The Ordinary Retinol 1% in Squalane",
        "sizes":  [
                      "30ml"
                  ]
    },
    {
        "id":  "mc-sr-003",
        "brand":  "The Ordinary",
        "name":  "The Ordinary Alpha Arbutin 2% + HA",
        "sizes":  [
                      "30ml"
                  ]
    },
    {
        "id":  "mc-sr-004",
        "brand":  "The Ordinary",
        "name":  "The Ordinary Retinol 0.5% in Squalane",
        "sizes":  [
                      "30ml"
                  ]
    },
    {
        "id":  "mc-sr-005",
        "brand":  "The Ordinary",
        "name":  "The Ordinary Vitamin C Suspension 23% + HA Spheres 2%",
        "sizes":  [
                      "30ml"
                  ]
    },
    {
        "id":  "mc-sr-006",
        "brand":  "Janssen",
        "name":  "Janssen Superfruit Fluid",
        "sizes":  [
                      "2ml"
                  ]
    },
    {
        "id":  "mc-sr-007",
        "brand":  "The Ordinary",
        "name":  "The Ordinary Retinol 0.2% in Squalane",
        "sizes":  [
                      "30ml"
                  ]
    },
    {
        "id":  "mc-sr-008",
        "brand":  "BBA By Suleman",
        "name":  "BBA By Suleman 24K Gold and Roses Serum",
        "sizes":  [
                      "15ml"
                  ]
    },
    {
        "id":  "mc-sr-009",
        "brand":  "The Ordinary",
        "name":  "The Ordinary Resveratrol 3% Ferulic Acid 3%",
        "sizes":  [
                      "30ml"
                  ]
    },
    {
        "id":  "mc-sr-010",
        "brand":  "The Ordinary",
        "name":  "The Ordinary Amino Acids + B5",
        "sizes":  [

                  ]
    },
    {
        "id":  "mc-sr-011",
        "brand":  "The Ordinary",
        "name":  "The Ordinary Buffet + Copper Peptides 1%",
        "sizes":  [
                      "30ml"
                  ]
    }
]

export const minayshSerumsBatch02Products = minayshSerumsBatch02ProductsCatalog.map((item) => {

  const image = '/images/products/product-placeholder.svg'

  return {

    ...item,

    tagline: item.brand,

    category: 'skinCare',

    subCategory: 'Serums',

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
      `${item.name}. Product details will be added after verification.`,

    benefits: [],

    howToUse: '',

    ingredients: '',

    draft: true,

    available: false,

  }

})



// MINAYSH_SKINSUN_IMAGE_MAP_84ad28aca5
const minayshSkinSunImages_84ad28aca5 =
{
  "mc-sr-008": "/images/products/skincare/serums/mc-sr-008.jpg"
};

for (const product of [serumProducts, minayshSerumsBatch02Products].flatMap(items => Array.isArray(items) ? items : [])) {
  const approvedImage =
    minayshSkinSunImages_84ad28aca5[product.id];

  if (approvedImage) {
    product.image = approvedImage;
    product.gallery = [approvedImage];
  }
}



// MINAYSH_SKINSUN_IMAGE_MAP_d9c9fbf14e
const minayshSkinSunImages_d9c9fbf14e =
{
  "mc-sr-001": "/images/products/skincare/serums/mc-sr-001.jpg",
  "mc-sr-002": "/images/products/skincare/serums/mc-sr-002.jpg",
  "mc-sr-003": "/images/products/skincare/serums/mc-sr-003.jpg",
  "mc-sr-004": "/images/products/skincare/serums/mc-sr-004.jpg",
  "mc-sr-005": "/images/products/skincare/serums/mc-sr-005.jpg",
  "mc-sr-006": "/images/products/skincare/serums/mc-sr-006.png",
  "mc-sr-007": "/images/products/skincare/serums/mc-sr-007.jpg",
  "mc-sr-008": "/images/products/skincare/serums/mc-sr-008.jpg",
  "mc-sr-009": "/images/products/skincare/serums/mc-sr-009.jpg",
  "mc-sr-010": "/images/products/skincare/serums/mc-sr-010.jpg",
  "mc-sr-011": "/images/products/skincare/serums/mc-sr-011.jpg"
};

for (const product of [serumProducts, minayshSerumsBatch02Products].flatMap(items => Array.isArray(items) ? items : [])) {
  const approvedImage =
    minayshSkinSunImages_d9c9fbf14e[product.id];

  if (approvedImage) {
    product.image = approvedImage;
    product.gallery = [approvedImage];
  }
}
