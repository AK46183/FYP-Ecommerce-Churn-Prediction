
import {useEffect , useMemo, useState } from 'react'
import {
  useLocation,
  useSearchParams,
} from 'react-router-dom'

import { SlidersHorizontal, X } from 'lucide-react'

import PageHeader from '../../components/common/PageHeader.jsx'
import ProductCard from '../../components/products/ProductCard.jsx'

import { allProducts } from '../../data/products.js'

import {
  primaryNav,
  megaMenu,
} from '../../data/navigation.js'

import './ProductListing.css'


// ==========================================
// MINAYSH - SORT OPTIONS
// ==========================================

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'bestselling', label: 'Best Selling' },
  { value: 'rating', label: 'Rating' },
]


// ==========================================
// NORMALIZE CATEGORY NAMES
//
// Handles:
// skinCare / skincare
// Foundations / foundations
// ==========================================

function normalize(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, ' ')
}


// ==========================================
// URL TO PRODUCT SUBCATEGORY MAPPING
//
// IMPORTANT:
// These labels match products.js records.
// ==========================================

const categoryAliases = {

  // FACE MAKEUP

  '/accessories': [
    'Makeup Accessories',
  ],
  '/fragrances/her': [
    'For Her',
  ],
  '/makeup/face/foundations': [
    'Foundations',
    'Foundation',
  ],

  '/makeup/face/bronzers-contours': [
    'Bronzers & Contours',
    'Bronzers',
    'Contours',
  ],

  '/makeup/face/highlighters': [
    'Face Highlighters',
    'Highlighters',
  ],

  '/makeup/face/powders': [
    'Face Powders',
    'Powders',
  ],

  '/makeup/face/blush': [
    'Blush',
    'Blushers',
  ],

  '/makeup/face/concealers': [
    'Concealers',
    'Concealer',
  ],

  '/makeup/face/fixers': [
    'Makeup Fixers',
    'Setting Sprays',
    'Makeup Setting Sprays',
  ],

  '/makeup/face/primers': [
    'Face Primers',
    'Face Primer',
  ],


  // EYE MAKEUP

  '/makeup/eye/eyeshadow': [
    'Eyeshadow',
    'Eye Shadows',
    'Individual Eye Shadows',
  ],

  '/makeup/eye/eyeliner': [
    'Eyeliner',
    'Eyeliners',
  ],

  '/makeup/eye/mascara': [
    'Mascara',
    'Mascaras',
  ],

  '/makeup/eye/brows': [
    'Brow Products',
    'Eyebrow Products',
  ],


  '/makeup/eye/lashes': [
    'False Lashes',
    'False Lash',
  ],


  // LIP MAKEUP

  '/makeup/lip/lipstick': [
    'Lipstick',
    'Lipsticks',
    'Liquid Lipsticks',
  ],

  '/makeup/lip/gloss': [
    'Lip Gloss',
  ],

  '/makeup/lip/liner': [
    'Lip Liner',
    'Lip Liners',
  ],

  '/makeup/lip/tints': [
    'Lip Tints',
    'Lip Tint',
  ],

  '/makeup/lip/care': [
    'Lip Care',
    'Lip Balms',
    'Lip Oils',
  ],


  // HANDS

  '/makeup/hands/nail-polish': [
    'Nail Polish',
  ],

  '/makeup/hands/hand-cream': [
    'Hand Cream',
    'Hand Creams',
  ],



  // PALETTES

  '/makeup/palettes/eyeshadow': [
    'Eyeshadow Palettes',
    'Eyeshadow Palette',
  ],




  // SKINCARE - CLEANSERS

  '/skincare/cleansers/face-wash': [
    'Face Wash',
    'Cleansers',
  ],


  '/skincare/cleansers/exfoliators': [
    'Exfoliators',
  ],


  // SKINCARE - MOISTURIZERS

  '/skincare/moisturizers/day-cream': [
    'Day Cream',
    'Day Creams',
  ],

  '/skincare/moisturizers/night-cream': [
    'Night Cream',
    'Night Creams',
  ],



  // SKINCARE - TREATMENTS

  '/skincare/treatments/serums': [
    'Serums',
    'Serum',
  ],


  '/skincare/treatments/masks': [
    'Masks',
    'Face Masks',
  ],

  '/skincare/treatments/eye-care': [
    'Eye Care',
  ],


  // ACCESSORIES


  // SUN CARE

  '/sun-care/protection/face-spf': [
    'Face SPF',
    'Sunscreen',
    'Sunscreens',
  ],




  // FRAGRANCES





  // HAIR

  '/hair/care/shampoo': [
    'Shampoo',
    'Shampoos',
  ],

  '/hair/care/conditioner': [
    'Conditioner',
    'Conditioners',
  ],

  '/hair/care/treatments': [
    'Hair Treatments',
  ],

  '/hair/care/oils': [
    'Hair Oils & Serums',
    'Hair Oils',
    'Hair Serum',
  ],

}


