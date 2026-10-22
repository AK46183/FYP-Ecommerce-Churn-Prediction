import { useWishlist } from '../../context/WishlistContext.jsx'
import { allProducts } from '../../data/products.js'
import ProductCard from '../../components/products/ProductCard.jsx'
import './AccountPages.css'

export default function Wishlist() {
  const { ids } = useWishlist()
  const items = allProducts.filter((p) => ids.includes(p.id))

  return (
    <div className="account-card">
      <h2>Wishlist</h2>
      {items.length === 0 ? (
        <p className="account-empty">Nothing saved yet — tap the heart on any product to add it here.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
