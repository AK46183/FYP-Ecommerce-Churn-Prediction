import { useEffect, useMemo, useState } from 'react'
import { getProducts, updateProduct } from '../../services/adminApi.js'
import { formatPKR } from '../../services/format.js'
import './AdminPages.css'

const PAGE = 50

export default function AdminProducts() {
  const [products, setProducts] = useState(null)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)
  const [editing, setEditing] = useState(null) // { sku, price }
  const [savingId, setSavingId] = useState(null)

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((e) => setError(e.message))
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!products) return []
    if (!q) return products
    return products.filter((p) =>
      [p.name, p.brand, p.sku, p.subCategory, p.Category?.name].some((v) => v && v.toLowerCase().includes(q))
    )
  }, [products, query])

  const shown = filtered.slice(page * PAGE, (page + 1) * PAGE)
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE))

  const save = async (p, changes) => {
    setSavingId(p.id)
    setError('')
    try {
      const updated = await updateProduct(p.sku || p.id, changes)
      setProducts((list) => list.map((x) => (x.id === p.id ? { ...x, ...updated, Category: x.Category } : x)))
      setEditing(null)
    } catch (e) {
      setError(e.message)
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div>
      <div className="admin-page__header">
        <div>
          <h1>Products</h1>
          <p>{products ? `${products.length} products in the store database` : 'Loading…'}</p>
        </div>
        <input
          className="admin-search"
          placeholder="Search name, brand, SKU…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setPage(0)
          }}
        />
      </div>

      {error && <p className="admin-error">{error}</p>}
      {products?.length === 0 && (
        <p className="admin-error">No products in the database yet — run <b>npm run seed:catalog</b> in the Backend folder.</p>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((p) => (
              <tr key={p.id}>
                <td>
                  {p.name}
                  <small className="admin-table__sub">{[p.brand, p.sku].filter(Boolean).join(' · ')}</small>
                </td>
                <td>
                  {p.Category?.name || '—'}
                  <small className="admin-table__sub">{p.subCategory}</small>
                </td>
                <td>
                  {editing?.id === p.id ? (
                    <form
                      className="admin-inline-edit"
                      onSubmit={(e) => {
                        e.preventDefault()
                        save(p, { price: Number(editing.price) })
                      }}
                    >
                      <input
                        type="number"
                        min="1"
                        value={editing.price}
                        onChange={(e) => setEditing({ ...editing, price: e.target.value })}
                        autoFocus
                      />
                      <button type="submit" disabled={savingId === p.id}>Save</button>
                      <button type="button" onClick={() => setEditing(null)}>✕</button>
                    </form>
                  ) : (
                    <button type="button" className="admin-link" onClick={() => setEditing({ id: p.id, price: p.price })}>
                      {formatPKR(p.price)}
                    </button>
                  )}
                </td>
                <td>{p.stock}</td>
                <td>
                  <button
                    type="button"
                    className={`admin-chip ${p.available ? 'is-ok' : 'is-on'}`}
                    onClick={() => save(p, { available: !p.available })}
                    disabled={savingId === p.id}
                    title="Click to change"
                  >
                    {p.available ? 'Active' : 'Hidden'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="admin-pager">
          <button type="button" disabled={page === 0} onClick={() => setPage(page - 1)}>‹ Prev</button>
          <span>Page {page + 1} of {pages} · {filtered.length} products</span>
          <button type="button" disabled={page >= pages - 1} onClick={() => setPage(page + 1)}>Next ›</button>
        </div>
      )}
    </div>
  )
}
