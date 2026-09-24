import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import type { ReactNode } from 'react'
import { DURATION, EASE_FOCUS, EASE_SOFT } from '@/lib/motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

type RevealVariant = 'up' | 'fade' | 'mask-up' | 'mask-left' | 'wild'

interface RevealProps {
  children: ReactNode
  className?: string
  /**
   * `up` (default) is the original subtle fade+rise. The mask variants wipe
   * content into place; `wild` runs the brand's blur → focus convergence.
   */
  variant?: RevealVariant
  delay?: number
  duration?: number
  /** Fraction of the element that must be visible before triggering. */
  amount?: number
}

const VARIANTS: Record<RevealVariant, Variants> = {
  up: { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } },
  fade: { hidden: { opacity: 0 }, show: { opacity: 1 } },
  'mask-up': {
    hidden: { clipPath: 'inset(0% 0% 100% 0%)', y: 14 },
    show: { clipPath: 'inset(0% 0% 0% 0%)', y: 0 },
  },
  'mask-left': {
    hidden: { clipPath: 'inset(0% 100% 0% 0%)', x: -16 },
    show: { clipPath: 'inset(0% 0% 0% 0%)', x: 0 },
  },
  wild: {
    hidden: { opacity: 0, y: 20, x: 14, scale: 0.99, filter: 'blur(10px)' },
    show: { opacity: 1, y: 0, x: 0, scale: 1, filter: 'blur(0px)' },
  },
}

export function Reveal({
  children,
  className,
  variant = 'up',
  delay = 0,
  duration = DURATION.base,
  amount = 0.3,
}: RevealProps) {
  const prefersReducedMotion = usePrefersReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  const variants = VARIANTS[variant]

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={variants}
      transition={{
        duration: variant === 'wild' ? DURATION.wild : duration,
        ease: variant === 'up' ? EASE_SOFT : EASE_FOCUS,
        delay,
      }}
    >
      {children}
    </motion.div>
  )
}
