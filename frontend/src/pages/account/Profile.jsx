import { useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import './AccountPages.css'

export default function Profile() {
  const { user } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [saved, setSaved] = useState(false)

  function handleSave(e) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="account-card">
      <h2>Profile</h2>
      <form className="account-form" onSubmit={handleSave}>
        <div className="account-form__field">
          <label>Full name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="account-form__field">
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
        </div>
        <div className="account-form__field">
          <label>Phone number</label>
          <input placeholder="+92 300 0000000" />
        </div>
        <button type="submit" className="account-form__save">
          {saved ? 'Saved ✓' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
