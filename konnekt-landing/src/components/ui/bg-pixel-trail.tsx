import React, { useCallback, useMemo, useRef, useEffect } from "react"
import { motion, useAnimationControls } from "framer-motion"
import { v4 as uuidv4 } from "uuid"
import { cn } from "@/lib/utils"

/**
 * Background-safe PixelTrail that tracks mouse globally
 * without blocking pointer events on content above it.
 */
interface BgPixelTrailProps {
  pixelSize: number
  fadeDuration?: number
  delay?: number
  pixelClassName?: string
}

const BgPixelTrail: React.FC<BgPixelTrailProps> = ({
  pixelSize = 32,
  fadeDuration = 0,
  delay = 500,
  pixelClassName,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const trailId = useRef(uuidv4())
  const [dims, setDims] = React.useState({ w: 0, h: 0 })

  // Measure
  useEffect(() => {
    function measure() {
      setDims({ w: window.innerWidth, h: window.innerHeight })
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  // Global mouse tracking (so content above doesn't block it)
  useEffect(() => {
    function handleMove(e: MouseEvent) {
      const x = Math.floor(e.clientX / pixelSize)
      const y = Math.floor(e.clientY / pixelSize)
      const el = document.getElementById(`${trailId.current}-px-${x}-${y}`)
      if (el) {
        const fn = (el as any).__animatePixel
        if (fn) fn()
      }
    }
    window.addEventListener("mousemove", handleMove)
    return () => window.removeEventListener("mousemove", handleMove)
  }, [pixelSize])

  const columns = useMemo(() => Math.ceil(dims.w / pixelSize), [dims.w, pixelSize])
  const rows = useMemo(() => Math.ceil(dims.h / pixelSize), [dims.h, pixelSize])

  if (columns === 0 || rows === 0) return null

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex">
          {Array.from({ length: columns }).map((_, c) => (
            <BgPixelDot
              key={`${c}-${r}`}
              id={`${trailId.current}-px-${c}-${r}`}
              size={pixelSize}
              fadeDuration={fadeDuration}
              delay={delay}
              className={pixelClassName}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

interface BgPixelDotProps {
  id: string
  size: number
  fadeDuration: number
  delay: number
  className?: string
}

const BgPixelDot: React.FC<BgPixelDotProps> = React.memo(
  ({ id, size, fadeDuration, delay, className }) => {
    const controls = useAnimationControls()

    const animatePixel = useCallback(() => {
      controls.start({
        opacity: [1, 0],
        transition: { duration: fadeDuration / 1000, delay: delay / 1000 },
      })
    }, [controls, fadeDuration, delay])

    const ref = useCallback(
      (node: HTMLDivElement | null) => {
        if (node) {
          ;(node as any).__animatePixel = animatePixel
        }
      },
      [animatePixel]
    )

    return (
      <motion.div
        id={id}
        ref={ref}
        className={cn("pointer-events-none", className)}
        style={{ width: `${size}px`, height: `${size}px` }}
        initial={{ opacity: 0 }}
        animate={controls}
        exit={{ opacity: 0 }}
      />
    )
  }
)
BgPixelDot.displayName = "BgPixelDot"

export { BgPixelTrail }
