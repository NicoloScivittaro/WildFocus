import { useState, type FormEvent } from 'react'
import { useContactFormState } from './useContactFormState'
import { useFormMountTime } from '@/hooks/useFormMountTime'
import { submitContactRequest } from '@/services/contactService'
import { services } from '@/data/services'
import type { BudgetRange, ContactPayload, ContactPreference } from '@/types/contact'

const budgetOptions: BudgetRange[] = [
  'Meno di 500€',
  '500-1.000€',
  '1.000-2.500€',
  '2.500-5.000€',
  'Oltre 5.000€',
  'Da definire',
]

const contactPreferenceOptions: ContactPreference[] = ['Email', 'Telefono', 'WhatsApp']

interface ContactFormProps {
  /** Slug del servizio da preselezionare, ad esempio dal preventivatore. */
  initialService?: string
}

export function ContactForm({ initialService = '' }: ContactFormProps) {
  const { step, fields, updateField, goNext, goBack, isStepValid } = useContactFormState(initialService)
  const formRenderedAt = useFormMountTime()
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!isStepValid) return

    setStatus('submitting')
    setErrorMessage(null)

    const payload: ContactPayload = {
      ...fields,
      honeypot,
      formRenderedAt,
      submittedAt: Date.now(),
    }

    const result = await submitContactRequest(payload)
    if (result.ok) {
      setStatus('success')
    } else {
      setStatus('error')
      setErrorMessage(result.error ?? 'Si è verificato un errore. Riprova.')
    }
  }

  if (status === 'success') {
    return (
      <div role="status" className="rounded-xl2 border border-accent/40 bg-surface p-8 text-center">
        <h3 className="font-display text-2xl text-ink">Richiesta inviata</h3>
        <p className="mt-3 text-ink-muted">
          Grazie! Dopo la richiesta riceverai una prima risposta entro [TEMPO REALE]. Se il progetto è compatibile,
          organizziamo una breve call conoscitiva, poi ti inviamo un preventivo su misura.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-xl2 border border-ink/10 bg-surface p-6 md:p-8">
      <p className="text-sm text-ink-muted">Passo {step} di 3</p>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Non compilare questo campo</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      {step === 1 && (
        <fieldset className="mt-4 space-y-4">
          <legend className="sr-only">I tuoi dati</legend>
          <div>
            <label htmlFor="fullName" className="block text-sm text-ink">
              Nome e cognome
            </label>
            <input
              id="fullName"
              required
              value={fields.fullName}
              onChange={(event) => updateField('fullName', event.target.value)}
              className="mt-1 w-full rounded-lg border border-ink/10 bg-base px-3 py-2 text-ink"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm text-ink">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={fields.email}
              onChange={(event) => updateField('email', event.target.value)}
              className="mt-1 w-full rounded-lg border border-ink/10 bg-base px-3 py-2 text-ink"
            />
          </div>
          <div>
            <label htmlFor="service" className="block text-sm text-ink">
              Servizio richiesto
            </label>
            <select
              id="service"
              required
              value={fields.service}
              onChange={(event) => updateField('service', event.target.value)}
              className="mt-1 w-full rounded-lg border border-ink/10 bg-base px-3 py-2 text-ink"
            >
              <option value="">Seleziona un servizio</option>
              {services.map((service) => (
                <option key={service.slug} value={service.slug}>
                  {service.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="companyOrProject" className="block text-sm text-ink">
              Azienda o progetto (facoltativo)
            </label>
            <input
              id="companyOrProject"
              value={fields.companyOrProject ?? ''}
              onChange={(event) => updateField('companyOrProject', event.target.value)}
              className="mt-1 w-full rounded-lg border border-ink/10 bg-base px-3 py-2 text-ink"
            />
          </div>
        </fieldset>
      )}

      {step === 2 && (
        <fieldset className="mt-4 space-y-4">
          <legend className="sr-only">Il tuo progetto</legend>
          <div>
            <label htmlFor="projectDescription" className="block text-sm text-ink">
              Descrizione del progetto
            </label>
            <textarea
              id="projectDescription"
              required
              rows={4}
              value={fields.projectDescription}
              onChange={(event) => updateField('projectDescription', event.target.value)}
              className="mt-1 w-full rounded-lg border border-ink/10 bg-base px-3 py-2 text-ink"
            />
          </div>
          <div>
            <label htmlFor="timeline" className="block text-sm text-ink">
              Tempistiche
            </label>
            <input
              id="timeline"
              required
              value={fields.timeline}
              onChange={(event) => updateField('timeline', event.target.value)}
              className="mt-1 w-full rounded-lg border border-ink/10 bg-base px-3 py-2 text-ink"
            />
          </div>
          <div>
            <label htmlFor="budget" className="block text-sm text-ink">
              Budget indicativo (facoltativo)
            </label>
            <select
              id="budget"
              value={fields.budget ?? ''}
              onChange={(event) =>
                updateField('budget', (event.target.value || undefined) as BudgetRange | undefined)
              }
              className="mt-1 w-full rounded-lg border border-ink/10 bg-base px-3 py-2 text-ink"
            >
              <option value="">Preferisco non specificare</option>
              {budgetOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </fieldset>
      )}

      {step === 3 && (
        <fieldset className="mt-4 space-y-4">
          <legend className="sr-only">Ultimi dettagli</legend>
          <div>
            <label htmlFor="materialsLink" className="block text-sm text-ink">
              Link a materiali (facoltativo)
            </label>
            <input
              id="materialsLink"
              value={fields.materialsLink ?? ''}
              onChange={(event) => updateField('materialsLink', event.target.value)}
              className="mt-1 w-full rounded-lg border border-ink/10 bg-base px-3 py-2 text-ink"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm text-ink">
              Telefono (facoltativo)
            </label>
            <input
              id="phone"
              value={fields.phone ?? ''}
              onChange={(event) => updateField('phone', event.target.value)}
              className="mt-1 w-full rounded-lg border border-ink/10 bg-base px-3 py-2 text-ink"
            />
          </div>
          <div>
            <label htmlFor="contactPreference" className="block text-sm text-ink">
              Modalità di contatto preferita (facoltativo)
            </label>
            <select
              id="contactPreference"
              value={fields.contactPreference ?? ''}
              onChange={(event) =>
                updateField('contactPreference', (event.target.value || undefined) as ContactPreference | undefined)
              }
              className="mt-1 w-full rounded-lg border border-ink/10 bg-base px-3 py-2 text-ink"
            >
              <option value="">Nessuna preferenza</option>
              {contactPreferenceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-start gap-2">
            <input
              id="privacyAccepted"
              type="checkbox"
              required
              checked={fields.privacyAccepted}
              onChange={(event) => updateField('privacyAccepted', event.target.checked)}
              className="mt-1"
            />
            <label htmlFor="privacyAccepted" className="text-sm text-ink-muted">
              Ho letto e accetto la{' '}
              <a href="/privacy-policy" className="text-accent-deep underline">
                Privacy Policy
              </a>
              .
            </label>
          </div>
        </fieldset>
      )}

      {status === 'error' && <p role="alert" className="mt-4 text-sm text-red-400">{errorMessage}</p>}

      <div className="mt-6 flex items-center justify-between">
        {step > 1 ? (
          <button type="button" onClick={goBack} className="text-sm text-ink-muted hover:text-ink">
            Indietro
          </button>
        ) : (
          <span />
        )}

        {step < 3 ? (
          <button
            type="button"
            onClick={goNext}
            disabled={!isStepValid}
            className="rounded-full bg-accent px-6 py-2 text-sm font-semibold text-ink disabled:opacity-40"
          >
            Continua
          </button>
        ) : (
          <button
            type="submit"
            disabled={!isStepValid || status === 'submitting'}
            className="rounded-full bg-accent px-6 py-2 text-sm font-semibold text-ink disabled:opacity-40"
          >
            {status === 'submitting' ? 'Invio in corso…' : 'Richiedi un preventivo'}
          </button>
        )}
      </div>

      <p className="mt-4 text-xs text-ink-muted">
        Dopo la richiesta riceverai una prima risposta entro [TEMPO REALE]. Se il progetto è compatibile,
        organizziamo una breve call conoscitiva, poi ti inviamo un preventivo su misura.
      </p>
    </form>
  )
}
