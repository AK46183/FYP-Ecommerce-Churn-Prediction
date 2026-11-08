import { useEffect, useState } from 'react'
import { getAddresses, addAddress, updateAddress, deleteAddress } from '../../services/storeApi.js'
import './AccountPages.css'

const empty = { label: 'Home', fullName: '', phone: '', street: '', city: '', province: '', postal: '' }

export default function Addresses() {
  const [addresses, setAddresses] = useState(null)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState(empty)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const load = () =>
    getAddresses()
      .then(setAddresses)
      .catch((e) => setError(e.message))

  useEffect(() => {
    load()
  }, [])

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  async function handleAdd(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await addAddress(form)
      setForm(empty)
      setAdding(false)
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function makeDefault(id) {
    setError('')
    try {
      await updateAddress(id, { isDefault: true })
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  async function remove(id) {
    setError('')
    try {
      await deleteAddress(id)
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="account-card">
      <h2>Addresses</h2>

      {error && <p className="account-error">{error}</p>}

      {!addresses && !error && <p className="account-empty">Loading…</p>}
      {addresses?.length === 0 && !adding && <p className="account-empty">No saved addresses yet.</p>}

      <div className="address-grid" style={{ marginBottom: '1.5rem' }}>
        {addresses?.map((addr) => (
          <div className="address-card" key={addr.id}>
            <h4>
              {addr.label}
              {addr.isDefault && <span className="address-card__default">Default</span>}
            </h4>
            <p>
              {addr.fullName && <>{addr.fullName}<br /></>}
              {[addr.street, addr.city, addr.province, addr.postal].filter(Boolean).join(', ')}
              {addr.phone && <><br />{addr.phone}</>}
            </p>
            <div className="address-card__actions">
              {!addr.isDefault && (
                <button type="button" onClick={() => makeDefault(addr.id)}>Make default</button>
              )}
              <button type="button" onClick={() => remove(addr.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {adding ? (
        <form className="account-form" onSubmit={handleAdd}>
          <div className="account-form__field">
            <label>Label</label>
            <input value={form.label} onChange={update('label')} placeholder="Home / Office" />
          </div>
          <div className="account-form__field">
            <label>Full name</label>
            <input value={form.fullName} onChange={update('fullName')} />
          </div>
          <div className="account-form__field">
            <label>Phone</label>
            <input value={form.phone} onChange={update('phone')} placeholder="03001234567" />
          </div>
          <div className="account-form__field">
            <label>Street address</label>
            <input value={form.street} onChange={update('street')} required />
          </div>
          <div className="account-form__field">
            <label>City</label>
            <input value={form.city} onChange={update('city')} required />
          </div>
          <div className="account-form__field">
            <label>Province</label>
            <input value={form.province} onChange={update('province')} />
          </div>
          <div className="account-form__field">
            <label>Postal code</label>
            <input value={form.postal} onChange={update('postal')} />
          </div>
          <button type="submit" className="account-form__save" disabled={busy}>
            {busy ? 'Saving…' : 'Save Address'}
          </button>
          <button type="button" className="account-form__cancel" onClick={() => setAdding(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <button className="account-form__save" onClick={() => setAdding(true)}>
          Add New Address
        </button>
      )}
    </div>
  )
}
