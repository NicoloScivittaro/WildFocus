import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CookieConsent } from './CookieConsent'

describe('CookieConsent', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('is visible when no consent has been stored yet', () => {
    render(<CookieConsent />)
    expect(screen.getByRole('dialog', { name: 'Preferenze cookie' })).toBeInTheDocument()
  })

  it('hides and persists the choice after accepting', async () => {
    const user = userEvent.setup()
    render(<CookieConsent />)

    await user.click(screen.getByRole('button', { name: 'Accetta' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(window.localStorage.getItem('wildfocus-cookie-consent')).toBe('accepted')
  })

  it('does not render when consent was already stored on a previous visit', () => {
    window.localStorage.setItem('wildfocus-cookie-consent', 'rejected')
    render(<CookieConsent />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
