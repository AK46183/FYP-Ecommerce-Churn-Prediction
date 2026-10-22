
// ============================================================
// MINAYSH PRODUCT CATALOG
// CATEGORY: Brow Products
// ============================================================

const catalog = [
    {
        "id":  "br-001",
        "brand":  "Revolution",
        "name":  "Revolution Relove Power Brow Pencil",
        "shades":  [
                       "Dark Brown",
                       "Brown"
                   ]
    },
    {
        "id":  "br-002",
        "brand":  "Revolution",
        "name":  "Revolution Relove Blade Brow Pencil",
        "shades":  [
                       "Dark Brown"
                   ]
    },
    {
        "id":  "br-003",
        "brand":  "Lamel",
        "name":  "Lamel Lamination Brow \u0026 Lash Gel",
        "shades":  [
                       "401"
                   ]
    },
    {
        "id":  "br-004",
        "brand":  "Lamel",
        "name":  "Lamel Brow Lifting Wax",
        "shades":  [
                       "401"
                   ]
    },
    {
        "id":  "br-005",
        "brand":  "Revolution",
        "name":  "Revolution Brow Sculpt Kit",
        "shades":  [
                       "Dark",
                       "Medium"
                   ]
    },
    {
        "id":  "br-006",
        "brand":  "GOSH",
        "name":  "GOSH Brow Shape \u0026 Fill",
        "shades":  [

                   ]
    },
    {
        "id":  "br-007",
        "brand":  "Essence",
        "name":  "Essence Eyebrow Designer",
        "shades":  [
                       "11"
                   ]
    },
    {
        "id":  "br-008",
        "brand":  "Lamel",
        "name":  "Lamel INSTA Micro Brow Pencil",
        "shades":  [
                       "403"
                   ]
    },
    {
        "id":  "br-009",
        "brand":  "ST London",
        "name":  "ST London Eye Brow Pencil",
        "shades":  [
                       "Black Brown"
                   ]
    },
    {
        "id":  "br-010",
        "brand":  "Lamel",
        "name":  "Lamel Liquid Brow Soap",
        "shades":  [
                       "401"
                   ]
    },
    {
        "id":  "br-011",
        "brand":  "BBA By Suleman",
        "name":  "BBA By Suleman 24K Gold \u0026 Roses V.02 Eyebrow Pencil",
        "shades":  [
                       "Coffee Brown",
                       "Charcoal",
                       "Chocolate Brown"
                   ]
    },
    {
        "id":  "br-012",
        "brand":  "Miss Rose",
        "name":  "Miss Rose 2In1 Eyebrow Pencil \u0026 Brush",
        "shades":  [

                   ]
    },
    {
        "id":  "br-013",
        "brand":  "Trouble Maker",
        "name":  "Trouble Maker Brat Brow Kit",
        "shades":  [
                       "Dark Brown"
                   ]
    },
    {
        "id":  "br-014",
        "brand":  "Essence",
        "name":  "Essence Thick \u0026 Wow! Fixing Brow Mascara",
        "shades":  [
                       "01"
                   ]
    },
    {
        "id":  "br-015",
        "brand":  "Trouble Maker",
        "name":  "Trouble Maker Feral Brow Glue",
        "shades":  [
                       "Clear"
                   ]
    }
]


// Convert records into MINAYSH product objects

export const browProducts = catalog.map((product) => {

  // Temporary neutral illustration
  // Replace with the correct product image later.

  const image =
    '/images/products/product-placeholder.svg'

  return {

    ...product,

    tagline: product.brand,

    category: 'makeup',

    subCategory: 'Brow Products',

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


// MINAYSH_BROW_IMAGES_15_V1

const minayshBrowImageMap = {
    "br-001":  "/images/products/makeup/eye/brow-products/br-001.jpg",
    "br-002":  "/images/products/makeup/eye/brow-products/br-002.jpg",
    "br-003":  "/images/products/makeup/eye/brow-products/br-003.jpg",
    "br-004":  "/images/products/makeup/eye/brow-products/br-004.jpg",
    "br-005":  "/images/products/makeup/eye/brow-products/br-005.png",
    "br-006":  "/images/products/makeup/eye/brow-products/br-006.jpg",
    "br-007":  "/images/products/makeup/eye/brow-products/br-007.jpg",
    "br-008":  "/images/products/makeup/eye/brow-products/br-008.jpg",
    "br-009":  "/images/products/makeup/eye/brow-products/br-009.jpg",
    "br-010":  "/images/products/makeup/eye/brow-products/br-010.png",
    "br-011":  "/images/products/makeup/eye/brow-products/br-011.jpg",
    "br-012":  "/images/products/makeup/eye/brow-products/br-012.png",
    "br-013":  "/images/products/makeup/eye/brow-products/br-013.jpg",
    "br-014":  "/images/products/makeup/eye/brow-products/br-014.jpg",
    "br-015":  "/images/products/makeup/eye/brow-products/br-015.jpg"
};

for (const product of browProducts) {

    const approvedImage =
        minayshBrowImageMap[product.id];

    if (approvedImage) {

        product.image = approvedImage;

        product.gallery = [approvedImage];

    }
}