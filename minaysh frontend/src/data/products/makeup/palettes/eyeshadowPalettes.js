
// ============================================================
// MINAYSH PRODUCT CATALOG
// CATEGORY: Eyeshadow Palettes
// ============================================================

const catalog = [
    {
        "id":  "ep-001",
        "brand":  "Revolution",
        "name":  "Revolution Reloaded Palette Velvet Rose",
        "shades":  [

                   ]
    },
    {
        "id":  "ep-002",
        "brand":  "Revolution",
        "name":  "Revolution Reloaded Palette Affection",
        "shades":  [

                   ]
    },
    {
        "id":  "ep-003",
        "brand":  "Revolution",
        "name":  "Revolution Reloaded Palette Newtrals 2",
        "shades":  [

                   ]
    },
    {
        "id":  "ep-004",
        "brand":  "Revolution",
        "name":  "Revolution Reloaded Palette Iconic Fever",
        "shades":  [

                   ]
    },
    {
        "id":  "ep-005",
        "brand":  "Revolution",
        "name":  "Revolution Forever Flawless Allure Eyeshadow Palette",
        "shades":  [

                   ]
    },
    {
        "id":  "ep-006",
        "brand":  "Revolution",
        "name":  "Revolution Maxi Reloaded Eyeshadow Palette Nudes",
        "shades":  [

                   ]
    },
    {
        "id":  "ep-007",
        "brand":  "GOSH",
        "name":  "GOSH Smokey Eyes Palette",
        "shades":  [

                   ]
    }
]


// Convert records into MINAYSH product objects

export const eyeshadowPaletteProducts = catalog.map((product) => {

  // Temporary neutral illustration
  // Replace with the correct product image later.

  const image =
    '/images/products/product-placeholder.svg'

  return {

    ...product,

    tagline: product.brand,

    category: 'makeup',

    subCategory: 'Eyeshadow Palettes',

    // Missing prices must be completed before checkout.

    price: null,

    oldPrice: null,

    currency: 'PKR',

    rating: 0,

    reviews: 0,

    badge: 'COMING SOON',

    image,

    gallery: [image],

    description:
      `${product.name}. Product details will be added soon.`,

    benefits: [],

    howToUse: '',

    ingredients: '',

    draft: true,

    available: false,

  }

})


// MINAYSH_EYESHADOW_PALETTES_07_V1

const minayshPaletteImageMap = {
    "ep-001":  "/images/products/makeup/eye/eyeshadow-palettes/ep-001.jpg",
    "ep-002":  "/images/products/makeup/eye/eyeshadow-palettes/ep-002.jpg",
    "ep-003":  "/images/products/makeup/eye/eyeshadow-palettes/ep-003.jpg",
    "ep-004":  "/images/products/makeup/eye/eyeshadow-palettes/ep-004.jpg",
    "ep-005":  "/images/products/makeup/eye/eyeshadow-palettes/ep-005.jpg",
    "ep-006":  "/images/products/makeup/eye/eyeshadow-palettes/ep-006.jpg",
    "ep-007":  "/images/products/makeup/eye/eyeshadow-palettes/ep-007.jpg"
};

for (const product of eyeshadowPaletteProducts) {

    const approvedImage =
        minayshPaletteImageMap[product.id];

    if (approvedImage) {

        product.image = approvedImage;

        product.gallery = [approvedImage];

    }
}