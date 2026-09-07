import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { StoreProvider } from '@/context/StoreContext'
import { initSessionTracking } from '@/services/tracking'
import { useEffect } from 'react'
import CustomerLayout from '@/components/layout/CustomerLayout'
import AdminLayout from '@/components/layout/AdminLayout'
import { CustomerRoute, AdminRoute } from '@/routes/ProtectedRoutes'

// Customer pages
import Home from '@/pages/customer/Home'
import Shop from '@/pages/customer/Shop'
import CategoryPage from '@/pages/customer/CategoryPage'
import ProductDetails from '@/pages/customer/ProductDetails'
import SearchResults from '@/pages/customer/SearchResults'
import Wishlist from '@/pages/customer/Wishlist'
import Cart from '@/pages/customer/Cart'
import Checkout from '@/pages/customer/Checkout'
import OrderSuccess from '@/pages/customer/OrderSuccess'
import Login from '@/pages/customer/Login'
import Register from '@/pages/customer/Register'
import ForgotPassword from '@/pages/customer/ForgotPassword'
import Profile from '@/pages/customer/Profile'
import MyOrders from '@/pages/customer/MyOrders'
import OrderDetails from '@/pages/customer/OrderDetails'
import Notifications from '@/pages/customer/Notifications'
import About from '@/pages/customer/About'
import Contact from '@/pages/customer/Contact'
import NotFound from '@/pages/customer/NotFound'

// Admin pages
import AdminLogin from '@/pages/admin/AdminLogin'
import Dashboard from '@/pages/admin/Dashboard'
import AdminProducts from '@/pages/admin/AdminProducts'
import AddProduct from '@/pages/admin/AddProduct'
import EditProduct from '@/pages/admin/EditProduct'
import AdminCategories from '@/pages/admin/AdminCategories'
import Inventory from '@/pages/admin/Inventory'
import AdminOrders from '@/pages/admin/AdminOrders'
import AdminCustomers from '@/pages/admin/AdminCustomers'
import CustomerDetails from '@/pages/admin/CustomerDetails'
import ChurnAnalytics from '@/pages/admin/ChurnAnalytics'
import CustomerSegmentation from '@/pages/admin/CustomerSegmentation'
import RetentionActions from '@/pages/admin/RetentionActions'
import ChatbotLogs from '@/pages/admin/ChatbotLogs'
import Reports from '@/pages/admin/Reports'
import AdminNotifications from '@/pages/admin/AdminNotifications'
import AdminSettings from '@/pages/admin/AdminSettings'

function AnimatedRoutes() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname.split('/').slice(0, 2).join('/')}>
        {/* Customer routes */}
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/profile" element={<CustomerRoute><Profile /></CustomerRoute>} />
          <Route path="/orders" element={<CustomerRoute><MyOrders /></CustomerRoute>} />
          <Route path="/orders/:id" element={<CustomerRoute><OrderDetails /></CustomerRoute>} />
          <Route path="/notifications" element={<CustomerRoute><Notifications /></CustomerRoute>} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route path="/admin/products" element={<AdminRoute><AdminLayout><AdminProducts /></AdminLayout></AdminRoute>} />
        <Route path="/admin/products/add" element={<AdminRoute><AdminLayout><AddProduct /></AdminLayout></AdminRoute>} />
        <Route path="/admin/products/:id/edit" element={<AdminRoute><AdminLayout><EditProduct /></AdminLayout></AdminRoute>} />
        <Route path="/admin/categories" element={<AdminRoute><AdminLayout><AdminCategories /></AdminLayout></AdminRoute>} />
        <Route path="/admin/inventory" element={<AdminRoute><AdminLayout><Inventory /></AdminLayout></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><AdminLayout><AdminOrders /></AdminLayout></AdminRoute>} />
        <Route path="/admin/customers" element={<AdminRoute><AdminLayout><AdminCustomers /></AdminLayout></AdminRoute>} />
        <Route path="/admin/customers/:id" element={<AdminRoute><AdminLayout><CustomerDetails /></AdminLayout></AdminRoute>} />
        <Route path="/admin/churn" element={<AdminRoute><AdminLayout><ChurnAnalytics /></AdminLayout></AdminRoute>} />
        <Route path="/admin/segmentation" element={<AdminRoute><AdminLayout><CustomerSegmentation /></AdminLayout></AdminRoute>} />
        <Route path="/admin/retention" element={<AdminRoute><AdminLayout><RetentionActions /></AdminLayout></AdminRoute>} />
        <Route path="/admin/chatbot-logs" element={<AdminRoute><AdminLayout><ChatbotLogs /></AdminLayout></AdminRoute>} />
        <Route path="/admin/reports" element={<AdminRoute><AdminLayout><Reports /></AdminLayout></AdminRoute>} />
        <Route path="/admin/notifications" element={<AdminRoute><AdminLayout><AdminNotifications /></AdminLayout></AdminRoute>} />
        <Route path="/admin/settings" element={<AdminRoute><AdminLayout><AdminSettings /></AdminLayout></AdminRoute>} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  useEffect(() => {
    const cleanup = initSessionTracking()
    return cleanup
  }, [])

  return (
    <StoreProvider>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </StoreProvider>
  )
}
