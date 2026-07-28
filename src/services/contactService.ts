import type { ContactPayload, ContactResult } from '@/types/contact'
import { hasElapsedMinimumTime, isHoneypotFilled, sanitizeInput } from '@/lib/antiSpam'

const MIN_SUBMIT_DELAY_MS = 3000

/**
 * Mock contact adapter. Replace the body below with a real POST to
 * Formspree / EmailJS / Netlify Forms / a custom backend, forwarding
 * `sanitized`. Keep the honeypot + timing checks even after wiring a real
 * endpoint, and add matching server-side validation there too.
 */
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

  await new Promise((resolve) => setTimeout(resolve, 400))
  console.info('[contactService] mock submission', sanitized)

  return { ok: true }
}
