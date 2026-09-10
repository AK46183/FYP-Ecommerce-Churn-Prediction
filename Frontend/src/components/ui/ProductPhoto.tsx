import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTilt } from "@/hooks/useTilt";
import type { Category } from "@/data/products";

const PHOTO_BY_CATEGORY: Record<Category, { src: string; alt: string }> = {
  smartphones: {
    src: "/images/products/smartphone.jpg",
    alt: "Close-up macro photograph of a smartphone camera module",
  },
  headphones: {
    src: "/images/products/headphones.jpg",
    alt: "Studio photograph of over-ear wireless headphones",
  },
  cameras: {
    src: "/images/products/camera.jpg",
    alt: "Studio photograph of a compact camera",
  },
};

// Each category's overlay is tinted toward its own section color (navy, plum,
// umber) so the same photo treatment still reads as three distinct moods.
// The headphones source photo has a bright yellow backdrop, so it needs a
// much stronger multiply pass to fold into the calm palette than the other
// two (which are already low-saturation).
const OVERLAY_BY_CATEGORY: Record<Category, string> = {
  smartphones:
    "linear-gradient(160deg, rgba(22,33,46,0.55) 0%, rgba(22,33,46,0.08) 45%, rgba(22,33,46,0.35) 100%)",
  headphones:
    "linear-gradient(160deg, rgba(36,31,46,0.88) 0%, rgba(36,31,46,0.55) 45%, rgba(36,31,46,0.78) 100%)",
  cameras:
    "linear-gradient(160deg, rgba(36,29,22,0.5) 0%, rgba(36,29,22,0.1) 45%, rgba(36,29,22,0.4) 100%)",
};

const SATURATE_BY_CATEGORY: Record<Category, string> = {
  smartphones: "saturate-[0.82]",
  headphones: "saturate-[0.35]",
  cameras: "saturate-[0.82]",
};

const GLOW_CLASS_BY_CATEGORY: Record<Category, string> = {
  smartphones: "bg-signal/15",
  headphones: "bg-violet/15",
  cameras: "bg-amber/15",
};

interface ProductPhotoProps {
  category: Category;
  className?: string;
  /** Enables pointer-driven 3D tilt (desktop only). */
  tilt?: boolean;
  /** Soft color-matched glow behind the frame. */
  glow?: boolean;
  rounded?: string;
  priority?: boolean;
}

export function ProductPhoto({
  category,
  className,
  tilt = true,
  glow = false,
  rounded = "rounded-2xl",
  priority = false,
}: ProductPhotoProps) {
  const { rotateX, rotateY, onPointerMove, onPointerLeave } = useTilt(8);
  const { src, alt } = PHOTO_BY_CATEGORY[category];

  const frame = (
    <div className={cn("relative h-full w-full overflow-hidden", rounded, className)}>
      {glow && (
        <div
          className={cn(
            "absolute inset-0 -z-10 scale-90 rounded-full blur-[80px]",
            GLOW_CLASS_BY_CATEGORY[category],
          )}
        />
      )}
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        className={cn("h-full w-full object-cover contrast-[1.03]", SATURATE_BY_CATEGORY[category])}
      />
      {/* Harmonizes each photo's original background with the site's calm palette. */}
      <div
        className="pointer-events-none absolute inset-0 mix-blend-multiply"
        style={{ background: OVERLAY_BY_CATEGORY[category] }}
        aria-hidden="true"
      />
    </div>
  );

  if (!tilt) return frame;

  return (
    <div style={{ perspective: 1000 }} className="h-full w-full">
      <motion.div
        className="h-full w-full"
        style={{ rotateX, rotateY }}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        {frame}
      </motion.div>
    </div>
  );
}
