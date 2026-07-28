import { Link } from 'react-router-dom'
import { siteConfig } from '@/data/siteConfig'

interface CTASectionProps {
  title: string
  description?: string
  ctaLabel?: string
  ctaTo?: string
  secondaryLabel?: string
  secondaryTo?: string
}

export function CTASection({
  title,
  description,
  ctaLabel = siteConfig.primaryCta,
  ctaTo = '/contatti',
  secondaryLabel,
  secondaryTo,
}: CTASectionProps) {
  return (
    <section className="rounded-xl2 border border-ink/10 bg-surface px-6 py-10 text-center md:px-12 md:py-14">
      <h2 className="font-display text-2xl text-ink md:text-3xl">{title}</h2>
      {description && <p className="mx-auto mt-3 max-w-xl text-ink-muted">{description}</p>}
      <div className="mt-6 flex flex-col items-center justify-center gap-3 md:flex-row">
        <Link to={ctaTo} className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-ink hover:opacity-90">
          {ctaLabel}
        </Link>
        {secondaryLabel && secondaryTo && (
          <Link to={secondaryTo} className="rounded-full border border-ink/20 px-6 py-3 text-sm text-ink hover:border-ink/40">
            {secondaryLabel}
          </Link>
        )}
      </div>
    </section>
  )
}
