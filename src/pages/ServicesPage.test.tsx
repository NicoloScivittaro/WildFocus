import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import ServicesPage from './ServicesPage'
import { services } from '@/data/services'
import { packages } from '@/data/packages'

function renderPage() {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <ServicesPage />
      </MemoryRouter>
    </HelmetProvider>,
  )
}

describe('ServicesPage', () => {
  it('renders every macro-service and every package', () => {
    renderPage()

    services.forEach((service) => {
      expect(screen.getByRole('heading', { name: service.title })).toBeInTheDocument()
    })
    packages.forEach((plan) => {
      expect(screen.getByRole('heading', { name: plan.name })).toBeInTheDocument()
    })
  })

  it('shows the quote estimator instead of the old generic CTA block', () => {
    renderPage()

    expect(screen.getByRole('heading', { name: /calcola un preventivo indicativo/i })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /scopri i nostri lavori/i })).not.toBeInTheDocument()
  })

  it('never states a committed price: packages stay custom, the estimator stays indicative', () => {
    renderPage()

    expect(screen.getAllByText('Preventivo personalizzato')).toHaveLength(packages.length)
    expect(screen.getByText(/Stima generica e non vincolante/i)).toBeInTheDocument()
  })
})
