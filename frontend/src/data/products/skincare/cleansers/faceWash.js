export const faceWashProducts = []


// ==========================================================
// MINAYSH_CLEANSERS_BATCH_01
// Face Wash
// ==========================================================

const catalog = [
    {
        "id":  "mc-fw-001",
        "brand":  "Janssen",
        "name":  "Janssen Brightening Face Cleanser",
        "sizes":  [
                      "200ml"
                  ]
    },
    {
        "id":  "mc-fw-002",
        "brand":  "L\u0027Oréal Paris",
        "name":  "L\u0027Oréal Paris Glycolic Bright Glowing Daily Face Wash",
        "sizes":  [
                      "100ml"
                  ]
    },
    {
        "id":  "mc-fw-003",
        "brand":  "Garnier",
        "name":  "Garnier Skin Active Bright Complete Face Wash",
        "sizes":  [
                      "50ml",
                      "100ml"
                  ]
    },
    {
        "id":  "mc-fw-004",
        "brand":  "L\u0027Oréal Paris",
        "name":  "L\u0027Oréal Paris Revitalift Hyaluronic Acid Face Gel Cleanser",
        "sizes":  [
                      "100ml"
                  ]
    },
    {
        "id":  "mc-fw-005",
        "brand":  "Garnier",
        "name":  "Garnier Bright Anti Acne Face Wash",
        "sizes":  [
                      "50ml",
                      "100ml"
                  ]
    },
    {
        "id":  "mc-fw-006",
        "brand":  "CeraVe",
        "name":  "CeraVe Renewing SA Cleanser",
        "sizes":  [
                      "237ml"
                  ]
    },
    {
        "id":  "mc-fw-007",
        "brand":  "CeraVe",
        "name":  "CeraVe Hydrating Cream to Foam Cleanser",
        "sizes":  [
                      "87ml"
                  ]
    },
    {
        "id":  "mc-fw-008",
        "brand":  "Garnier",
        "name":  "Garnier Men Acno Fight Face Wash",
        "sizes":  [
                      "50ml",
                      "100ml"
                  ]
    },
    {
        "id":  "mc-fw-009",
        "brand":  "Garnier",
        "name":  "Garnier Oil Clear Face Wash For Men",
        "sizes":  [
                      "100ml"
                  ]
    },
    {
        "id":  "mc-fw-010",
        "brand":  "Savannah Beauté",
        "name":  "Savannah Beauté Whitening Rose Facewash",
        "sizes":  [
                      "100ml"
                  ]
    },
    {
        "id":  "mc-fw-011",
        "brand":  "Garnier",
        "name":  "Garnier Pure Active Neem Purifying Face Wash",
        "sizes":  [
                      "50ml",
                      "100ml"
                  ]
    },
    {
        "id":  "mc-fw-012",
        "brand":  "Garnier",
        "name":  "Garnier Power White Face Wash For Men",
        "sizes":  [
                      "50ml"
                  ]
    },
    {
        "id":  "mc-fw-013",
        "brand":  "CeraVe",
        "name":  "CeraVe Acne Facial Cleanser",
        "sizes":  [
                      "148ml"
                  ]
    },
    {
        "id":  "mc-fw-014",
        "brand":  "Anua",
        "name":  "Anua Heartleaf Pore Cleansing Foam",
        "sizes":  [
                      "150ml"
                  ]
    },
    {
        "id":  "mc-fw-015",
        "brand":  "Arencia",
        "name":  "Arencia Fresh Green Rice Mochi Cleanser",
        "sizes":  [
                      "120g"
                  ]
    }
]

export const minayshFaceWashBatchProducts = catalog.map((item) => {

  const image =
    '/images/products/product-placeholder.svg'

  return {

    ...item,

    tagline: item.brand,

    category: 'skinCare',

    subCategory: 'Face Wash',

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



// MINAYSH_SKINSUN_IMAGE_MAP_100f101efe
const minayshSkinSunImages_100f101efe =
{
  "mc-fw-001": "/images/products/skincare/face-wash/mc-fw-001.jpg",
  "mc-fw-002": "/images/products/skincare/face-wash/mc-fw-002.jpg",
  "mc-fw-003": "/images/products/skincare/face-wash/mc-fw-003.png",
  "mc-fw-005": "/images/products/skincare/face-wash/mc-fw-005.jpg",
  "mc-fw-006": "/images/products/skincare/face-wash/mc-fw-006.jpg",
  "mc-fw-007": "/images/products/skincare/face-wash/mc-fw-007.jpg",
  "mc-fw-008": "/images/products/skincare/face-wash/mc-fw-008.jpg",
  "mc-fw-009": "/images/products/skincare/face-wash/mc-fw-009.jpg",
  "mc-fw-010": "/images/products/skincare/face-wash/mc-fw-010.png",
  "mc-fw-011": "/images/products/skincare/face-wash/mc-fw-011.jpg",
  "mc-fw-012": "/images/products/skincare/face-wash/mc-fw-012.jpg",
  "mc-fw-013": "/images/products/skincare/face-wash/mc-fw-013.jpg",
  "mc-fw-014": "/images/products/skincare/face-wash/mc-fw-014.jpg",
  "mc-fw-015": "/images/products/skincare/face-wash/mc-fw-015.jpg"
};

for (const product of [faceWashProducts, minayshFaceWashBatchProducts].flatMap(items => Array.isArray(items) ? items : [])) {
  const approvedImage =
    minayshSkinSunImages_100f101efe[product.id];

  if (approvedImage) {
    product.image = approvedImage;
    product.gallery = [approvedImage];
  }
}



// MINAYSH_SKINSUN_IMAGE_MAP_38521cbe87
const minayshSkinSunImages_38521cbe87 =
{
  "mc-fw-001": "/images/products/skincare/face-wash/mc-fw-001.jpg",
  "mc-fw-002": "/images/products/skincare/face-wash/mc-fw-002.jpg",
  "mc-fw-003": "/images/products/skincare/face-wash/mc-fw-003.png",
  "mc-fw-004": "/images/products/skincare/face-wash/mc-fw-004.png",
  "mc-fw-005": "/images/products/skincare/face-wash/mc-fw-005.jpg",
  "mc-fw-006": "/images/products/skincare/face-wash/mc-fw-006.jpg",
  "mc-fw-007": "/images/products/skincare/face-wash/mc-fw-007.jpg",
  "mc-fw-008": "/images/products/skincare/face-wash/mc-fw-008.jpg",
  "mc-fw-009": "/images/products/skincare/face-wash/mc-fw-009.jpg",
  "mc-fw-010": "/images/products/skincare/face-wash/mc-fw-010.png",
  "mc-fw-011": "/images/products/skincare/face-wash/mc-fw-011.jpg",
  "mc-fw-012": "/images/products/skincare/face-wash/mc-fw-012.jpg",
  "mc-fw-013": "/images/products/skincare/face-wash/mc-fw-013.jpg",
  "mc-fw-014": "/images/products/skincare/face-wash/mc-fw-014.jpg",
  "mc-fw-015": "/images/products/skincare/face-wash/mc-fw-015.jpg"
};

for (const product of [faceWashProducts, minayshFaceWashBatchProducts].flatMap(items => Array.isArray(items) ? items : [])) {
  const approvedImage =
    minayshSkinSunImages_38521cbe87[product.id];

  if (approvedImage) {
    product.image = approvedImage;
    product.gallery = [approvedImage];
  }
}
