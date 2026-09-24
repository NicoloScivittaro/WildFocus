import { Film, Camera, Share2, Building2, Headphones, Music } from 'lucide-react'
import type { Service } from '@/types/content'

const serviceIcons: Record<string, typeof Film> = {
  'video-editing': Film,
  'fotografia-shooting': Camera,
  'contenuti-social': Share2,
  'produzione-brand-aziende': Building2,
  'sound-design': Headphones,
  'produzione-musicale': Music,
}

interface ServiceSummaryCardProps {
  service: Service
  /** The service the pointer is on — it takes on more presence. */
  isActive?: boolean
  /** Another service is active, so this one recedes. */
  isDimmed?: boolean
}

/**
 * Condensed service teaser for the Home page — icon, title, one-line
 * outcome, nothing else. The full breakdown (includes/examples/CTA) lives
 * on /servizi via ServiceCard; the Home page only needs to point there.
 *
 * Hovering the grid makes one card lead and the others recede, so the row
 * reads like an editorial list rather than six equal buttons.
 */
export function ServiceSummaryCard({ service, isActive = false, isDimmed = false }: ServiceSummaryCardProps) {
  const Icon = serviceIcons[service.slug] ?? Film

  return (
    <div
      className={`relative h-full overflow-hidden rounded-xl2 border p-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isActive ? 'border-accent bg-base/10' : 'border-base/15 bg-base/5'
      } ${isDimmed ? 'opacity-50' : 'opacity-100'}`}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-px origin-left bg-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isActive ? 'scale-x-100' : 'scale-x-0'
        }`}
      />
      <Icon
        className={`transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isActive ? 'text-accent' : 'text-accent/70'
        }`}
        aria-hidden="true"
      />
      <h3 className="mt-3 font-display text-lg text-base">{service.title}</h3>
      <p className="mt-2 text-sm text-base/70">{service.outcomeStatement}</p>
    </div>
  )
}
