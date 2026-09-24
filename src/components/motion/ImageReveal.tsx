import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { DURATION, EASE_FOCUS, VIEWPORT } from '@/lib/motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

type RevealDirection = 'up' | 'down' | 'left' | 'right'

const CLIP_START: Record<RevealDirection, string> = {
  up: 'inset(0% 0% 100% 0%)',
  down: 'inset(100% 0% 0% 0%)',
  left: 'inset(0% 100% 0% 0%)',
  right: 'inset(0% 0% 0% 100%)',
}

interface ImageRevealProps {
  children: ReactNode
  className?: string
  direction?: RevealDirection
  delay?: number
  duration?: number
  /** Settle the media from a slight zoom while the mask opens. */
  zoom?: boolean
}

/**
 * Masked media reveal: a clip-path wipes the frame open while the image
 * settles from a barely-there zoom. Alternating directions across a page
 * keeps the rhythm from feeling mechanical.
 */
export function ImageReveal({
  children,
  className,
  direction = 'up',
  delay = 0,
  duration = DURATION.reveal,
  zoom = true,
}: ImageRevealProps) {
  const prefersReducedMotion = usePrefersReducedMotion()

  if (prefersReducedMotion) {
    return <div className={`relative overflow-hidden ${className ?? ''}`}>{children}</div>
  }

  const transition = { duration, ease: EASE_FOCUS, delay }

  return (
    <motion.div
      className={`relative overflow-hidden ${className ?? ''}`}
      initial={{ clipPath: CLIP_START[direction] }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={VIEWPORT}
      transition={transition}
    >
      {zoom ? (
        <motion.div
          className="h-full w-full"
          initial={{ scale: 1.06 }}
          whileInView={{ scale: 1 }}
          viewport={VIEWPORT}
          transition={transition}
        >
          {children}
        </motion.div>
      ) : (
        children
      )}
    </motion.div>
  )
}
