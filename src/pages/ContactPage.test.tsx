import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import ContactPage from './ContactPage'

function renderPage(entry = '/contatti') {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[entry]}>
        <ContactPage />
      </MemoryRouter>
    </HelmetProvider>,
  )
}

describe('ContactPage', () => {
  it('preselects the service coming from the query string', () => {
    renderPage('/contatti?servizio=video-editing')

    const select = screen.getByLabelText('Servizio richiesto') as HTMLSelectElement
    expect(select.value).toBe('video-editing')
  })

  it('recaps every service and the zone sent by the quote estimator', () => {
    renderPage('/contatti?servizio=video-editing&servizi=video-editing,sound-design&zona=sud-isole')

    expect(screen.getByText(/Video Editing, Sound Design/)).toBeInTheDocument()
    expect(screen.getByText(/Sud e Isole/)).toBeInTheDocument()
  })

  it('shows no recap when the page is opened without a selection', () => {
    renderPage()

    expect(screen.queryByText(/Servizi selezionati/)).not.toBeInTheDocument()
  })

  it('renders a WhatsApp link on the contact page', () => {
    renderPage()

    expect(screen.getByRole('link', { name: 'Scrivici su WhatsApp' })).toBeInTheDocument()
  })
})
