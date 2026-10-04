import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { QuoteEstimator } from './QuoteEstimator'
import { quotePackages } from '@/data/quote'

function renderEstimator() {
  return render(
    <MemoryRouter>
      <QuoteEstimator />
    </MemoryRouter>,
  )
}

describe('QuoteEstimator', () => {
  it('shows every package as a selectable option, grouped by category', () => {
    renderEstimator()

    expect(screen.getAllByRole('checkbox')).toHaveLength(quotePackages.length)
    expect(screen.getByRole('group', { name: 'Reel' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Fotografia' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Matrimonio' })).toBeInTheDocument()
  })

  it('shows the reel per-unit prices', () => {
    renderEstimator()

    expect(screen.getByText('62,50 €/reel')).toBeInTheDocument()
    expect(screen.getByText('57,50 €/reel')).toBeInTheDocument()
    expect(screen.getByText('50 €/reel')).toBeInTheDocument()
  })

  it('starts with no payable total and a disabled call to action', () => {
    renderEstimator()

    expect(screen.getByText(/seleziona almeno un pacchetto/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /richiedi il preventivo/i })).toBeDisabled()
  })

  it('totals the selected packages plus one fixed transfer', async () => {
    const user = userEvent.setup()
    renderEstimator()

    await user.click(screen.getByRole('checkbox', { name: /1 Reel/ }))
    await user.click(screen.getByRole('checkbox', { name: /MINI SHOOTING/ }))
    await user.click(screen.getByRole('radio', { name: /Fino a 50 km/ }))

    expect(screen.getByText(/210\s*€/)).toBeInTheDocument()
    expect(screen.getByText(/50 km di distanza — 100 km totali andata e ritorno/i)).toBeInTheDocument()
  })

  it('applies the transfer once even when several packages are selected', async () => {
    const user = userEvent.setup()
    renderEstimator()

    await user.click(screen.getByRole('checkbox', { name: /1 Reel/ }))
    await user.click(screen.getByRole('checkbox', { name: /MINI SHOOTING/ }))
    await user.click(screen.getByRole('checkbox', { name: /CERIMONIA/ }))
    await user.click(screen.getByRole('radio', { name: /Roma centro/ }))

    // 70 + 90 + 450 + 40, with the transfer charged a single time.
    expect(screen.getByText(/650\s*€/)).toBeInTheDocument()
  })

  it('never shows combination discounts or percentage zone uplifts', async () => {
    const user = userEvent.setup()
    renderEstimator()

    await user.click(screen.getByRole('checkbox', { name: /1 Reel/ }))
    await user.click(screen.getByRole('checkbox', { name: /MINI SHOOTING/ }))

    expect(screen.queryByText(/sconto combinazione/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/adeguamento zona/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/trasferta e logistica/i)).not.toBeInTheDocument()
  })

  it('sends package ids, transfer and total to the contact page', async () => {
    const user = userEvent.setup()
    renderEstimator()

    await user.click(screen.getByRole('checkbox', { name: /4 Reel/ }))
    await user.click(screen.getByRole('checkbox', { name: /MINI SHOOTING/ }))
    await user.click(screen.getByRole('radio', { name: /Fino a 20 km/ }))

    const href = screen.getByRole('link', { name: /richiedi il preventivo/i }).getAttribute('href') ?? ''

    expect(href).toContain('pacchetti=reel-4%2Cmini-shooting')
    expect(href).toContain('trasferimento=entro-20-km')
    expect(href).toContain('totale=360')
    expect(href).toContain('servizio=video-editing')
  })

  it('labels the prices as indicative and non-binding', () => {
    renderEstimator()

    expect(screen.getByText(/prezzi indicativi e non vincolanti/i)).toBeInTheDocument()
  })
})
