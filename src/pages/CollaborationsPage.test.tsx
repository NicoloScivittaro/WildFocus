import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import CollaborationsPage from './CollaborationsPage'

describe('CollaborationsPage', () => {
  it('links its primary CTA to Contatti with the collaboration service preselected', () => {
    render(
      <HelmetProvider>
        <MemoryRouter>
          <CollaborationsPage />
        </MemoryRouter>
      </HelmetProvider>,
    )

    expect(screen.getByRole('link', { name: 'Parliamo del tuo progetto' })).toHaveAttribute(
      'href',
      '/contatti?servizio=collaborazione-continuativa',
    )
  })
})
