import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Plus, Star } from "lucide-react";
import { ProductPhoto } from "@/components/ui/ProductPhoto";
import type { Product } from "@/data/products";
import { cn, formatPrice } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const [wishlisted, setWishlisted] = useState(false);
  const price = product.discountPrice ?? product.price;

  return (
    <div className="group relative">
      <Link
        to={`/product/${product.slug}`}
        className="block overflow-hidden rounded-2xl border border-graphite/10 bg-white transition-shadow duration-400 hover:shadow-[0_16px_40px_rgba(43,38,32,0.08)]"
      >
        <div className="relative aspect-square overflow-hidden bg-mist">
          {product.badge && (
            <span className="absolute left-3 top-3 z-10 rounded-full bg-ink px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-paper">
              {product.badge}
            </span>
          )}
          <div className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.08]">
            <ProductPhoto category={product.category} tilt={false} rounded="" className="h-full w-full" />
          </div>
        </div>

        <div className="p-4">
          <h3 className="truncate text-[15px] font-semibold text-graphite">{product.name}</h3>
          <div className="mt-1 flex items-center gap-1.5 text-[12px] text-slate">
            <Star className="h-3.5 w-3.5 fill-gold text-gold" aria-hidden="true" />
            {product.rating} · ({product.reviewCount})
          </div>

          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-2">
              <span className="text-[16px] font-bold text-ink">{formatPrice(price)}</span>
              {product.discountPrice && (
                <span className="text-[12px] text-slate line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            <span
              aria-hidden="true"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mist text-ink transition-colors duration-200 group-hover:bg-ink group-hover:text-paper"
            >
              <Plus className="h-4 w-4" />
            </span>
          </div>

          <div className="mt-2.5 flex items-center gap-1.5">
            {product.colors.map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="h-3 w-3 rounded-full border border-black/10"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>
      </Link>

      <button
        type="button"
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={wishlisted}
        onClick={(e) => {
          e.preventDefault();
          setWishlisted((v) => !v);
        }}
        className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-graphite shadow-sm backdrop-blur transition-transform hover:scale-105"
      >
        <Heart
          className={cn("h-4 w-4 transition-colors", wishlisted && "fill-blush text-blush")}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
