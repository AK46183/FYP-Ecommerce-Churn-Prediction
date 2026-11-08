import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useCart } from '../../context/CartContext.jsx'
import { useWishlist } from '../../context/WishlistContext.jsx'
import { formatPKR } from '../../services/format.js'
import { hasValidPrice, isPurchasable } from '../../services/product.js'
import './ProductCard.css'

export default function ProductCard({ product, editorial = false }) {
  const { addItem } = useCart()
  const { toggle, isWishlisted } = useWishlist()
  const [selectedShade, setSelectedShade] = useState(product.shades?.[0] || null)

  const wishlisted = isWishlisted(product.id)
  const soldOut = !isPurchasable(product)
  const extraShades = product.shades && product.shades.length > 3 ? product.shades.length - 3 : 0

  function handleAddToBag(e) {
    e.preventDefault()
    e.stopPropagation()
    if (soldOut) return
    addItem(product, { shade: selectedShade, quantity: 1 })
  }

  function handleWishlist(e) {
    e.preventDefault()
    e.stopPropagation()
    toggle(product.id)
  }

  return (
    <Link
      to={`/product/${product.id}`}
      className={`product-card ${editorial ? 'product-card--editorial' : ''}`}
    >
      <div className="product-card__media">
        {product.badge && (
          <span className={`product-card__badge product-card__badge--${product.badge.replace(/\s/g, '')}`}>
            {product.badge}
          </span>
        )}
        <img src={product.image} alt={product.name} className="product-card__image" loading="lazy" decoding="async" />
      </div>

      <p className="product-card__tagline">{product.tagline}</p>
      <h3 className="product-card__name">{product.name}</h3>

      <div className="product-card__price">
        <span>{hasValidPrice(product) ? formatPKR(product.price) : 'Price coming soon'}</span>
        {product.oldPrice > product.price && (
          <span className="product-card__price--old">{formatPKR(product.oldPrice)}</span>
        )}
      </div>

      {product.shades && product.shades.length > 0 && (
        <div className="product-card__shades">
          {product.shades.slice(0, 3).map((shade, index) => {
            const shadeName =
              typeof shade === 'string'
                ? shade
                : shade?.name || shade?.label || shade?.title || `Shade ${index + 1}`

            const shadeColor =
              typeof shade === 'object' && shade !== null
                ? shade.hex || shade.hexCode || shade.colorHex || shade.color
                : null

            const validColor =
              typeof shadeColor === 'string' &&
              /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(shadeColor)

            return validColor ? (
              <button
                key={`${shadeName}-${index}`}
                type="button"
                className={`product-card__shade-dot ${selectedShade === shade ? 'is-selected' : ''}`}
                style={{ backgroundColor: shadeColor }}
                title={shadeName}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setSelectedShade(shade)
                }}
              />
            ) : (
              <button
                key={`${shadeName}-${index}`}
                type="button"
                className={`product-card__shade-name ${selectedShade === shade ? 'is-selected' : ''}`}
                title={shadeName}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setSelectedShade(shade)
                }}
              >
                {shadeName}
              </button>
            )
          })}

          {extraShades > 0 && <span className="product-card__shade-more">+{extraShades}</span>}
        </div>
      )}

      {/* bottom row: heart (left) + Add to Bag (right) */}
      <div className="product-card__actions">
        <button
          type="button"
          className={`product-card__heart ${wishlisted ? 'is-active' : ''}`}
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wishlisted}
        >
          <Heart size={18} strokeWidth={1.6} className="product-card__heart-line" />
          {/* red heart that fills up from the bottom on hover */}
          <span className="product-card__heart-fill" aria-hidden="true">
            <Heart size={18} strokeWidth={1.6} fill="currentColor" />
          </span>
        </button>

        <button
          type="button"
          className="product-card__add-btn"
          onClick={handleAddToBag}
          disabled={soldOut}
        >
          {!hasValidPrice(product) ? 'Coming Soon' : soldOut ? 'Sold Out' : 'Add to Bag'}
        </button>
      </div>
    </Link>
  )
}