import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Grid2x2,
  Headphones,
  Heart,
  Mail,
  Menu,
  Phone,
  Scale,
  Search,
  ShoppingBag,
  Truck,
  User,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Smartphones", to: "/smartphones" },
  { label: "Headphones", to: "/headphones" },
  { label: "Cameras", to: "/cameras" },
  { label: "Accessories", to: "/accessories" },
  { label: "Deals", to: "/deals" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/support" },
];

const MOBILE_LINKS = NAV_LINKS;

const cartCount = 0;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-paper">
        {/* Utility bar */}
        <div className="hidden bg-ink text-white/85 md:block">
          <div className="container-nexora flex items-center justify-between py-2 text-[12px]">
            <div className="flex items-center gap-5">
              <span className="flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5" aria-hidden="true" />
                Free shipping on orders over $79
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                (415) 123-4567
              </span>
            </div>
            <div className="flex items-center gap-5">
              <Link to="/account/orders" className="hover:text-paper">
                Track Order
              </Link>
              <Link to="/support" className="hover:text-paper">
                Help Center
              </Link>
            </div>
          </div>
        </div>

        {/* Main bar */}
        <div
          className={cn(
            "border-b border-graphite/10 transition-shadow duration-300",
            scrolled && "shadow-[0_2px_16px_rgba(43,38,32,0.06)]",
          )}
        >
          <div className="container-nexora flex items-center gap-6 py-4">
            <Link to="/" className="shrink-0">
              <span className="block text-[20px] font-extrabold tracking-[0.08em] text-ink">
                NEXORA
              </span>
              <span className="block text-[11px] text-slate">Technology, Refined.</span>
            </Link>

            <div className="hidden flex-1 items-center md:flex">
              <label htmlFor="nav-search" className="sr-only">
                Search products
              </label>
              <div className="flex w-full max-w-xl items-center overflow-hidden rounded-full border border-graphite/15 bg-mist">
                <input
                  id="nav-search"
                  type="search"
                  placeholder="Search phones, headphones, cameras…"
                  className="h-11 w-full bg-transparent px-4 text-[14px] text-graphite placeholder:text-slate focus:outline-none"
                />
                <button
                  type="button"
                  aria-label="Search"
                  className="flex h-11 w-12 shrink-0 items-center justify-center bg-ink text-paper transition-colors hover:bg-ink-soft"
                >
                  <Search className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-1 md:ml-0">
              <NavIcon to="/compare" label="Compare" icon={Scale} className="hidden lg:inline-flex" />
              <NavIcon to="/account/wishlist" label="Wishlist" icon={Heart} className="hidden sm:inline-flex" />
              <NavIcon to="/cart" label="Cart" icon={ShoppingBag} count={cartCount} />
              <NavIcon to="/account" label="Account" icon={User} className="hidden sm:inline-flex" />
              <button
                type="button"
                className="ml-1 inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-mist md:hidden"
                aria-label="Open menu"
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Category / nav-links row */}
        <div className="hidden border-b border-graphite/10 bg-mist md:block">
          <div className="container-nexora flex items-center gap-8 py-2.5">
            <a
              href="#shop-by-category"
              className="flex shrink-0 items-center gap-2 rounded-full bg-ink px-4 py-2 text-[13px] font-semibold text-paper transition-colors hover:bg-ink-soft"
            >
              <Grid2x2 className="h-4 w-4" aria-hidden="true" />
              Shop by Category
            </a>
            <ul className="flex items-center gap-6">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === "/"}
                    className={({ isActive }) =>
                      cn(
                        "text-[13px] font-medium text-graphite/70 transition-colors hover:text-ink",
                        isActive && "font-semibold text-ink",
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              className="ml-auto flex h-full w-[82%] max-w-sm flex-col bg-paper px-6 py-6"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-extrabold tracking-[0.08em] text-ink">NEXORA</span>
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center rounded-full text-ink hover:bg-mist"
                  aria-label="Close menu"
                  onClick={() => setMobileOpen(false)}
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              <div className="mt-6 flex items-center overflow-hidden rounded-full border border-graphite/15 bg-mist">
                <input
                  type="search"
                  placeholder="Search products…"
                  className="h-11 w-full bg-transparent px-4 text-[14px] text-graphite placeholder:text-slate focus:outline-none"
                />
                <span className="flex h-11 w-12 shrink-0 items-center justify-center text-ink">
                  <Search className="h-4 w-4" aria-hidden="true" />
                </span>
              </div>

              <ul className="mt-6 flex flex-col gap-1">
                {MOBILE_LINKS.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className="block min-h-11 border-b border-graphite/10 py-4 text-[17px] font-medium text-graphite/90 transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex items-center gap-5 pt-6 text-slate">
                <Link to="/account" className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4" aria-hidden="true" /> Account
                </Link>
                <Link to="/account/wishlist" className="flex items-center gap-2 text-sm">
                  <Heart className="h-4 w-4" aria-hidden="true" /> Wishlist
                </Link>
                <Link to="/compare" className="flex items-center gap-2 text-sm">
                  <Headphones className="h-4 w-4" aria-hidden="true" /> Compare
                </Link>
              </div>
              <p className="mt-4 flex items-center gap-1.5 text-[12px] text-slate">
                <Mail className="h-3.5 w-3.5" aria-hidden="true" /> support@nexora.com
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavIcon({
  to,
  label,
  icon: Icon,
  count,
  className = "inline-flex",
}: {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  count?: number;
  className?: string;
}) {
  return (
    <Link
      to={to}
      aria-label={count !== undefined ? `${label}, ${count} items` : label}
      className={cn(
        "relative h-11 w-11 flex-col items-center justify-center rounded-full text-ink transition-colors hover:bg-mist",
        className,
      )}
    >
      <Icon className="h-[19px] w-[19px]" aria-hidden={true} />
      {count !== undefined && count > 0 && (
        <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-blush px-1 text-[10px] font-bold text-ink">
          {count}
        </span>
      )}
    </Link>
  );
}
