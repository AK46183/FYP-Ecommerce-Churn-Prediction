export const eyeCareProducts = []


// ============================================================
// MINAYSH_SKINCARE_BATCH_02
// Eye Care
// ============================================================

const minayshEyeCareBatch02ProductsCatalog = [
    {
        "id":  "mc-ec-001",
        "brand":  "K-Secret",
        "name":  "K-Secret Seoul 1988 Eye Cream Retinal Liposome 4% + Fermented Bean",
        "sizes":  [
                      "30ml"
                  ]
    },
    {
        "id":  "mc-ec-002",
        "brand":  "Janssen",
        "name":  "Janssen Eye Flash Fluid",
        "sizes":  [
                      "7 x 1.5ml"
                  ]
    },
    {
        "id":  "mc-ec-003",
        "brand":  "Beauty of Joseon",
        "name":  "Beauty of Joseon Revive Eye Serum + Retinal",
        "sizes":  [

                  ]
    },
    {
        "id":  "mc-ec-004",
        "brand":  "AXIS-Y",
        "name":  "AXIS-Y Collagen Eye Cream",
        "sizes":  [

                  ]
    },
    {
        "id":  "mc-ec-005",
        "brand":  "Medicube",
        "name":  "Medicube PDRN Pink Peptide Eye Cream",
        "sizes":  [
                      "30ml"
                  ]
    },
    {
        "id":  "mc-ec-006",
        "brand":  "COSRX",
        "name":  "COSRX Peptide Eye Cream",
        "sizes":  [
                      "25ml"
                  ]
    },
    {
        "id":  "mc-ec-007",
        "brand":  "Dr Rashel",
        "name":  "Dr Rashel Retinol Night Repair Eye Cream",
        "sizes":  [
                      "30g"
                  ]
    },
    {
        "id":  "mc-ec-008",
        "brand":  "CeraVe",
        "name":  "CeraVe Skin Renewing Vitamin C Eye Cream",
        "sizes":  [
                      "15ml"
                  ]
    },
    {
        "id":  "mc-ec-009",
        "brand":  "Dr Althea",
        "name":  "Dr Althea To Be Youthful Eye Serum",
        "sizes":  [
                      "25ml"
                  ]
    },
    {
        "id":  "mc-ec-010",
        "brand":  "Arencia",
        "name":  "Arencia Retinal Boosting Eye Mask",
        "sizes":  [
                      "60"
                  ]
    },
    {
        "id":  "mc-ec-011",
        "brand":  "Celimax",
        "name":  "Celimax Noni Ultimate Eye Cream",
        "sizes":  [
                      "20ml"
                  ]
    },
    {
        "id":  "mc-ec-012",
        "brand":  "Essence",
        "name":  "Essence Queen of Fantasy Eye Patches",
        "sizes":  [
                      "01"
                  ]
    },
    {
        "id":  "mc-ec-013",
        "brand":  "Essence",
        "name":  "Essence Queen of Magic Eye Patches",
        "sizes":  [
                      "01"
                  ]
    },
    {
        "id":  "mc-ec-014",
        "brand":  "Dr Althea",
        "name":  "Dr Althea Retinol Flat Iron Eye Roller",
        "sizes":  [
                      "25ml"
                  ]
    },
    {
        "id":  "mc-ec-015",
        "brand":  "Rederm",
        "name":  "Rederm Eyeconic Serum",
        "sizes":  [
                      "20ml"
                  ]
    },
    {
        "id":  "mc-ec-016",
        "brand":  "Heimish",
        "name":  "Heimish RX Retinol Bakuchiol Hydrogel Eye Patch",
        "sizes":  [
                      "60ea"
                  ]
    },
    {
        "id":  "mc-ec-017",
        "brand":  "The Ordinary",
        "name":  "The Ordinary Caffeine Solution 5% + EGCG",
        "sizes":  [
                      "30ml"
                  ]
    }
]

