import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";

interface StoryIntroProps {
  eyebrow: string;
  heading: ReactNode;
  description: string;
  art: ReactNode;
  accent?: "signal" | "violet" | "amber";
}

const ACCENT_CLASS: Record<NonNullable<StoryIntroProps["accent"]>, string> = {
  signal: "text-signal",
  violet: "text-violet",
  amber: "text-amber",
};

export function StoryIntro({ eyebrow, heading, description, art, accent = "signal" }: StoryIntroProps) {
  return (
    <div className="grid grid-cols-1 items-center gap-12 pb-8 pt-24 md:grid-cols-2 md:pt-32">
      <Reveal>
        <span
          className={`text-[13px] font-semibold uppercase tracking-[0.18em] ${ACCENT_CLASS[accent]}`}
        >
          {eyebrow}
        </span>
        <h2 className="mt-5 text-balance text-[40px] font-extrabold leading-[1.05] tracking-tight text-paper md:text-[56px]">
          {heading}
        </h2>
        <p className="mt-5 max-w-md text-[17px] leading-relaxed text-white/55">{description}</p>
      </Reveal>
      <Reveal delay={0.15} className="flex justify-center md:justify-end">
        <div className="h-[300px] w-[230px] sm:h-[360px] sm:w-[280px] md:h-[420px] md:w-[320px]">
          {art}
        </div>
      </Reveal>
    </div>
  );
}
