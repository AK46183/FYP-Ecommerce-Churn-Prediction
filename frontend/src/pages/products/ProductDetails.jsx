import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { Heart, Minus, Plus, Truck, RotateCcw, Wallet, Check, ChevronLeft, ChevronRight } from 'lucide-react'

import { getProductById, getRelatedProducts } from '../../data/products.js'
import { primaryNav } from '../../data/navigation.js'
import { useCart } from '../../context/CartContext.jsx'
import { useWishlist } from '../../context/WishlistContext.jsx'
import { formatPKR } from '../../services/format.js'
import { hasValidPrice, isPurchasable } from '../../services/product.js'
import { shadeLabel, shadeColor, shadeShortCode, isLightColor } from '../../utils/shadeColor.js'
import { SHADE_IMAGES } from '../../data/shadeImages.js'
import { SHIPPING_STANDARD } from '../../config/store.js'
import ProductCard from '../../components/products/ProductCard.jsx'
import ShadeStory from '../../components/products/ShadeStory.jsx'
import './ProductDetails.css'

const VISIBLE_SHADES = 7

// Route wrapper: key={id} gives every product a fresh page state
// (image, shade, quantity, tab) when moving between products.
export default function ProductDetailsPage() {
  const { id } = useParams()
  const product = getProductById(id)
  if (!product) return <Navigate to="/" replace />
  return <ProductDetails key={id} product={product} />
}

// Build one list of shade / size options from either data shape:
//   variants: [{ name, price, oldPrice, available }]  (Makeup City sync)
//   shades:   ['Black', 'White']                        (older data)
function getOptions(product) {
  if (Array.isArray(product.variants) && product.variants.length) {
    return product.variants
      .map((v) => ({
        label: shadeLabel(v),
        price: hasValidPrice(v) ? v.price : null,
        oldPrice: Number.isFinite(v.oldPrice) && v.oldPrice > 0 ? v.oldPrice : null,
        available: v.available !== false && v.stock !== 0,
      }))
      .filter((o) => o.label && o.label.toLowerCase() !== 'default title')
  }
  if (Array.isArray(product.shades) && product.shades.length) {
    return product.shades
      .map((s) => ({ label: shadeLabel(s), price: null, oldPrice: null, available: true }))
      .filter((o) => o.label)
  }
  return []
}

