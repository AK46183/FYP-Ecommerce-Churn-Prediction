import { cn } from "@/lib/utils";

interface ArtProps {
  className?: string;
  glow?: boolean;
}

/**
 * Original, brand-neutral device illustrations rendered as SVG line/duotone art.
 * These are not photographs and do not depict any real or third-party product —
 * they exist to give each section a premium "product presence" without stock imagery.
 */

export function PhoneArt({ className, glow = true }: ArtProps) {
  return (
    <div className={cn("relative", className)}>
      {glow && (
        <div className="absolute inset-0 scale-90 rounded-full bg-signal/20 blur-[80px]" />
      )}
      <svg
        viewBox="0 0 320 640"
        className="relative h-full w-full drop-shadow-[0_40px_80px_rgba(0,0,0,0.45)]"
        role="img"
        aria-label="Nexora smartphone illustration"
      >
        <defs>
          <linearGradient id="phoneBody" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2b2d33" />
            <stop offset="55%" stopColor="#16171b" />
            <stop offset="100%" stopColor="#08090b" />
          </linearGradient>
          <linearGradient id="phoneScreen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1c2b36" />
            <stop offset="45%" stopColor="#0d1013" />
            <stop offset="100%" stopColor="#08090b" />
          </linearGradient>
          <linearGradient id="phoneSheen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
            <stop offset="30%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect x="4" y="4" width="312" height="632" rx="56" fill="url(#phoneBody)" />
        <rect
          x="4"
          y="4"
          width="312"
          height="632"
          rx="56"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.08"
          strokeWidth="1.5"
        />
        <rect x="16" y="16" width="288" height="608" rx="46" fill="url(#phoneScreen)" />
        <rect x="16" y="16" width="288" height="608" rx="46" fill="url(#phoneSheen)" />

        {/* dynamic island */}
        <rect x="128" y="34" width="64" height="20" rx="10" fill="#000000" />

        {/* camera module */}
        <rect x="36" y="40" width="88" height="88" rx="26" fill="#111318" fillOpacity="0.8" />
        <circle cx="60" cy="64" r="15" fill="#0b0c0f" stroke="#5bc8ff" strokeOpacity="0.5" strokeWidth="1" />
        <circle cx="100" cy="64" r="15" fill="#0b0c0f" stroke="#5bc8ff" strokeOpacity="0.35" strokeWidth="1" />
        <circle cx="60" cy="104" r="15" fill="#0b0c0f" stroke="#5bc8ff" strokeOpacity="0.25" strokeWidth="1" />

        {/* subtle screen content */}
        <rect x="48" y="220" width="224" height="6" rx="3" fill="#ffffff" fillOpacity="0.08" />
        <rect x="48" y="240" width="160" height="6" rx="3" fill="#ffffff" fillOpacity="0.06" />

        {/* side buttons */}
        <rect x="0" y="150" width="4" height="46" rx="2" fill="#3a3d44" />
        <rect x="316" y="180" width="4" height="70" rx="2" fill="#3a3d44" />
      </svg>
    </div>
  );
}

export function HeadphoneArt({ className, glow = true }: ArtProps) {
  return (
    <div className={cn("relative", className)}>
      {glow && (
        <div className="absolute inset-0 scale-90 rounded-full bg-violet/20 blur-[80px]" />
      )}
      <svg
        viewBox="0 0 480 360"
        className="relative h-full w-full drop-shadow-[0_40px_80px_rgba(0,0,0,0.45)]"
        role="img"
        aria-label="Nexora headphones illustration"
      >
        <defs>
          <linearGradient id="cupGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2b2d33" />
            <stop offset="100%" stopColor="#08090b" />
          </linearGradient>
          <radialGradient id="cupSheen" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#8b7cff" stopOpacity="0.35" />
            <stop offset="60%" stopColor="#8b7cff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* headband */}
        <path
          d="M 90 180 C 90 70 390 70 390 180"
          fill="none"
          stroke="#2b2d33"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M 90 180 C 90 70 390 70 390 180"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.06"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray="1 22"
        />

        {/* left cup */}
        <g>
          <ellipse cx="90" cy="220" rx="58" ry="74" fill="url(#cupGrad)" />
          <ellipse cx="90" cy="220" rx="58" ry="74" fill="url(#cupSheen)" />
          <ellipse cx="90" cy="220" rx="34" ry="48" fill="#111318" stroke="#5bc8ff" strokeOpacity="0.3" />
        </g>

        {/* right cup */}
        <g>
          <ellipse cx="390" cy="220" rx="58" ry="74" fill="url(#cupGrad)" />
          <ellipse cx="390" cy="220" rx="58" ry="74" fill="url(#cupSheen)" />
          <ellipse cx="390" cy="220" rx="34" ry="48" fill="#111318" stroke="#5bc8ff" strokeOpacity="0.3" />
        </g>
      </svg>
    </div>
  );
}

export function CameraArt({ className, glow = true }: ArtProps) {
  return (
    <div className={cn("relative", className)}>
      {glow && (
        <div className="absolute inset-0 scale-90 rounded-full bg-signal/20 blur-[80px]" />
      )}
      <svg
        viewBox="0 0 480 340"
        className="relative h-full w-full drop-shadow-[0_40px_80px_rgba(0,0,0,0.45)]"
        role="img"
        aria-label="Nexora camera illustration"
      >
        <defs>
          <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2b2d33" />
            <stop offset="100%" stopColor="#08090b" />
          </linearGradient>
          <radialGradient id="lensGrad" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#3a3d44" />
            <stop offset="55%" stopColor="#0b0c0f" />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>
        </defs>

        <rect x="60" y="90" width="360" height="200" rx="28" fill="url(#bodyGrad)" />
        <rect x="140" y="50" width="120" height="60" rx="14" fill="#111318" />
        <rect x="150" y="60" width="40" height="18" rx="4" fill="#0b0c0f" />

        <circle cx="240" cy="200" r="92" fill="url(#lensGrad)" />
        <circle cx="240" cy="200" r="92" fill="none" stroke="#5bc8ff" strokeOpacity="0.35" strokeWidth="1.5" />
        <circle cx="240" cy="200" r="62" fill="none" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="1" />
        <circle cx="240" cy="200" r="34" fill="#050506" stroke="#5bc8ff" strokeOpacity="0.5" strokeWidth="1" />
        <circle cx="212" cy="172" r="10" fill="#ffffff" fillOpacity="0.12" />

        <circle cx="380" cy="130" r="10" fill="#5bc8ff" fillOpacity="0.8" />
        <rect x="84" y="112" width="34" height="20" rx="4" fill="#0b0c0f" />
      </svg>
    </div>
  );
}
