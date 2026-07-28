import { Link } from 'react-router-dom'
import type { Service } from '@/types/content'

interface ServiceCardProps {
  service: Service
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article className="flex flex-col rounded-xl2 border border-ink/10 bg-surface p-6">
      <h3 className="font-display text-xl text-ink">{service.title}</h3>
      <p className="mt-3 text-ink-muted">{service.outcomeStatement}</p>
      <p className="mt-3 text-sm text-ink-muted">
        <span className="text-ink">Risolve:</span> {service.problemSolved}
      </p>

      <ul className="mt-4 space-y-1 text-sm text-ink-muted">
        {service.includes.map((item) => (
          <li key={item}>· {item}</li>
        ))}
      </ul>

      {service.examples.length > 0 && (
        <div className="mt-4">
          <p className="text-xs uppercase tracking-wide text-ink-muted">Esempi</p>
          <ul className="mt-1 space-y-1 text-sm text-ink-muted">
            {service.examples.map((example) => (
              <li key={example}>· {example}</li>
            ))}
          </ul>
        </div>
      )}

      <Link
        to={`/contatti?servizio=${service.slug}`}
        className="mt-6 inline-block rounded-full border border-accent px-4 py-2 text-center text-sm font-semibold text-accent hover:bg-accent hover:text-ink"
      >
        {service.ctaLabel}
      </Link>
    </article>
  )
}
