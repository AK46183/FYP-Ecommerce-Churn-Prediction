import WelcomeModal from './components/auth/WelcomeModal.jsx'
import PageTitle from './components/layout/PageTitle.jsx'
import { Routes, Route } from 'react-router-dom'
import StorefrontLayout from './components/layout/StorefrontLayout.jsx'
import { RequireAuth, RequireAdmin } from './routes/guards.jsx'

// Auth
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import ForgotPassword from './pages/auth/ForgotPassword.jsx'

// Home
import Home from './pages/home/Home.jsx'

// Products / categories
import ProductListing from './pages/products/ProductListing.jsx'
import ProductDetails from './pages/products/ProductDetails.jsx'

// Cart / checkout
import Cart from './pages/cart/Cart.jsx'
import Checkout from './pages/checkout/Checkout.jsx'

// Tips & Trends
import TipsDetail from './pages/tips/TipsDetail.jsx'

// Static / content pages
import OurBrandPage from './pages/categories/OurBrandPage.jsx'
import HelpCenter from './pages/categories/HelpCenter.jsx'
import ContactUs from './pages/categories/ContactUs.jsx'
import SimplePage from './pages/categories/SimplePage.jsx'

// Account
import AccountLayout from './pages/account/AccountLayout.jsx'
import Profile from './pages/account/Profile.jsx'
import Orders from './pages/account/Orders.jsx'
import OrderDetails from './pages/account/OrderDetails.jsx'
import Wishlist from './pages/account/Wishlist.jsx'
import Addresses from './pages/account/Addresses.jsx'

// Admin
import AdminLayout from './pages/admin/AdminLayout.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminProducts from './pages/admin/AdminProducts.jsx'
import AdminCategories from './pages/admin/AdminCategories.jsx'
import AdminInventory from './pages/admin/AdminInventory.jsx'
import AdminOrders from './pages/admin/AdminOrders.jsx'
import AdminCustomers from './pages/admin/AdminCustomers.jsx'
import AdminPromotions from './pages/admin/AdminPromotions.jsx'
import AdminBundles from './pages/admin/AdminBundles.jsx'
import AdminTipsTrends from './pages/admin/AdminTipsTrends.jsx'
import AdminHomepageContent from './pages/admin/AdminHomepageContent.jsx'
import AdminReports from './pages/admin/AdminReports.jsx'
import AdminSettings from './pages/admin/AdminSettings.jsx'

function NotFound() {
  return (
    <div style={{ padding: '6rem 2rem', textAlign: 'center' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', marginBottom: '1rem' }}>
        Page Not Found
      </h1>
      <p style={{ color: 'var(--color-charcoal-soft)' }}>
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
    </div>
  )
}

export default function App() {
  return (
    <>
    <PageTitle />
    <Routes>
      {/* ---------- Auth (no header/footer chrome) ---------- */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* ---------- Admin portal (protected, own layout) ---------- */}
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="inventory" element={<AdminInventory />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="promotions" element={<AdminPromotions />} />
        <Route path="bundles" element={<AdminBundles />} />
        <Route path="tips-trends" element={<AdminTipsTrends />} />
        <Route path="homepage" element={<AdminHomepageContent />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* ---------- Storefront (header + footer chrome) ---------- */}
      <Route element={<StorefrontLayout />}>
        <Route path="/" element={<Home />} />

        {/* Category listing routes: top-level and nested (e.g. /makeup/face) */}
        <Route path="/:category" element={<ProductListing />} />
        <Route path="/:category/:subCategory" element={<ProductListing />} />
        <Route path="/:category/:subCategory/:productType" element={<ProductListing />} />
        <Route path="/search" element={<ProductListing />} />

        {/* Product details */}
        <Route path="/product/:id" element={<ProductDetails />} />

        {/* Tips & Trends destination pages */}
        <Route path="/tips/:category" element={<TipsDetail />} />

        {/* Cart / checkout / wishlist */}
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/checkout"
          element={
            <RequireAuth>
              <Checkout />
            </RequireAuth>
          }
        />
        <Route path="/wishlist" element={<Wishlist />} />

        {/* Static / informational pages */}
        <Route path="/our-brand" element={<OurBrandPage />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/help/delivery" element={<SimplePage slug="delivery-options" />} />
        <Route path="/help/payment" element={<SimplePage slug="payment-methods" />} />
        <Route path="/help/returns" element={<SimplePage slug="return-policy" />} />
        <Route path="/help/privacy" element={<SimplePage slug="privacy-policy" />} />
        <Route path="/help/terms" element={<SimplePage slug="terms-conditions" />} />
        <Route path="/careers" element={<SimplePage slug="careers" />} />
        <Route path="/press" element={<SimplePage slug="press" />} />
        <Route path="/stores" element={<SimplePage slug="stores" />} />

        {/* Customer account (protected, nested layout) */}
        <Route
          path="/account"
          element={
            <RequireAuth>
              <AccountLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Profile />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:orderId" element={<OrderDetails />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="addresses" element={<Addresses />} />
          <Route path="track-order" element={<SimplePage slug="track-order" />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
       <WelcomeModal />
    </>
  )
}