export const maskProducts = []


// ============================================================
// MINAYSH_SKINCARE_BATCH_02
// Masks
// ============================================================

const minayshMasksBatch02ProductsCatalog = [
    {
        "id":  "mc-mk-001",
        "brand":  "L\u0027Oréal Paris",
        "name":  "L\u0027Oréal Paris Glycolic Bright Instant Glowing Serum Mask",
        "sizes":  [

                  ]
    },
    {
        "id":  "mc-mk-002",
        "brand":  "Garnier",
        "name":  "Garnier Skin Active Hydra Bomb Sakura Tissue Face Mask",
        "sizes":  [
                      "28g"
                  ]
    },
    {
        "id":  "mc-mk-003",
        "brand":  "Garnier",
        "name":  "Garnier Skin Active Bright Complete Tissue Face Mask",
        "sizes":  [

                  ]
    },
    {
        "id":  "mc-mk-004",
        "brand":  "Garnier",
        "name":  "Garnier Skin Active Hydra Bomb Green Tea Tissue Face Mask",
        "sizes":  [
                      "28g"
                  ]
    },
    {
        "id":  "mc-mk-005",
        "brand":  "Janssen",
        "name":  "Janssen Botanica White Mask",
        "sizes":  [
                      "300g"
                  ]
    },
    {
        "id":  "mc-mk-006",
        "brand":  "Medicube",
        "name":  "Medicube Collagen Night Wrapping Mask",
        "sizes":  [
                      "75ml"
                  ]
    },
    {
        "id":  "mc-mk-007",
        "brand":  "Garnier",
        "name":  "Garnier Skin Active Hydra Bomb Pomegranate Tissue Face Mask",
        "sizes":  [
                      "28g"
                  ]
    },
    {
        "id":  "mc-mk-008",
        "brand":  "Biodance",
        "name":  "Biodance Real Deep Pink Sheet Mask",
        "sizes":  [
                      "1pc"
                  ]
    },
    {
        "id":  "mc-mk-009",
        "brand":  "Bioaqua",
        "name":  "Bioaqua Rice Ice Cooling Facial Sheet Mask",
        "sizes":  [

                  ]
    },
    {
        "id":  "mc-mk-010",
        "brand":  "Bioaqua",
        "name":  "Bioaqua Blueberry Facial Sheet Mask",
        "sizes":  [

                  ]
    },
    {
        "id":  "mc-mk-011",
        "brand":  "Bioaqua",
        "name":  "Bioaqua Hyaluronic Facial Sheet Mask",
        "sizes":  [

                  ]
    },
    {
        "id":  "mc-mk-012",
        "brand":  "Skin Clear",
        "name":  "Skin Clear Whitening Blackhead Mask",
        "sizes":  [
                      "40g"
                  ]
    },
    {
        "id":  "mc-mk-013",
        "brand":  "Anua",
        "name":  "Anua Soothing Ampoule Sheet Mask",
        "sizes":  [

                  ]
    },
    {
        "id":  "mc-mk-014",
        "brand":  "Biodance",
        "name":  "Biodance Yellow Niacinamide Sheet Mask",
        "sizes":  [
                      "1pc"
                  ]
    },
    {
        "id":  "mc-mk-015",
        "brand":  "Medicube",
        "name":  "Medicube Kojic Acid Turmeric Night Wrapping Mask",
        "sizes":  [
                      "75ml"
                  ]
    },
    {
        "id":  "mc-mk-016",
        "brand":  "Bioaqua",
        "name":  "Bioaqua Rice Nose Mask",
        "sizes":  [
                      "60g"
                  ]
    },
    {
        "id":  "mc-mk-017",
        "brand":  "Dr Althea",
        "name":  "Dr Althea Brightening Velvet Mask",
        "sizes":  [

                  ]
    },
    {
        "id":  "mc-mk-018",
        "brand":  "Medicube",
        "name":  "Medicube PDRN Pink Caffeine Night Wrapping Mask",
        "sizes":  [
                      "75ml"
                  ]
    },
    {
        "id":  "mc-mk-019",
        "brand":  "Medicube",
        "name":  "Medicube Deep Vita C Glutathione Brightening Mask",
        "sizes":  [

                  ]
    }
]

