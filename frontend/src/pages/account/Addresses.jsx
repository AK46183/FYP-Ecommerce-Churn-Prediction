import { useState } from 'react'
import './AccountPages.css'

const initialAddresses = [
  {
    id: 1,
    label: 'Home',
    detail: '24 Gulberg Boulevard, Lahore, Punjab, Pakistan',
  },
]

export default function Addresses() {
  const [addresses, setAddresses] = useState(initialAddresses)
  const [adding, setAdding] = useState(false)
  const [newAddress, setNewAddress] = useState('')

  function handleAdd(e) {
    e.preventDefault()
    if (!newAddress.trim()) return
    setAddresses((prev) => [
      ...prev,
      { id: Date.now(), label: 'Address', detail: newAddress.trim() },
    ])
    setNewAddress('')
    setAdding(false)
  }

  return (
    <div className="account-card">
      <h2>Addresses</h2>

      <div className="address-grid" style={{ marginBottom: '1.5rem' }}>
        {addresses.map((addr) => (
          <div className="address-card" key={addr.id}>
            <h4>{addr.label}</h4>
            <p>{addr.detail}</p>
          </div>
        ))}
      </div>

      {adding ? (
        <form className="account-form" onSubmit={handleAdd}>
          <div className="account-form__field">
            <label>New address</label>
            <input value={newAddress} onChange={(e) => setNewAddress(e.target.value)} required />
          </div>
          <button type="submit" className="account-form__save">
            Save Address
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
