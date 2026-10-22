// ============================================================
// MINAYSH_SUNCARE_MC_20260924
// Makeup City verified Sunscreen reference batch
// ============================================================

const makeupCitySunCareCatalog = [
    {
        "id":  "sun-001",
        "brand":  "Beauty Of Joseon",
        "name":  "Relief Sun Rice + Probiotics SPF50",
        "size":  "50ml",
        "marketPrice":  3900,
        "marketOldPrice":  5200
    },
    {
        "id":  "sun-002",
        "brand":  "Beauty Of Joseon",
        "name":  "Aqua Relief Sunscreen",
        "size":  "50ml",
        "marketPrice":  3975,
        "marketOldPrice":  5300
    },
    {
        "id":  "sun-003",
        "brand":  "Garnier",
        "name":  "Bright Complete Vitamin C Super UV Matte Sunscreen SPF50+",
        "size":  "30ml",
        "marketPrice":  1895,
        "marketOldPrice":  2229
    },
    {
        "id":  "sun-004",
        "brand":  "Estelin",
        "name":  "Multi-Defense Tinted Sunscreen SPF100",
        "size":  "100g",
        "marketPrice":  1039,
        "marketOldPrice":  1299
    },
    {
        "id":  "sun-005",
        "brand":  "Estelin",
        "name":  "Multi-Defense Tinted Sunscreen SPF70",
        "size":  "50g",
        "marketPrice":  879,
        "marketOldPrice":  1099
    },
    {
        "id":  "sun-006",
        "brand":  "Oneskin",
        "name":  "Super Glow Mineral SPF 50++",
        "size":  "",
        "marketPrice":  1550,
        "marketOldPrice":  null
    },
    {
        "id":  "sun-007",
        "brand":  "Skin1004",
        "name":  "Madagascar Centella Hyalu-Cica Silky-Fit Sun Stick SPF 50+ PA++++",
        "size":  "20g",
        "marketPrice":  5100,
        "marketOldPrice":  6800
    },
    {
        "id":  "sun-008",
        "brand":  "Oneskin",
        "name":  "Clear Guard Gel SPF 50++",
        "size":  "",
        "marketPrice":  1750,
        "marketOldPrice":  null
    },
    {
        "id":  "sun-009",
        "brand":  "Estelin",
        "name":  "Ultra-Light Hydrating Invisible Sunscreen SPF50",
        "size":  "50g",
        "marketPrice":  879,
        "marketOldPrice":  1099
    },
    {
        "id":  "sun-010",
        "brand":  "Fundamentals",
        "name":  "Sunsational Tinted Sunblock with SPF 50",
        "size":  "",
        "marketPrice":  1299,
        "marketOldPrice":  null
    },
    {
        "id":  "sun-011",
        "brand":  "AXIS-Y",
        "name":  "Complete No-Stress Physical Sunscreen",
        "size":  "50ml",
        "marketPrice":  5100,
        "marketOldPrice":  6800
    },
    {
        "id":  "sun-012",
        "brand":  "La Roche Posay",
        "name":  "Anthelios Uvmine Sunscreen SPF50",
        "size":  "50ml",
        "marketPrice":  11550,
        "marketOldPrice":  null
    },
    {
        "id":  "sun-013",
        "brand":  "Skin1004",
        "name":  "Centella Water Fit Sun-Serum",
        "size":  "50ml",
        "marketPrice":  3975,
        "marketOldPrice":  5300
    },
    {
        "id":  "sun-014",
        "brand":  "Medicube",
        "name":  "Collagen Firming Sun Cream",
        "size":  "50ml",
        "marketPrice":  5025,
        "marketOldPrice":  6700
    },
    {
        "id":  "sun-015",
        "brand":  "Neutrogena",
        "name":  "Ultra Sheer Dry-Touch Sunscreen SPF 70",
        "size":  "88ml",
        "marketPrice":  4350,
        "marketOldPrice":  5800
    },
    {
        "id":  "sun-016",
        "brand":  "BBA By Suleman",
        "name":  "Vitamin C \u0026 E Sunscreen SPF 50+ PA++++",
        "size":  "50ml",
        "marketPrice":  740,
        "marketOldPrice":  null
    },
    {
        "id":  "sun-017",
        "brand":  "Beauty Of Joseon",
        "name":  "Ginseng Moist Sun Serum SPF 50+ PA++++",
        "size":  "",
        "marketPrice":  4200,
        "marketOldPrice":  5600
    },
    {
        "id":  "sun-018",
        "brand":  "Cosrx",
        "name":  "Invisible Sunscreen SPF50",
        "size":  "50ml",
        "marketPrice":  4200,
        "marketOldPrice":  5600
    },
    {
        "id":  "sun-019",
        "brand":  "Neutrogena",
        "name":  "Ultra Sheer Dry-Touch Sunscreen SPF 55",
        "size":  "88ml",
        "marketPrice":  4350,
        "marketOldPrice":  5800
    },
    {
        "id":  "sun-020",
        "brand":  "Tocobo",
        "name":  "Cica Cooling Sunstick SPF50",
        "size":  "18g",
        "marketPrice":  4800,
        "marketOldPrice":  6400
    },
    {
        "id":  "sun-021",
        "brand":  "Bioaqua",
        "name":  "Full Band Sun Protection Lightweight Moisturizing Sunscreen SPF50+ PA+++",
        "size":  "",
        "marketPrice":  776,
        "marketOldPrice":  1035
    },
    {
        "id":  "sun-022",
        "brand":  "Tocobo",
        "name":  "Cotton Soft Sunstick SPF50",
        "size":  "19g",
        "marketPrice":  4800,
        "marketOldPrice":  6400
    },
    {
        "id":  "sun-023",
        "brand":  "Medicube",
        "name":  "Zero Pore Moisture Sun Serum SPF 50+ PA++++",
        "size":  "50ml",
        "marketPrice":  4050,
        "marketOldPrice":  5400
    },
    {
        "id":  "sun-024",
        "brand":  "Tocobo",
        "name":  "Bio Watery Sun Cream SPF50",
        "size":  "50ml",
        "marketPrice":  4500,
        "marketOldPrice":  6000
    }
]

