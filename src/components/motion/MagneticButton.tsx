import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useRef, type PointerEvent, type ReactNode } from 'react'
import { SPRING_MAGNET } from '@/lib/motion'
import { usePointerFine } from '@/hooks/usePointerFine'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  /** Maximum drift in pixels. Deliberately tiny — this is a hint, not a gimmick. */
  strength?: number
}

/**
 * Barely-there magnetic pull on primary CTAs. A few pixels of drift toward
 * the pointer, released on leave. Disabled on touch and when the user asks
 * for reduced motion, where it becomes a plain inline wrapper.
 */
export function MagneticButton({ children, className, strength = 7 }: MagneticButtonProps) {
  const pointerFine = usePointerFine()
  const prefersReducedMotion = usePrefersReducedMotion()
  const enabled = pointerFine && !prefersReducedMotion

  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, SPRING_MAGNET)
  const springY = useSpring(y, SPRING_MAGNET)

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!enabled || !ref.current) return

    const rect = ref.current.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return

    const relativeX = (event.clientX - rect.left) / rect.width - 0.5
    const relativeY = (event.clientY - rect.top) / rect.height - 0.5

    x.set(relativeX * strength * 2)
    y.set(relativeY * strength * 2)
  }

  function handlePointerLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={`inline-flex ${className ?? ''}`}
      style={enabled ? { x: springX, y: springY } : undefined}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {children}
    </motion.div>
  )
}
