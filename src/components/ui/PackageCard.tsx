import { Link } from 'react-router-dom'
import type { PackagePlan } from '@/types/content'

interface PackageCardProps {
  plan: PackagePlan
}

export function PackageCard({ plan }: PackageCardProps) {
  return (
    <article className="flex flex-col rounded-xl2 border border-ink/10 bg-surface p-6">
      <h3 className="font-display text-xl text-ink">{plan.name}</h3>
      <p className="mt-3 text-ink-muted">{plan.description}</p>

      <ul className="mt-4 space-y-1 text-sm text-ink-muted">
        {plan.highlights.map((item) => (
          <li key={item}>· {item}</li>
        ))}
      </ul>

      <p className="mt-6 font-display text-lg text-accent-deep">{plan.priceLabel}</p>

      <Link
        to={`/contatti?pacchetto=${plan.slug}`}
        className="mt-3 inline-block rounded-full bg-accent px-4 py-2 text-center text-sm font-semibold text-ink hover:opacity-90"
      >
        Parliamo del tuo progetto
      </Link>
    </article>
  )
}