export const makeupCitySunCareProducts =
  makeupCitySunCareCatalog.map((item) => {

    const image =
      '/images/products/product-placeholder.svg'

    const sizes = item.size
      ? [item.size]
      : []

    return {

      id: item.id,

      brand: item.brand,

      name: item.name,

      tagline:
        `${item.brand} sun protection`,

      category: 'sunCare',

      // Generic sunscreen classification.
      // Current MINAYSH Face SPF route also accepts Sunscreen.
      subCategory: 'Sunscreen',

      // Current market reference snapshot.
      // Backend automatic pricing can replace these later.
      price: item.marketPrice,

      oldPrice: item.marketOldPrice,

      currency: 'PKR',

      priceSource: 'Makeup City Pakistan',

      priceSourceUrl:
        'https://www.makeupcityshop.com/collections/sunscreen',

      priceCheckedAt: '2026-09-24',

      pricingMode: 'market-reference-snapshot',

      rating: 0,

      reviews: 0,

      badge:
        item.marketOldPrice &&
        item.marketOldPrice > item.marketPrice
          ? 'SALE'
          : null,

      image,

      gallery: [image],

      shades: [],

      sizes,

      variants: sizes.map(
        (size, index) => ({

          sku:
            `${item.id}-${String(index + 1).padStart(2, '0')}`,

          size,

          shade: null,

          price: item.marketPrice,

          stock: null,

        })
      ),

      description:
        `${item.name}. Product information and imagery will be completed after final catalog verification.`,

      benefits: [],

      howToUse: '',

      ingredients: '',

      // Visible for frontend development,
      // but do not treat Makeup City stock as MINAYSH stock.
      draft: true,

      available: false,

    }

  })



