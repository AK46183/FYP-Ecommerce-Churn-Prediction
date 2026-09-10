import { CameraArt, HeadphoneArt, PhoneArt } from "@/components/ui/DeviceArt";
import { ProductCard } from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { formatPrice } from "@/lib/utils";
import { getFeaturedProducts, products } from "@/data/products";

const ART = { smartphones: PhoneArt, headphones: HeadphoneArt, cameras: CameraArt };

export function FeaturedProducts() {
  const featured = getFeaturedProducts();
  const gridProducts = products.filter((p) => !p.featured).slice(0, 8);

  return (
    <section className="bg-mist py-24 md:py-32">
      <div className="container-nexora">
        <Reveal>
          <span className="text-[13px] font-semibold uppercase tracking-[0.18em] text-slate">
            Featured
          </span>
          <h2 className="mt-4 max-w-xl text-balance text-[36px] font-extrabold leading-[1.08] tracking-tight text-graphite md:text-[48px]">
            Right now, most loved.
          </h2>
        </Reveal>

        <div className="mt-16 flex flex-col gap-6">
          {featured.map((product, i) => {
            const Art = ART[product.category];
            return (
              <Reveal key={product.id} delay={i * 0.08}>
                <div
                  className={`flex flex-col items-center gap-10 rounded-2xl bg-paper p-8 md:gap-16 md:p-14 lg:flex-row ${
                    i % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  <div className="h-[240px] w-[170px] shrink-0 sm:h-[300px] sm:w-[210px]">
                    <Art className="h-full w-full" glow />
                  </div>
                  <div className="text-center lg:text-left">
                    <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-signal">
                      {product.badge ?? "Featured"}
                    </span>
                    <h3 className="mt-3 text-[30px] font-bold tracking-tight text-graphite md:text-[38px]">
                      {product.name}
                    </h3>
                    <p className="mx-auto mt-3 max-w-sm text-[16px] leading-relaxed text-slate lg:mx-0">
                      {product.description}
                    </p>
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                      <span className="text-[20px] font-semibold text-graphite">
                        {formatPrice(product.discountPrice ?? product.price)}
                      </span>
                      <Button to={`/product/${product.slug}`} variant="primary" withArrow>
                        View Product
                      </Button>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-20 grid grid-cols-2 gap-5 md:grid-cols-4">
          {gridProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