// ==========================================
// EXISTING GENERAL PRODUCT GROUPS
//
// Preserves original MINAYSH demo products.
// ==========================================

const groupAliases = {

  '/fragrances/her': ['For Her'],

  '/skincare/cleansers': [
    'Cleansers',
  ],

  '/skincare/moisturizers': [
    'Moisturizers',
    'Daily Moisturizers',
    'Hand Creams',
    'Body Lotions',
  ],

  '/skincare/treatments': [
    'Treatments',
    'Spot Treatments',
    'Face Oils',
  ],

}


// ==========================================
// FIND NAVIGATION CATEGORY BY URL
// ==========================================

function findRoute(pathname) {

  const path =
    pathname.replace(/\/+$/, '') || '/'

  // Main categories

  const mainCategory = primaryNav.find(
    (item) => item.path === path
  )

  if (mainCategory) {
    return {
      type: 'main',
      title: mainCategory.label,
      key: mainCategory.key,
      path,
    }
  }

  // Nested categories

  for (const nav of primaryNav) {

    const columns = megaMenu[nav.key] || []

    for (const column of columns) {

      if (column.path === path) {

        return {
          type: 'group',
          title: column.label,
          key: nav.key,
          path,
          column,
        }

      }

      for (const item of column.items) {

        if (item.path === path) {

          return {
            type: 'subcategory',
            title: item.label,
            key: nav.key,
            path,
            column,
          }

        }

      }

    }

  }

  return null
}


// ==========================================
// MATCH PRODUCT CATEGORY
// ==========================================

function matchesMainCategory(product, key, path) {

  const category = normalize(product.category)
  const subCategory = normalize(product.subCategory)

  // Special case:
  // Hand Cream belongs to skincare data,
  // but may be linked from Makeup > Hands.

  if (
    path === '/makeup/hands/hand-cream'
  ) {

    return (
      category === 'skincare' ||
      category === 'makeup'
    )

  }

  if (path === '/makeup/hands') {

    return (
      category === 'makeup' ||
      (
        category === 'skincare' &&
        [
          'hand cream',
          'hand creams',
        ].includes(subCategory)
      )
    )

  }

  // Sun Care may be stored under skincare.

  if (key === 'sunCare') {

    return (
      category === 'suncare' ||
      (
        category === 'skincare' &&
        [
          'sunscreen',
          'sunscreens',
          'face spf',
          'body spf',
          'after sun',
          'after sun care',
        ].includes(subCategory)
      )
    )

  }

  return category === normalize(key)

}


// ==========================================
// VALID PRICE
// ==========================================

function hasValidPrice(product) {

  return (
    typeof product.price === 'number' &&
    Number.isFinite(product.price) &&
    product.price > 0
  )

}


// ==========================================
// PRODUCT LISTING
// ==========================================

