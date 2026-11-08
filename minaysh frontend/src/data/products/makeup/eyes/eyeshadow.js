
// ============================================================
// MINAYSH PRODUCT CATALOG
// CATEGORY: Eye Shadows
// ============================================================

const catalog = [
    {
        "id":  "es-001",
        "brand":  "ST London",
        "name":  "ST London Eyematic Creamy Eye Shadow",
        "shades":  [

                   ]
    },
    {
        "id":  "es-002",
        "brand":  "ST London",
        "name":  "ST London 3D Lights Eye Shadow",
        "shades":  [

                   ]
    },
    {
        "id":  "es-003",
        "brand":  "Kryolan",
        "name":  "Kryolan Aquacolor Interferenz",
        "shades":  [

                   ]
    },
    {
        "id":  "es-004",
        "brand":  "ST London",
        "name":  "ST London Dual Wet \u0026 Dry Eye Shadow",
        "shades":  [

                   ]
    },
    {
        "id":  "es-005",
        "brand":  "ST London",
        "name":  "ST London Glam \u0026 Shine Shimmer Eye Shadow",
        "shades":  [

                   ]
    },
    {
        "id":  "es-006",
        "brand":  "Femina",
        "name":  "Femina Eye Shadow",
        "shades":  [

                   ]
    },
    {
        "id":  "es-007",
        "brand":  "Kryolan",
        "name":  "Kryolan Satin Powder",
        "shades":  [

                   ]
    },
    {
        "id":  "es-008",
        "brand":  "Kryolan",
        "name":  "Kryolan Polyester Glimmer",
        "shades":  [

                   ]
    },
    {
        "id":  "es-009",
        "brand":  "Kryolan",
        "name":  "Kryolan Eye Shadow Matt",
        "shades":  [

                   ]
    },
    {
        "id":  "es-010",
        "brand":  "Kryolan",
        "name":  "Kryolan Glamour Sparks",
        "shades":  [

                   ]
    }
]


// Convert records into MINAYSH product objects

export const eyeshadowProducts = catalog.map((product) => {

  // Temporary neutral illustration
  // Replace with the correct product image later.

  const image =
    '/images/products/product-placeholder.svg'

  return {

    ...product,

    tagline: product.brand,

    category: 'makeup',

    subCategory: 'Eyeshadow',

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


// MINAYSH_EYESHADOW_IMAGES_10_V2

const minayshEyeshadowImageMap = {
    "es-001":  "/images/products/makeup/eye/eyeshadow/es-001.jpg",
    "es-002":  "/images/products/makeup/eye/eyeshadow/es-002.jpg",
    "es-003":  "/images/products/makeup/eye/eyeshadow/es-003.jpg",
    "es-004":  "/images/products/makeup/eye/eyeshadow/es-004.jpg",
    "es-005":  "/images/products/makeup/eye/eyeshadow/es-005.jpg",
    "es-006":  "/images/products/makeup/eye/eyeshadow/es-006.jpg",
    "es-007":  "/images/products/makeup/eye/eyeshadow/es-007.jpg",
    "es-008":  "/images/products/makeup/eye/eyeshadow/es-008.jpg",
    "es-009":  "/images/products/makeup/eye/eyeshadow/es-009.jpg",
    "es-010":  "/images/products/makeup/eye/eyeshadow/es-010.jpg"
};

for (const product of eyeshadowProducts) {

    const approvedImage =
        minayshEyeshadowImageMap[product.id];

    if (approvedImage) {

        product.image = approvedImage;

        product.gallery = [approvedImage];

    }
}