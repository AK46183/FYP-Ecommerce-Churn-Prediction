import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { FacebookGlyph, InstagramGlyph, TiktokGlyph, YoutubeGlyph } from "@/components/ui/SocialIcons";

const COLUMNS: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: "Products",
    links: [
      { label: "Smartphones", to: "/smartphones" },
      { label: "Headphones", to: "/headphones" },
      { label: "Cameras", to: "/cameras" },
      { label: "Accessories", to: "/accessories" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact", to: "/support" },
      { label: "Shipping", to: "/support/shipping" },
      { label: "Returns", to: "/support/returns" },
      { label: "Warranty", to: "/support/warranty" },
      { label: "FAQs", to: "/support/faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Careers", to: "/careers" },
      { label: "Privacy", to: "/privacy" },
      { label: "Terms", to: "/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-ink text-white/70">
      <div className="container-nexora border-b border-white/10 py-16">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-[28px] font-bold text-paper md:text-[32px]">Stay in the loop.</h2>
            <p className="mt-2 max-w-sm text-[15px] text-white/60">
              Product news, launch dates, and considered updates. No noise.
            </p>
          </div>
          <form
            className="flex w-full max-w-md items-center gap-3"
            onSubmit={(e) => e.preventDefault()}
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="Enter your email"
              className="h-12 w-full min-w-0 rounded-[10px] border border-white/15 bg-white/5 px-4 text-[15px] text-paper placeholder:text-white/40 focus-visible:outline-signal"
            />
            <Button type="submit" variant="primary-inverse" className="shrink-0">
              Subscribe
            </Button>
          </form>
        </div>
      </div>

      <div className="container-nexora grid grid-cols-2 gap-10 py-16 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <span className="text-lg font-extrabold tracking-[0.12em] text-paper">NEXORA</span>
          <p className="mt-4 max-w-[220px] text-sm text-white/50">
            Technology, in its purest form.
          </p>
          <div className="mt-6 flex items-center gap-3">
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
            <h3 className="text-[13px] font-semibold uppercase tracking-wider text-white/40">
              {col.title}
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {col.links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-[14px] text-white/70 transition-colors hover:text-paper"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="container-nexora flex flex-col items-center justify-between gap-3 border-t border-white/10 py-6 text-xs text-white/40 sm:flex-row">
        <p>© 2026 NEXORA. All rights reserved.</p>
        <p>Designed for people who notice detail.</p>
      </div>
    </footer>
  );
}

function SocialIcon({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-signal hover:text-signal"
    >
      {children}
    </a>
  );
}
