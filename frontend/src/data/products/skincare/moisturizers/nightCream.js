export const nightCreamProducts = []


// ============================================================
// MINAYSH_SKINCARE_BATCH_02
// Night Cream
// ============================================================

const minayshNightCreamBatch02ProductsCatalog = [
    {
        "id":  "mc-nc-001",
        "brand":  "L\u0027Oréal Paris",
        "name":  "L\u0027Oréal Paris Glycolic Bright Glowing Night Cream",
        "sizes":  [
                      "50ml"
                  ]
    }
]

export const minayshNightCreamBatch02Products = minayshNightCreamBatch02ProductsCatalog.map((item) => {

  const image = '/images/products/product-placeholder.svg'

  return {

    ...item,

    tagline: item.brand,

    category: 'skinCare',

    subCategory: 'Night Cream',

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



// MINAYSH_SKINSUN_IMAGE_MAP_021987851e
const minayshSkinSunImages_021987851e =
{
  "mc-nc-001": "/images/products/skincare/night-cream/mc-nc-001.png"
};

for (const product of [nightCreamProducts, minayshNightCreamBatch02Products].flatMap(items => Array.isArray(items) ? items : [])) {
  const approvedImage =
    minayshSkinSunImages_021987851e[product.id];

  if (approvedImage) {
    product.image = approvedImage;
    product.gallery = [approvedImage];
  }
}



// MINAYSH_SKINSUN_IMAGE_MAP_62ff78a5e8
const minayshSkinSunImages_62ff78a5e8 =
{
  "mc-nc-001": "/images/products/skincare/night-cream/mc-nc-001.png"
};

for (const product of [nightCreamProducts, minayshNightCreamBatch02Products].flatMap(items => Array.isArray(items) ? items : [])) {
  const approvedImage =
    minayshSkinSunImages_62ff78a5e8[product.id];

  if (approvedImage) {
    product.image = approvedImage;
    product.gallery = [approvedImage];
  }
}
