import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { QuoteEstimator } from './QuoteEstimator'
import { services } from '@/data/services'

function renderEstimator() {
  return render(
    <MemoryRouter>
      <QuoteEstimator />
    </MemoryRouter>,
  )
}

describe('QuoteEstimator', () => {
  it('lists every service with a generic starting price', () => {
    renderEstimator()

    services.forEach((service) => {
      expect(screen.getByRole('checkbox', { name: new RegExp(service.title, 'i') })).toBeInTheDocument()
    })
  })

  it('starts from a single service, with no combination discount', () => {
    renderEstimator()

    expect(screen.getByText(/Servizi selezionati \(1\)/)).toBeInTheDocument()
    expect(screen.queryByText(/Sconto combinazione/)).not.toBeInTheDocument()
  })

  it('adds a larger discount as soon as a second service is selected', async () => {
    const user = userEvent.setup()
    renderEstimator()

    await user.click(screen.getByRole('checkbox', { name: /sound design/i }))

    expect(screen.getByText(/Servizi selezionati \(2\)/)).toBeInTheDocument()
    expect(screen.getByText(/Sconto combinazione/)).toBeInTheDocument()
  })

  it('grows the discount again when a third service is added', async () => {
    const user = userEvent.setup()
    renderEstimator()

    const discountText = () => screen.getByText(/Sconto combinazione/).parentElement?.textContent ?? ''

    await user.click(screen.getByRole('checkbox', { name: /sound design/i }))
    expect(discountText()).toContain('8%')

    await user.click(screen.getByRole('checkbox', { name: /produzione musicale/i }))

    expect(screen.getByText(/Servizi selezionati \(3\)/)).toBeInTheDocument()
    expect(discountText()).toContain('12%')
    expect(discountText()).not.toContain('8%')
  })

  it('lets the user choose where in Italy the project happens', async () => {
    const user = userEvent.setup()
    renderEstimator()

    expect(screen.getByText(/Nessun adeguamento per trasferta/i)).toBeInTheDocument()

    await user.selectOptions(screen.getByLabelText(/Dove si svolge il progetto/i), 'sud-isole')

    expect(screen.getByText(/Trasferta e logistica/i)).toBeInTheDocument()
  })

  it('sends the chosen services and zone to the contact page', async () => {
    const user = userEvent.setup()
    renderEstimator()

    await user.click(screen.getByRole('checkbox', { name: /sound design/i }))
    await user.selectOptions(screen.getByLabelText(/Dove si svolge il progetto/i), 'centro')

    const href = screen.getByRole('link', { name: /richiedi il preventivo su misura/i }).getAttribute('href') ?? ''

    expect(href).toContain('servizio=video-editing')
    expect(href).toContain('servizi=video-editing%2Csound-design')
    expect(href).toContain('zona=centro')
  })

  it('labels the figures as a generic, non-binding estimate', () => {
    renderEstimator()

    expect(screen.getByText(/Stima generica e non vincolante/i)).toBeInTheDocument()
  })
})
