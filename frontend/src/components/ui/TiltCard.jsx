import { useRef, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion'

/**
 * Wraps children in a 3D tilt card with mouse-tracked rotation,
 * dynamic glow, and spring physics. Degrades gracefully on touch.
 */
export function TiltCard({ children, className = '', maxTilt = 12, glowRgb = '124,92,191', springConfig = { stiffness: 320, damping: 28, mass: 0.6 } }) {
  const ref = useRef(null)

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const glowOpacity = useMotionValue(0)

  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [maxTilt, -maxTilt]), springConfig)
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-maxTilt, maxTilt]), springConfig)
  const scale   = useSpring(1, { stiffness: 350, damping: 35 })

  const glowXPct = useTransform(rawX, [-0.5, 0.5], [0, 100])
  const glowYPct = useTransform(rawY, [-0.5, 0.5], [0, 100])
  const glowBg = useMotionTemplate`radial-gradient(circle at ${glowXPct}% ${glowYPct}%, rgba(${glowRgb},0.20), transparent 62%)`

  const onMouseMove = useCallback((e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    rawX.set((e.clientX - rect.left) / rect.width - 0.5)
    rawY.set((e.clientY - rect.top) / rect.height - 0.5)
    glowOpacity.set(1)
    scale.set(1.028)
  }, [rawX, rawY, glowOpacity, scale])

  const onMouseLeave = useCallback(() => {
    rawX.set(0)
    rawY.set(0)
    glowOpacity.set(0)
    scale.set(1)
  }, [rawX, rawY, glowOpacity, scale])

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        rotateX,
        rotateY,
        scale,
        transformPerspective: 1100,
        transformStyle: 'preserve-3d',
      }}
      className={`relative ${className}`}
    >
      {children}

      {/* Dynamic glow overlay */}
      <motion.div
        className="absolute inset-0 rounded-[inherit] pointer-events-none"
        style={{ background: glowBg, opacity: glowOpacity }}
      />
    </motion.div>
  )
}
