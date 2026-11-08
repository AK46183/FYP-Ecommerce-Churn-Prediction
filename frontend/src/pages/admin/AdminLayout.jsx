import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom'
import {
  Home,
  LayoutDashboard,
  Activity,
  Megaphone,
  CalendarClock,
  Package,
  FolderTree,
  Boxes,
  ShoppingCart,
  Users,
  Tag,
  Gift,
  Sparkles,
  LayoutTemplate,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import './AdminLayout.css'
import './AdminTheme.css'

// Sidebar ke links — upar wale 5 main workspaces, neeche baaki store ke pages
const mainItems = [
  { to: '/admin', label: 'Home', icon: Home, end: true },
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/churn', label: 'Churn Monitoring', icon: Activity },
  { to: '/admin/marketing', label: 'Marketing Strategy', icon: Megaphone },
  { to: '/admin/sale', label: 'Upcoming Sale', icon: CalendarClock },
]

const storeItems = [
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: FolderTree },
  { to: '/admin/inventory', label: 'Inventory', icon: Boxes },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/promotions', label: 'Promotions', icon: Tag },
  { to: '/admin/bundles', label: 'Bundle Offers', icon: Gift },
  { to: '/admin/tips-trends', label: 'Tips & Trends Content', icon: Sparkles },
  { to: '/admin/homepage', label: 'Homepage Content', icon: LayoutTemplate },
  { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

function NavItem({ to, label, icon: Icon, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => `admin-sidebar__link ${isActive ? 'is-active' : ''}`}
    >
      <Icon size={17} strokeWidth={1.5} />
      {label}
    </NavLink>
  )
}

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link to="/admin" className="admin-sidebar__brand">
          <img src="/images/minaysh-logo.png" alt="MINAYSH" />
          <span>Admin</span>
        </Link>

        <nav className="admin-sidebar__nav">
          <small className="admin-sidebar__group">Workspaces</small>
          {mainItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}

          <small className="admin-sidebar__group">Store</small>
          {storeItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__user">
            <span>{user?.email}</span>
            <small>Administrator</small>
          </div>
          <button onClick={handleLogout} aria-label="Log out">
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