export const minayshEyeCareBatch02Products = minayshEyeCareBatch02ProductsCatalog.map((item) => {

  const image = '/images/products/product-placeholder.svg'

  return {

    ...item,

    tagline: item.brand,

    category: 'skinCare',

    subCategory: 'Eye Care',

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



// MINAYSH_SKINSUN_IMAGE_MAP_9d54f4733c
const minayshSkinSunImages_9d54f4733c =
{
  "mc-ec-001": "/images/products/skincare/eye-care/mc-ec-001.jpg",
  "mc-ec-002": "/images/products/skincare/eye-care/mc-ec-002.jpg",
  "mc-ec-004": "/images/products/skincare/eye-care/mc-ec-004.jpg",
  "mc-ec-005": "/images/products/skincare/eye-care/mc-ec-005.jpg",
  "mc-ec-006": "/images/products/skincare/eye-care/mc-ec-006.jpg",
  "mc-ec-007": "/images/products/skincare/eye-care/mc-ec-007.jpg",
  "mc-ec-008": "/images/products/skincare/eye-care/mc-ec-008.jpg",
  "mc-ec-009": "/images/products/skincare/eye-care/mc-ec-009.jpg",
  "mc-ec-010": "/images/products/skincare/eye-care/mc-ec-010.jpg",
  "mc-ec-011": "/images/products/skincare/eye-care/mc-ec-011.jpg",
  "mc-ec-013": "/images/products/skincare/eye-care/mc-ec-013.jpg",
  "mc-ec-014": "/images/products/skincare/eye-care/mc-ec-014.jpg",
  "mc-ec-015": "/images/products/skincare/eye-care/mc-ec-015.png",
  "mc-ec-016": "/images/products/skincare/eye-care/mc-ec-016.jpg"
};

for (const product of [eyeCareProducts, minayshEyeCareBatch02Products].flatMap(items => Array.isArray(items) ? items : [])) {
  const approvedImage =
    minayshSkinSunImages_9d54f4733c[product.id];

  if (approvedImage) {
    product.image = approvedImage;
    product.gallery = [approvedImage];
  }
}



// MINAYSH_SKINSUN_IMAGE_MAP_3102b32da5
const minayshSkinSunImages_3102b32da5 =
{
  "mc-ec-001": "/images/products/skincare/eye-care/mc-ec-001.jpg",
  "mc-ec-002": "/images/products/skincare/eye-care/mc-ec-002.jpg",
  "mc-ec-003": "/images/products/skincare/eye-care/mc-ec-003.jpg",
  "mc-ec-004": "/images/products/skincare/eye-care/mc-ec-004.jpg",
  "mc-ec-005": "/images/products/skincare/eye-care/mc-ec-005.jpg",
  "mc-ec-006": "/images/products/skincare/eye-care/mc-ec-006.jpg",
  "mc-ec-007": "/images/products/skincare/eye-care/mc-ec-007.jpg",
  "mc-ec-008": "/images/products/skincare/eye-care/mc-ec-008.jpg",
  "mc-ec-009": "/images/products/skincare/eye-care/mc-ec-009.jpg",
  "mc-ec-010": "/images/products/skincare/eye-care/mc-ec-010.jpg",
  "mc-ec-011": "/images/products/skincare/eye-care/mc-ec-011.jpg",
  "mc-ec-012": "/images/products/skincare/eye-care/mc-ec-012.png",
  "mc-ec-013": "/images/products/skincare/eye-care/mc-ec-013.jpg",
  "mc-ec-014": "/images/products/skincare/eye-care/mc-ec-014.jpg",
  "mc-ec-015": "/images/products/skincare/eye-care/mc-ec-015.png",
  "mc-ec-016": "/images/products/skincare/eye-care/mc-ec-016.jpg",
  "mc-ec-017": "/images/products/skincare/eye-care/mc-ec-017.jpg"
};

for (const product of [eyeCareProducts, minayshEyeCareBatch02Products].flatMap(items => Array.isArray(items) ? items : [])) {
  const approvedImage =
    minayshSkinSunImages_3102b32da5[product.id];

  if (approvedImage) {
    product.image = approvedImage;
    product.gallery = [approvedImage];
  }
}
