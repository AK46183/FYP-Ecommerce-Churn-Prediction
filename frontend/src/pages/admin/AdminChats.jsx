import { useCallback, useEffect, useState } from 'react'
import { api } from '../../services/api.js'
import './AdminPages.css'
import './AdminChats.css'

// Admin: Skincare Assistant ki save hui chats (list + poori guftagu)
const fmt = (d) => (d ? new Date(d).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' }) : '-')
const LIMIT = 20

export default function AdminChats() {
  const [data, setData] = useState(null)
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [openId, setOpenId] = useState(null)
  const [chat, setChat] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setData(await api(`/chatbot/admin/sessions?page=${page}&limit=${LIMIT}&q=${encodeURIComponent(search)}`))
    } catch (err) {
      setError(err.message || 'Chats could not be loaded.')
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (!openId) return
    let alive = true
    setChat(null)
    api(`/chatbot/admin/sessions/${encodeURIComponent(openId)}`)
      .then((d) => alive && setChat(d))
      .catch((err) => alive && setError(err.message || 'Chat could not be opened.'))
    return () => {
      alive = false
    }
  }, [openId])

  // erasure request: customer ki chat mitao (do dafa click = pakka)
  const [confirmDel, setConfirmDel] = useState(false)
  const [deleting, setDeleting] = useState(false)
  useEffect(() => setConfirmDel(false), [openId])
  async function deleteChat() {
    if (!confirmDel) {
      setConfirmDel(true)
      setTimeout(() => setConfirmDel(false), 4000)
      return
    }
    setDeleting(true)
    try {
      await api(`/chatbot/admin/sessions/${encodeURIComponent(openId)}`, { method: 'DELETE' })
      setOpenId(null)
      setChat(null)
      load()
    } catch (err) {
      setError(err.message || 'Chat could not be deleted.')
    } finally {
      setDeleting(false)
      setConfirmDel(false)
    }
  }

  const pages = data ? Math.max(1, Math.ceil(data.total / LIMIT)) : 1
  const stats = data?.stats

  return (
    <div>
      <div className="admin-page__header">
        <div>
          <h1>Skincare Assistant Chats</h1>
          <p>Conversations customers had with the chatbot. Photos are never stored.</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setPage(1)
            setSearch(query.trim())
          }}
        >
          <input className="admin-search" placeholder="Search in messages…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </form>
      </div>

      {stats && (
        <div className="admin-chats__stats">
          <div><b>{stats.chats}</b><span>Chats</span></div>
          <div><b>{stats.messages}</b><span>Messages</span></div>
          <div><b>{stats.scans}</b><span>Used face scan</span></div>
          <div>
            <b>{stats.topConcerns.length ? stats.topConcerns.map((c) => c.concern.replace('_', ' ')).join(', ') : '-'}</b>
            <span>Top concerns</span>
          </div>
        </div>
      )}

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-chats">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>First message</th>
                <th>Skin</th>
                <th>Msgs</th>
                <th>Last active</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={5} className="admin-table__empty">Loading chats…</td></tr>
              )}
              {!loading && data?.sessions.length === 0 && (
                <tr><td colSpan={5} className="admin-table__empty">No chats yet.</td></tr>
              )}
              {!loading && data?.sessions.map((s) => (
                <tr
                  key={s.sessionId}
                  className={`admin-chats__row${openId === s.sessionId ? ' is-open' : ''}`}
                  onClick={() => setOpenId(s.sessionId)}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setOpenId(s.sessionId)}
                >
                  <td>
                    {s.userId ? `User #${s.userId}` : 'Guest'}
                    {s.usedScan && <span className="admin-chats__tag">scan</span>}
                  </td>
                  <td className="admin-table__message">{s.preview || <em>(photo only)</em>}</td>
                  <td>
                    {s.skinType || '-'}
                    {s.concerns.length > 0 && <div className="admin-table__sub">{s.concerns.join(', ').replaceAll('_', ' ')}</div>}
                  </td>
                  <td>{s.messageCount}</td>
                  <td>{fmt(s.lastMessageAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {pages > 1 && (
            <div className="admin-chats__pager">
              <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
              <span>Page {page} of {pages}</span>
              <button type="button" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>Next</button>
            </div>
          )}
        </div>

        <aside className="admin-chats__view" aria-live="polite">
          {!openId && <p className="admin-chats__hint">Select a chat to read it.</p>}
          {openId && !chat && <p className="admin-chats__hint">Opening chat…</p>}
          {chat && (
            <>
              <header>
                <strong>{chat.session.userId ? `User #${chat.session.userId}` : 'Guest'}</strong>
                <span>Started {fmt(chat.session.startedAt)} · {chat.session.messageCount} messages</span>
                <button type="button" className={`admin-chats__delete${confirmDel ? ' is-confirm' : ''}`} onClick={deleteChat} disabled={deleting}>
                  {deleting ? 'Deleting…' : confirmDel ? 'Click again to delete' : 'Delete chat'}
                </button>
              </header>
              <div className="admin-chats__msgs">
                {chat.messages.map((m, i) => (
                  <div key={i} className={`admin-chats__msg admin-chats__msg--${m.role}`}>
                    {m.hadImage && <em>Photo sent (not stored)</em>}
                    {m.text && <p>{m.text}</p>}
                    {m.scan && (
                      <small>
                        Scan: {Object.entries(m.scan).filter(([, v]) => v && v !== 'none' && v !== 'unknown').map(([k, v]) => `${k.replaceAll('_', ' ')} ${v === true ? 'yes' : v}`).join(' · ') || 'nothing notable'}
                      </small>
                    )}
                    {m.productSkus?.length > 0 && <small>Products: {m.productSkus.join(', ')}</small>}
                    {m.sources?.length > 0 && <small>Sources: {m.sources.map((s) => `${s.title} (${s.source}, ${s.sha256})`).join(' · ')}</small>}
                    <time>{fmt(m.at)}</time>
                  </div>
                ))}
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  )
}
