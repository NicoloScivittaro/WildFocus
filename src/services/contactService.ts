import type { ContactPayload, ContactResult } from '@/types/contact'
import { hasElapsedMinimumTime, isHoneypotFilled, sanitizeInput } from '@/lib/antiSpam'
import { siteConfig } from '@/data/siteConfig'

const MIN_SUBMIT_DELAY_MS = 3000
const ENDPOINT = `https://formsubmit.co/ajax/${siteConfig.email}`
const SEND_ERROR = 'Invio non riuscito. Riprova oppure scrivici a ' + siteConfig.email + '.'

export async function submitContactRequest(payload: ContactPayload): Promise<ContactResult> {
  if (isHoneypotFilled(payload.honeypot)) {
    return { ok: false, error: 'Richiesta non valida.' }
  }

  if (!hasElapsedMinimumTime(payload.formRenderedAt, payload.submittedAt, MIN_SUBMIT_DELAY_MS)) {
    return { ok: false, error: 'Richiesta non valida.' }
  }

  if (!payload.privacyAccepted) {
    return { ok: false, error: 'Devi accettare la privacy policy per continuare.' }
  }

  const sanitized: ContactPayload = {
    ...payload,
    fullName: sanitizeInput(payload.fullName),
    email: sanitizeInput(payload.email),
    projectDescription: sanitizeInput(payload.projectDescription),
  }

  const body = {
    _subject: `Nuova richiesta dal sito — ${sanitized.fullName}`,
    _replyto: sanitized.email,
    _template: 'table',
    _captcha: 'false',
    Nome: sanitized.fullName,
    Email: sanitized.email,
    Servizio: sanitized.service,
    'Azienda / progetto': sanitized.companyOrProject ?? '',
    Descrizione: sanitized.projectDescription,
    Tempistiche: sanitized.timeline,
    Budget: sanitized.budget ?? '',
    'Link materiali': sanitized.materialsLink ?? '',
    Telefono: sanitized.phone ?? '',
    'Contatto preferito': sanitized.contactPreference ?? '',
  }

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    })
    if (!response.ok) return { ok: false, error: SEND_ERROR }
    return { ok: true }
  } catch {
    return { ok: false, error: SEND_ERROR }
  }
}
