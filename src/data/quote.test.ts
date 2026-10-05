import { describe, expect, it } from 'vitest'
import {
  estimateQuote,
  findQuotePackage,
  findQuoteTransfer,
  quotePackages,
  quotePackagesByCategory,
  quoteServiceSlug,
  quoteTransfers,
} from './quote'

describe('quote catalog', () => {
  it('lists the 14 packages across all subcategories', () => {
    expect(quotePackages).toHaveLength(14)
    expect(quotePackagesByCategory('reel')).toHaveLength(4)
    expect(quotePackagesByCategory('shooting')).toHaveLength(3)
    expect(quotePackagesByCategory('evento')).toHaveLength(3)
    expect(quotePackagesByCategory('social')).toHaveLength(1)
    expect(quotePackagesByCategory('cerimonia')).toHaveLength(1)
    expect(quotePackagesByCategory('wedding')).toHaveLength(2)
  })

  it('keeps the exact reel prices and per-unit notes', () => {
    expect(findQuotePackage('reel-1')).toMatchObject({ price: 70 })
    expect(findQuotePackage('reel-4')).toMatchObject({ price: 250, priceNote: '62,50 €/reel' })
    expect(findQuotePackage('reel-8')).toMatchObject({ price: 460, priceNote: '57,50 €/reel' })
    expect(findQuotePackage('reel-12')).toMatchObject({ price: 600, priceNote: '50 €/reel' })
  })

  it('keeps the exact photo and wedding prices', () => {
    const prices = Object.fromEntries(quotePackages.map((item) => [item.id, item.price]))

    expect(prices['mini-shooting']).toBe(90)
    expect(prices['shooting-standard']).toBe(150)
    expect(prices['shooting-pro']).toBe(220)
    expect(prices['evento']).toBe(150)
    expect(prices['evento-plus']).toBe(250)
    expect(prices['evento-completo']).toBe(350)
    expect(prices['social-photo']).toBe(120)
    expect(prices['cerimonia']).toBe(450)
    expect(prices['wedding']).toBe(750)
    expect(prices['wedding-full-day']).toBe(1200)
  })

  it('keeps every supplied package feature', () => {
    expect(findQuotePackage('mini-shooting')?.features).toEqual([
      'Fino a 1 ora di shooting',
      'Selezione e post-produzione',
      'Consegna digitale',
    ])
    expect(findQuotePackage('evento')?.features).toEqual([
      'Fino a 2 ore di copertura',
      "Scatti durante l'evento",
      'Selezione e post-produzione',
      'Consegna digitale',
    ])
    expect(findQuotePackage('wedding-full-day')?.features).toEqual([
      'Fino a 10 ore di copertura',
      'Preparazione degli sposi',
      'Cerimonia',
      'Foto di coppia e famiglia',
      'Ricevimento e festa',
      'Selezione completa delle migliori immagini',
      'Post-produzione avanzata',
      'Consegna digitale',
    ])
  })

  it('lists the fixed transfer options with round-trip distances', () => {
    expect(quoteTransfers.map((item) => item.price)).toEqual([0, 20, 30, 50, 0])
    expect(findQuoteTransfer('entro-20-km').description).toBe('20 km di distanza — 40 km totali andata e ritorno.')
    expect(findQuoteTransfer('entro-30-km').description).toBe('30 km di distanza — 60 km totali andata e ritorno.')
    expect(findQuoteTransfer('entro-50-km').description).toBe('50 km di distanza — 100 km totali andata e ritorno.')
    expect(findQuoteTransfer('oltre-50-km').description).toBe('Oltre 50 km di distanza — prezzo da stipulare.')
  })
})

describe('estimateQuote', () => {
  it('returns nothing payable when no package is selected', () => {
    const estimate = estimateQuote([], 'entro-50-km')

    expect(estimate.packageCount).toBe(0)
    expect(estimate.packages).toEqual([])
    expect(estimate.transfer).toBeNull()
    expect(estimate.transferPrice).toBe(0)
    expect(estimate.total).toBe(0)
  })

  it('sums the selected packages plus one fixed transfer', () => {
    const estimate = estimateQuote(['reel-4', 'mini-shooting'], 'entro-30-km')

    expect(estimate.subtotal).toBe(340)
    expect(estimate.transferPrice).toBe(30)
    expect(estimate.total).toBe(370)
  })

  it('applies the transfer once, not per package', () => {
    const single = estimateQuote(['reel-1'], 'entro-50-km')
    const multiple = estimateQuote(['reel-1', 'mini-shooting', 'cerimonia'], 'entro-50-km')

    expect(single.transferPrice).toBe(50)
    expect(multiple.transferPrice).toBe(50)
    expect(multiple.total).toBe(70 + 90 + 450 + 50)
  })

  it('never adds an automatic discount or a percentage uplift', () => {
    const estimate = estimateQuote(['reel-1', 'mini-shooting'], 'nessuno')

    expect(estimate.subtotal).toBe(160)
    expect(estimate.total).toBe(160)
  })

  it('ignores unknown package ids', () => {
    const estimate = estimateQuote(['reel-1', 'pacchetto-inventato'], 'nessuno')

    expect(estimate.packageCount).toBe(1)
    expect(estimate.total).toBe(70)
  })

  it('falls back to the no-transfer option when the id is unknown', () => {
    expect(findQuoteTransfer('atlantide').price).toBe(0)
    expect(estimateQuote(['reel-1'], 'atlantide').transferPrice).toBe(0)
  })
})

describe('quoteServiceSlug', () => {
  it('maps packages to real service slugs', () => {
    expect(quoteServiceSlug(['reel-4'])).toBe('video-editing')
    expect(quoteServiceSlug(['mini-shooting'])).toBe('fotografia-shooting')
    expect(quoteServiceSlug(['wedding'])).toBe('fotografia-shooting')
  })

  it('returns a real slug even when the list mixes groups', () => {
    expect(quoteServiceSlug(['mini-shooting', 'reel-1'])).toBe('fotografia-shooting')
    expect(quoteServiceSlug(['reel-1', 'mini-shooting'])).toBe('video-editing')
  })

  it('returns an empty string when nothing valid is selected', () => {
    expect(quoteServiceSlug([])).toBe('')
    expect(quoteServiceSlug(['pacchetto-inventato'])).toBe('')
  })
})
