import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Star } from "lucide-react";
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
        className="block overflow-hidden rounded-2xl bg-white transition-shadow duration-400 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
      >
        <div className="relative aspect-square overflow-hidden bg-mist">
          {product.badge && (
            <span className="absolute left-4 top-4 z-10 rounded-full bg-graphite px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-paper">
              {product.badge}
            </span>
          )}
          <div className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.08]">
            <ProductPhoto category={product.category} tilt={false} rounded="" className="h-full w-full" />
          </div>

          <span
            className={cn(
              "absolute inset-x-4 bottom-4 translate-y-3 rounded-[10px] bg-graphite py-3 text-center text-[13px] font-semibold text-paper opacity-0 transition-all duration-300 ease-out",
              "group-hover:translate-y-0 group-hover:opacity-100",
            )}
          >
            Quick add
          </span>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-[16px] font-semibold text-graphite">{product.name}</h3>
            <div className="flex shrink-0 items-center gap-1 pt-0.5 text-[13px] text-slate">
              <Star className="h-3.5 w-3.5 fill-signal text-signal" aria-hidden="true" />
              {product.rating}
            </div>
          </div>
          <p className="mt-1 text-[14px] text-slate">{product.tagline}</p>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {product.colors.map((c) => (
                <span
                  key={c.name}
                  title={c.name}
                  className="h-3.5 w-3.5 rounded-full border border-black/10"
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
            <div className="flex items-baseline gap-2">
              {product.discountPrice && (
                <span className="text-[13px] text-slate line-through">
                  {formatPrice(product.price)}
                </span>
              )}
              <span className="text-[15px] font-semibold text-graphite">{formatPrice(price)}</span>
            </div>
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
          className={cn("h-4 w-4 transition-colors", wishlisted && "fill-signal text-signal")}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
