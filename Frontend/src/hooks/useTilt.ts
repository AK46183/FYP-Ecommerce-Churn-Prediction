import { useState } from "react";
import { useMotionValue, useSpring } from "framer-motion";

/**
 * Pointer-driven 3D tilt. Desktop only — on touch devices the tilt is
 * disabled and pointer events fall through untouched, per the "no
 * hover-dependent interaction on mobile" rule.
 */
export function useTilt(strength = 10) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 140, damping: 16 });
  const springRotateY = useSpring(rotateY, { stiffness: 140, damping: 16 });
  const [isTouch] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches,
  );

  function onPointerMove(e: React.PointerEvent<HTMLElement>) {
    if (isTouch) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * strength);
    rotateX.set(py * -strength);
  }

  function onPointerLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return { rotateX: springRotateX, rotateY: springRotateY, onPointerMove, onPointerLeave, isTouch };
}
