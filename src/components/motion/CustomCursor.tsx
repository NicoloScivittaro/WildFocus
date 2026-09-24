import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'
import { SPRING_CURSOR } from '@/lib/motion'
import { usePointerFine } from '@/hooks/usePointerFine'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

/**
 * Minimal custom cursor for pointer devices.
 *
 * A precise dot tracks the pointer exactly (so aiming never suffers) while a
 * ring lags behind with light inertia and shows the action for whatever is
 * underneath: VIEW on a project, PLAY on a video, DRAG on a draggable,
 * GO → on a CTA. Opt-in per element via `data-cursor="..."`.
 *
 * Completely disabled on touch devices and under prefers-reduced-motion.
 */
export function CustomCursor() {
  const pointerFine = usePointerFine()
  const prefersReducedMotion = usePrefersReducedMotion()
  const enabled = pointerFine && !prefersReducedMotion

  const [label, setLabel] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, SPRING_CURSOR)
  const ringY = useSpring(y, SPRING_CURSOR)

  useEffect(() => {
    if (!enabled) return

    const root = document.documentElement
    root.classList.add('has-custom-cursor')

    const handlePointerMove = (event: globalThis.PointerEvent) => {
      x.set(event.clientX)
      y.set(event.clientY)
      setIsVisible(true)
    }

    const handlePointerOver = (event: globalThis.PointerEvent) => {
      const target = event.target as Element | null
      const host = target?.closest?.('[data-cursor]')
      setLabel(host?.getAttribute('data-cursor') ?? null)
    }

    const handlePointerLeave = () => setIsVisible(false)

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerover', handlePointerOver, { passive: true })
    document.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      root.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerover', handlePointerOver)
      document.removeEventListener('pointerleave', handlePointerLeave)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[201]"
        style={{ x, y, opacity: isVisible ? 1 : 0 }}
      >
        <div className="h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-deep" />
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[200]"
        style={{ x: ringX, y: ringY, opacity: isVisible ? 1 : 0 }}
      >
        <div
          className={`flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-[transform,opacity,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            label
              ? 'scale-100 bg-ink text-base opacity-100'
              : 'scale-50 border border-accent-deep/40 bg-transparent opacity-0'
          }`}
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em]">{label}</span>
        </div>
      </motion.div>
    </>
  )
}
