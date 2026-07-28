import { SectionTitle } from '@/components/ui/SectionTitle'
import { TeamMember } from '@/components/ui/TeamMember'
import { CTASection } from '@/components/ui/CTASection'
import { team } from '@/data/team'
import { Seo } from '@/seo/Seo'

const values = [
  'Creatività',
  'Attenzione ai dettagli',
  'Comunicazione trasparente',
  'Puntualità',
  'Qualità',
  'Ricerca continua',
  'Orientamento ai risultati',
]

export default function AboutPage() {
  return (
    <>
      <Seo
        title="Chi siamo — WildFocus"
        description="WildFocus è un team creativo specializzato in video editing, fotografia e contenuti social, nato per trasformare idee in contenuti che generano risultati."
      />
      <div className="mx-auto max-w-5xl px-4 py-12">
        <SectionTitle
          eyebrow="Chi siamo"
          title="Un team creativo, non un'agenzia generica"
          description="WildFocus nasce dall'idea che ogni contenuto debba avere uno scopo: attirare attenzione, raccontare valore e portare il pubblico a compiere un'azione."
        />

        <ul className="mt-8 flex flex-wrap gap-3">
          {values.map((value) => (
            <li key={value} className="rounded-full border border-ink/10 bg-surface px-4 py-2 text-sm text-ink-muted">
              {value}
            </li>
          ))}
        </ul>

        <div className="mt-16">
          <SectionTitle eyebrow="Il team" title="Le persone dietro WildFocus" />
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {team.map((member) => (
              <TeamMember key={member.name + member.role} member={member} />
            ))}
          </div>
        </div>

        <div className="mt-16">
          <CTASection title="Parliamo del tuo progetto" />
        </div>
      </div>
    </>
  )
}
