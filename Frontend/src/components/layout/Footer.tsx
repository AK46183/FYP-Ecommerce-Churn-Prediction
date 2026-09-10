import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { FacebookGlyph, InstagramGlyph, TiktokGlyph, YoutubeGlyph } from "@/components/ui/SocialIcons";

const COLUMNS: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "All Products", to: "/smartphones" },
      { label: "Smartphones", to: "/smartphones" },
      { label: "Headphones", to: "/headphones" },
      { label: "Cameras", to: "/cameras" },
      { label: "Accessories", to: "/accessories" },
    ],
  },
  {
    title: "Customer Service",
    links: [
      { label: "Contact Us", to: "/support" },
      { label: "Shipping & Delivery", to: "/support/shipping" },
      { label: "Returns & Refunds", to: "/support/returns" },
      { label: "Warranty", to: "/support/warranty" },
      { label: "FAQs", to: "/support/faq" },
    ],
  },
  {
    title: "Shop by Category",
    links: [
      { label: "Smartphones", to: "/smartphones" },
      { label: "Headphones", to: "/headphones" },
      { label: "Cameras", to: "/cameras" },
      { label: "Deals", to: "/deals" },
    ],
  },
];

const PAYMENT_METHODS = ["Visa", "Mastercard", "PayPal", "Apple Pay", "Google Pay"];

export function Footer() {
  return (
    <footer className="border-t border-graphite/10 bg-mist text-slate">
      <div className="container-nexora grid grid-cols-2 gap-10 py-16 md:grid-cols-5">
        <div className="col-span-2 md:col-span-2">
          <span className="text-lg font-extrabold tracking-[0.08em] text-ink">NEXORA</span>
          <p className="mt-3 max-w-[260px] text-[13px] leading-relaxed text-slate">
            Your one-stop destination for premium smartphones, headphones, and cameras — quality,
            trust, and performance in every product.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <SocialIcon label="Instagram">
              <InstagramGlyph className="h-4 w-4" />
            </SocialIcon>
            <SocialIcon label="Facebook">
              <FacebookGlyph className="h-4 w-4" />
            </SocialIcon>
            <SocialIcon label="YouTube">
              <YoutubeGlyph className="h-4 w-4" />
            </SocialIcon>
            <SocialIcon label="TikTok">
              <TiktokGlyph className="h-4 w-4" />
            </SocialIcon>
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="text-[13px] font-semibold uppercase tracking-wider text-ink">
              {col.title}
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {col.links.map((link) => (
                <li key={`${col.title}-${link.label}`}>
                  <Link to={link.to} className="text-[13px] text-slate transition-colors hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="text-[13px] font-semibold uppercase tracking-wider text-ink">Contact Us</h3>
          <ul className="mt-4 flex flex-col gap-3 text-[13px] text-slate">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              123 Tech Street, San Francisco, CA
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
              (415) 123-4567
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
              support@nexora.com
            </li>
          </ul>
        </div>
      </div>

      <div className="container-nexora flex flex-col items-center justify-between gap-4 border-t border-graphite/10 py-6 text-xs text-slate sm:flex-row">
        <p>© 2026 NEXORA. All rights reserved.</p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="mr-1 text-[11px] uppercase tracking-wide text-slate/80">We Accept</span>
          {PAYMENT_METHODS.map((method) => (
            <span
              key={method}
              className="rounded-md border border-graphite/15 bg-paper px-2.5 py-1 text-[11px] font-medium text-ink"
            >
              {method}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-graphite/15 text-slate transition-colors hover:border-signal hover:text-signal"
    >
      {children}
    </a>
  );
}
