import { useRef, useState } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { PhoneArt } from "@/components/ui/DeviceArt";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const productScale = useTransform(scrollYProgress, [0, 1], [1, 0.82]);
  const productY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const bgOpacity = useTransform(scrollYProgress, [0, 1], [0.5, 0.1]);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 120, damping: 18 });
  const springRotateY = useSpring(rotateY, { stiffness: 120, damping: 18 });
  const [isTouch] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches,
  );

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (isTouch) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 10);
    rotateX.set(py * -10);
  }

  function handlePointerLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-ink text-paper"
    >
      {/* atmospheric background */}
      <motion.div className="pointer-events-none absolute inset-0" style={{ opacity: bgOpacity }}>
        <div className="absolute left-1/2 top-1/2 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal/10 blur-[160px]" />
        <div className="absolute right-0 top-0 h-[50vh] w-[50vh] rounded-full bg-violet/10 blur-[140px]" />
      </motion.div>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
        aria-hidden="true"
      />

      <div className="container-nexora relative grid w-full grid-cols-1 items-center gap-10 pt-28 lg:grid-cols-2 lg:gap-4 lg:pt-16">
        <motion.div style={{ y: textY, opacity: textOpacity }} className="order-2 lg:order-1">
          <span className="text-[12px] font-semibold uppercase tracking-[0.2em] text-signal">
            The New Nexora Series
          </span>
          <h1 className="mt-5 text-balance text-[52px] font-extrabold leading-[1.02] tracking-tight sm:text-[68px] lg:text-[80px] xl:text-[92px]">
            Technology,
            <br />
            in its purest form.
          </h1>
          <p className="mt-6 max-w-md text-balance text-[17px] leading-relaxed text-white/60 md:text-[19px]">
            Designed to disappear into your life. Engineered to stand out when it matters.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button to="/product/nexora-x1-pro" variant="primary-inverse" withArrow>
              Explore Smartphone
            </Button>
            <Button to="/smartphones" variant="secondary-inverse">
              View All Products
            </Button>
          </div>
        </motion.div>

        <motion.div
          className="order-1 flex justify-center lg:order-2 lg:justify-end"
          style={{ scale: productScale, y: productY }}
        >
          <div
            className="relative h-[360px] w-[220px] sm:h-[440px] sm:w-[270px] lg:h-[560px] lg:w-[340px]"
            style={{ perspective: 1000 }}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
          >
            <motion.div
              className="h-full w-full"
              style={{ rotateX: springRotateX, rotateY: springRotateY }}
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <PhoneArt className="h-full w-full" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div className="absolute inset-x-0 bottom-8 flex flex-col items-center gap-3 text-white/50">
        <span className="text-[11px] font-medium uppercase tracking-[0.2em]">
          Scroll to explore
        </span>
        <span className="relative h-10 w-px overflow-hidden bg-white/15">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-signal"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </div>
    </section>
  );
}
