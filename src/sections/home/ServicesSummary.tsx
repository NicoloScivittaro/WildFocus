import { SectionTitle } from '@/components/ui/SectionTitle'
import { ServiceCard } from '@/components/ui/ServiceCard'
import { Reveal } from '@/components/ui/Reveal'
import { services } from '@/data/services'

const miniSteps = [
  { step: '1', label: 'Brief e obiettivi' },
  { step: '2', label: 'Produzione ed editing' },
  { step: '3', label: 'Consegna e supporto' },
]

export function ServicesSummary() {
  return (
    <section className="py-12">
      <SectionTitle
        eyebrow="Servizi"
        title="Cosa facciamo"
        description="Quattro aree di lavoro, un solo obiettivo: contenuti che generano risultati."
      />

      <Reveal className="mt-8 grid gap-6 md:grid-cols-2">
        {services.map((service) => (
          <ServiceCard key={service.slug} service={service} />
        ))}
      </Reveal>

      <Reveal className="mt-10 flex flex-col gap-4 rounded-xl2 border border-ink/10 bg-surface p-6 md:flex-row md:items-center md:justify-between">
        {miniSteps.map((item) => (
          <div key={item.step} className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-semibold text-ink">
              {item.step}
            </span>
            <span className="text-sm text-ink-muted">{item.label}</span>
          </div>
        ))}
      </Reveal>
    </section>
  )
}
