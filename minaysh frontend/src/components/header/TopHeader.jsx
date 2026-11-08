import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Search, User, Heart, ShoppingBag, Menu, X, Package, LogOut } from 'lucide-react'
import { useCart } from '../../context/CartContext.jsx'
import { useWishlist } from '../../context/WishlistContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { allProducts } from '../../data/products.js'
import { primaryNav, megaMenu } from '../../data/navigation.js'
import { formatPKR } from '../../services/format.js'
import { hasValidPrice, isPurchasable } from '../../services/product.js'
import './TopHeader.css'

const MAX_PRODUCTS = 6
const MAX_CATEGORIES = 3

function normalize(text) {
  return String(text || '')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

// Build the search index once (name + brand + category for every product)
const productIndex = allProducts.map((product) => ({
  product,
  name: normalize(product.name),
  brand: normalize(product.brand),
  text: normalize([product.name, product.brand, product.subCategory, product.tagline].join(' ')),
}))

// Every category link in the menu, e.g. "Lipstick" -> /makeup/lip/lipstick
const categoryIndex = primaryNav.flatMap((nav) => [
  ...(megaMenu[nav.key] || []).flatMap((column) =>
    column.items.map((item) => ({
      label: item.label,
      parent: nav.label,
      path: item.path,
      key: normalize(item.label),
    }))
  ),
])

function searchProducts(query) {
  const q = normalize(query)
  if (!q) return []
  const words = q.split(' ')

  return productIndex
    .filter((entry) => words.every((w) => entry.text.includes(w)))
    .map((entry) => {
      let score = 0
      if (entry.name.startsWith(q)) score += 50
      if (entry.brand.startsWith(q)) score += 30
      if (entry.name.split(' ').some((w) => w.startsWith(words[0]))) score += 20
      if (entry.name.includes(q)) score += 10
      if (isPurchasable(entry.product)) score += 15 // things you can buy first
      return { product: entry.product, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_PRODUCTS)
    .map((r) => r.product)
}

function searchCategories(query) {
  const q = normalize(query)
  if (!q) return []
  return categoryIndex.filter((c) => c.key.includes(q)).slice(0, MAX_CATEGORIES)
}

// Bold the typed part inside the product name
function Highlight({ text, query }) {
  const q = String(query || '').trim()
  if (!q) return text
  const index = text.toLowerCase().indexOf(q.toLowerCase())
  if (index === -1) return text
  return (
    <>
      {text.slice(0, index)}
      <mark>{text.slice(index, index + q.length)}</mark>
      {text.slice(index + q.length)}
    </>
  )
}

export default function TopHeader({ onMenuToggle }) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)
  const searchRef = useRef(null)

  const navigate = useNavigate()
  const location = useLocation()
  const { count: cartCount } = useCart()
  const { count: wishlistCount } = useWishlist()
  const { user, logout } = useAuth()

  // ---------- profile logo ----------
  const [menuOpen, setMenuOpen] = useState(false)
  const [avatarPop, setAvatarPop] = useState(false)
  const accountRef = useRef(null)
  const displayName = user ? user.name || user.email?.split('@')[0] || 'Me' : ''
  const initial = displayName.slice(0, 1).toUpperCase()

  // the welcome card "lands" here -> small pop
  useEffect(() => {
    function onPop() {
      setAvatarPop(true)
      setTimeout(() => setAvatarPop(false), 700)
    }
    window.addEventListener('minaysh:avatar-pop', onPop)
    return () => window.removeEventListener('minaysh:avatar-pop', onPop)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!menuOpen) return undefined
    function onClick(event) {
      if (accountRef.current && !accountRef.current.contains(event.target)) setMenuOpen(false)
    }
    function onKey(event) {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  function handleLogout() {
    setMenuOpen(false)
    logout()
    navigate('/')
  }

  const products = useMemo(() => searchProducts(query), [query])
  const categories = useMemo(() => searchCategories(query), [query])
  const hasQuery = query.trim().length > 0

  // one flat list for arrow-key navigation: categories, products, "view all"
  const items = [
    ...categories.map((c) => ({ type: 'category', path: c.path })),
    ...products.map((p) => ({ type: 'product', path: `/product/${p.id}` })),
    ...(hasQuery ? [{ type: 'all', path: `/search?q=${encodeURIComponent(query.trim())}` }] : []),
  ]

  function closeSearch() {
    setSearchOpen(false)
    setQuery('')
    setActiveIndex(-1)
  }

  // close when the page changes
  useEffect(() => {
    closeSearch()
  }, [location.pathname])

  // close when clicking outside the search box
  useEffect(() => {
    if (!searchOpen) return undefined
    function onClick(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) closeSearch()
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [searchOpen])

  useEffect(() => {
    setActiveIndex(-1)
  }, [query])

  function go(path) {
    navigate(path)
    closeSearch()
  }

  function handleSearchSubmit(e) {
    e.preventDefault()
    if (activeIndex >= 0 && items[activeIndex]) {
      go(items[activeIndex].path)
      return
    }
    if (!query.trim()) return
    go(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  function handleKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (items.length ? (i + 1) % items.length : -1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (items.length ? (i <= 0 ? items.length - 1 : i - 1) : -1))
    } else if (e.key === 'Escape') {
      closeSearch()
    }
  }

  let itemNumber = -1
  const nextId = () => {
    itemNumber += 1
    return itemNumber
  }

  return (
    <div className="top-header">
      <div className="container top-header__inner">
        <div className="top-header__side top-header__side--left">
          {/* MINAYSH_LOGO_SPLIT: logo mark in the left corner */}
          <Link to="/" className="top-header__mark" aria-label="MINAYSH home">
            <img src="/images/brand/minaysh-mark-rose.png" alt="" />
          </Link>
          <button
            className="top-header__icon-btn top-header__hamburger"
            onClick={onMenuToggle}
            aria-label="Open menu"
          >
            <Menu size={20} strokeWidth={1.5} />
          </button>

          {searchOpen ? (
            <div className="top-header__search" ref={searchRef}>
              <form className="top-header__search-form" onSubmit={handleSearchSubmit} role="search">
                <Search size={16} strokeWidth={1.5} />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search products, shades, brands..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  role="combobox"
                  aria-expanded={hasQuery}
                  aria-controls="search-suggestions"
                  aria-autocomplete="list"
                />
                <button
                  type="button"
                  className="top-header__icon-btn"
                  onClick={closeSearch}
                  aria-label="Close search"
                >
                  <X size={16} strokeWidth={1.5} />
                </button>
              </form>

              {hasQuery && (
                <div className="search-suggest" id="search-suggestions" role="listbox">
                  {categories.length > 0 && (
                    <div className="search-suggest__group">
                      <p className="search-suggest__label">Categories</p>
                      <div className="search-suggest__chips">
                        {categories.map((c) => {
                          const n = nextId()
                          return (
                            <button
                              key={c.path}
                              type="button"
                              role="option"
                              aria-selected={activeIndex === n}
                              className={`search-suggest__chip ${activeIndex === n ? 'is-active' : ''}`}
                              onMouseEnter={() => setActiveIndex(n)}
                              onClick={() => go(c.path)}
                            >
                              {c.label}
                              <span>{c.parent.toLowerCase()}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {products.length > 0 ? (
                    <div className="search-suggest__group">
                      <p className="search-suggest__label">Products</p>
                      <ul>
                        {products.map((p) => {
                          const n = nextId()
                          return (
                            <li key={p.id}>
                              <button
                                type="button"
                                role="option"
                                aria-selected={activeIndex === n}
                                className={`search-suggest__item ${activeIndex === n ? 'is-active' : ''}`}
                                onMouseEnter={() => setActiveIndex(n)}
                                onClick={() => go(`/product/${p.id}`)}
                              >
                                <img src={p.image} alt="" loading="lazy" />
                                <span className="search-suggest__text">
                                  <span className="search-suggest__brand">{p.brand}</span>
                                  <span className="search-suggest__name">
                                    <Highlight text={p.name} query={query} />
                                  </span>
                                </span>
                                <span className="search-suggest__price">
                                  {hasValidPrice(p) ? formatPKR(p.price) : 'Coming soon'}
                                </span>
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  ) : (
                    categories.length === 0 && (
                      <p className="search-suggest__empty">
                        No products found for “{query.trim()}”
                      </p>
                    )
                  )}

                  {(() => {
                    const n = nextId()
                    return (
                      <button
                        type="button"
                        role="option"
                        aria-selected={activeIndex === n}
                        className={`search-suggest__all ${activeIndex === n ? 'is-active' : ''}`}
                        onMouseEnter={() => setActiveIndex(n)}
                        onClick={() => go(`/search?q=${encodeURIComponent(query.trim())}`)}
                      >
                        View all results for “{query.trim()}” →
                      </button>
                    )
                  })()}
                </div>
              )}
            </div>
          ) : (
            <button
              className="top-header__icon-btn top-header__search-trigger"
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
            >
              <Search size={19} strokeWidth={1.5} />
              <span>Search</span>
            </button>
          )}
        </div>

        <Link to="/" className="top-header__logo" aria-label="MINAYSH home">
          <img src="/images/brand/minaysh-wordmark-rose.png" alt="MINAYSH" />
        </Link>

        <div className="top-header__side top-header__side--right">
          {user ? (
            <div className="top-header__account" ref={accountRef}>
              <button
                id="header-avatar"
                type="button"
                className={`top-header__avatar ${avatarPop ? 'is-pop' : ''}`}
                onClick={() => setMenuOpen((open) => !open)}
                aria-label={`Account menu for ${displayName}`}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
              >
                {initial}
              </button>

              {menuOpen && (
                <div className="account-menu" role="menu">
                  <div className="account-menu__head">
                    <span className="account-menu__avatar">{initial}</span>
                    <span className="account-menu__who">
                      <strong>{displayName}</strong>
                      <small>{user.email}</small>
                    </span>
                  </div>
                  <Link to={user.role === 'admin' ? '/admin' : '/account'} role="menuitem">
                    <User size={16} strokeWidth={1.5} /> {user.role === 'admin' ? 'Admin panel' : 'My profile'}
                  </Link>
                  <Link to="/account/orders" role="menuitem">
                    <Package size={16} strokeWidth={1.5} /> My orders
                  </Link>
                  <Link to="/wishlist" role="menuitem">
                    <Heart size={16} strokeWidth={1.5} /> Wishlist
                  </Link>
                  <button type="button" role="menuitem" onClick={handleLogout} className="account-menu__logout">
                    <LogOut size={16} strokeWidth={1.5} /> Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="top-header__icon-btn" aria-label="Sign in">
              <User size={19} strokeWidth={1.5} />
            </Link>
          )}
          <Link to="/wishlist" className="top-header__icon-btn" aria-label="Wishlist">
            <Heart size={19} strokeWidth={1.5} />
            {wishlistCount > 0 && <span className="top-header__badge">{wishlistCount}</span>}
          </Link>
          <Link to="/cart" className="top-header__icon-btn" aria-label="Shopping bag">
            <ShoppingBag size={19} strokeWidth={1.5} />
            {cartCount > 0 && <span className="top-header__badge">{cartCount}</span>}
          </Link>
        </div>
      </div>
    </div>
  )
}