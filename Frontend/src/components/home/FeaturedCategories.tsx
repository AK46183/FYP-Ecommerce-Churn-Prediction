import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { ProductPhoto } from "@/components/ui/ProductPhoto";
import type { Category } from "@/data/products";
import { categoryCopy } from "@/data/products";

const CARD_BG: Record<Category, string> = {
  smartphones: "bg-ink",
  headphones: "bg-plum",
  cameras: "bg-umber",
};

const CARD_ACCENT: Record<Category, string> = {
  smartphones: "text-signal",
  headphones: "text-violet",
  cameras: "text-amber",
};

const CATEGORIES: Category[] = ["smartphones", "headphones", "cameras"];

export function FeaturedCategories() {
  return (
    <section className="bg-mist py-24 md:py-32">
      <div className="container-nexora">
        <Reveal>
          <span className="text-[13px] font-semibold uppercase tracking-[0.18em] text-slate">
            Shop by category
          </span>
          <h2 className="mt-4 max-w-xl text-balance text-[36px] font-extrabold leading-[1.08] tracking-tight text-graphite md:text-[48px]">
            Three categories. One standard.
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {CATEGORIES.map((category, i) => {
            const copy = categoryCopy[category];
            return (
              <Reveal key={category} delay={i * 0.1}>
                <Link
                  to={`/${category}`}
                  className={`group relative flex h-[440px] flex-col justify-end overflow-hidden rounded-2xl p-8 text-paper transition-shadow duration-500 hover:shadow-2xl md:h-[520px] ${CARD_BG[category]}`}
                >
                  <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]">
                    <ProductPhoto category={category} tilt={false} className="h-full w-full" />
                  </div>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  <div className="relative z-10 transition-transform duration-500 ease-out group-hover:-translate-y-1">
                    <h3 className="text-[24px] font-bold">{copy.label}</h3>
                    <p className="mt-2 max-w-[85%] text-[14px] text-white/70">{copy.headline}</p>
                    <span
                      className={`mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold ${CARD_ACCENT[category]}`}
                    >
                      Explore
                      <ArrowUpRight
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
