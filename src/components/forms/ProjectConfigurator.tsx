import { useState, type FormEvent } from 'react'
import { useFormMountTime } from '@/hooks/useFormMountTime'
import { submitContactRequest } from '@/services/contactService'
import {
  briefToContactFields,
  optionLabel,
  projectBudgetChoices,
  projectGoals,
  projectKinds,
} from '@/data/projectConfigurator'
import type { BudgetRange, ContactPayload, ProjectBrief } from '@/types/contact'

const TOTAL_STEPS = 4

const emptyBrief: ProjectBrief = {
  kind: '',
  goal: '',
  budget: undefined,
  deadline: '',
  references: '',
}

type Status = 'idle' | 'submitting' | 'success' | 'error'

/**
 * Configuratore progetto: quattro domande in fila, poche e parlate, che
 * finiscono con "Tell us where to reach you". Sostituisce l'ingresso diretto
 * nel classico form.
 */
export function ProjectConfigurator() {
  const [step, setStep] = useState(1)
  const [brief, setBrief] = useState<ProjectBrief>(emptyBrief)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const formRenderedAt = useFormMountTime()

  function updateBrief<K extends keyof ProjectBrief>(key: K, value: ProjectBrief[K]) {
    setBrief((prev) => ({ ...prev, [key]: value }))
  }

  const contactIsValid = fullName.trim().length > 0 && /\S+@\S+\.\S+/.test(email) && privacyAccepted
  const canContinue =
    step === 1
      ? brief.kind !== ''
      : step === 2
        ? brief.goal !== ''
        : step === 3
          ? true
          : contactIsValid

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!contactIsValid) return

    setStatus('submitting')
    setErrorMessage(null)

    const payload: ContactPayload = {
      ...briefToContactFields(brief),
      fullName,
      email,
      privacyAccepted,
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
      <div role="status" className="rounded-xl2 border border-accent/40 bg-surface p-8 text-center md:p-12">
        <h2 className="font-display text-3xl text-ink">Sounds like a WildFocus project.</h2>
        <p className="mt-3 text-ink-muted">
          Brief ricevuto. Ti rispondiamo entro [TEMPO REALE]: se il progetto è compatibile organizziamo una breve call,
          poi arriva il preventivo su misura.
        </p>
        <p className="mt-4 text-sm text-ink-muted">
          {optionLabel(projectKinds, brief.kind)} · {optionLabel(projectGoals, brief.goal)}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-xl2 border border-ink/10 bg-surface p-6 md:p-10">
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website-configurator">Non compilare questo campo</label>
        <input
          id="website-configurator"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-xs uppercase tracking-wide text-ink-muted">
          Step {step} of {TOTAL_STEPS}
        </p>
        <ol className="flex gap-1.5" aria-hidden="true">
          {Array.from({ length: TOTAL_STEPS }, (_, index) => (
            <li
              key={index}
              className={`h-1.5 w-6 rounded-full ${index < step ? 'bg-accent-deep' : 'bg-ink/15'}`}
            />
          ))}
        </ol>
      </div>

      {step === 1 && (
        <fieldset className="mt-6">
          <legend className="font-display text-2xl text-ink md:text-3xl">What are we making?</legend>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {projectKinds.map((option) => (
              <label key={option.id} className="relative cursor-pointer">
                <input
                  type="radio"
                  name="kind"
                  value={option.id}
                  checked={brief.kind === option.id}
                  onChange={() => updateBrief('kind', option.id)}
                  className="peer sr-only"
                />
                <span className="block h-full rounded-xl2 border border-ink/10 bg-base p-4 transition-colors peer-checked:border-accent-deep peer-checked:bg-accent/20 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent-deep hover:border-accent-deep/40">
                  <span className="block font-display text-lg text-ink">{option.label}</span>
                  <span className="mt-1 block text-xs text-ink-muted">{option.hint}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {step === 2 && (
        <fieldset className="mt-6">
          <legend className="font-display text-2xl text-ink md:text-3xl">What&apos;s the goal?</legend>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {projectGoals.map((option) => (
              <label key={option.id} className="relative cursor-pointer">
                <input
                  type="radio"
                  name="goal"
                  value={option.id}
                  checked={brief.goal === option.id}
                  onChange={() => updateBrief('goal', option.id)}
                  className="peer sr-only"
                />
                <span className="block h-full rounded-xl2 border border-ink/10 bg-base p-4 transition-colors peer-checked:border-accent-deep peer-checked:bg-accent/20 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent-deep hover:border-accent-deep/40">
                  <span className="block font-display text-lg text-ink">{option.label}</span>
                  <span className="mt-1 block text-xs text-ink-muted">{option.hint}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {step === 3 && (
        <fieldset className="mt-6 space-y-5">
          <legend className="font-display text-2xl text-ink md:text-3xl">Give us the shape of it.</legend>

          <div>
            <label htmlFor="brief-budget" className="block text-sm text-ink">
              Indicative budget
            </label>
            <select
              id="brief-budget"
              value={brief.budget ?? ''}
              onChange={(event) =>
                updateBrief('budget', (event.target.value || undefined) as BudgetRange | undefined)
              }
              className="mt-1 w-full rounded-lg border border-ink/10 bg-base px-3 py-2 text-ink"
            >
              <option value="">Select a range</option>
              {projectBudgetChoices.map((choice) => (
                <option key={choice.value} value={choice.value}>
                  {choice.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="brief-deadline" className="block text-sm text-ink">
              Deadline
            </label>
            <input
              id="brief-deadline"
              value={brief.deadline}
              onChange={(event) => updateBrief('deadline', event.target.value)}
              placeholder="e.g. mid-September, or whenever it's ready"
              className="mt-1 w-full rounded-lg border border-ink/10 bg-base px-3 py-2 text-ink"
            />
          </div>

          <div>
            <label htmlFor="brief-references" className="block text-sm text-ink">
              References
            </label>
            <input
              id="brief-references"
              value={brief.references}
              onChange={(event) => updateBrief('references', event.target.value)}
              placeholder="Link a moodboard, video, brani o cartelle"
              className="mt-1 w-full rounded-lg border border-ink/10 bg-base px-3 py-2 text-ink"
            />
          </div>
        </fieldset>
      )}

      {step === 4 && (
        <fieldset className="mt-6 space-y-5">
          <legend className="font-display text-2xl text-ink md:text-3xl">
            Sounds like a WildFocus project.
          </legend>
          <p className="-mt-2 text-ink-muted">Tell us where to reach you.</p>

          <div>
            <label htmlFor="brief-name" className="block text-sm text-ink">
              Name
            </label>
            <input
              id="brief-name"
              required
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="mt-1 w-full rounded-lg border border-ink/10 bg-base px-3 py-2 text-ink"
            />
          </div>

          <div>
            <label htmlFor="brief-email" className="block text-sm text-ink">
              Email
            </label>
            <input
              id="brief-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-lg border border-ink/10 bg-base px-3 py-2 text-ink"
            />
          </div>

          <div className="flex items-start gap-2">
            <input
              id="brief-privacy"
              type="checkbox"
              required
              checked={privacyAccepted}
              onChange={(event) => setPrivacyAccepted(event.target.checked)}
              className="mt-1"
            />
            <label htmlFor="brief-privacy" className="text-sm text-ink-muted">
              Ho letto e accetto la{' '}
              <a href="/privacy-policy" className="text-accent-deep underline">
                Privacy Policy
              </a>
              .
            </label>
          </div>
        </fieldset>
      )}

      {step > 2 && (
        <p className="mt-6 rounded-lg bg-base px-4 py-3 text-sm text-ink-muted">
          {optionLabel(projectKinds, brief.kind)} · {optionLabel(projectGoals, brief.goal)}
        </p>
      )}

      {status === 'error' && (
        <p role="alert" className="mt-4 text-sm text-red-400">
          {errorMessage}
        </p>
      )}

      <div className="mt-6 flex items-center justify-between gap-4">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep((prev) => prev - 1)}
            className="text-sm text-ink-muted hover:text-ink"
          >
            Back
          </button>
        ) : (
          <span />
        )}

        {step < TOTAL_STEPS ? (
          <button
            type="button"
            disabled={!canContinue}
            onClick={() => setStep((prev) => prev + 1)}
            className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-ink disabled:opacity-40"
          >
            Continue
          </button>
        ) : (
          <button
            type="submit"
            disabled={!canContinue || status === 'submitting'}
            className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-ink disabled:opacity-40"
          >
            {status === 'submitting' ? 'Sending…' : 'Send it →'}
          </button>
        )}
      </div>
    </form>
  )
}