export default function ProductListing() {

  const location = useLocation()

  const [searchParams] = useSearchParams()

  const [sort, setSort] = useState('newest')

  const [selectedBrands, setSelectedBrands] = useState([])
  
  const [showAllBrands, setShowAllBrands] = useState(false)

  const [filtersOpen, setFiltersOpen] =
    useState(false)

  // null means no maximum price filter

  const [priceMax, setPriceMax] =
    useState(null)

  const [availability, setAvailability] =
    useState('all')


  // ========================================
  // CURRENT URL
  // ========================================

  const pathname =
    location.pathname.replace(/\/+$/, '') || '/'

  const route = findRoute(pathname)

  const originalQuery =
    searchParams.get('q') || ''

  const searchQuery =
    normalize(originalQuery)
  useEffect(() => {
    setSelectedBrands([])
    setPriceMax(null)
    setAvailability('all')
    setFiltersOpen(false)
  }, [pathname])

  // ========================================
  // DYNAMIC PRICE RANGE
  // ========================================

  const maxCatalogPrice = useMemo(() => {

    const prices = allProducts
      .filter(hasValidPrice)
      .map((product) => product.price)

    return Math.max(
      6000,
      Math.ceil(
        Math.max(0, ...prices) / 100
      ) * 100
    )

  }, [])


  // ========================================
  // PAGE TITLE
  // ========================================

  const pageTitle = searchQuery

    ? `Results for "${originalQuery}"`

    : pathname === '/search'

      ? 'Shop All'

      : route?.title || 'Category Not Found'


  // ========================================
  // CATEGORY + SEARCH FILTERING
  // ========================================
  const availableBrands = useMemo(() => {
  return [...new Set(
    allProducts
      .map((product) => product.brand?.trim())
      .filter(Boolean)
  )].sort((a, b) => a.localeCompare(b))
}, [])

const toggleBrand = (brand) => {
  setSelectedBrands((current) =>
    current.includes(brand)
      ? current.filter((item) => item !== brand)
      : [...current, brand]
  )
}
  const filtered = useMemo(() => {

    let list = [...allProducts]


    // --------------------------------------
    // SEARCH
    // --------------------------------------

    if (searchQuery) {

      list = list.filter((product) => {

        const searchableText = normalize([
          product.name,
          product.brand,
          product.tagline,
          product.subCategory,
        ].join(' '))

        return searchableText.includes(searchQuery)

      })

    }


    // --------------------------------------
    // MAIN / SUBCATEGORY ROUTES
    // --------------------------------------

    else if (pathname !== '/search') {

      if (!route) {

        list = []

      }

      else if (route.key === 'new') {

        list = list.filter(
          (product) =>
            normalize(product.badge) === 'new'
        )

      }

      else if (route.key === 'sale') {

        list = list.filter((product) => {

          return (
            hasValidPrice(product) &&
            typeof product.oldPrice === 'number' &&
            product.oldPrice > product.price
          )

        })

      }

      else {

        list = list.filter((product) =>
          matchesMainCategory(
            product,
            route.key,
            route.path
          )
        )


        // ----------------------------------
        // EXACT SUBCATEGORY
        // ----------------------------------

        if (route.type === 'subcategory') {

          const aliases =
            categoryAliases[route.path] ||
            [route.title]

          const allowed = aliases.map(normalize)

          list = list.filter((product) => {

            return allowed.includes(
              normalize(product.subCategory)
            )

          })

        }


        // ----------------------------------
        // PARENT GROUP
        //
        // /makeup/face
        // /makeup/eye
        // /skincare/cleansers
        // ----------------------------------

        else if (route.type === 'group') {

          const childCategories =
            route.column.items.flatMap(
              (item) =>
                categoryAliases[item.path] ||
                [item.label]
            )

          const additionalCategories =
            groupAliases[route.path] || []

          const allowed = [
            ...childCategories,
            ...additionalCategories,
          ].map(normalize)

          list = list.filter((product) => {

            return allowed.includes(
              normalize(product.subCategory)
            )

          })

        }

      }

    }

    if (selectedBrands.length > 0) {
  list = list.filter((product) =>
    selectedBrands.includes(product.brand?.trim())
  )
}
    // ======================================
    // PRICE FILTER
    //
    // Unpriced draft products remain visible
    // when browsing all availability.
    // ======================================

    if (priceMax !== null) {

      list = list.filter((product) => {

        if (!hasValidPrice(product)) {
          return true
        }

        return product.price <= priceMax

      })

    }


    // ======================================
    // AVAILABILITY FILTER
    // ======================================

    if (availability === 'inStock') {

      list = list.filter((product) => {

        if (product.draft === true) {
          return false
        }

        if (product.available === false) {
          return false
        }

        if (!hasValidPrice(product)) {
          return false
        }

        if (
          normalize(product.badge) ===
          'sold out'
        ) {
          return false
        }

        return true

      })

    }


    // ======================================
    // SORTING
    // ======================================

    switch (sort) {

      case 'price-asc':

        list.sort((a, b) => {

          const aPrice = hasValidPrice(a)
            ? a.price
            : Infinity

          const bPrice = hasValidPrice(b)
            ? b.price
            : Infinity

          return aPrice - bPrice

        })

        break


      case 'price-desc':

        list.sort((a, b) => {

          const aPrice = hasValidPrice(a)
            ? a.price
            : -Infinity

          const bPrice = hasValidPrice(b)
            ? b.price
            : -Infinity

          return bPrice - aPrice

        })

        break


      case 'rating':

        list.sort(
          (a, b) =>
            (b.rating || 0) -
            (a.rating || 0)
        )

        break


      case 'bestselling':

        list.sort(
          (a, b) =>
            (b.reviews || 0) -
            (a.reviews || 0)
        )

        break


      default:
        break

    }

    return list

  // route is worked out from pathname, which is already in the list below
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pathname,
    searchQuery,
    sort,
    priceMax,
    availability,
    selectedBrands
  ])


  // ========================================
  // EXISTING FRONTEND DESIGN
  // ========================================

  return (

    <>

      <PageHeader

        title={pageTitle}

        subtitle={
          `${filtered.length} product${
            filtered.length === 1 ? '' : 's'
          }`
        }

      />


      <section className="listing">

        <div className="container listing__layout">


          {/* FILTER TOGGLE */}

          <button

            className="listing__filter-toggle"

            onClick={() =>
              setFiltersOpen((value) => !value)
            }

          >

            <SlidersHorizontal
              size={16}
              strokeWidth={1.5}
            />

            Filter &amp; Sort

          </button>


          {/* SIDEBAR */}

          <aside

            className={`listing__sidebar ${
              filtersOpen ? 'is-open' : ''
            }`}

          >

            <div className="listing__sidebar-header">

              <h3>Filters</h3>

              <button

                onClick={() =>
                  setFiltersOpen(false)
                }

                aria-label="Close filters"

              >

                <X size={18} />

              </button>

            </div>


            {/* SORT */}

            <div className="listing__filter-group">

              <h4>Sort By</h4>

              <select

                value={sort}

                onChange={(event) =>
                  setSort(event.target.value)
                }

              >

                {sortOptions.map((option) => (

                  <option

                    key={option.value}

                    value={option.value}

                  >

                    {option.label}

                  </option>

                ))}

              </select>

            </div>


            {/* PRICE */}

            <div className="listing__filter-group">

              <h4>

                {priceMax === null

                  ? 'All Prices'

                  : `Price up to PKR ${
                      priceMax.toLocaleString()
                    }`

                }

              </h4>

              <input

                type="range"

                min="0"

                max={maxCatalogPrice}

                step="100"

                value={
                  priceMax ?? maxCatalogPrice
                }

                onChange={(event) => {

                  const value =
                    Number(event.target.value)

                  setPriceMax(
                    value >= maxCatalogPrice
                      ? null
                      : value
                  )

                }}

              />

            </div>


            {/* AVAILABILITY */}

            <div className="listing__filter-group">

              <h4>Availability</h4>


              <label className="listing__radio">

                <input

                  type="radio"

                  name="availability"

                  checked={
                    availability === 'all'
                  }

                  onChange={() =>
                    setAvailability('all')
                  }

                />

                All

              </label>


              <label className="listing__radio">

                <input

                  type="radio"

                  name="availability"

                  checked={
                    availability === 'inStock'
                  }

                  onChange={() =>
                    setAvailability('inStock')
                  }

                />

                In Stock Only

              </label>

            </div>
            
            {/* BRANDS */}
<div className="listing__filter-group">
  <h4>Brands</h4>

  {(showAllBrands
    ? availableBrands
    : availableBrands.slice(0, 6)
  ).map((brand) => (
    <label
      className="listing__radio"
      key={brand}
    >
      <input
        type="checkbox"
        checked={selectedBrands.includes(brand)}
        onChange={() => toggleBrand(brand)}
      />

      {brand}
    </label>
  ))}

  {availableBrands.length > 6 && (
    <button
      type="button"
      onClick={() => setShowAllBrands((value) => !value)}
    >
      {showAllBrands ? '− Show less' : '+ Show more'}
    </button>
  )}
</div>

            {/* CATEGORY NOTE */}

            <div className="listing__filter-group">

              <h4>Category</h4>

              <p className="listing__filter-note">

                Browse individual categories
                from the MINAYSH navigation menu.

              </p>

            </div>

          </aside>


          {/* PRODUCT GRID */}

          <div className="listing__grid">

            {filtered.length === 0 ? (

              <p className="listing__empty">

                No products found in this
                category yet.

              </p>

            ) : (

              filtered.map((product) => (

                <ProductCard

                  key={product.id}

                  product={product}

                />

              ))

            )}

          </div>

        </div>

      </section>

    </>

  )

}

