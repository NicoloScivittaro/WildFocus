import type { QuoteDiscountTier, QuoteEstimate, QuoteZone } from '@/types/content'

/**
 * Listini generici e puramente indicativi, espressi come "a partire da".
 * Servono solo a dare un ordine di grandezza nel preventivatore: il prezzo
 * reale viene sempre definito su misura dopo la call conoscitiva.
 */
export const quoteServiceRates: Record<string, number> = {
  'video-editing': 800,
  'fotografia-shooting': 500,
  'contenuti-social': 600,
  'produzione-brand-aziende': 1500,
  'sound-design': 700,
  'produzione-musicale': 900,
}

/** Coefficienti di zona: coprono trasferte, logistica e giorni fuori sede. */
export const quoteZones: QuoteZone[] = [
  { id: 'nord', label: 'Nord Italia', multiplier: 1 },
  { id: 'centro', label: 'Centro Italia', multiplier: 1.1 },
  { id: 'sud-isole', label: 'Sud e Isole', multiplier: 1.25 },
]

/** Più servizi si combinano, più alta è la fascia di sconto. */
export const quoteDiscountTiers: QuoteDiscountTier[] = [
  { minServices: 2, rate: 0.08 },
  { minServices: 3, rate: 0.12 },
  { minServices: 4, rate: 0.16 },
  { minServices: 5, rate: 0.18 },
  { minServices: 6, rate: 0.2 },
]

export function discountRateFor(serviceCount: number): number {
  return quoteDiscountTiers.reduce((rate, tier) => (serviceCount >= tier.minServices ? tier.rate : rate), 0)
}

export function nextTierFor(serviceCount: number): QuoteDiscountTier | null {
  return quoteDiscountTiers.find((tier) => tier.minServices > serviceCount) ?? null
}

export function findQuoteZone(zoneId: string): QuoteZone {
  return quoteZones.find((zone) => zone.id === zoneId) ?? quoteZones[0]
}

/**
 * Stima indicativa a partire dai servizi scelti e dalla zona in Italia.
 * Non tiene conto di durata, complessità o numero di revisioni: quelli
 * entrano solo nel preventivo su misura.
 */
export function estimateQuote(serviceSlugs: string[], zoneId: string): QuoteEstimate {
  const zone = findQuoteZone(zoneId)
  const subtotal = serviceSlugs.reduce((sum, slug) => sum + (quoteServiceRates[slug] ?? 0), 0)
  const zoneAdjusted = subtotal * zone.multiplier
  const discountRate = discountRateFor(serviceSlugs.length)
  const discountAmount = zoneAdjusted * discountRate

  return {
    serviceCount: serviceSlugs.length,
    subtotal,
    zoneMultiplier: zone.multiplier,
    zoneAdjustment: zoneAdjusted - subtotal,
    discountRate,
    discountAmount,
    total: zoneAdjusted - discountAmount,
    nextTier: nextTierFor(serviceSlugs.length),
  }
}
