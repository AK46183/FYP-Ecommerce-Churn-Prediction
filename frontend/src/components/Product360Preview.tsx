import { useRef, useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { RotateCw } from 'lucide-react'

interface Product360PreviewProps {
  frames: string[]
  mainImage: string
  alt: string
  className?: string
  /** Enable automatic 360 rotation on hover. Default true. */
  autoRotateOnHover?: boolean
  /** Frame interval in ms. Default 120ms. */
  frameSpeed?: number
}

/**
 * Image-frame-based 360° product rotation.
 * Cycles through actual product angle images while hovering — NOT a CSS rotation trick.
 * When the mouse leaves, returns to the main image.
 *
 * To use real angle photography, pass frames in order:
 * ['front.webp', 'angle-1.webp', 'side.webp', 'back.webp', 'angle-2.webp']
 */
export default function Product360Preview({
  frames,
  mainImage,
  alt,
  className = '',
  autoRotateOnHover = true,
  frameSpeed = 120,
}: Product360PreviewProps) {
  const [isHovering, setIsHovering] = useState(false)
  const [currentFrame, setCurrentFrame] = useState(0)
  const [loaded, setLoaded] = useState<Record<number, boolean>>({})
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const allFrames = frames.length > 0 ? frames : [mainImage]

  // Preload all frames
  useEffect(() => {
    allFrames.forEach((src, i) => {
      const img = new Image()
      img.onload = () => setLoaded((prev) => ({ ...prev, [i]: true }))
      img.src = src
    })
  }, [allFrames])

  const stopRotation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const startRotation = useCallback(() => {
    stopRotation()
    setCurrentFrame(0)
    intervalRef.current = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % allFrames.length)
    }, frameSpeed)
  }, [allFrames.length, frameSpeed, stopRotation])

  const handleMouseEnter = () => {
    if (autoRotateOnHover && allFrames.length > 1) {
      setIsHovering(true)
      startRotation()
    }
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    stopRotation()
    setCurrentFrame(0)
  }

  useEffect(() => {
    return () => stopRotation()
  }, [stopRotation])

  const showFrame = isHovering ? allFrames[currentFrame] : mainImage

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={showFrame}
          src={showFrame}
          alt={alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </AnimatePresence>

      {allFrames.length > 1 && (
        <div
          className={`pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-medium text-white/80 backdrop-blur-sm transition-opacity duration-300 ${
            isHovering ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          <RotateCw className="h-3 w-3" />
          <span>360°</span>
        </div>
      )}
    </div>
  )
}
