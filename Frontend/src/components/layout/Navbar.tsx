import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Only the homepage opens on a full-bleed dark hero, so only there does the
// navbar start transparent-over-dark. Every other page defaults to the
// opaque, legible styling regardless of scroll position.
const TRANSPARENT_HERO_ROUTES = new Set(["/"]);

const NAV_LINKS = [
  { label: "Smartphones", to: "/smartphones" },
  { label: "Headphones", to: "/headphones" },
  { label: "Cameras", to: "/cameras" },
  { label: "Accessories", to: "/accessories" },
];

const MOBILE_LINKS = [...NAV_LINKS, { label: "Deals", to: "/deals" }, { label: "Support", to: "/support" }];

const cartCount = 0;

export function Navbar() {
  const { pathname } = useLocation();
  const hasTransparentHero = TRANSPARENT_HERO_ROUTES.has(pathname);
  const [scrolled, setScrolled] = useState(!hasTransparentHero);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!hasTransparentHero) {
      setScrolled(true);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasTransparentHero]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          scrolled
            ? "border-b border-white/10 bg-ink/70 py-3 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent py-5",
        )}
      >
        <nav className="container-nexora flex items-center justify-between text-paper" aria-label="Primary">
          <Link
            to="/"
            className="text-[20px] font-extrabold tracking-[0.12em] text-paper focus-visible:outline-signal"
          >
            NEXORA
          </Link>

          <ul className="hidden items-center gap-9 md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    cn(
                      "relative py-1 text-[14px] font-medium text-white/80 transition-colors duration-300 hover:text-paper",
                      "after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-signal after:transition-all after:duration-300 hover:after:w-full",
                      isActive && "text-paper after:w-full",
                    )
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1">
            <IconButton label="Search">
              <Search className="h-[18px] w-[18px]" aria-hidden="true" />
            </IconButton>
            <IconButton label="Account" className="hidden sm:inline-flex">
              <User className="h-[18px] w-[18px]" aria-hidden="true" />
            </IconButton>
            <IconButton label="Wishlist" className="hidden sm:inline-flex">
              <Heart className="h-[18px] w-[18px]" aria-hidden="true" />
            </IconButton>
            <IconButton label={`Cart, ${cartCount} items`}>
              <ShoppingBag className="h-[18px] w-[18px]" aria-hidden="true" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-signal px-1 text-[10px] font-bold text-ink">
                  {cartCount}
                </span>
              )}
            </IconButton>
            <button
              type="button"
              className="ml-1 inline-flex h-11 w-11 items-center justify-center rounded-full text-paper transition-colors hover:bg-white/10 md:hidden"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[60] bg-ink/60 backdrop-blur-sm md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              className="ml-auto flex h-full w-[82%] max-w-sm flex-col bg-ink-soft px-6 py-6 text-paper"
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
                <span className="text-lg font-extrabold tracking-[0.12em]">NEXORA</span>
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-white/10"
                  aria-label="Close menu"
                  onClick={() => setMobileOpen(false)}
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              <ul className="mt-10 flex flex-col gap-1">
                {MOBILE_LINKS.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className="block min-h-11 border-b border-white/10 py-4 text-[19px] font-medium text-white/90 transition-colors hover:text-signal"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex items-center gap-4 pt-6 text-white/70">
                <Link to="/account" className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4" aria-hidden="true" /> Account
                </Link>
                <Link to="/account/wishlist" className="flex items-center gap-2 text-sm">
                  <Heart className="h-4 w-4" aria-hidden="true" /> Wishlist
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function IconButton({
  children,
  label,
  className,
}: {
  children: React.ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "relative inline-flex h-11 w-11 items-center justify-center rounded-full text-paper transition-colors duration-200 hover:bg-white/10",
        className,
      )}
    >
      {children}
    </button>
  );
}
