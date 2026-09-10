import { ProductCard } from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { products } from "@/data/products";

export function FeaturedProducts() {
  const popular = products.slice(0, 8);

  return (
    <section className="bg-paper py-16 md:py-20">
      <div className="container-nexora">
        <Reveal className="flex items-end justify-between gap-4">
          <h2 className="text-[26px] font-extrabold tracking-tight text-ink md:text-[30px]">
            Popular Products
          </h2>
          <Button to="/smartphones" variant="ghost" withArrow className="hidden text-signal sm:inline-flex">
            View All Products
          </Button>
        </Reveal>

        <Reveal className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-4">
          {popular.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Reveal>

        <div className="mt-8 text-center sm:hidden">
          <Button to="/smartphones" variant="secondary" withArrow>
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
}