function ProductDetails({ product }) {
  const { addItem } = useCart()
  const { toggle, isWishlisted } = useWishlist()

  const options = useMemo(() => getOptions(product), [product])
  const gallery = product.gallery?.length ? product.gallery : [product.image].filter(Boolean)

  const firstAvailable = options.findIndex((o) => o.available)
  const [selected, setSelected] = useState(firstAvailable >= 0 ? firstAvailable : 0)
  const [showAllShades, setShowAllShades] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const option = options[selected] || null
  const price = option?.price ?? product.price
  const oldPrice = option?.price ? option.oldPrice : product.oldPrice
  const discount = hasValidPrice({ price }) && oldPrice > price ? Math.round((1 - price / oldPrice) * 100) : 0

  const canBuy = isPurchasable({ ...product, price }) && (option ? option.available : true)
  const wishlisted = isWishlisted(product.id)
  const related = getRelatedProducts(product, 12)
  const categoryNav = primaryNav.find(
    (n) => n.key.toLowerCase() === String(product.category || '').toLowerCase()
  )

  const tabs = [
    product.description && { key: 'description', label: 'Description', body: product.description },
    product.howToUse && { key: 'how', label: 'How to Use', body: product.howToUse },
    product.ingredients && { key: 'ingredients', label: 'Ingredients', body: product.ingredients },
    Array.isArray(product.benefits) && product.benefits.length && {
      key: 'benefits',
      label: 'Benefits',
      list: product.benefits,
    },
    {
      key: 'delivery',
      label: 'Delivery & Returns',
      body: `Standard delivery within Pakistan is ${formatPKR(SHIPPING_STANDARD)} and usually arrives in 3-5 business days. Items can be exchanged within 7 days of delivery, unused and in original packaging.`,
    },
  ].filter(Boolean)
  const [activeTab, setActiveTab] = useState(tabs[0].key)
  const tab = tabs.find((t) => t.key === activeTab) || tabs[0]

  // "50ml", "100 g", "7 x 1.5ml", "1pc" -> show as size pills, not colour dots
  const isSizeList =
    options.length > 0 &&
    options.every((o) => /^\s*(\d+\s?x\s?)?\d+(\.\d+)?\s?(ml|g|gm|gms|kg|oz|pc|pcs|pieces)\b/i.test(o.label))

  const shadeWord = isSizeList
    ? 'Sizes'
    : /nail|lip|eye|brow|blush|foundation|concealer|powder|bronzer|highlight|palette|mascara|liner/i.test(
          product.subCategory || ''
        )
      ? 'Shades'
      : 'Options'
  // Collapsed list shows the first 7, but always keeps the selected shade visible
  let shownOptions = showAllShades ? options : options.slice(0, VISIBLE_SHADES)
  if (!showAllShades && selected >= VISIBLE_SHADES && options[selected]) {
    shownOptions = [...shownOptions.slice(0, VISIBLE_SHADES - 1), options[selected]]
  }

  function handleAddToBag() {
    if (!canBuy) return
    addItem({ ...product, price, oldPrice }, { shade: option?.label || undefined, quantity })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="pdp">
      {/* ================= HERO ================= */}
      <section className="pdp-hero">
        <div className="pdp-hero__inner">
          {/* LEFT: name + image switcher */}
          <div className="pdp-hero__info">
            <nav className="pdp-hero__crumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span>/</span>
              {categoryNav && (
                <>
                  <Link to={categoryNav.path}>{categoryNav.label.toLowerCase()}</Link>
                </>
              )}
              {product.subCategory && (
                <>
                  <span>/</span>
                  <span>{product.subCategory}</span>
                </>
              )}
            </nav>

            {product.brand && <p className="pdp-hero__brand">{product.brand}</p>}
            <h1 className="pdp-hero__title">{product.name}</h1>
            {product.tagline && <p className="pdp-hero__tagline">{product.tagline}</p>}

            {gallery.length > 1 && (
              <div className="pdp-hero__thumbs">
                {gallery.map((img, i) => (
                  <button
                    key={img}
                    type="button"
                    className={`pdp-hero__thumb ${activeImage === i ? 'is-active' : ''}`}
                    onClick={() => setActiveImage(i)}
                    aria-label={`Show image ${i + 1}`}
                  >
                    <img src={img} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* CENTER: big image */}
          <div className="pdp-hero__media">
            {product.badge && <span className="pdp-hero__badge">{product.badge}</span>}
            <img src={gallery[activeImage] || product.image} alt={product.name} />
          </div>

          {/* RIGHT: shades + buy box */}
          <aside className="pdp-hero__panel">
            {options.length > 0 && (
              <div className="pdp-card pdp-shades">
                <div className="pdp-shades__head">
                  <span className="pdp-shades__current">
                    {option?.label}
                    {option && !option.available && <em> · Sold out</em>}
                  </span>
                  {options.length > VISIBLE_SHADES ? (
                    <button
                      type="button"
                      className="pdp-shades__all"
                      onClick={() => setShowAllShades((v) => !v)}
                      aria-expanded={showAllShades}
                    >
                      {showAllShades ? 'Show less' : `All ${shadeWord} (${options.length})`}
                    </button>
                  ) : (
                    <span className="pdp-shades__count">
                      {options.length} {options.length === 1 ? shadeWord.slice(0, -1) : shadeWord}
                    </span>
                  )}
                </div>

                <div className="pdp-shades__row" role="radiogroup" aria-label={shadeWord}>
                  {shownOptions.map((o) => {
                    const index = options.indexOf(o)
                    const isSelected = index === selected

                    if (isSizeList) {
                      return (
                        <button
                          key={`${o.label}-${index}`}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          className={['pdp-size', isSelected && 'is-selected', !o.available && 'is-soldout']
                            .filter(Boolean)
                            .join(' ')}
                          onClick={() => setSelected(index)}
                        >
                          {o.label}
                        </button>
                      )
                    }

                    const color = SHADE_IMAGES[product.id]?.[(String(o.label).match(/^\s*([A-Za-z]?\d{1,4}(?:\.\d+)?[A-Za-z]?)(?=[\s,]|$)/) || [])[1]?.toUpperCase()]?.color || SHADE_IMAGES[product.id]?.[o.label]?.color || shadeColor(o.label, product.subCategory)
                    return (
                      <button
                        key={`${o.label}-${index}`}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        title={o.available ? o.label : `${o.label} (sold out)`}
                        className={[
                          'pdp-swatch',
                          isSelected && 'is-selected',
                          !o.available && 'is-soldout',
                          !color && 'is-text',
                          color && isLightColor(color) && 'is-light',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        style={color ? { '--swatch': color } : undefined}
                        onClick={() => setSelected(index)}
                      >
                        {!color && <span>{shadeShortCode(o.label)}</span>}
                        {isSelected && color && <Check size={16} strokeWidth={2.5} aria-hidden="true" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="pdp-card pdp-buy">
              <div className="pdp-buy__price">
                {hasValidPrice({ price }) ? (
                  <>
                    <span className="pdp-buy__now">{formatPKR(price)}</span>
                    {oldPrice > price && <span className="pdp-buy__old">{formatPKR(oldPrice)}</span>}
                    {discount > 0 && <span className="pdp-buy__off">-{discount}%</span>}
                  </>
                ) : (
                  <span className="pdp-buy__now pdp-buy__now--soon">Price coming soon</span>
                )}
              </div>

              <p className={`pdp-buy__stock ${canBuy ? 'is-in' : 'is-out'}`}>
                {canBuy ? 'In stock' : hasValidPrice({ price }) ? 'Currently unavailable' : 'Coming soon'}
              </p>

              <div className="pdp-buy__actions">
                <div className="pdp-buy__qty">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span aria-live="polite">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button type="button" className="pdp-buy__add" onClick={handleAddToBag} disabled={!canBuy}>
                  {!canBuy ? 'Unavailable' : added ? 'Added ✓' : 'Add to Bag'}
                </button>

                <button
                  type="button"
                  className={`pdp-buy__wish ${wishlisted ? 'is-active' : ''}`}
                  onClick={() => toggle(product.id)}
                  aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  aria-pressed={wishlisted}
                >
                  <Heart size={20} strokeWidth={1.5} fill={wishlisted ? 'currentColor' : 'none'} />
                </button>
              </div>

              <ul className="pdp-buy__perks">
                <li>
                  <Truck size={17} strokeWidth={1.5} /> {formatPKR(SHIPPING_STANDARD)} delivery all over Pakistan
                </li>
                <li>
                  <Wallet size={17} strokeWidth={1.5} /> Cash on Delivery available
                </li>
                <li>
                  <RotateCcw size={17} strokeWidth={1.5} /> Easy exchange within 7 days
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* ================= DETAILS TABS ================= */}
      {!isSizeList && (
        <ShadeStory
          selected={selected}
          product={product}
          options={options}
          canAdd={(o) => o.available && isPurchasable({ ...product, price: o.price ?? product.price })}
          onAdd={(o) =>
            addItem(
              { ...product, price: o.price ?? product.price, oldPrice: o.price ? o.oldPrice : product.oldPrice },
              { shade: o.label, quantity: 1 }
            )
          }
        />
      )}

      <section className="pdp-details">
        <div className="container pdp-details__inner">
          <h2 className="pdp-details__heading">
            {product.subCategory || 'Product'} <span>by {product.brand || 'MINAYSH'}</span>
          </h2>

          <div className="pdp-details__content">
            <div className="pdp-details__tabs" role="tablist">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  role="tab"
                  aria-selected={tab.key === t.key}
                  className={tab.key === t.key ? 'is-active' : ''}
                  onClick={() => setActiveTab(t.key)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="pdp-details__panel" role="tabpanel">
              {tab.list ? (
                <ul>
                  {tab.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>{tab.body}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================= RELATED ================= */}
            {related.length > 0 && <RelatedCarousel products={related} />}
    </div>
  )
}
// "You May Also Like" - scrolls left / right (arrows, trackpad, touch swipe)
function RelatedCarousel({ products }) {
  const trackRef = useRef(null)
  const [edge, setEdge] = useState({ start: true, end: false })

  function updateEdge() {
    const el = trackRef.current
    if (!el) return
    setEdge({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    })
  }

  useEffect(() => {
    updateEdge()
    window.addEventListener('resize', updateEdge)
    return () => window.removeEventListener('resize', updateEdge)
  }, [])

  function scroll(dir) {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth, behavior: 'smooth' })
  }

  return (
    <section className="pdp-related">
      <div className="container">
        <div className="pdp-related__head">
          <h2>You May Also Like</h2>
          <div className="pdp-related__arrows">
            <button type="button" aria-label="Previous products" onClick={() => scroll(-1)} disabled={edge.start}>
              <ChevronLeft size={20} />
            </button>
            <button type="button" aria-label="Next products" onClick={() => scroll(1)} disabled={edge.end}>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="pdp-related__track" ref={trackRef} onScroll={updateEdge}>
          {products.map((p) => (
            <div className="pdp-related__item" key={p.id}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}