import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import ServicesPage from './ServicesPage'
import { services } from '@/data/services'
import { packages } from '@/data/packages'

describe('ServicesPage', () => {
  it('renders every macro-service and every package, never an invented price', () => {
    render(
      <HelmetProvider>
        <MemoryRouter>
          <ServicesPage />
        </MemoryRouter>
      </HelmetProvider>,
    )

    services.forEach((service) => {
      expect(screen.getByRole('heading', { name: service.title })).toBeInTheDocument()
    })
    packages.forEach((plan) => {
      expect(screen.getByRole('heading', { name: plan.name })).toBeInTheDocument()
    })
    expect(screen.queryByText(/€\d/)).not.toBeInTheDocument()
  })
})
