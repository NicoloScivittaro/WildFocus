import { describe, expect, it } from 'vitest'
import { submitContactRequest } from './contactService'
import type { ContactPayload } from '@/types/contact'

function buildPayload(overrides: Partial<ContactPayload> = {}): ContactPayload {
  const now = Date.now()
  return {
    fullName: 'Mario Rossi',
    email: 'mario@example.com',
    service: 'video-editing',
    projectDescription: 'Ho bisogno di un video promozionale.',
    timeline: 'Entro un mese',
    privacyAccepted: true,
    honeypot: '',
    formRenderedAt: now - 5000,
    submittedAt: now,
    ...overrides,
  }
}

describe('submitContactRequest', () => {
  it('rejects submissions where the honeypot field is filled', async () => {
    const result = await submitContactRequest(buildPayload({ honeypot: 'im-a-bot' }))
    expect(result.ok).toBe(false)
  })

  it('rejects submissions faster than the minimum time threshold', async () => {
    const now = Date.now()
    const result = await submitContactRequest(buildPayload({ formRenderedAt: now, submittedAt: now + 500 }))
    expect(result.ok).toBe(false)
  })

  it('rejects submissions without privacy consent', async () => {
    const result = await submitContactRequest(buildPayload({ privacyAccepted: false }))
    expect(result.ok).toBe(false)
  })

  it('accepts a well-formed submission', async () => {
    const result = await submitContactRequest(buildPayload())
    expect(result.ok).toBe(true)
  })
})
