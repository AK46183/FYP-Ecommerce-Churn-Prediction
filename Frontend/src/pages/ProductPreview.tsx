import { useParams } from "react-router-dom";
import { ProductPhoto } from "@/components/ui/ProductPhoto";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { products } from "@/data/products";
import type { Category } from "@/data/products";

const ACCENT_TEXT: Record<Category, string> = {
  smartphones: "text-signal",
  headphones: "text-violet",
  cameras: "text-amber",
};

export default function ProductPreview() {
  const { slug } = useParams();
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return (
      <section className="flex min-h-[70svh] flex-col items-center justify-center bg-mist px-6 py-32 text-center">
        <h1 className="text-[32px] font-extrabold tracking-tight text-graphite">
          We couldn&apos;t find that product.
        </h1>
        <p className="mt-3 text-[16px] text-slate">It may have been moved or renamed.</p>
        <Button to="/" variant="primary" withArrow className="mt-8">
          Back to Home
        </Button>
      </section>
    );
  }

  return (
    <section className="flex min-h-[70svh] flex-col items-center justify-center gap-10 bg-mist px-6 py-32 text-center md:flex-row md:text-left">
      <div className="aspect-[4/5] w-[220px] shrink-0 sm:w-[260px]">
        <ProductPhoto category={product.category} glow rounded="rounded-[20px]" />
      </div>
      <div>
        <span className={`text-[13px] font-semibold uppercase tracking-[0.18em] ${ACCENT_TEXT[product.category]}`}>
          {product.badge ?? "Product"}
        </span>
        <h1 className="mt-3 text-balance text-[36px] font-extrabold tracking-tight text-graphite md:text-[44px]">
          {product.name}
        </h1>
        <p className="mt-3 max-w-md text-[16px] leading-relaxed text-slate">{product.description}</p>
        <p className="mt-5 text-[22px] font-semibold text-graphite">
          {formatPrice(product.discountPrice ?? product.price)}
        </p>
        <p className="mt-6 max-w-md text-[14px] text-slate">
          The full product page — gallery, variant selection, specifications, and reviews — is
          coming in the next build phase.
        </p>
        <Button to="/" variant="primary" withArrow className="mt-6">
          Back to Home
        </Button>
      </div>
    </section>
  );
}
