import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import ContactPage from './ContactPage'
import { siteConfig } from '@/data/siteConfig'

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

  it('recaps the packages, transfer and total sent by the quote estimator', () => {
    renderPage('/contatti?pacchetti=reel-4,mini-shooting&trasferimento=entro-50-km&totale=390&servizio=video-editing')

    expect(screen.getByText('4 Reel')).toBeInTheDocument()
    expect(screen.getByText('MINI SHOOTING')).toBeInTheDocument()
    expect(screen.getByText(/Fino a 50 km/)).toBeInTheDocument()
    expect(screen.getByText(/390\s*€/)).toBeInTheDocument()
  })

  it('keeps the package handoff out of the service field', () => {
    renderPage('/contatti?pacchetti=mini-shooting&trasferimento=nessuno&totale=90&servizio=fotografia-shooting')

    const select = screen.getByLabelText('Servizio richiesto') as HTMLSelectElement
    expect(select.value).toBe('fotografia-shooting')
    expect(Array.from(select.options).map((option) => option.value)).not.toContain('mini-shooting')
  })

  it('carries the selected packages, transfer and total into the form description', async () => {
    const user = userEvent.setup()
    renderPage('/contatti?pacchetti=reel-4&trasferimento=entro-20-km&totale=270&servizio=video-editing')

    await user.type(screen.getByLabelText('Nome e cognome'), 'Mario Rossi')
    await user.type(screen.getByLabelText('Email'), 'mario@example.com')
    await user.click(screen.getByRole('button', { name: 'Continua' }))

    const description = screen.getByLabelText('Descrizione del progetto') as HTMLTextAreaElement
    expect(description.value).toContain('4 Reel')
    expect(description.value).toContain('Fino a 20 km')
    expect(description.value).toContain('270')
  })

  it('shows no recap when the page is opened without a selection', () => {
    renderPage()

    expect(screen.queryByText(/Pacchetti selezionati/)).not.toBeInTheDocument()
  })

  it('links the real Instagram and TikTok profiles', () => {
    renderPage()

    expect(screen.getByRole('link', { name: 'Instagram' })).toHaveAttribute('href', siteConfig.socials[0].url)
    expect(screen.getByRole('link', { name: 'TikTok' })).toHaveAttribute('href', siteConfig.socials[1].url)
  })

  it('renders a WhatsApp link on the contact page', () => {
    renderPage()

    expect(screen.getByRole('link', { name: 'Scrivici su WhatsApp' })).toBeInTheDocument()
  })
})
