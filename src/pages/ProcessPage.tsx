import { SectionTitle } from '@/components/ui/SectionTitle'
import { FaqAccordion } from '@/components/ui/FaqAccordion'
import { CTASection } from '@/components/ui/CTASection'
import { faqItems } from '@/data/faq'
import { Seo } from '@/seo/Seo'

const phases = [
  { name: 'Scoperta', steps: ['Brief iniziale', 'Analisi degli obiettivi'] },
  { name: 'Ideazione', steps: ['Ideazione creativa'] },
  { name: 'Produzione', steps: ['Produzione o ricezione dei materiali', 'Editing e post-produzione'] },
  { name: 'Consegna', steps: ['Revisione', 'Consegna finale', 'Supporto successivo'] },
]

export default function ProcessPage() {
  return (
    <>
      <Seo
        title="Processo — WildFocus | Come lavoriamo"
        description="Dal brief iniziale alla consegna finale: il metodo di lavoro WildFocus in quattro fasi, pensato per essere semplice e rassicurante."
      />
      <div className="mx-auto max-w-5xl px-4 py-12">
        <SectionTitle
          eyebrow="Processo"
          title="Come lavoriamo"
          description="Quattro fasi, un percorso chiaro dal primo contatto alla consegna finale."
        />

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {phases.map((phase, index) => (
            <div key={phase.name} className="rounded-xl2 border border-ink/10 bg-surface p-6">
              <span className="text-sm font-semibold text-accent">Fase {index + 1}</span>
              <h3 className="mt-1 font-display text-xl text-ink">{phase.name}</h3>
              <ul className="mt-3 space-y-1 text-sm text-ink-muted">
                {phase.steps.map((step) => (
                  <li key={step}>· {step}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <SectionTitle eyebrow="FAQ" title="Domande frequenti" />
          <div className="mt-8">
            <FaqAccordion items={faqItems} />
          </div>
        </div>

        <div className="mt-16">
          <CTASection title="Parliamo del tuo progetto" secondaryLabel="Guarda cosa possiamo creare" secondaryTo="/portfolio" />
        </div>
      </div>
    </>
  )
}
