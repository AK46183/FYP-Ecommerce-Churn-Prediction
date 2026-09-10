import { Sparkles } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { ProductPhoto } from "@/components/ui/ProductPhoto";

export function DealsBanner() {
  return (
    <section className="bg-mist py-16 md:py-20">
      <div className="container-nexora">
        <Reveal>
          <div className="relative grid grid-cols-1 items-center overflow-hidden rounded-3xl bg-ink text-paper md:grid-cols-[1.2fr_1fr]">
            <div className="p-10 md:p-14">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[12px] font-semibold uppercase tracking-wide text-blush">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                Limited Time Offer
              </span>
              <h2 className="mt-4 max-w-sm text-balance text-[30px] font-extrabold leading-[1.1] tracking-tight md:text-[36px]">
                The Camera Edit is live.
              </h2>
              <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-white/70">
                Save on select cameras and lenses for a limited run — while stock lasts.
              </p>
              <Button to="/cameras" variant="primary-inverse" withArrow className="mt-6">
                Explore Deals
              </Button>
            </div>

            <div className="relative flex h-[240px] items-center justify-center md:h-[320px]">
              <div className="absolute right-6 top-6 flex h-16 w-16 flex-col items-center justify-center rounded-full bg-blush text-center text-ink sm:h-20 sm:w-20">
                <span className="text-[16px] font-extrabold leading-none sm:text-[20px]">30%</span>
                <span className="text-[9px] font-semibold uppercase tracking-wide sm:text-[10px]">Off</span>
              </div>
              <div className="h-[200px] w-[150px] sm:h-[260px] sm:w-[200px]">
                <ProductPhoto category="cameras" tilt={false} rounded="rounded-[20px]" />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
