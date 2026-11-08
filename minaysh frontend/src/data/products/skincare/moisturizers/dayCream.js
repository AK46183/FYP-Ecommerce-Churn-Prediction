export const dayCreamProducts = []


// ============================================================
// MINAYSH_SKINCARE_BATCH_02
// Day Cream
// ============================================================

const minayshDayCreamBatch02ProductsCatalog = [
    {
        "id":  "mc-dc-001",
        "brand":  "Garnier",
        "name":  "Garnier Light Complete Fairness Cream Instant Glow",
        "sizes":  [
                      "40ml"
                  ]
    }
]

export const minayshDayCreamBatch02Products = minayshDayCreamBatch02ProductsCatalog.map((item) => {

  const image = '/images/products/product-placeholder.svg'

  return {

    ...item,

    tagline: item.brand,

    category: 'skinCare',

    subCategory: 'Day Cream',

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



// MINAYSH_SKINSUN_IMAGE_MAP_061974e04f
const minayshSkinSunImages_061974e04f =
{
  "mc-dc-001": "/images/products/skincare/day-cream/mc-dc-001.png"
};

for (const product of [dayCreamProducts, minayshDayCreamBatch02Products].flatMap(items => Array.isArray(items) ? items : [])) {
  const approvedImage =
    minayshSkinSunImages_061974e04f[product.id];

  if (approvedImage) {
    product.image = approvedImage;
    product.gallery = [approvedImage];
  }
}



// MINAYSH_SKINSUN_IMAGE_MAP_407403f288
const minayshSkinSunImages_407403f288 =
{
  "mc-dc-001": "/images/products/skincare/day-cream/mc-dc-001.png"
};

for (const product of [dayCreamProducts, minayshDayCreamBatch02Products].flatMap(items => Array.isArray(items) ? items : [])) {
  const approvedImage =
    minayshSkinSunImages_407403f288[product.id];

  if (approvedImage) {
    product.image = approvedImage;
    product.gallery = [approvedImage];
  }
}
