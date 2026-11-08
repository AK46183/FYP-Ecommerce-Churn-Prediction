import { NavLink, Outlet } from 'react-router-dom'
import { User, Package, Heart, MapPin, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import PageHeader from '../../components/common/PageHeader.jsx'
import './AccountLayout.css'

const links = [
  { to: '/account', label: 'Profile', icon: User, end: true },
  { to: '/account/orders', label: 'Orders', icon: Package },
  { to: '/account/wishlist', label: 'Wishlist', icon: Heart },
  { to: '/account/addresses', label: 'Addresses', icon: MapPin },
]

export default function AccountLayout() {
  const { user, logout } = useAuth()

  return (
    <>
      <PageHeader title="My Account" subtitle={user ? `Signed in as ${user.email}` : ''} />
      <section className="account-page">
        <div className="container account-page__layout">
          <aside className="account-sidebar">
            {links.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) => `account-sidebar__link ${isActive ? 'is-active' : ''}`}
              >
                <Icon size={17} strokeWidth={1.5} />
                {label}
              </NavLink>
            ))}
            <button className="account-sidebar__link account-sidebar__logout" onClick={logout}>
              <LogOut size={17} strokeWidth={1.5} />
              Logout
            </button>
          </aside>

          <div className="account-content">
            <Outlet />
          </div>
        </div>
      </section>
    </>
  )
}
