import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { DURATION, EASE_FOCUS, VIEWPORT } from '@/lib/motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

type SplitLinesTag = 'h1' | 'h2' | 'h3' | 'p' | 'div' | 'span'

interface SplitLinesProps {
  /** One entry per visual line. Content stays real text inside the DOM. */
  lines: ReactNode[]
  as?: SplitLinesTag
  className?: string
  lineClassName?: string
  delay?: number
  stagger?: number
  /** `mount` for above-the-fold headlines, `inView` for the rest. */
  mode?: 'inView' | 'mount'
}

/**
 * Editorial headline reveal: each line sits in an overflow-hidden mask and
 * slides up into place with a short stagger. Used only on headlines — small
 * copy gets a plain fade so the page never feels like everything is moving.
 */
export function SplitLines({
  lines,
  as: Tag = 'h2',
  className,
  lineClassName,
  delay = 0,
  stagger = 0.08,
  mode = 'inView',
}: SplitLinesProps) {
  const prefersReducedMotion = usePrefersReducedMotion()

  if (prefersReducedMotion) {
    return (
      <Tag className={className}>
        {lines.map((line, index) => (
          <span key={index} className={`block ${lineClassName ?? ''}`}>
            {line}
          </span>
        ))}
      </Tag>
    )
  }

  return (
    <Tag className={className}>
      {lines.map((line, index) => (
        /*
          The mask needs overflow-hidden to work, but that would also shear the
          descenders off letters like "g" and "p" at tight leading. The padding
          extends the clipping box below the baseline and the matching negative
          margin gives the space back, so nothing shifts.
        */
        <span key={index} className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
          <motion.span
            className={`block ${lineClassName ?? ''}`}
            initial={{ y: '110%' }}
            animate={mode === 'mount' ? { y: '0%' } : undefined}
            whileInView={mode === 'inView' ? { y: '0%' } : undefined}
            viewport={mode === 'inView' ? VIEWPORT : undefined}
            transition={{
              duration: DURATION.reveal,
              ease: EASE_FOCUS,
              delay: delay + index * stagger,
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
