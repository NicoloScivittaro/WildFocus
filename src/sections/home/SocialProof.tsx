import { SectionTitle } from '@/components/ui/SectionTitle'
import { TestimonialCard } from '@/components/ui/TestimonialCard'
import { Reveal } from '@/components/ui/Reveal'
import { testimonials } from '@/data/testimonials'
import { siteConfig } from '@/data/siteConfig'

export function SocialProof() {
  return (
    <section className="py-12">
      <SectionTitle eyebrow="Prova sociale" title="Chi ha lavorato con noi" align="center" />

      <Reveal className="mt-8 grid gap-6 md:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard key={index} testimonial={testimonial} />
        ))}
      </Reveal>

      <dl className="mt-10 grid grid-cols-1 gap-6 text-center sm:grid-cols-3">
        {siteConfig.trustStats.map((stat) => (
          <div key={stat.label}>
            <dt className="text-sm text-ink-muted">{stat.label}</dt>
            <dd className="mt-1 font-display text-2xl text-accent">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
