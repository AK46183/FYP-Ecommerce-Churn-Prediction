import { BatteryCharging, EarOff, Feather, Waves } from "lucide-react";
import { StoryIntro } from "@/components/home/StoryIntro";
import { FeatureRow } from "@/components/home/FeatureRow";
import { ProductPhoto } from "@/components/ui/ProductPhoto";

export function HeadphoneStory() {
  return (
    <section className="bg-plum text-paper">
      <div className="container-nexora">
        <StoryIntro
          eyebrow="Nexora Air Pro"
          accent="violet"
          heading={
            <>
              Sound,
              <br />
              without distraction.
            </>
          }
          description="Adaptive noise cancellation and a tuned soundstage, built for listening that lasts longer than a commute."
          art={<ProductPhoto category="headphones" rounded="rounded-[24px]" className="border border-white/10" />}
        />

        <FeatureRow
          index="01"
          icon={EarOff}
          eyebrow="Active Noise Cancellation"
          title="Silence when you need it."
          description="Adaptive ANC reads the room and adjusts in real time, so the noise fades before you notice it's gone."
          accent="violet"
        />
        <FeatureRow
          index="02"
          icon={Waves}
          eyebrow="Audio Quality"
          title="Every layer, clearly heard."
          description="A wider frequency range keeps low-end detail intact without losing clarity in the mid and high range."
          reversed
          accent="violet"
        />
        <FeatureRow
          index="03"
          icon={Feather}
          eyebrow="Comfort"
          title="Designed for longer listening."
          description="Memory-foam cushions and a balanced clamp force, tuned for sessions that run past a single album."
          accent="violet"
        />
        <FeatureRow
          index="04"
          icon={BatteryCharging}
          eyebrow="Battery"
          title={
            <>
              More listening.
              <br />
              Less charging.
            </>
          }
          description="Up to 40 hours on a single charge, with a quick 10-minute top-up for a full afternoon."
          reversed
          accent="violet"
        />
      </div>
    </section>
  );
}
