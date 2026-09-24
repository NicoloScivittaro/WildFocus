import { SectionTitle } from '@/components/ui/SectionTitle'
import { CTASection } from '@/components/ui/CTASection'
import { Seo } from '@/seo/Seo'

const recurringServices = [
  'Montaggio di Reel mensili',
  'Post-produzione continuativa',
  'Shooting periodici',
  'Gestione di grandi quantità di contenuti',
  'Adattamento dei video per più piattaforme',
  'Creazione di formati coordinati',
  'Supporto creativo continuativo',
]

export default function CollaborationsPage() {
  return (
    <>
      <Seo
        title="Collaborazioni — WildFocus | Contenuti mensili per aziende e creator"
        description="Pacchetti di contenuti mensili e collaborazioni continuative per aziende, creator e professionisti che hanno bisogno di produzione costante."
      />
      <div className="mx-auto max-w-5xl px-4 py-12">
        <SectionTitle
          eyebrow="Collaborazioni"
          title="Contenuti con continuità, mese dopo mese"
          description="Per aziende, creator e professionisti che non possono permettersi cali di presenza: una produzione costante, coordinata su più formati e piattaforme."
        />

        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {recurringServices.map((service) => (
            <li key={service} className="rounded-xl border border-ink/10 bg-surface p-4 text-sm text-ink-muted">
              {service}
            </li>
          ))}
        </ul>

        <div className="mt-16">
          <CTASection
            title="Costruiamo il prossimo contenuto"
            description="Raccontaci le tue esigenze mensili: troviamo insieme il ritmo di produzione giusto."
            ctaLabel="Parliamo del tuo progetto"
            ctaTo="/contatti?servizio=collaborazione-continuativa"
          />
        </div>
      </div>
    </>
  )
}
