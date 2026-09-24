import type { Transition, Variants } from 'framer-motion'

/**
 * WildFocus motion language.
 *
 * One place for easing and timing so every animation feels like it came from
 * the same hand. All curves are "premium" easings (no linear, no bounce) and
 * every effect is expressed through transform / opacity / filter / clip-path
 * so the compositor can keep it off the main thread.
 */

export type Bezier = [number, number, number, number]

/** Long, confident settle. Used for reveals and hero convergence. */
export const EASE_FOCUS: Bezier = [0.16, 1, 0.3, 1]
/** Softer variant for smaller elements. */
export const EASE_SOFT: Bezier = [0.22, 1, 0.36, 1]
/** Symmetric, for exits and overlay sweeps. */
export const EASE_SWEEP: Bezier = [0.76, 0, 0.24, 1]

export const DURATION = {
  micro: 0.22,
  fast: 0.34,
  base: 0.55,
  reveal: 0.9,
  wild: 1.15,
} as const

/** Reveal once, slightly before the element is fully in frame. */
export const VIEWPORT = { once: true, amount: 0.25 } as const
/** For tall sections where 25% may never be reached on small screens. */
export const VIEWPORT_LOOSE = { once: true, amount: 0.1 } as const

export const SPRING_SOFT: Transition = { type: 'spring', stiffness: 140, damping: 20, mass: 0.6 }

/**
 * Spring options for `useSpring` (no `type` key — these are always springs).
 * The cursor ring lags slightly; the magnetic drift is softer still.
 */
export const SPRING_CURSOR = { stiffness: 520, damping: 42, mass: 0.4 }
export const SPRING_MAGNET = { stiffness: 220, damping: 24, mass: 0.5 }

/**
 * The brand's core gesture: an element starts blurred, slightly out of place
 * and marginally scaled down, then converges into its final composition.
 * WILD → FOCUS.
 */
export function wildFocusItem(direction = 1, distance = 18) {
  return {
    hidden: {
      opacity: 0,
      x: direction * distance,
      y: distance * 0.7,
      scale: 0.985,
      filter: 'blur(10px)',
    },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: { duration: DURATION.wild, ease: EASE_FOCUS },
    },
  }
}

/** Container that staggers its wild→focus children. */
export const wildFocusContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.12 },
  },
}

/**
 * Staggered grid reveal: the container only orchestrates timing, each child
 * runs a quick opacity + rise. Deliberately no blur here — the blur lives on
 * two or three signature moments only, because a lingering `filter` on every
 * repeated card would cost compositing for an effect nobody notices.
 */
export function staggerContainer(stagger = 0.08, delay = 0): Variants {
  return { hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.992 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: DURATION.reveal, ease: EASE_FOCUS },
  },
}
