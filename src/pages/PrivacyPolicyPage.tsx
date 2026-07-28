import { SectionTitle } from '@/components/ui/SectionTitle'
import { siteConfig } from '@/data/siteConfig'
import { Seo } from '@/seo/Seo'

export default function PrivacyPolicyPage() {
  return (
    <>
      <Seo title="Privacy Policy — WildFocus" description="Informativa sul trattamento dei dati raccolti tramite il form contatti di WildFocus." />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div role="note" className="rounded-xl2 border border-accent/40 bg-surface p-4 text-sm text-ink">
          Bozza — testo non definitivo, da far revisionare da un professionista legale prima della pubblicazione.
        </div>

        <div className="mt-8">
          <SectionTitle title="Privacy Policy" />
          <div className="mt-4 space-y-4 text-sm text-ink-muted">
            <p>
              I dati inseriti nel form contatti (nome, email, eventuale telefono, dettagli del progetto) vengono
              utilizzati esclusivamente per rispondere alla richiesta e, se necessario, formulare un preventivo.
            </p>
            <p>
              Allo stato attuale il sito non utilizza cookie di profilazione o strumenti di analytics. Per i dettagli
              sui cookie tecnici, consulta la{' '}
              <a href="/cookie-policy" className="text-accent-deep underline">
                Cookie Policy
              </a>
              .
            </p>
            <p>Titolare del trattamento: WildFocus, {siteConfig.email}.</p>
          </div>
        </div>
      </div>
    </>
  )
}
