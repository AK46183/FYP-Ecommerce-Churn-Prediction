
// ============================================================
// MINAYSH PRODUCT CATALOG
// CATEGORY: Eyeliner
// ============================================================

const catalog = [
    {
        "id":  "el-001",
        "brand":  "ST London",
        "name":  "ST London Intense Eyeliner",
        "shades":  [

                   ]
    },
    {
        "id":  "el-002",
        "brand":  "Kryolan",
        "name":  "Kryolan Aquacolor Cake Liner",
        "shades":  [

                   ]
    },
    {
        "id":  "el-003",
        "brand":  "Revolution",
        "name":  "Revolution Dip Eyeliner",
        "shades":  [
                       "Black",
                       "White"
                   ]
    },
    {
        "id":  "el-004",
        "brand":  "Revolution",
        "name":  "Revolution Relove Slick Flick Eyeliner",
        "shades":  [
                       "Black"
                   ]
    },
    {
        "id":  "el-005",
        "brand":  "Maybelline",
        "name":  "Maybelline Tattoo Liner 48H Liquid Pen",
        "shades":  [

                   ]
    },
    {
        "id":  "el-006",
        "brand":  "Revolution",
        "name":  "Revolution Relove Kohl Eyeliner",
        "shades":  [
                       "White"
                   ]
    },
    {
        "id":  "el-007",
        "brand":  "Maybelline",
        "name":  "Maybelline Lasting Drama Gel Eyeliner",
        "shades":  [
                       "Black"
                   ]
    },
    {
        "id":  "el-008",
        "brand":  "GOSH",
        "name":  "GOSH Velvet Touch Eye Liner",
        "shades":  [

                   ]
    },
    {
        "id":  "el-009",
        "brand":  "GOSH",
        "name":  "GOSH Metal Eyes",
        "shades":  [

                   ]
    },
    {
        "id":  "el-010",
        "brand":  "GOSH",
        "name":  "GOSH Kohl/Eye Liner",
        "shades":  [

                   ]
    },
    {
        "id":  "el-011",
        "brand":  "Fundamentals",
        "name":  "Fundamentals Flick It Matte Black Eyeliner",
        "shades":  [
                       "Black"
                   ]
    },
    {
        "id":  "el-012",
        "brand":  "Lamel",
        "name":  "Lamel Long Lasting Kajal Eye Liner",
        "shades":  [
                       "404"
                   ]
    },
    {
        "id":  "el-013",
        "brand":  "GOSH",
        "name":  "GOSH Xtreme Liquid Gel Eye Liner",
        "shades":  [

                   ]
    },
    {
        "id":  "el-014",
        "brand":  "L\u0027Oréal Paris",
        "name":  "L\u0027Oréal Paris Liner Signature Liquid Eyeliner",
        "shades":  [
                       "02 Blue",
                       "04 Emeraude"
                   ]
    }
]


// Convert records into MINAYSH product objects

export const eyelinerProducts = catalog.map((product) => {

  // Temporary neutral illustration
  // Replace with the correct product image later.

  const image =
    '/images/products/product-placeholder.svg'

  return {

    ...product,

    tagline: product.brand,

    category: 'makeup',

    subCategory: 'Eyeliner',

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


// MINAYSH_EYELINER_IMAGES_14_V1

const minayshEyelinerImageMap = {
    "el-001":  "/images/products/makeup/eye/eyeliner/el-001.jpg",
    "el-002":  "/images/products/makeup/eye/eyeliner/el-002.jpg",
    "el-003":  "/images/products/makeup/eye/eyeliner/el-003.jpg",
    "el-004":  "/images/products/makeup/eye/eyeliner/el-004.jpg",
    "el-005":  "/images/products/makeup/eye/eyeliner/el-005.jpg",
    "el-006":  "/images/products/makeup/eye/eyeliner/el-006.jpg",
    "el-007":  "/images/products/makeup/eye/eyeliner/el-007.jpg",
    "el-008":  "/images/products/makeup/eye/eyeliner/el-008.jpg",
    "el-009":  "/images/products/makeup/eye/eyeliner/el-009.jpg",
    "el-010":  "/images/products/makeup/eye/eyeliner/el-010.jpg",
    "el-011":  "/images/products/makeup/eye/eyeliner/el-011.jpg",
    "el-012":  "/images/products/makeup/eye/eyeliner/el-012.jpg",
    "el-013":  "/images/products/makeup/eye/eyeliner/el-013.jpg",
    "el-014":  "/images/products/makeup/eye/eyeliner/el-014.jpg"
};

for (const product of eyelinerProducts) {

    const approvedImage =
        minayshEyelinerImageMap[product.id];

    if (approvedImage) {

        product.image = approvedImage;

        product.gallery = [approvedImage];

    }
}