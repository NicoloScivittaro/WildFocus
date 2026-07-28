import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { PackageCard } from './PackageCard'
import type { PackagePlan } from '@/types/content'

const plan: PackagePlan = {
  slug: 'progetto-singolo',
  name: 'Progetto Singolo',
  description: 'Descrizione',
  highlights: ['Un servizio definito'],
  priceLabel: 'Preventivo personalizzato',
}

describe('PackageCard', () => {
  it('never shows an invented price, only "Preventivo personalizzato"', () => {
    render(<PackageCard plan={plan} />, { wrapper: MemoryRouter })
    expect(screen.getByText('Preventivo personalizzato')).toBeInTheDocument()
    expect(screen.queryByText(/€\d/)).not.toBeInTheDocument()
  })
})
