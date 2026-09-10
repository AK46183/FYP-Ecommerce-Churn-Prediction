import { BatteryCharging, Camera, Cpu, MonitorSmartphone } from "lucide-react";
import { StoryIntro } from "@/components/home/StoryIntro";
import { FeatureRow } from "@/components/home/FeatureRow";
import { ProductPhoto } from "@/components/ui/ProductPhoto";

export function SmartphoneStory() {
  return (
    <section className="bg-ink text-paper">
      <div className="container-nexora">
        <StoryIntro
          eyebrow="Nexora X1 Pro"
          heading={<>Made to keep up.</>}
          description="A phone tuned for the pace of a real day — quick to respond, calm under load, and built to last from morning to midnight."
          art={<ProductPhoto category="smartphones" rounded="rounded-[24px]" className="border border-white/10" />}
        />

        <FeatureRow
          index="01"
          icon={MonitorSmartphone}
          eyebrow="Display"
          title="Every detail, clearer."
          description="An edge-to-edge panel with higher peak brightness, so the screen holds up outdoors as well as it does in a dark room."
        />
        <FeatureRow
          index="02"
          icon={Camera}
          eyebrow="Camera"
          title="Your moments, with more depth."
          description="A wider sensor and refined computational processing capture detail in shadows most cameras lose."
          reversed
        />
        <FeatureRow
          index="03"
          icon={Cpu}
          eyebrow="Performance"
          title={
            <>
              Fast when you need it.
              <br />
              Quiet when you don&apos;t.
            </>
          }
          description="An efficiency-first chipset that scales power to the task, so the phone stays cool during everyday use."
        />
        <FeatureRow
          index="04"
          icon={BatteryCharging}
          eyebrow="Battery"
          title="Power that stays with you."
          description="A full day of typical use on a single charge, with fast charging when you're running low on time."
          reversed
        />
      </div>
    </section>
  );
}
