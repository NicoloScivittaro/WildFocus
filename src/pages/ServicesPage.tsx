import { SectionTitle } from '@/components/ui/SectionTitle'
import { ServiceCard } from '@/components/ui/ServiceCard'
import { PackageCard } from '@/components/ui/PackageCard'
import { CTASection } from '@/components/ui/CTASection'
import { services } from '@/data/services'
import { packages } from '@/data/packages'
import { Seo } from '@/seo/Seo'

export default function ServicesPage() {
  return (
    <>
      <Seo
        title="Servizi — WildFocus | Video editing, fotografia, contenuti social"
        description="Video editing, fotografia e shooting, contenuti social, produzione per brand e aziende. Preventivo personalizzato per ogni progetto."
      />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <SectionTitle
          eyebrow="Servizi"
          title="Le nostre aree di lavoro"
          description="Quattro macro-servizi, ogni lavorazione pensata per un risultato concreto."
        />

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>

        <div className="mt-16">
          <SectionTitle
            eyebrow="Pacchetti"
            title="Come possiamo collaborare"
            description="Ogni pacchetto viene definito su misura. Nessun prezzo standard: solo preventivi personalizzati."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {packages.map((plan) => (
              <PackageCard key={plan.slug} plan={plan} />
            ))}
          </div>
        </div>

        <div className="mt-16">
          <CTASection title="Parliamo del tuo progetto" secondaryLabel="Scopri i nostri lavori" secondaryTo="/portfolio" />
        </div>
      </div>
    </>
  )
}
