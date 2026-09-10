import { Aperture, Crosshair, ScanEye, Video } from "lucide-react";
import { StoryIntro } from "@/components/home/StoryIntro";
import { FeatureRow } from "@/components/home/FeatureRow";
import { ProductPhoto } from "@/components/ui/ProductPhoto";

export function CameraStory() {
  return (
    <section className="bg-umber text-paper">
      <div className="container-nexora">
        <StoryIntro
          eyebrow="Nexora Vision C1"
          accent="amber"
          heading={
            <>
              Capture the moment
              <br />
              before it disappears.
            </>
          }
          description="A full-frame sensor and a redesigned autofocus system, built for photographers who shoot on instinct."
          art={<ProductPhoto category="cameras" rounded="rounded-[24px]" className="border border-white/10" />}
        />

        <FeatureRow
          index="01"
          icon={Aperture}
          eyebrow="Sensor"
          title={
            <>
              More light.
              <br />
              More detail.
            </>
          }
          description="A larger full-frame sensor pulls in more light per pixel, holding detail in shadow and highlight alike."
          accent="amber"
        />
        <FeatureRow
          index="02"
          icon={ScanEye}
          eyebrow="Lens"
          title="See the scene differently."
          description="A modular mount system built around glass designed specifically for this sensor, edge to edge."
          reversed
          accent="amber"
        />
        <FeatureRow
          index="03"
          icon={Crosshair}
          eyebrow="Autofocus"
          title="Focus where it matters."
          description="Subject-tracking autofocus locks on and stays locked, even through fast, unpredictable motion."
          accent="amber"
        />
        <FeatureRow
          index="04"
          icon={Video}
          eyebrow="Video"
          title="Motion, with clarity."
          description="High-resolution video with in-body stabilization, so handheld footage looks considered, not shaky."
          reversed
          accent="amber"
        />
      </div>
    </section>
  );
}
