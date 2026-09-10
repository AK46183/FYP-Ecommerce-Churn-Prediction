import { useParams } from "react-router-dom";
import { CameraArt, HeadphoneArt, PhoneArt } from "@/components/ui/DeviceArt";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { products } from "@/data/products";

const ART = { smartphones: PhoneArt, headphones: HeadphoneArt, cameras: CameraArt };

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

  const Art = ART[product.category];

  return (
    <section className="flex min-h-[70svh] flex-col items-center justify-center gap-10 bg-mist px-6 py-32 text-center md:flex-row md:text-left">
      <div className="h-[260px] w-[190px] shrink-0 sm:h-[320px] sm:w-[230px]">
        <Art className="h-full w-full" />
      </div>
      <div>
        <span className="text-[13px] font-semibold uppercase tracking-[0.18em] text-signal">
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
