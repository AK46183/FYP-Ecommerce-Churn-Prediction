import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

interface FeatureRowProps {
  index: string;
  icon: LucideIcon;
  eyebrow: string;
  title: ReactNode;
  description: string;
  reversed?: boolean;
  accent?: "signal" | "violet";
}

export function FeatureRow({
  index,
  icon: Icon,
  eyebrow,
  title,
  description,
  reversed = false,
  accent = "signal",
}: FeatureRowProps) {
  const accentColor = accent === "signal" ? "var(--color-signal)" : "var(--color-violet)";

  return (
    <div className="grid grid-cols-1 items-center gap-10 py-16 md:grid-cols-2 md:gap-16 md:py-24">
      <Reveal className={cn(reversed && "md:order-2")}>
        <div
          className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border border-white/10"
          style={{
            background:
              "radial-gradient(120% 120% at 30% 20%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 60%), #111318",
          }}
        >
          <div
            className="absolute h-40 w-40 rounded-full blur-[70px]"
            style={{ backgroundColor: accentColor, opacity: 0.25 }}
            aria-hidden="true"
          />
          <Icon className="relative h-16 w-16 text-white/80" strokeWidth={1.25} aria-hidden="true" />
        </div>
      </Reveal>

      <Reveal delay={0.1} className={cn(reversed && "md:order-1")}>
        <span className="text-[13px] font-semibold tracking-[0.18em]" style={{ color: accentColor }}>
          {index} — {eyebrow}
        </span>
        <h3 className="mt-4 text-balance text-[32px] font-bold leading-[1.1] tracking-tight text-paper md:text-[40px]">
          {title}
        </h3>
        <p className="mt-4 max-w-md text-[16px] leading-relaxed text-white/55 md:text-[17px]">
          {description}
        </p>
      </Reveal>
    </div>
  );
}
