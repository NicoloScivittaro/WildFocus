import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CTASection } from './CTASection'

describe('CTASection', () => {
  it('renders the primary CTA pointing to /contatti by default', () => {
    render(<CTASection title="Parliamo del tuo progetto" />, { wrapper: MemoryRouter })
    expect(screen.getByRole('link', { name: 'Parliamo del tuo progetto' })).toHaveAttribute('href', '/contatti')
  })

  it('renders a secondary CTA only when explicitly provided', () => {
    render(<CTASection title="Test" />, { wrapper: MemoryRouter })
    expect(screen.queryByRole('link', { name: 'Richiedi un preventivo' })).not.toBeInTheDocument()

    render(
      <CTASection title="Test" secondaryLabel="Richiedi un preventivo" secondaryTo="/contatti" />,
      { wrapper: MemoryRouter },
    )
    expect(screen.getByRole('link', { name: 'Richiedi un preventivo' })).toBeInTheDocument()
  })
})
