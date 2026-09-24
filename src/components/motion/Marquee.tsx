import { motion, useAnimationFrame, useInView, useMotionValue, useScroll, useSpring, useVelocity } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

interface MarqueeProps {
  items: string[]
  /** Baseline drift in pixels per second. Slow on purpose. */
  speed?: number
  className?: string
}

/**
 * Slow typographic band. Scroll velocity nudges the speed and flips the
 * direction, so the strip feels physically connected to the page without
 * ever competing with the content around it.
 *
 * The animation loop parks itself while the band is off-screen, and is
 * replaced by a single static copy under prefers-reduced-motion.
 */
export function Marquee({ items, speed = 34, className }: MarqueeProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const directionRef = useRef(-1)
  const [halfWidth, setHalfWidth] = useState(0)

  const isInView = useInView(containerRef, { amount: 0 })
  const x = useMotionValue(0)

  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { stiffness: 260, damping: 50 })

  useEffect(() => {
    const element = trackRef.current
    if (!element) return

    const measure = () => setHalfWidth(element.scrollWidth / 2)
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [items])

  useAnimationFrame((_, delta) => {
    if (!isInView || prefersReducedMotion || halfWidth <= 0) return

    const velocity = smoothVelocity.get()

    // Scrolling up and scrolling down push the band opposite ways.
    if (velocity < -60) directionRef.current = 1
    else if (velocity > 60) directionRef.current = -1

    const boost = Math.min(Math.abs(velocity) / 1400, 1.6)
    let next = x.get() + directionRef.current * speed * (1 + boost) * (delta / 1000)

    // Keep the offset inside one copy so the loop is seamless.
    if (next <= -halfWidth) next += halfWidth
    if (next > 0) next -= halfWidth

    x.set(next)
  })

  const copies = prefersReducedMotion ? [0] : [0, 1]

  return (
    <div ref={containerRef} className={`overflow-hidden ${className ?? ''}`}>
      <motion.div
        ref={trackRef}
        className="flex w-max will-change-transform"
        style={prefersReducedMotion ? undefined : { x }}
      >
        {copies.map((copy) => (
          <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
            {items.map((item, index) => (
              <span key={`${copy}-${index}`} className="flex shrink-0 items-center">
                <span className="px-4">{item}</span>
                <span className="text-accent-deep/70">—</span>
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  )
}
