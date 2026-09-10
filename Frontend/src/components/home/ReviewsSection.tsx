import { Star } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const REVIEWS = [
  {
    quote: "Beautiful display and the camera performs exactly how I wanted, even in low light.",
    name: "Farah H.",
    context: "Nexora X1 Pro · Verified Purchase",
  },
  {
    quote: "ANC is the best I've used at this price. Comfortable enough for a full workday.",
    name: "Daniyal R.",
    context: "Nexora Air Pro · Verified Purchase",
  },
  {
    quote: "Autofocus tracking is genuinely reliable — first camera that keeps up with my kids.",
    name: "Sana M.",
    context: "Nexora Vision C1 · Verified Purchase",
  },
];

export function ReviewsSection() {
  return (
    <section className="bg-mist py-24 md:py-28">
      <div className="container-nexora">
        <Reveal>
          <span className="text-[13px] font-semibold uppercase tracking-[0.18em] text-slate">
            Customer trust
          </span>
          <h2 className="mt-4 max-w-xl text-balance text-[32px] font-extrabold leading-[1.08] tracking-tight text-graphite md:text-[42px]">
            What people are saying.
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {REVIEWS.map((review, i) => (
            <Reveal key={review.name} delay={i * 0.08}>
              <figure className="h-full rounded-2xl bg-paper p-7">
                <div className="flex gap-0.5 text-signal" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 fill-signal" />
                  ))}
                </div>
                <blockquote className="mt-4 text-[15px] leading-relaxed text-graphite">
                  “{review.quote}”
                </blockquote>
                <figcaption className="mt-5 text-[13px] text-slate">
                  <span className="font-semibold text-graphite">{review.name}</span> · {review.context}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
