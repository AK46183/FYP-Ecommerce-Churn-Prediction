
// ============================================================
// MINAYSH PRODUCT CATALOG
// CATEGORY: Mascara
// ============================================================

const catalog = [
    {
        "id":  "em-001",
        "brand":  "ST London",
        "name":  "ST London Life Proof Volumizing Mascara",
        "shades":  [

                   ]
    },
    {
        "id":  "em-002",
        "brand":  "ST London",
        "name":  "ST London 3D Billion Mascara",
        "shades":  [

                   ]
    },
    {
        "id":  "em-003",
        "brand":  "ST London",
        "name":  "ST London Curve Obsession Mascara",
        "shades":  [

                   ]
    },
    {
        "id":  "em-004",
        "brand":  "Maybelline",
        "name":  "Maybelline Volum\u0027 Express The Colossal Waterproof Mascara",
        "shades":  [

                   ]
    },
    {
        "id":  "em-005",
        "brand":  "Maybelline",
        "name":  "Maybelline Lash Sensational Firework Waterproof Mascara",
        "shades":  [

                   ]
    },
    {
        "id":  "em-006",
        "brand":  "Essence",
        "name":  "Essence Lash Princess Volume Mascara",
        "shades":  [

                   ]
    },
    {
        "id":  "em-007",
        "brand":  "Essence",
        "name":  "Essence I Love Extreme Volume Waterproof Mascara",
        "shades":  [

                   ]
    },
    {
        "id":  "em-008",
        "brand":  "Essence",
        "name":  "Essence Lash Princess False Lash Effect Waterproof Mascara",
        "shades":  [

                   ]
    },
    {
        "id":  "em-009",
        "brand":  "Essence",
        "name":  "Essence Get Big Lashes Volume Boost Waterproof Mascara",
        "shades":  [

                   ]
    },
    {
        "id":  "em-010",
        "brand":  "Essence",
        "name":  "Essence Get Big Lashes Volume Curl Mascara",
        "shades":  [

                   ]
    },
    {
        "id":  "em-011",
        "brand":  "Revolution",
        "name":  "Revolution Relove Power Lash Volume Mascara",
        "shades":  [

                   ]
    },
    {
        "id":  "em-012",
        "brand":  "Revolution",
        "name":  "Revolution Relove Power Lash Waterproof Volume Mascara",
        "shades":  [

                   ]
    },
    {
        "id":  "em-013",
        "brand":  "Revolution",
        "name":  "Revolution Relove Long Lash Lengthening Mascara",
        "shades":  [

                   ]
    },
    {
        "id":  "em-014",
        "brand":  "GOSH",
        "name":  "GOSH Boombastic Crazy Mascara",
        "shades":  [
                       "001"
                   ]
    },
    {
        "id":  "em-015",
        "brand":  "GOSH",
        "name":  "GOSH Waterproof Volume Mascara",
        "shades":  [
                       "Black"
                   ]
    },
    {
        "id":  "em-016",
        "brand":  "BOB",
        "name":  "BOB Extreme Curl Mascara",
        "shades":  [

                   ]
    }
]


// Convert records into MINAYSH product objects

export const mascaraProducts = catalog.map((product) => {

  // Temporary neutral illustration
  // Replace with the correct product image later.

  const image =
    '/images/products/product-placeholder.svg'

  return {

    ...product,

    tagline: product.brand,

    category: 'makeup',

    subCategory: 'Mascara',

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


// MINAYSH_MASCARA_IMAGES_16_V1

const minayshMascaraImageMap = {
    "em-001":  "/images/products/makeup/eye/mascara/em-001.jpg",
    "em-002":  "/images/products/makeup/eye/mascara/em-002.jpg",
    "em-003":  "/images/products/makeup/eye/mascara/em-003.jpg",
    "em-004":  "/images/products/makeup/eye/mascara/em-004.png",
    "em-005":  "/images/products/makeup/eye/mascara/em-005.jpg",
    "em-006":  "/images/products/makeup/eye/mascara/em-006.jpg",
    "em-007":  "/images/products/makeup/eye/mascara/em-007.jpg",
    "em-008":  "/images/products/makeup/eye/mascara/em-008.jpg",
    "em-009":  "/images/products/makeup/eye/mascara/em-009.jpg",
    "em-010":  "/images/products/makeup/eye/mascara/em-010.jpg",
    "em-011":  "/images/products/makeup/eye/mascara/em-011.jpg",
    "em-012":  "/images/products/makeup/eye/mascara/em-012.jpg",
    "em-013":  "/images/products/makeup/eye/mascara/em-013.jpg",
    "em-014":  "/images/products/makeup/eye/mascara/em-014.jpg",
    "em-015":  "/images/products/makeup/eye/mascara/em-015.jpg",
    "em-016":  "/images/products/makeup/eye/mascara/em-016.png"
};

for (const product of mascaraProducts) {

    const approvedImage =
        minayshMascaraImageMap[product.id];

    if (approvedImage) {

        product.image = approvedImage;

        product.gallery = [approvedImage];

    }
}