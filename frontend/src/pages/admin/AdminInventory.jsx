import { useEffect, useMemo, useState } from 'react'
import { getProducts, updateProduct } from '../../services/adminApi.js'
import './AdminPages.css'

const LOW = 10
const PAGE = 50

const stockState = (p) => (p.stock === 0 ? 'out' : p.stock < LOW ? 'low' : 'ok')

export default function AdminInventory() {
  const [products, setProducts] = useState(null)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all') // all | low | out
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)
  const [drafts, setDrafts] = useState({}) // id -> stock text
  const [savingId, setSavingId] = useState(null)

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((e) => setError(e.message))
  }, [])

  const counts = useMemo(() => {
    const c = { all: 0, low: 0, out: 0 }
    products?.forEach((p) => {
      c.all++
      if (stockState(p) === 'low') c.low++
      if (stockState(p) === 'out') c.out++
    })
    return c
  }, [products])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (products || [])
      .filter((p) => filter === 'all' || stockState(p) === filter)
      .filter((p) => !q || [p.name, p.brand, p.sku].some((v) => v && v.toLowerCase().includes(q)))
      .sort((a, b) => a.stock - b.stock)
  }, [products, filter, query])

  const shown = filtered.slice(page * PAGE, (page + 1) * PAGE)
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE))

  const saveStock = async (p) => {
    const value = Number(drafts[p.id])
    if (!Number.isInteger(value) || value < 0) {
      setError('Stock must be a whole number, 0 or more.')
      return
    }
    setSavingId(p.id)
    setError('')
    try {
      const updated = await updateProduct(p.sku || p.id, { stock: value })
      setProducts((list) => list.map((x) => (x.id === p.id ? { ...x, stock: updated.stock } : x)))
      setDrafts((d) => {
        const next = { ...d }
        delete next[p.id]
        return next
      })
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
          <h1>Inventory</h1>
          <p>Stock goes down automatically when a customer places an order</p>
        </div>
        <input
          className="admin-search"
          placeholder="Search product…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setPage(0)
          }}
        />
      </div>

      <div className="admin-tabs">
        {[
          ['all', `All (${counts.all})`],
          ['low', `Low stock (${counts.low})`],
          ['out', `Out of stock (${counts.out})`],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={filter === key ? 'is-active' : ''}
            onClick={() => {
              setFilter(key)
              setPage(0)
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>In Stock</th>
              <th>Status</th>
              <th>Update stock</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((p) => {
              const st = stockState(p)
              return (
                <tr key={p.id}>
                  <td>
                    {p.name}
                    <small className="admin-table__sub">{p.sku}</small>
                  </td>
                  <td>{p.stock} units</td>
                  <td>
                    <span className={`admin-badge admin-badge--${st === 'out' ? 'danger' : st === 'low' ? 'pending' : 'success'}`}>
                      {st === 'out' ? 'Out of Stock' : st === 'low' ? 'Low Stock' : 'In Stock'}
                    </span>
                  </td>
                  <td>
                    <form
                      className="admin-inline-edit"
                      onSubmit={(e) => {
                        e.preventDefault()
                        saveStock(p)
                      }}
                    >
                      <input
                        type="number"
                        min="0"
                        placeholder={String(p.stock)}
                        value={drafts[p.id] ?? ''}
                        onChange={(e) => setDrafts((d) => ({ ...d, [p.id]: e.target.value }))}
                      />
                      <button type="submit" disabled={savingId === p.id || drafts[p.id] === undefined || drafts[p.id] === ''}>
                        Save
                      </button>
                    </form>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="admin-pager">
          <button type="button" disabled={page === 0} onClick={() => setPage(page - 1)}>‹ Prev</button>
          <span>Page {page + 1} of {pages}</span>
          <button type="button" disabled={page >= pages - 1} onClick={() => setPage(page + 1)}>Next ›</button>
        </div>
      )}
    </div>
  )
}
