import { motion } from 'framer-motion'
import { useLayoutEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { EASE_SWEEP } from '@/lib/motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

type Phase = 'idle' | 'covering' | 'revealing'

/**
 * Route change, staged like a cut in an edit.
 *
 * On navigation the ink panel becomes fully opaque in the same frame the new
 * route paints (a layout effect, so there is never a flash of the old page),
 * shows the wordmark for a beat, then wipes away to reveal where you landed.
 * Total beat: well under a second — no artificial loading screen.
 *
 * Purely decorative: `pointer-events-none` throughout, so it can never
 * intercept a click or a focus.
 */
export function PageTransition() {
  const { pathname } = useLocation()
  const prefersReducedMotion = usePrefersReducedMotion()
  const isFirstRender = useRef(true)
  const [phase, setPhase] = useState<Phase>('idle')

  useLayoutEffect(() => {
    if (isFirstRender.current) {
      // The very first paint is the hero's job, not ours.
      isFirstRender.current = false
      return
    }

    if (prefersReducedMotion) return

    setPhase('covering')

    let revealFrame = 0
    const coverFrame = requestAnimationFrame(() => {
      revealFrame = requestAnimationFrame(() => setPhase('revealing'))
    })
    const timer = window.setTimeout(() => setPhase('idle'), 900)

    return () => {
      cancelAnimationFrame(coverFrame)
      cancelAnimationFrame(revealFrame)
      window.clearTimeout(timer)
    }
  }, [pathname, prefersReducedMotion])

  if (prefersReducedMotion) return null

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[150] origin-bottom bg-ink"
      initial={false}
      animate={{ scaleY: phase === 'covering' ? 1 : 0 }}
      transition={phase === 'covering' ? { duration: 0 } : { duration: 0.62, ease: EASE_SWEEP }}
    >
      <motion.span
        className="absolute inset-0 flex items-center justify-center font-display text-2xl text-base"
        initial={false}
        animate={{ opacity: phase === 'revealing' ? [1, 1, 0] : 0 }}
        transition={{ duration: 0.62, ease: EASE_SWEEP, times: [0, 0.4, 1] }}
      >
        WildFocus
      </motion.span>
    </motion.div>
  )
}
