import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { VideoPlayer } from '@/components/ui/VideoPlayer'
import { SplitLines } from '@/components/motion/SplitLines'
import { MagneticButton } from '@/components/motion/MagneticButton'
import { siteConfig } from '@/data/siteConfig'
import { heroPosterDataUri } from '@/lib/placeholderPoster'
import { wildFocusContainer, wildFocusItem } from '@/lib/motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { useScrollSkew } from '@/hooks/useScrollSkew'

/**
 * Hero entrance — the brand statement in one gesture.
 *
 * Every element starts slightly blurred, off-position and marginally scaled
 * down, then converges into place over ~1.1s while the blur resolves to zero:
 * chaos becoming intent, WILD → FOCUS. The headline layers a masked
 * split-text reveal on top of that convergence.
 */
export function Hero() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const scrollSkew = useScrollSkew()

  const containerProps = prefersReducedMotion
    ? {}
    : { initial: 'hidden' as const, animate: 'show' as const, variants: wildFocusContainer }

  const itemVariants = (direction: number) => (prefersReducedMotion ? undefined : wildFocusItem(direction))

  return (
    <motion.section
      className="grid gap-10 py-12 md:grid-cols-2 md:items-center md:py-20"
      {...containerProps}
    >
      <motion.div variants={itemVariants(-1)}>
        <SplitLines
          as="h1"
          mode="mount"
          lines={["Contenuti che catturano l'attenzione.", 'Immagini che fanno crescere il tuo brand.']}
          className="font-display text-4xl leading-tight text-ink md:text-5xl"
        />

        <motion.p variants={itemVariants(1)} className="mt-4 max-w-lg text-ink-muted">
          {siteConfig.positioning}
        </motion.p>

        <motion.div variants={itemVariants(1)} className="mt-8 flex flex-wrap gap-3">
          <MagneticButton>
            <Link
              to={siteConfig.startProjectPath}
              data-cursor="GO →"
              className="group relative overflow-hidden rounded-full bg-accent px-6 py-3 text-sm font-semibold text-ink"
            >
              <span className="absolute inset-0 -translate-x-full bg-accent-deep transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0" />
              <span className="relative transition-colors duration-500 group-hover:text-base">{siteConfig.primaryCta}</span>
            </Link>
          </MagneticButton>

          <MagneticButton>
            <Link
              to="/portfolio"
              data-cursor="GO →"
              className="group relative overflow-hidden rounded-full border border-ink/20 px-6 py-3 text-sm text-ink transition-colors duration-300 hover:border-ink/40"
            >
              <span className="absolute inset-0 -translate-x-full bg-ink/5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0" />
              <span className="relative inline-flex items-center gap-1.5">
                Guarda i nostri lavori
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5"
                >
                  →
                </span>
              </span>
            </Link>
          </MagneticButton>
        </motion.div>
      </motion.div>

      <motion.div variants={itemVariants(1)}>
        {/* Scroll-velocity stretch: a whisper of skew that only exists while moving. */}
        <motion.div style={scrollSkew ? { skewY: scrollSkew } : undefined}>
          <VideoPlayer title="Showreel WildFocus" poster={heroPosterDataUri} />
        </motion.div>
      </motion.div>
    </motion.section>
  )
}
