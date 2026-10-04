import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { QuoteEstimator } from './QuoteEstimator'

function renderEstimator(category: string | null = 'Reel') {
  const result = render(
    <MemoryRouter>
      <QuoteEstimator />
    </MemoryRouter>,
  )
  if (category) fireEvent.click(screen.getByRole('radio', { name: new RegExp(category) }))
  return result
}

describe('QuoteEstimator', () => {
  it('starts with only the three macrocategories', () => {
    renderEstimator(null)
    expect(screen.getAllByRole('radio')).toHaveLength(3)
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    expect(screen.queryByText('Riepilogo')).not.toBeInTheDocument()
    expect(screen.queryByRole('group', { name: /trasferta/i })).not.toBeInTheDocument()
  })

  it('reveals only the chosen category and clears the previous quote when switching', async () => {
    const user = userEvent.setup()
    renderEstimator()
    expect(screen.getAllByRole('checkbox')).toHaveLength(4)
    expect(screen.queryByRole('checkbox', { name: /MINI SHOOTING/ })).not.toBeInTheDocument()
    await user.click(screen.getByRole('checkbox', { name: /4 Reel/ }))
    await user.click(screen.getByRole('radio', { name: /Roma centro/ }))
    await user.click(screen.getByRole('radio', { name: /Fotografia/ }))
    expect(screen.getAllByRole('checkbox')).toHaveLength(7)
    expect(screen.queryByRole('checkbox', { name: /4 Reel/ })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /richiedi il preventivo/i })).toBeDisabled()
    expect(screen.queryByRole('radio', { name: /Roma centro/ })).not.toBeInTheDocument()
    await user.click(screen.getByRole('checkbox', { name: /MINI SHOOTING/ }))
    expect(screen.getByRole('radio', { name: /Nessun trasferimento/ })).toBeChecked()
    expect(screen.getByRole('link', { name: /richiedi il preventivo/i })).toHaveAttribute(
      'href', expect.stringContaining('totale=90'),
    )
    await user.click(screen.getByRole('radio', { name: /Matrimonio/ }))
    expect(screen.getAllByRole('checkbox')).toHaveLength(3)
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
    await user.click(screen.getByRole('checkbox', { name: /4 Reel/ }))
    await user.click(screen.getByRole('radio', { name: /Fino a 50 km/ }))

    expect(screen.getByText(/370\s*€/)).toBeInTheDocument()
    expect(screen.getByText(/50 km di distanza — 100 km totali andata e ritorno/i)).toBeInTheDocument()
  })

  it('applies the transfer once even when several packages are selected', async () => {
    const user = userEvent.setup()
    renderEstimator()

    await user.click(screen.getByRole('checkbox', { name: /1 Reel/ }))
    await user.click(screen.getByRole('checkbox', { name: /4 Reel/ }))
    await user.click(screen.getByRole('checkbox', { name: /8 Reel/ }))
    await user.click(screen.getByRole('radio', { name: /Roma centro/ }))

    // 70 + 250 + 460 + 40, with the transfer charged a single time.
    expect(screen.getByText(/820\s*€/)).toBeInTheDocument()
  })

  it('never shows combination discounts or percentage zone uplifts', async () => {
    const user = userEvent.setup()
    renderEstimator()

    await user.click(screen.getByRole('checkbox', { name: /1 Reel/ }))
    await user.click(screen.getByRole('checkbox', { name: /4 Reel/ }))

    expect(screen.queryByText(/sconto combinazione/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/adeguamento zona/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/trasferta e logistica/i)).not.toBeInTheDocument()
  })

  it('sends package ids, transfer and total to the contact page', async () => {
    const user = userEvent.setup()
    renderEstimator()

    await user.click(screen.getByRole('checkbox', { name: /4 Reel/ }))
    await user.click(screen.getByRole('checkbox', { name: /1 Reel/ }))
    await user.click(screen.getByRole('radio', { name: /Fino a 20 km/ }))

    const href = screen.getByRole('link', { name: /richiedi il preventivo/i }).getAttribute('href') ?? ''

    expect(href).toContain('pacchetti=reel-4%2Creel-1')
    expect(href).toContain('trasferimento=entro-20-km')
    expect(href).toContain('totale=340')
    expect(href).toContain('servizio=video-editing')
  })

  it('labels the prices as indicative and non-binding', () => {
    renderEstimator()

    expect(screen.getByText(/prezzi indicativi e non vincolanti/i)).toBeInTheDocument()
  })
})
