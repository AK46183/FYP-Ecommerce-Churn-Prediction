import { Check } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { getProductsByCategory } from "@/data/products";

const ROWS: { label: string; values: [string, string, string] }[] = [
  { label: "Display", values: ["6.7\" LTPO, 120Hz", "6.5\" OLED, 120Hz", "6.4\" OLED, 90Hz"] },
  { label: "Chipset", values: ["Nexora N4 Pro", "Nexora N4", "Nexora N3"] },
  { label: "Battery", values: ["5,200 mAh", "4,800 mAh", "4,500 mAh"] },
  { label: "Charging", values: ["65W wired", "45W wired", "33W wired"] },
];

export function ComparisonTeaser() {
  const [a, b, c] = getProductsByCategory("smartphones");
  const models = [a, b, c];

  return (
    <section className="bg-paper py-24 md:py-32">
      <div className="container-nexora">
        <Reveal className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="text-[13px] font-semibold uppercase tracking-[0.18em] text-slate">
              Compare
            </span>
            <h2 className="mt-4 max-w-lg text-balance text-[36px] font-extrabold leading-[1.08] tracking-tight text-graphite md:text-[48px]">
              Find the right fit.
            </h2>
          </div>
          <Button to="/compare" variant="secondary" withArrow>
            Full comparison
          </Button>
        </Reveal>

        <Reveal delay={0.1} className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr>
                <th className="w-40 pb-5 text-[13px] font-medium text-slate">&nbsp;</th>
                {models.map((m) => (
                  <th key={m.id} className="pb-5 pr-6">
                    <span className="block text-[17px] font-bold text-graphite">{m.name}</span>
                    <span className="mt-1 block text-[14px] text-slate">
                      {formatPrice(m.discountPrice ?? m.price)}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.label} className="border-t border-graphite/10">
                  <th
                    scope="row"
                    className="py-4 pr-6 text-[14px] font-medium text-slate"
                  >
                    {row.label}
                  </th>
                  {row.values.map((v, i) => (
                    <td key={i} className="py-4 pr-6 text-[15px] text-graphite">
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-t border-graphite/10">
                <th scope="row" className="py-4 pr-6 text-[14px] font-medium text-slate">
                  5G
                </th>
                {models.map((m) => (
                  <td key={m.id} className="py-4 pr-6">
                    <Check className="h-4 w-4 text-signal" aria-label="Supported" />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </Reveal>
      </div>
    </section>
  );
}
