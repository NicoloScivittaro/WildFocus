import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import ContactPage from './ContactPage'

describe('ContactPage', () => {
  it('shows the preselected service from the query string', () => {
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={['/contatti?servizio=video-editing']}>
          <ContactPage />
        </MemoryRouter>
      </HelmetProvider>,
    )

    expect(screen.getByText('video-editing')).toBeInTheDocument()
  })

  it("renders a WhatsApp link on the contact page", () => {
    render(
      <HelmetProvider>
        <MemoryRouter>
          <ContactPage />
        </MemoryRouter>
      </HelmetProvider>,
    )

    expect(screen.getByRole('link', { name: 'Scrivici su WhatsApp' })).toBeInTheDocument()
  })
})
