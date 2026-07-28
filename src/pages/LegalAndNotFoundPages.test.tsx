import type { ReactElement } from 'react'
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import PrivacyPolicyPage from './PrivacyPolicyPage'
import CookiePolicyPage from './CookiePolicyPage'
import NotFoundPage from './NotFoundPage'

function renderWithProviders(ui: ReactElement) {
  return render(
    <HelmetProvider>
      <MemoryRouter>{ui}</MemoryRouter>
    </HelmetProvider>,
  )
}

describe('Legal and 404 pages', () => {
  it('shows the draft disclaimer on the Privacy Policy page', () => {
    renderWithProviders(<PrivacyPolicyPage />)
    expect(screen.getByRole('note')).toHaveTextContent(/bozza/i)
  })

  it('shows the draft disclaimer on the Cookie Policy page', () => {
    renderWithProviders(<CookiePolicyPage />)
    expect(screen.getByRole('note')).toHaveTextContent(/bozza/i)
  })

  it('links back to the Home page from the 404 page', () => {
    renderWithProviders(<NotFoundPage />)
    expect(screen.getByRole('link', { name: 'Torna alla Home' })).toHaveAttribute('href', '/')
  })
})
