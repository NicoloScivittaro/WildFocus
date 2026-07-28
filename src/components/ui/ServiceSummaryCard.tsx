import { Film, Camera, Share2, Building2 } from 'lucide-react'
import type { Service } from '@/types/content'

const serviceIcons: Record<string, typeof Film> = {
  'video-editing': Film,
  'fotografia-shooting': Camera,
  'contenuti-social': Share2,
  'produzione-brand-aziende': Building2,
}

interface ServiceSummaryCardProps {
  service: Service
}

/**
 * Condensed service teaser for the Home page — icon, title, one-line
 * outcome, nothing else. The full breakdown (includes/examples/CTA) lives
 * on /servizi via ServiceCard; the Home page only needs to point there.
 */
export function ServiceSummaryCard({ service }: ServiceSummaryCardProps) {
  const Icon = serviceIcons[service.slug] ?? Film

  return (
    <div className="rounded-xl2 border border-base/15 bg-base/5 p-6">
      <Icon className="text-accent" aria-hidden="true" />
      <h3 className="mt-3 font-display text-lg text-base">{service.title}</h3>
      <p className="mt-2 text-sm text-base/70">{service.outcomeStatement}</p>
    </div>
  )
}
