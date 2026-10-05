import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { QuoteEstimator } from './QuoteEstimator'

function renderEstimator() {
  render(
    <MemoryRouter>
      <QuoteEstimator />
    </MemoryRouter>,
  )
  return userEvent.setup()
}

describe('QuoteEstimator', () => {
  it('starts with only the three macrocategories and no payable total', () => {
    renderEstimator()

    expect(screen.getAllByRole('radio')).toHaveLength(3)
    expect(screen.getByText(/seleziona almeno un pacchetto/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /richiedi il preventivo/i })).toBeDisabled()
    expect(screen.queryByRole('group', { name: /trasferta/i })).not.toBeInTheDocument()
  })

  it('shows the subcategories of the chosen macrocategory', async () => {
    const user = renderEstimator()

    await user.click(screen.getByRole('radio', { name: 'Fotografia' }))

    expect(screen.getByRole('group', { name: 'Shooting' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Evento' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Social' })).toBeInTheDocument()
    expect(screen.queryByRole('radio', { name: /4 Reel/ })).not.toBeInTheDocument()
  })

  it('shows the reel per-unit prices', async () => {
    const user = renderEstimator()
    await user.click(screen.getByRole('radio', { name: 'Video' }))

    expect(screen.getByText('62,50 €/reel')).toBeInTheDocument()
    expect(screen.getByText('57,50 €/reel')).toBeInTheDocument()
    expect(screen.getByText('50 €/reel')).toBeInTheDocument()
  })

  it('allows only one package per subcategory', async () => {
    const user = renderEstimator()
    await user.click(screen.getByRole('radio', { name: 'Video' }))

    await user.click(screen.getByRole('radio', { name: /4 Reel/ }))
    await user.click(screen.getByRole('radio', { name: /8 Reel/ }))

    expect(screen.getByRole('radio', { name: /4 Reel/ })).not.toBeChecked()
    expect(screen.getByRole('radio', { name: /8 Reel/ })).toBeChecked()
    expect(screen.getByText(/460\s*€/, { selector: 'p' })).toBeInTheDocument()
  })

  it('combines packages across macrocategories and applies the transfer once', async () => {
    const user = renderEstimator()

    await user.click(screen.getByRole('radio', { name: 'Video' }))
    await user.click(screen.getByRole('radio', { name: /4 Reel/ }))
    await user.click(screen.getByRole('radio', { name: 'Fotografia' }))
    await user.click(screen.getByRole('radio', { name: /MINI SHOOTING/ }))
    await user.click(screen.getByRole('radio', { name: /Fino a 30 km/ }))

    // 250 + 90 + 30, with the transfer charged a single time.
    expect(screen.getByText(/370\s*€/, { selector: 'p' })).toBeInTheDocument()
  })

  it('marks the over-50-km transfer as to be agreed', async () => {
    const user = renderEstimator()
    await user.click(screen.getByRole('radio', { name: 'Video' }))
    await user.click(screen.getByRole('radio', { name: /1 Reel/ }))

    expect(screen.getByRole('radio', { name: /\+ 50 km/ })).toBeInTheDocument()
    expect(screen.getByText('Da stipulare')).toBeInTheDocument()
  })

  it('never shows combination discounts or percentage zone uplifts', async () => {
    const user = renderEstimator()
    await user.click(screen.getByRole('radio', { name: 'Video' }))
    await user.click(screen.getByRole('radio', { name: /4 Reel/ }))

    expect(screen.queryByText(/sconto combinazione/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/adeguamento zona/i)).not.toBeInTheDocument()
  })

  it('sends package ids, transfer and total to the contact page', async () => {
    const user = renderEstimator()
    await user.click(screen.getByRole('radio', { name: 'Video' }))
    await user.click(screen.getByRole('radio', { name: /4 Reel/ }))
    await user.click(screen.getByRole('radio', { name: /Fino a 20 km/ }))

    const href = screen.getByRole('link', { name: /richiedi il preventivo/i }).getAttribute('href') ?? ''

    expect(href).toContain('pacchetti=reel-4')
    expect(href).toContain('trasferimento=entro-20-km')
    expect(href).toContain('totale=270')
    expect(href).toContain('servizio=video-editing')
  })

  it('labels the prices as indicative and non-binding', () => {
    renderEstimator()

    expect(screen.getByText(/prezzi indicativi e non vincolanti/i)).toBeInTheDocument()
  })
})