// MINAYSH_SKINSUN_IMAGE_MAP_0854c9f730
const minayshSkinSunImages_0854c9f730 =
{
  "sun-001": "/images/products/suncare/sunscreen/sun-001.jpg",
  "sun-002": "/images/products/suncare/sunscreen/sun-002.jpg",
  "sun-003": "/images/products/suncare/sunscreen/sun-003.png",
  "sun-004": "/images/products/suncare/sunscreen/sun-004.jpg",
  "sun-005": "/images/products/suncare/sunscreen/sun-005.jpg",
  "sun-006": "/images/products/suncare/sunscreen/sun-006.jpg",
  "sun-008": "/images/products/suncare/sunscreen/sun-008.jpg",
  "sun-009": "/images/products/suncare/sunscreen/sun-009.jpg",
  "sun-010": "/images/products/suncare/sunscreen/sun-010.jpg",
  "sun-011": "/images/products/suncare/sunscreen/sun-011.jpg",
  "sun-012": "/images/products/suncare/sunscreen/sun-012.jpg",
  "sun-013": "/images/products/suncare/sunscreen/sun-013.jpg",
  "sun-014": "/images/products/suncare/sunscreen/sun-014.jpg",
  "sun-015": "/images/products/suncare/sunscreen/sun-015.jpg",
  "sun-016": "/images/products/suncare/sunscreen/sun-016.jpg",
  "sun-017": "/images/products/suncare/sunscreen/sun-017.jpg",
  "sun-018": "/images/products/suncare/sunscreen/sun-018.jpg",
  "sun-019": "/images/products/suncare/sunscreen/sun-019.jpg",
  "sun-020": "/images/products/suncare/sunscreen/sun-020.jpg",
  "sun-022": "/images/products/suncare/sunscreen/sun-022.jpg",
  "sun-023": "/images/products/suncare/sunscreen/sun-023.jpg",
  "sun-024": "/images/products/suncare/sunscreen/sun-024.jpg"
};

for (const product of [makeupCitySunCareProducts].flatMap(items => Array.isArray(items) ? items : [])) {
  const approvedImage =
    minayshSkinSunImages_0854c9f730[product.id];

  if (approvedImage) {
    product.image = approvedImage;
    product.gallery = [approvedImage];
  }
}



// MINAYSH_SKINSUN_IMAGE_MAP_80acebdeb5
const minayshSkinSunImages_80acebdeb5 =
{
  "sun-001": "/images/products/suncare/sunscreen/sun-001.jpg",
  "sun-002": "/images/products/suncare/sunscreen/sun-002.jpg",
  "sun-003": "/images/products/suncare/sunscreen/sun-003.png",
  "sun-004": "/images/products/suncare/sunscreen/sun-004.jpg",
  "sun-005": "/images/products/suncare/sunscreen/sun-005.jpg",
  "sun-006": "/images/products/suncare/sunscreen/sun-006.jpg",
  "sun-007": "/images/products/suncare/sunscreen/sun-007.jpg",
  "sun-008": "/images/products/suncare/sunscreen/sun-008.jpg",
  "sun-009": "/images/products/suncare/sunscreen/sun-009.jpg",
  "sun-010": "/images/products/suncare/sunscreen/sun-010.jpg",
  "sun-011": "/images/products/suncare/sunscreen/sun-011.jpg",
  "sun-012": "/images/products/suncare/sunscreen/sun-012.jpg",
  "sun-013": "/images/products/suncare/sunscreen/sun-013.jpg",
  "sun-014": "/images/products/suncare/sunscreen/sun-014.jpg",
  "sun-015": "/images/products/suncare/sunscreen/sun-015.jpg",
  "sun-016": "/images/products/suncare/sunscreen/sun-016.jpg",
  "sun-017": "/images/products/suncare/sunscreen/sun-017.jpg",
  "sun-018": "/images/products/suncare/sunscreen/sun-018.jpg",
  "sun-019": "/images/products/suncare/sunscreen/sun-019.jpg",
  "sun-020": "/images/products/suncare/sunscreen/sun-020.jpg",
  "sun-021": "/images/products/suncare/sunscreen/sun-021.jpg",
  "sun-022": "/images/products/suncare/sunscreen/sun-022.jpg",
  "sun-023": "/images/products/suncare/sunscreen/sun-023.jpg",
  "sun-024": "/images/products/suncare/sunscreen/sun-024.jpg"
};

for (const product of [makeupCitySunCareProducts].flatMap(items => Array.isArray(items) ? items : [])) {
  const approvedImage =
    minayshSkinSunImages_80acebdeb5[product.id];

  if (approvedImage) {
    product.image = approvedImage;
    product.gallery = [approvedImage];
  }
}
