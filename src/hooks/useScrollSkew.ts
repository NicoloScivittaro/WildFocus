import { useScroll, useSpring, useTransform, useVelocity } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import { usePointerFine } from '@/hooks/usePointerFine'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

/**
 * A whisper of vertical skew that appears only while the page is moving fast
 * and disappears the instant it stops. Scroll velocity is fed through a
 * spring so it decays instead of snapping, and the whole thing is clamped to
 * a couple of degrees — you should notice it more when it's gone.
 *
 * Returns `null` on touch devices and under prefers-reduced-motion, so the
 * caller can simply skip the transform.
 */
export function useScrollSkew(maxDegrees = 1.6): MotionValue<number> | null {
  const pointerFine = usePointerFine()
  const prefersReducedMotion = usePrefersReducedMotion()

  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { stiffness: 300, damping: 50 })
  const skew = useTransform(smoothVelocity, [-2600, 0, 2600], [-maxDegrees, 0, maxDegrees], { clamp: true })

  return pointerFine && !prefersReducedMotion ? skew : null
}
