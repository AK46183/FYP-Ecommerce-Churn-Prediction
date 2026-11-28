import AdminChats from './pages/admin/AdminChats.jsx'
import WelcomeModal from './components/auth/WelcomeModal.jsx'
import PageTitle from './components/layout/PageTitle.jsx'
import { Routes, Route, Outlet } from 'react-router-dom'
import StorefrontLayout from './components/layout/StorefrontLayout.jsx'
import { RequireAuth, RequireAdmin } from './routes/guards.jsx'

// Auth
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import ForgotPassword from './pages/auth/ForgotPassword.jsx'
import ResetPassword from './pages/auth/ResetPassword.jsx'

// Home
import Home from './pages/home/Home.jsx'

// Products / categories
import ProductListing from './pages/products/ProductListing.jsx'
import BundleOfferPage from './pages/bundle/BundleOfferPage.jsx'
import NewDropPage from './pages/new/NewDropPage.jsx'
import ProductDetails from './pages/products/ProductDetails.jsx'

// Cart / checkout
import Cart from './pages/cart/Cart.jsx'
import Checkout from './pages/checkout/Checkout.jsx'
import CheckoutPayment from './pages/checkout/CheckoutPayment.jsx'

// Tips & Trends
import TipsDetail from './pages/tips/TipsDetail.jsx'

// Static / content pages
import OurBrandPage from './pages/categories/OurBrandPage.jsx'
import HelpCenter from './pages/categories/HelpCenter.jsx'
import ContactUs from './pages/categories/ContactUs.jsx'
import SimplePage from './pages/categories/SimplePage.jsx'
import DeliveryOptions from './pages/help/DeliveryOptions.jsx'
import PaymentMethods from './pages/help/PaymentMethods.jsx'
import ReturnPolicy from './pages/help/ReturnPolicy.jsx'
import PrivacyPolicy from './pages/help/PrivacyPolicy.jsx'
import TermsConditions from './pages/help/TermsConditions.jsx'
import TrackOrder from './pages/help/TrackOrder.jsx'

// Account
import AccountLayout from './pages/account/AccountLayout.jsx'
import Profile from './pages/account/Profile.jsx'
import Orders from './pages/account/Orders.jsx'
import OrderDetails from './pages/account/OrderDetails.jsx'
import Wishlist from './pages/account/Wishlist.jsx'
import Addresses from './pages/account/Addresses.jsx'

// Admin
import AdminLayout from './pages/admin/AdminLayout.jsx'
import AdminHome from './pages/admin/AdminHome.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminChurn from './pages/admin/AdminChurn.jsx'
import AdminMarketing from './pages/admin/AdminMarketing.jsx'
import AdminStrategyBuilder from './pages/admin/AdminStrategyBuilder.jsx'
import AdminSale from './pages/admin/AdminSale.jsx'
import AdminProducts from './pages/admin/AdminProducts.jsx'
import AdminCategories from './pages/admin/AdminCategories.jsx'
import AdminInventory from './pages/admin/AdminInventory.jsx'
import AdminOrders from './pages/admin/AdminOrders.jsx'
import AdminCustomers from './pages/admin/AdminCustomers.jsx'
import AdminMessages from './pages/admin/AdminMessages.jsx'
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
        {/* ---------- Auth ---------- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ---------- Admin portal ---------- */}
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <Outlet />
            </RequireAdmin>
          }
        >
          {/* /admin → Choose your workspace (no sidebar) */}
          <Route index element={<AdminHome />} />

          {/* baaki sab pages sidebar layout ke andar */}
          <Route element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="churn" element={<AdminChurn />} />
            <Route path="marketing" element={<AdminMarketing />} />
            <Route path="marketing/new" element={<AdminStrategyBuilder />} />
            <Route path="sale" element={<AdminSale />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="chats" element={<AdminChats />} />
            <Route path="promotions" element={<AdminPromotions />} />
            <Route path="bundles" element={<AdminBundles />} />
            <Route path="tips-trends" element={<AdminTipsTrends />} />
            <Route path="homepage" element={<AdminHomepageContent />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>

        {/* ---------- Storefront ---------- */}
        <Route element={<StorefrontLayout />}>
          <Route path="/" element={<Home />} />

          <Route path="/new" element={<NewDropPage />} />

          <Route path="/bundle-offer" element={<BundleOfferPage />} />

          <Route path="/:category" element={<ProductListing />} />
          <Route path="/:category/:subCategory" element={<ProductListing />} />
          <Route path="/:category/:subCategory/:productType" element={<ProductListing />} />
          <Route path="/search" element={<ProductListing />} />

          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/tips/:category" element={<TipsDetail />} />

          <Route path="/cart" element={<Cart />} />
          <Route
            path="/checkout"
            element={
              <RequireAuth>
                <Checkout />
              </RequireAuth>
            }
          />
          <Route
            path="/checkout/payment"
            element={
              <RequireAuth>
                <CheckoutPayment />
              </RequireAuth>
            }
          />
          <Route path="/wishlist" element={<Wishlist />} />

          <Route path="/our-brand" element={<OurBrandPage />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/help/delivery" element={<DeliveryOptions />} />
          <Route path="/help/payment" element={<PaymentMethods />} />
          <Route path="/help/returns" element={<ReturnPolicy />} />
          <Route path="/help/privacy" element={<PrivacyPolicy />} />
          <Route path="/help/terms" element={<TermsConditions />} />
          <Route path="/careers" element={<SimplePage slug="careers" />} />
          <Route path="/press" element={<SimplePage slug="press" />} />
          <Route path="/stores" element={<SimplePage slug="stores" />} />

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
            <Route path="track-order" element={<TrackOrder />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <WelcomeModal />
    </>
  )
}