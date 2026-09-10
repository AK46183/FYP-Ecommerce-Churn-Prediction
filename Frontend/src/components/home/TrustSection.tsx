import { HeadphonesIcon, ShieldCheck, Truck, Undo2 } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const ITEMS = [
  {
    icon: ShieldCheck,
    title: "Secure Checkout",
    description: "Protected payment experience.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Reliable delivery tracking.",
  },
  {
    icon: Undo2,
    title: "Warranty",
    description: "Coverage you can count on.",
  },
  {
    icon: HeadphonesIcon,
    title: "Customer Support",
    description: "Help when you need it.",
  },
];

export function TrustSection() {
  return (
    <section className="bg-paper py-20 md:py-24">
      <div className="container-nexora grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-6">
        {ITEMS.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.06} className="flex flex-col items-start gap-4">
            <item.icon className="h-6 w-6 text-signal" strokeWidth={1.5} aria-hidden="true" />
            <div>
              <h3 className="text-[15px] font-semibold text-graphite">{item.title}</h3>
              <p className="mt-1 text-[13px] text-slate">{item.description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
