import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { CreditCard, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProductPhoto } from "@/components/ui/ProductPhoto";
import { formatPrice } from "@/lib/utils";
import { products } from "@/data/products";

const TRUST_ITEMS = [
  { icon: ShieldCheck, label: "100% Authentic" },
  { icon: Truck, label: "Free Shipping" },
  { icon: RotateCcw, label: "Easy 30-Day Returns" },
  { icon: CreditCard, label: "Secure Payment" },
];

const crossSell = products.find((p) => p.slug === "nexora-air-pro")!;

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const productY = useTransform(scrollYProgress, [0, 1], [0, 40]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-mist">
      {/* soft organic background blobs, kept very subtle */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full bg-blush-soft" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-[320px] w-[320px] rounded-full bg-ink/[0.04]" aria-hidden="true" />

      <div className="container-nexora relative grid grid-cols-1 items-center gap-12 py-16 md:py-24 lg:grid-cols-2 lg:py-28">
        <div>
          <span className="text-[12px] font-semibold uppercase tracking-[0.2em] text-signal">
            New Arrival
          </span>
          <h1 className="mt-4 text-balance text-[44px] font-extrabold leading-[1.05] tracking-tight text-ink sm:text-[56px] lg:text-[64px]">
            Technology,
            <br />
            <span className="text-signal">in its purest form.</span>
          </h1>
          <p className="mt-5 max-w-md text-balance text-[16px] leading-relaxed text-slate md:text-[18px]">
            Designed to disappear into your life. Engineered to stand out when it matters.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button to="/product/nexora-x1-pro" variant="primary" withArrow>
              Shop Now
            </Button>
            <Button to="/smartphones" variant="secondary">
              Explore Range
            </Button>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
            {TRUST_ITEMS.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <item.icon className="h-4 w-4 shrink-0 text-signal" aria-hidden="true" />
                <span className="text-[12px] font-medium text-slate">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <motion.div className="relative flex justify-center lg:justify-end" style={{ y: productY }}>
          <div className="absolute right-6 top-6 z-10 flex items-center gap-1.5 rounded-full bg-blush px-4 py-2 text-[13px] font-bold text-ink shadow-sm sm:right-10 sm:top-10">
            Up to 25% off
          </div>

          <div className="aspect-[4/5] w-[260px] sm:w-[320px] lg:w-[380px]">
            <ProductPhoto
              category="smartphones"
              glow
              priority
              rounded="rounded-[28px]"
              className="border border-graphite/10 shadow-[0_30px_70px_rgba(43,38,32,0.14)]"
            />
          </div>

          <Link
            to={`/product/${crossSell.slug}`}
            className="absolute -bottom-4 left-0 flex w-[200px] items-center gap-3 rounded-2xl border border-graphite/10 bg-paper p-3 shadow-[0_20px_45px_rgba(43,38,32,0.14)] sm:-left-6"
          >
            <div className="h-14 w-14 shrink-0">
              <ProductPhoto category="headphones" tilt={false} rounded="rounded-[12px]" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-ink">{crossSell.name}</p>
              <p className="text-[13px] font-bold text-signal">{formatPrice(crossSell.price)}</p>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
