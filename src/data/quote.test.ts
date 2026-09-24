import { describe, expect, it } from 'vitest'
import { discountRateFor, estimateQuote, quoteServiceRates, quoteZones } from './quote'

const allSlugs = Object.keys(quoteServiceRates)

describe('discountRateFor', () => {
  it('gives no combination discount for a single service', () => {
    expect(discountRateFor(0)).toBe(0)
    expect(discountRateFor(1)).toBe(0)
  })

  it('grows as more services are combined', () => {
    expect(discountRateFor(2)).toBeGreaterThan(discountRateFor(1))
    expect(discountRateFor(3)).toBeGreaterThan(discountRateFor(2))
    expect(discountRateFor(4)).toBeGreaterThan(discountRateFor(3))
    expect(discountRateFor(6)).toBeGreaterThan(discountRateFor(5))
  })

  it('never exceeds the highest tier', () => {
    expect(discountRateFor(6)).toBe(discountRateFor(20))
    expect(discountRateFor(20)).toBeLessThan(1)
  })
})

describe('estimateQuote', () => {
  it('returns an empty estimate when no service is selected', () => {
    const estimate = estimateQuote([], 'nord')

    expect(estimate.serviceCount).toBe(0)
    expect(estimate.subtotal).toBe(0)
    expect(estimate.discountRate).toBe(0)
    expect(estimate.total).toBe(0)
  })

  it('sums the generic rates of the selected services', () => {
    const estimate = estimateQuote(['video-editing', 'sound-design'], 'nord')

    expect(estimate.serviceCount).toBe(2)
    expect(estimate.subtotal).toBe(quoteServiceRates['video-editing'] + quoteServiceRates['sound-design'])
  })

  it('ignores unknown service slugs', () => {
    const estimate = estimateQuote(['video-editing', 'servizio-inventato'], 'nord')

    expect(estimate.subtotal).toBe(quoteServiceRates['video-editing'])
  })

  it('applies the zone coefficient on top of the subtotal', () => {
    const nord = estimateQuote(['video-editing'], 'nord')
    const sud = estimateQuote(['video-editing'], 'sud-isole')

    expect(nord.zoneMultiplier).toBe(1)
    expect(nord.zoneAdjustment).toBe(0)
    expect(sud.subtotal).toBe(nord.subtotal)
    expect(sud.zoneAdjustment).toBeGreaterThan(0)
    expect(sud.total).toBeGreaterThan(nord.total)
  })

  it('falls back to the first zone when the id is unknown', () => {
    const fallback = estimateQuote(['video-editing'], quoteZones[0].id)
    const unknown = estimateQuote(['video-editing'], 'atlantide')

    expect(unknown.total).toBe(fallback.total)
  })

  it('applies a larger discount when more services are combined', () => {
    const one = estimateQuote(['video-editing'], 'nord')
    const three = estimateQuote(['video-editing', 'sound-design', 'produzione-musicale'], 'nord')

    expect(one.discountAmount).toBe(0)
    expect(three.discountRate).toBeGreaterThan(one.discountRate)
    expect(three.discountAmount).toBeGreaterThan(0)
  })

  it('keeps a multi-service bundle below the sum of the single services', () => {
    const bundle = estimateQuote(['video-editing', 'sound-design', 'produzione-musicale'], 'nord')
    const singlesTotal = bundle.subtotal

    expect(bundle.total).toBeLessThan(singlesTotal)
  })

  it('reports the next discount tier, and none once every service is selected', () => {
    expect(estimateQuote(['video-editing'], 'nord').nextTier?.minServices).toBe(2)
    expect(estimateQuote(allSlugs, 'nord').nextTier).toBeNull()
  })
})
