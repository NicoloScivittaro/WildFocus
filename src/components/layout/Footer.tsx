import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { siteConfig } from '@/data/siteConfig'
import { Logo } from '@/components/ui/Logo'
import { SplitLines } from '@/components/motion/SplitLines'
import { MagneticButton } from '@/components/motion/MagneticButton'
import { EASE_FOCUS, VIEWPORT } from '@/lib/motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

export function Footer() {
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <footer className="border-t border-ink/10 bg-base">
      {/*
        The last scene: the promise, then the door. WILD arrives out of focus
        and resolves — the same gesture as the hero, closing the loop.
      */}
      <section className="bg-ink px-4 py-20 text-center md:py-28">
        <SplitLines
          as="h2"
          mode="inView"
          stagger={0.1}
          lines={[
            "LET'S MAKE",
            <>
              SOMETHING{' '}
              {prefersReducedMotion ? (
                <span>WILD.</span>
              ) : (
                <motion.span
                  className="inline-block"
                  initial={{ opacity: 0, filter: 'blur(14px)', scale: 1.06, skewX: 7 }}
                  whileInView={{ opacity: 1, filter: 'blur(0px)', scale: 1, skewX: 0 }}
                  viewport={VIEWPORT}
                  transition={{ duration: 1.25, ease: EASE_FOCUS, delay: 0.18 }}
                >
                  WILD.
                </motion.span>
              )}
            </>,
          ]}
          className="font-display text-4xl leading-[1.05] text-base md:text-7xl"
        />

        <div className="mt-10 flex justify-center">
          <MagneticButton strength={9}>
            <Link
              to={siteConfig.startProjectPath}
              data-cursor="GO →"
              className="group relative overflow-hidden rounded-full bg-accent px-8 py-4 text-sm font-semibold tracking-[0.14em] text-ink"
            >
              <span className="absolute inset-0 -translate-x-full bg-accent-deep transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0" />
              <span className="relative transition-colors duration-500 group-hover:text-base">
                START A PROJECT →
              </span>
            </Link>
          </MagneticButton>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-2 text-sm text-ink-muted">{siteConfig.positioning}</p>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink">Naviga</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-muted">
            {siteConfig.nav.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="link-underline hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink">Contatti</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-muted">
            <li>{siteConfig.email}</li>
            <li>{siteConfig.city}</li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink">Social</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-muted">
            {siteConfig.socials.map((social) => (
              <li key={social.platform}>
                <a href={social.url} target="_blank" rel="noreferrer" className="link-underline hover:text-ink">
                  {social.platform}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-ink/10 px-4 py-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 text-xs text-ink-muted md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} WildFocus. Tutti i diritti riservati.</p>
          <div className="flex gap-4">
            <Link to="/privacy-policy" className="link-underline hover:text-ink">
              Privacy Policy
            </Link>
            <Link to="/cookie-policy" className="link-underline hover:text-ink">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
