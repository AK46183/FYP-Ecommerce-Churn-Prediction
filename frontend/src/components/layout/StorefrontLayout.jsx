import ChatWidget from '../chat/ChatWidget.jsx'
import WhatsAppButton from '../chat/WhatsAppButton.jsx'
import { Outlet } from 'react-router-dom'
import Header from '../header/Header.jsx'
import Footer from './Footer.jsx'
import CartDrawer from '../../pages/cart/CartDrawer.jsx'
import FlyToCart from '../cart/FlyToCart.jsx'
import ScrollToTop from './ScrollToTop.jsx'
export default function StorefrontLayout() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />

      {/* shopping bag drawer (opens from "View bag") */}
      <CartDrawer />

      {/* "Add to Bag" fly animation + message, for every product on the site */}
      <FlyToCart />
      {/* WhatsApp (Skincare Assistant ke upar) */}
      <WhatsAppButton />
      <ChatWidget />
    </>
  )
}
