import { Link } from "react-router-dom";
import { Reveal } from "@/components/ui/Reveal";
import { ProductPhoto } from "@/components/ui/ProductPhoto";
import type { Category } from "@/data/products";
import { categoryCopy, getProductsByCategory } from "@/data/products";

const CATEGORIES: Category[] = ["smartphones", "headphones", "cameras"];

export function CategoryIconRow() {
  return (
    <section id="shop-by-category" className="scroll-mt-40 bg-paper py-16 md:py-20">
      <div className="container-nexora">
        <Reveal className="text-center">
          <h2 className="text-[26px] font-extrabold tracking-tight text-ink md:text-[30px]">
            Shop by Category
          </h2>
        </Reveal>

        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
          {CATEGORIES.map((category, i) => {
            const copy = categoryCopy[category];
            const count = getProductsByCategory(category).length;
            return (
              <Reveal key={category} delay={i * 0.08}>
                <Link
                  to={`/${category}`}
                  className="group flex flex-col items-center rounded-2xl border border-graphite/10 bg-mist p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(43,38,32,0.08)]"
                >
                  <div className="h-24 w-24 overflow-hidden rounded-full ring-4 ring-paper transition-transform duration-300 group-hover:scale-105">
                    <ProductPhoto category={category} tilt={false} rounded="rounded-full" />
                  </div>
                  <h3 className="mt-4 text-[16px] font-semibold text-ink">{copy.label}</h3>
                  <p className="mt-1 text-[13px] text-slate">{count}+ products</p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
