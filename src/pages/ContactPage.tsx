import { useSearchParams } from 'react-router-dom'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { ContactForm } from '@/components/forms/ContactForm'
import { siteConfig } from '@/data/siteConfig'
import { estimateQuote, findQuoteTransfer, quoteServiceSlug } from '@/data/quote'
import { Seo } from '@/seo/Seo'

const afterSubmitSteps = ['Richiesta', 'Risposta e call conoscitiva', 'Preventivo su misura', 'Avvio del progetto']

const currency = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

export default function ContactPage() {
  const [searchParams] = useSearchParams()
  const preselectedService = searchParams.get('servizio') ?? ''
  const packageIds = (searchParams.get('pacchetti') ?? '')
    .split(',')
    .map((id) => id.trim())
    .filter((id) => id.length > 0)
  const transferParam = searchParams.get('trasferimento')

  const estimate = estimateQuote(packageIds, transferParam)
  const hasPackages = estimate.packageCount > 0
  const transfer = findQuoteTransfer(transferParam)
  const total = estimate.total

  const serviceForForm = hasPackages ? quoteServiceSlug(packageIds) || preselectedService : preselectedService

  const selectionSummary = hasPackages
    ? [
        `Pacchetti: ${estimate.packages
          .map((line) => `${line.name} (${currency.format(line.price)})`)
          .join(', ')}`,
        transfer.price > 0 ? `Trasferimento: ${transfer.label} (${currency.format(transfer.price)})` : null,
        `Totale indicativo: ${currency.format(total)}`,
      ]
        .filter((part): part is string => part !== null)
        .join(' · ')
    : ''

  return (
    <>
      <Seo
        title="Contatti — WildFocus | Richiedi un preventivo"
        description="Raccontaci il tuo progetto: reel, fotografia, matrimonio o una richiesta su misura. Ti risponderemo con i prossimi passi."
      />
      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 md:grid-cols-[1.1fr,0.9fr]">
        <div>
          <SectionTitle
            eyebrow="Contatti"
            title="Raccontaci il tuo progetto"
            description="Ti aiuteremo a trasformarlo in qualcosa che le persone vorranno guardare, ricordare e condividere."
          />

          {hasPackages && (
            <div className="mt-3 rounded-xl2 border border-ink/10 bg-surface px-4 py-3 text-sm text-ink-muted">
              <p className="font-semibold text-ink">Pacchetti selezionati</p>
              <ul className="mt-2 space-y-1">
                {estimate.packages.map((line) => (
                  <li key={line.id} className="flex items-baseline justify-between gap-4">
                    <span>{line.name}</span>
                    <span className="text-accent-deep">{currency.format(line.price)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2">
                Trasferimento:{' '}
                <span className="text-accent-deep">
                  {transfer.price > 0 ? `${transfer.label} (${currency.format(transfer.price)})` : 'nessuno'}
                </span>
              </p>
              <p className="mt-1">
                Totale indicativo: <span className="text-accent-deep">{currency.format(total)}</span>
              </p>
            </div>
          )}

          <ol className="mt-8 space-y-3 text-sm text-ink-muted">
            {afterSubmitSteps.map((step, index) => (
              <li key={step} className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface text-xs text-accent-deep">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>

          <div className="mt-8 space-y-2 text-sm text-ink-muted">
            <p>
              Email:{' '}
              <a href={`mailto:${siteConfig.email}`} className="text-accent-deep hover:underline">
                {siteConfig.email}
              </a>
            </p>
            <p>
              WhatsApp:{' '}
              <a href={siteConfig.whatsappLink} target="_blank" rel="noreferrer" className="text-accent-deep hover:underline">
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

        <ContactForm initialService={serviceForForm} initialDescription={selectionSummary} />
      </div>
    </>
  )
}
