import { NavLink, Outlet, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Boxes,
  ShoppingCart,
  Users,
  Tag,
  Gift,
  Sparkles,
  Home,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import './AdminLayout.css'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: FolderTree },
  { to: '/admin/inventory', label: 'Inventory', icon: Boxes },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/promotions', label: 'Promotions', icon: Tag },
  { to: '/admin/bundles', label: 'Bundle Offers', icon: Gift },
  { to: '/admin/tips-trends', label: 'Tips & Trends Content', icon: Sparkles },
  { to: '/admin/homepage', label: 'Homepage Content', icon: Home },
  { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link to="/admin" className="admin-sidebar__brand">
          <img src="/images/minaysh-logo.png" alt="MINAYSH" />
          <span>Admin</span>
        </Link>

        <nav className="admin-sidebar__nav">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `admin-sidebar__link ${isActive ? 'is-active' : ''}`}
            >
              <Icon size={17} strokeWidth={1.5} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__user">
            <span>{user?.email}</span>
            <small>Administrator</small>
          </div>
          <button onClick={logout} aria-label="Log out">
            <LogOut size={16} strokeWidth={1.5} />
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}