export const minayshMasksBatch02Products = minayshMasksBatch02ProductsCatalog.map((item) => {

  const image = '/images/products/product-placeholder.svg'

  return {

    ...item,

    tagline: item.brand,

    category: 'skinCare',

    subCategory: 'Masks',

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



// MINAYSH_SKINSUN_IMAGE_MAP_05b3f56c3a
const minayshSkinSunImages_05b3f56c3a =
{
  "mc-mk-001": "/images/products/skincare/masks/mc-mk-001.jpg",
  "mc-mk-002": "/images/products/skincare/masks/mc-mk-002.jpg",
  "mc-mk-003": "/images/products/skincare/masks/mc-mk-003.jpg",
  "mc-mk-004": "/images/products/skincare/masks/mc-mk-004.jpg",
  "mc-mk-005": "/images/products/skincare/masks/mc-mk-005.jpg",
  "mc-mk-006": "/images/products/skincare/masks/mc-mk-006.jpg",
  "mc-mk-007": "/images/products/skincare/masks/mc-mk-007.jpg",
  "mc-mk-008": "/images/products/skincare/masks/mc-mk-008.jpg",
  "mc-mk-009": "/images/products/skincare/masks/mc-mk-009.jpg",
  "mc-mk-010": "/images/products/skincare/masks/mc-mk-010.jpg",
  "mc-mk-011": "/images/products/skincare/masks/mc-mk-011.jpg",
  "mc-mk-012": "/images/products/skincare/masks/mc-mk-012.jpg",
  "mc-mk-013": "/images/products/skincare/masks/mc-mk-013.jpg",
  "mc-mk-014": "/images/products/skincare/masks/mc-mk-014.jpg",
  "mc-mk-015": "/images/products/skincare/masks/mc-mk-015.png",
  "mc-mk-016": "/images/products/skincare/masks/mc-mk-016.jpg",
  "mc-mk-017": "/images/products/skincare/masks/mc-mk-017.jpg",
  "mc-mk-018": "/images/products/skincare/masks/mc-mk-018.jpg",
  "mc-mk-019": "/images/products/skincare/masks/mc-mk-019.jpg"
};

for (const product of [maskProducts, minayshMasksBatch02Products].flatMap(items => Array.isArray(items) ? items : [])) {
  const approvedImage =
    minayshSkinSunImages_05b3f56c3a[product.id];

  if (approvedImage) {
    product.image = approvedImage;
    product.gallery = [approvedImage];
  }
}



// MINAYSH_SKINSUN_IMAGE_MAP_096d6f457e
const minayshSkinSunImages_096d6f457e =
{
  "mc-mk-001": "/images/products/skincare/masks/mc-mk-001.jpg",
  "mc-mk-002": "/images/products/skincare/masks/mc-mk-002.jpg",
  "mc-mk-003": "/images/products/skincare/masks/mc-mk-003.jpg",
  "mc-mk-004": "/images/products/skincare/masks/mc-mk-004.jpg",
  "mc-mk-005": "/images/products/skincare/masks/mc-mk-005.jpg",
  "mc-mk-006": "/images/products/skincare/masks/mc-mk-006.jpg",
  "mc-mk-007": "/images/products/skincare/masks/mc-mk-007.jpg",
  "mc-mk-008": "/images/products/skincare/masks/mc-mk-008.jpg",
  "mc-mk-009": "/images/products/skincare/masks/mc-mk-009.jpg",
  "mc-mk-010": "/images/products/skincare/masks/mc-mk-010.jpg",
  "mc-mk-011": "/images/products/skincare/masks/mc-mk-011.jpg",
  "mc-mk-012": "/images/products/skincare/masks/mc-mk-012.jpg",
  "mc-mk-013": "/images/products/skincare/masks/mc-mk-013.jpg",
  "mc-mk-014": "/images/products/skincare/masks/mc-mk-014.jpg",
  "mc-mk-015": "/images/products/skincare/masks/mc-mk-015.png",
  "mc-mk-016": "/images/products/skincare/masks/mc-mk-016.jpg",
  "mc-mk-017": "/images/products/skincare/masks/mc-mk-017.jpg",
  "mc-mk-018": "/images/products/skincare/masks/mc-mk-018.jpg",
  "mc-mk-019": "/images/products/skincare/masks/mc-mk-019.jpg"
};

for (const product of [maskProducts, minayshMasksBatch02Products].flatMap(items => Array.isArray(items) ? items : [])) {
  const approvedImage =
    minayshSkinSunImages_096d6f457e[product.id];

  if (approvedImage) {
    product.image = approvedImage;
    product.gallery = [approvedImage];
  }
}
