import { BadgeCheck, HeadphonesIcon, ShieldCheck, Undo2, Wallet } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const ITEMS = [
  {
    icon: BadgeCheck,
    title: "Best Price Guarantee",
    description: "Fair pricing on every product.",
  },
  {
    icon: HeadphonesIcon,
    title: "Expert Support",
    description: "Real help from people who know tech.",
  },
  {
    icon: Undo2,
    title: "Hassle-Free Returns",
    description: "30-day easy returns, no fine print.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    description: "Protected checkout, every time.",
  },
  {
    icon: Wallet,
    title: "Extended Warranty",
    description: "Coverage you can count on.",
  },
];

export function TrustSection() {
  return (
    <section className="bg-mist py-16 md:py-20">
      <div className="container-nexora">
        <Reveal className="text-center">
          <h2 className="text-[24px] font-extrabold tracking-tight text-ink md:text-[28px]">
            Why Choose NEXORA?
          </h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {ITEMS.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.06} className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-signal/10">
                <item.icon className="h-5 w-5 text-signal" strokeWidth={1.5} aria-hidden="true" />
              </div>
              <h3 className="mt-3 text-[13px] font-semibold text-ink">{item.title}</h3>
              <p className="mt-1 text-[12px] text-slate">{item.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
