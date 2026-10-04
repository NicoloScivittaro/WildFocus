import { SectionTitle } from '@/components/ui/SectionTitle'
import { ServiceCard } from '@/components/ui/ServiceCard'
import { PackageCard } from '@/components/ui/PackageCard'
import { QuoteEstimator } from '@/components/ui/QuoteEstimator'
import { services } from '@/data/services'
import { packages } from '@/data/packages'
import { Seo } from '@/seo/Seo'

export default function ServicesPage() {
  return (
    <>
      <Seo
        title="Servizi — WildFocus | Video, fotografia, contenuti social, sound design e musica"
        description="Reel, fotografia e matrimonio con pacchetti e prezzi chiari, più servizi su misura con preventivo personalizzato."
      />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <SectionTitle
          eyebrow="Servizi"
          title="Le nostre aree di lavoro"
          description="Sei macro-servizi, ogni lavorazione pensata per un risultato concreto."
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
            description="Formule su misura per progetti che escono dai pacchetti con prezzo: più servizi, continuità o lavorazioni dedicate."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {packages.map((plan) => (
              <PackageCard key={plan.slug} plan={plan} />
            ))}
          </div>
        </div>

        <div className="mt-16">
          <QuoteEstimator />
        </div>
      </div>
    </>
  )
}
