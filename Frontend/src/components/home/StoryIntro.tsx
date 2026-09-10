import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";

interface StoryIntroProps {
  eyebrow: string;
  heading: ReactNode;
  description: string;
  art: ReactNode;
}

export function StoryIntro({ eyebrow, heading, description, art }: StoryIntroProps) {
  return (
    <div className="grid grid-cols-1 items-center gap-12 pb-8 pt-24 md:grid-cols-2 md:pt-32">
      <Reveal>
        <span className="text-[13px] font-semibold uppercase tracking-[0.18em] text-signal">
          {eyebrow}
        </span>
        <h2 className="mt-5 text-balance text-[40px] font-extrabold leading-[1.05] tracking-tight text-paper md:text-[56px]">
          {heading}
        </h2>
        <p className="mt-5 max-w-md text-[17px] leading-relaxed text-white/55">{description}</p>
      </Reveal>
      <Reveal delay={0.15} className="flex justify-center md:justify-end">
        <div className="h-[280px] w-[180px] sm:h-[340px] sm:w-[220px] md:h-[400px] md:w-[260px]">
          {art}
        </div>
      </Reveal>
    </div>
  );
}
