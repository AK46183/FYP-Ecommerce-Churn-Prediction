import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Home from "@/pages/Home";
import ProductPreview from "@/pages/ProductPreview";
import ComingSoon from "@/pages/ComingSoon";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const PLACEHOLDER_ROUTES = [
  "/smartphones",
  "/headphones",
  "/cameras",
  "/accessories",
  "/deals",
  "/support",
  "/compare",
  "/cart",
  "/checkout",
  "/login",
  "/register",
  "/account",
  "/account/orders",
  "/account/wishlist",
  "/search",
];

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:slug" element={<ProductPreview />} />
          {PLACEHOLDER_ROUTES.map((path) => (
            <Route key={path} path={path} element={<ComingSoon />} />
          ))}
          <Route path="*" element={<ComingSoon />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
