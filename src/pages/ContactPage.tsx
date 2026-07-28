import { useSearchParams } from 'react-router-dom'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { ContactForm } from '@/components/forms/ContactForm'
import { siteConfig } from '@/data/siteConfig'
import { Seo } from '@/seo/Seo'

const afterSubmitSteps = ['Richiesta', 'Risposta e call conoscitiva', 'Preventivo su misura', 'Avvio del progetto']

export default function ContactPage() {
  const [searchParams] = useSearchParams()
  const preselectedService = searchParams.get('servizio')

  return (
    <>
      <Seo
        title="Contatti — WildFocus | Richiedi un preventivo"
        description="Raccontaci il tuo progetto: video editing, fotografia, contenuti social o produzione per brand. Ti risponderemo con i prossimi passi."
      />
      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 md:grid-cols-[1.1fr,0.9fr]">
        <div>
          <SectionTitle
            eyebrow="Contatti"
            title="Raccontaci il tuo progetto"
            description="Ti aiuteremo a trasformarlo in qualcosa che le persone vorranno guardare, ricordare e condividere."
          />

          {preselectedService && (
            <p className="mt-3 text-sm text-ink-muted">
              Servizio selezionato: <span className="text-accent">{preselectedService}</span>
            </p>
          )}

          <ol className="mt-8 space-y-3 text-sm text-ink-muted">
            {afterSubmitSteps.map((step, index) => (
              <li key={step} className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface text-xs text-accent">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>

          <div className="mt-8 space-y-2 text-sm text-ink-muted">
            <p>
              Email:{' '}
              <a href={`mailto:${siteConfig.email}`} className="text-accent hover:underline">
                {siteConfig.email}
              </a>
            </p>
            <p>
              WhatsApp:{' '}
              <a href={siteConfig.whatsappLink} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                Scrivici su WhatsApp
              </a>
            </p>
            <div className="flex gap-4 pt-2">
              {siteConfig.socials.map((social) => (
                <a key={social.platform} href={social.url} target="_blank" rel="noreferrer" className="hover:text-ink">
                  {social.platform}
                </a>
              ))}
            </div>
          </div>
        </div>

        <ContactForm />
      </div>
    </>
  )
}
