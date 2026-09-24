import { useState } from 'react'
import { motion } from 'framer-motion'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { ServiceSummaryCard } from '@/components/ui/ServiceSummaryCard'
import { Reveal } from '@/components/ui/Reveal'
import { services } from '@/data/services'
import { VIEWPORT, staggerContainer, staggerItem } from '@/lib/motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

const miniSteps = [
  { step: '1', label: 'Brief e obiettivi' },
  { step: '2', label: 'Produzione ed editing' },
  { step: '3', label: 'Consegna e supporto' },
]

export function ServicesSummary() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [activeSlug, setActiveSlug] = useState<string | null>(null)

  return (
    <div className="py-12">
      <section className="rounded-xl2 bg-ink px-6 py-12 md:px-10 md:py-16">
        <SectionTitle
          inverted
          eyebrow="Servizi"
          title="Cosa facciamo"
          description="Sei aree di lavoro, un solo obiettivo: contenuti che generano risultati."
        />

        <motion.div
          className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          onMouseLeave={() => setActiveSlug(null)}
          variants={prefersReducedMotion ? undefined : staggerContainer(0.06)}
          initial={prefersReducedMotion ? undefined : 'hidden'}
          whileInView={prefersReducedMotion ? undefined : 'show'}
          viewport={VIEWPORT}
        >
          {services.map((service) => (
            <motion.div
              key={service.slug}
              variants={prefersReducedMotion ? undefined : staggerItem}
              onMouseEnter={() => setActiveSlug(service.slug)}
            >
              <ServiceSummaryCard
                service={service}
                isActive={activeSlug === service.slug}
                isDimmed={activeSlug !== null && activeSlug !== service.slug}
              />
            </motion.div>
          ))}
        </motion.div>

        <Reveal variant="up" className="mt-10">
          <div className="flex flex-col gap-4 rounded-xl2 border border-base/15 bg-base/5 p-6 md:flex-row md:items-center md:justify-between">
            {miniSteps.map((item) => (
              <div key={item.step} className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-semibold text-ink">
                  {item.step}
                </span>
                <span className="text-sm text-base/70">{item.label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>
    </div>
  )
}
