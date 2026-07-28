import { SectionTitle } from '@/components/ui/SectionTitle'
import { Seo } from '@/seo/Seo'

export default function CookiePolicyPage() {
  return (
    <>
      <Seo title="Cookie Policy — WildFocus" description="Informativa sui cookie utilizzati dal sito WildFocus." />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div role="note" className="rounded-xl2 border border-accent/40 bg-surface p-4 text-sm text-ink">
          Bozza — testo non definitivo, da far revisionare da un professionista legale prima della pubblicazione.
        </div>

        <div className="mt-8">
          <SectionTitle title="Cookie Policy" />
          <div className="mt-4 space-y-4 text-sm text-ink-muted">
            <p>
              Il sito, allo stato attuale, utilizza esclusivamente cookie tecnici necessari al funzionamento di base.
              Non sono attivi cookie di profilazione o strumenti di analytics.
            </p>
            <p>
              Se in futuro verranno attivati strumenti di analisi (es. Google Analytics), questa pagina verrà
              aggiornata e verrà mostrato un banner di consenso prima dell&apos;attivazione di qualsiasi cookie non
              tecnico.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
