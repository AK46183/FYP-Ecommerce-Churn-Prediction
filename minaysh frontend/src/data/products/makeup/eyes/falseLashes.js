
// ============================================================
// MINAYSH PRODUCT CATALOG
// CATEGORY: False Lashes
// ============================================================

const catalog = [
    {
        "id":  "fl-001",
        "brand":  "ST London",
        "name":  "ST London Eye Lashes 01 Candy",
        "shades":  [

                   ]
    },
    {
        "id":  "fl-002",
        "brand":  "ST London",
        "name":  "ST London Eye Lashes 02 Samantha",
        "shades":  [

                   ]
    },
    {
        "id":  "fl-003",
        "brand":  "ST London",
        "name":  "ST London Eye Lashes 03 Scarlet",
        "shades":  [

                   ]
    },
    {
        "id":  "fl-004",
        "brand":  "ST London",
        "name":  "ST London Eye Lashes 04 Sasha",
        "shades":  [

                   ]
    },
    {
        "id":  "fl-005",
        "brand":  "ST London",
        "name":  "ST London Eye Lashes 06 Naomi",
        "shades":  [

                   ]
    },
    {
        "id":  "fl-006",
        "brand":  "Kryolan",
        "name":  "Kryolan Eye Lash TV 1",
        "shades":  [

                   ]
    },
    {
        "id":  "fl-007",
        "brand":  "Kryolan",
        "name":  "Kryolan Eye Lash TV 6",
        "shades":  [

                   ]
    },
    {
        "id":  "fl-008",
        "brand":  "Huda Beauty",
        "name":  "Huda Beauty Classic Lash 05 Candy",
        "shades":  [

                   ]
    },
    {
        "id":  "fl-009",
        "brand":  "BBA By Suleman",
        "name":  "BBA By Suleman Eye Lashes World Tour Edition Lit",
        "shades":  [

                   ]
    },
    {
        "id":  "fl-010",
        "brand":  "BBA By Suleman",
        "name":  "BBA By Suleman Eye Lashes World Tour Edition Farasha",
        "shades":  [

                   ]
    },
    {
        "id":  "fl-011",
        "brand":  "BBA By Suleman",
        "name":  "BBA By Suleman Eye Lashes World Tour Edition Habibi",
        "shades":  [

                   ]
    },
    {
        "id":  "fl-012",
        "brand":  "BBA By Suleman",
        "name":  "BBA By Suleman Eye Lashes Miami Edition Masquerade #7",
        "shades":  [

                   ]
    },
    {
        "id":  "fl-013",
        "brand":  "BBA By Suleman",
        "name":  "BBA By Suleman Eye Lashes Miami Edition Suavey #8",
        "shades":  [

                   ]
    },
    {
        "id":  "fl-014",
        "brand":  "BBA By Suleman",
        "name":  "BBA By Suleman Eye Lashes Miami Edition Date Night #9",
        "shades":  [

                   ]
    },
    {
        "id":  "fl-015",
        "brand":  "BBA By Suleman",
        "name":  "BBA By Suleman Eye Lashes Miami Edition Esperanza #11",
        "shades":  [

                   ]
    },
    {
        "id":  "fl-016",
        "brand":  "BBA By Suleman",
        "name":  "BBA By Suleman Eye Lashes Miami Edition Senorita #12",
        "shades":  [

                   ]
    }
]


// Convert records into MINAYSH product objects

export const falseLashProducts = catalog.map((product) => {

  // Temporary neutral illustration
  // Replace with the correct product image later.

  const image =
    '/images/products/product-placeholder.svg'

  return {

    ...product,

    tagline: product.brand,

    category: 'makeup',

    subCategory: 'False Lashes',

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


// MINAYSH_FALSE_LASHES_IMAGES_16_V1

const minayshFalseLashesImageMap = {
    "fl-001":  "/images/products/makeup/eye/false-lashes/fl-001.jpg",
    "fl-002":  "/images/products/makeup/eye/false-lashes/fl-002.jpg",
    "fl-003":  "/images/products/makeup/eye/false-lashes/fl-003.jpg",
    "fl-004":  "/images/products/makeup/eye/false-lashes/fl-004.jpg",
    "fl-005":  "/images/products/makeup/eye/false-lashes/fl-005.jpg",
    "fl-006":  "/images/products/makeup/eye/false-lashes/fl-006.jpg",
    "fl-007":  "/images/products/makeup/eye/false-lashes/fl-007.jpg",
    "fl-008":  "/images/products/makeup/eye/false-lashes/fl-008.jpg",
    "fl-009":  "/images/products/makeup/eye/false-lashes/fl-009.jpg",
    "fl-010":  "/images/products/makeup/eye/false-lashes/fl-010.jpg",
    "fl-011":  "/images/products/makeup/eye/false-lashes/fl-011.jpg",
    "fl-012":  "/images/products/makeup/eye/false-lashes/fl-012.jpg",
    "fl-013":  "/images/products/makeup/eye/false-lashes/fl-013.jpg",
    "fl-014":  "/images/products/makeup/eye/false-lashes/fl-014.jpg",
    "fl-015":  "/images/products/makeup/eye/false-lashes/fl-015.jpg",
    "fl-016":  "/images/products/makeup/eye/false-lashes/fl-016.jpg"
};

for (const product of falseLashProducts) {

    const approvedImage =
        minayshFalseLashesImageMap[product.id];

    if (approvedImage) {

        product.image = approvedImage;

        product.gallery = [approvedImage];

    }
}