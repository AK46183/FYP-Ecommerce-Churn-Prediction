import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/Button";

const LABELS: Record<string, string> = {
  "/smartphones": "Smartphones",
  "/headphones": "Headphones",
  "/cameras": "Cameras",
  "/accessories": "Accessories",
  "/deals": "Deals",
  "/support": "Support",
  "/compare": "Compare",
  "/cart": "Cart",
  "/checkout": "Checkout",
  "/login": "Login",
  "/register": "Register",
  "/account": "Account",
  "/account/orders": "Orders",
  "/account/wishlist": "Wishlist",
  "/search": "Search",
};

export default function ComingSoon() {
  const { pathname } = useLocation();
  const label = LABELS[pathname] ?? "This page";

  return (
    <section className="flex min-h-[70svh] flex-col items-center justify-center bg-mist px-6 py-32 text-center">
      <span className="text-[13px] font-semibold uppercase tracking-[0.18em] text-slate">
        {label}
      </span>
      <h1 className="mt-4 text-balance text-[36px] font-extrabold tracking-tight text-graphite md:text-[48px]">
        Built for the next chapter.
      </h1>
      <p className="mt-4 max-w-md text-[16px] leading-relaxed text-slate">
        This part of NEXORA is still in progress. The homepage experience is live —
        check back soon for the full page.
      </p>
      <Button to="/" variant="primary" withArrow className="mt-8">
        Back to Home
      </Button>
    </section>
  );
}
