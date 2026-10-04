import type {
  QuoteCategory,
  QuoteCategoryId,
  QuoteEstimate,
  QuotePackage,
  QuoteTransferOption,
} from '@/types/content'

/**
 * Listino reale del preventivatore. I prezzi sono quelli pubblicati da
 * WildFocus: nessuno sconto automatico e nessun adeguamento percentuale.
 * Il totale è sempre "pacchetti scelti + trasferimento fisso".
 */
export const quoteCategories: QuoteCategory[] = [
  {
    id: 'reel',
    label: 'Reel',
    description: 'Video brevi verticali, montati e pronti da pubblicare.',
  },
  {
    id: 'fotografia',
    label: 'Fotografia',
    description: 'Shooting, eventi e contenuti fotografici per i social.',
  },
  {
    id: 'matrimonio',
    label: 'Matrimonio',
    description: 'Copertura fotografica del giorno del matrimonio.',
  },
]

export const quotePackages: QuotePackage[] = [
  // Reel
  {
    id: 'reel-1',
    category: 'reel',
    name: '1 Reel',
    price: 70,
    features: [],
  },
  {
    id: 'reel-4',
    category: 'reel',
    name: '4 Reel',
    price: 250,
    priceNote: '62,50 €/reel',
    features: [],
  },
  {
    id: 'reel-8',
    category: 'reel',
    name: '8 Reel',
    price: 460,
    priceNote: '57,50 €/reel',
    features: [],
  },
  {
    id: 'reel-12',
    category: 'reel',
    name: '12 Reel',
    price: 600,
    priceNote: '50 €/reel',
    features: [],
  },

  // Fotografia
  {
    id: 'mini-shooting',
    category: 'fotografia',
    name: 'MINI SHOOTING',
    price: 90,
    features: ['Fino a 1 ora di shooting', 'Selezione e post-produzione', 'Consegna digitale'],
  },
  {
    id: 'shooting-standard',
    category: 'fotografia',
    name: 'SHOOTING STANDARD',
    price: 150,
    features: ['Fino a 2 ore di shooting', 'Selezione e post-produzione', 'Consegna digitale'],
  },
  {
    id: 'shooting-pro',
    category: 'fotografia',
    name: 'SHOOTING PRO',
    price: 220,
    features: ['Fino a 3 ore di shooting', 'Selezione e post-produzione avanzata', 'Consegna digitale'],
  },
  {
    id: 'evento',
    category: 'fotografia',
    name: 'EVENTO',
    price: 150,
    features: [
      'Fino a 2 ore di copertura',
      "Scatti durante l'evento",
      'Selezione e post-produzione',
      'Consegna digitale',
    ],
  },
  {
    id: 'evento-plus',
    category: 'fotografia',
    name: 'EVENTO PLUS',
    price: 250,
    features: [
      'Fino a 4 ore di copertura',
      "Scatti durante l'evento",
      'Selezione e post-produzione',
      'Consegna digitale',
    ],
  },
  {
    id: 'evento-completo',
    category: 'fotografia',
    name: 'EVENTO COMPLETO',
    price: 350,
    features: [
      'Fino a 6 ore di copertura',
      'Copertura fotografica completa',
      'Selezione e post-produzione',
      'Consegna digitale',
    ],
  },
  {
    id: 'social-photo',
    category: 'fotografia',
    name: 'SOCIAL PHOTO',
    price: 120,
    features: [
      '1 ora di shooting',
      '30 foto selezionate e post-prodotte',
      'Contenuti pensati per i social',
      'Consegna digitale',
    ],
  },

  // Matrimonio
  {
    id: 'cerimonia',
    category: 'matrimonio',
    name: 'CERIMONIA',
    price: 450,
    features: [
      'Fino a 3 ore di copertura',
      'Preparazione degli sposi',
      'Cerimonia',
      'Foto di coppia e famiglia',
      'Selezione completa delle migliori immagini',
      'Post-produzione',
      'Consegna digitale',
    ],
  },
  {
    id: 'wedding',
    category: 'matrimonio',
    name: 'WEDDING',
    price: 750,
    features: [
      'Fino a 6 ore di copertura',
      'Preparazione degli sposi',
      'Cerimonia',
      'Foto di coppia e famiglia',
      'Ricevimento',
      'Selezione completa delle migliori immagini',
      'Post-produzione',
      'Consegna digitale',
    ],
  },
  {
    id: 'wedding-full-day',
    category: 'matrimonio',
    name: 'WEDDING FULL DAY',
    price: 1200,
    features: [
      'Fino a 10 ore di copertura',
      'Preparazione degli sposi',
      'Cerimonia',
      'Foto di coppia e famiglia',
      'Ricevimento e festa',
      'Selezione completa delle migliori immagini',
      'Post-produzione avanzata',
      'Consegna digitale',
    ],
  },
]

/**
 * Trasferimenti fissi. Il costo copre andata e ritorno, quindi si applica una
 * sola volta all'intero preventivo, non per ogni pacchetto selezionato.
 */
export const quoteTransfers: QuoteTransferOption[] = [
  {
    id: 'nessuno',
    label: 'Nessun trasferimento',
    description: 'Ci occupiamo del progetto senza spostamenti da coprire.',
    price: 0,
  },
  {
    id: 'entro-20-km',
    label: 'Fino a 20 km',
    description: '20 km di distanza — 40 km totali andata e ritorno.',
    price: 20,
  },
  {
    id: 'entro-30-km',
    label: 'Fino a 30 km',
    description: '30 km di distanza — 60 km totali andata e ritorno.',
    price: 30,
  },
  {
    id: 'entro-50-km',
    label: 'Fino a 50 km',
    description: '50 km di distanza — 100 km totali andata e ritorno.',
    price: 50,
  },
  {
    id: 'roma-centro',
    label: 'Roma centro',
    description: 'Circa 40 km di distanza — 80 km totali andata e ritorno.',
    price: 40,
  },
]

/** Servizio del form contatti a cui corrisponde un pacchetto. */
const packageServiceSlug: Record<QuoteCategoryId, string> = {
  reel: 'video-editing',
  fotografia: 'fotografia-shooting',
  matrimonio: 'fotografia-shooting',
}

export function findQuotePackage(packageId: string): QuotePackage | undefined {
  return quotePackages.find((item) => item.id === packageId)
}

export function findQuoteTransfer(transferId: string | null | undefined): QuoteTransferOption {
  return quoteTransfers.find((item) => item.id === transferId) ?? quoteTransfers[0]
}

export function quotePackagesByCategory(categoryId: QuoteCategoryId): QuotePackage[] {
  return quotePackages.filter((item) => item.category === categoryId)
}

/**
 * Servizio da preselezionare nel form contatti a partire dai pacchetti scelti.
 * Restituisce uno slug reale di `services`, così il campo "Servizio richiesto"
 * resta valido anche quando il preventivatore passa dal link.
 */
export function quoteServiceSlug(packageIds: string[]): string {
  for (const packageId of packageIds) {
    const item = findQuotePackage(packageId)
    if (!item) continue
    const slug = packageServiceSlug[item.category]
    if (slug) return slug
  }
  return ''
}

/**
 * Totale del preventivo: somma dei pacchetti selezionati più il trasferimento
 * fisso, applicato una sola volta. Una selezione vuota restituisce un totale
 * pari a zero, così l'interfaccia può disattivare la richiesta.
 */
export function estimateQuote(packageIds: string[], transferId: string | null | undefined): QuoteEstimate {
  const packages = packageIds
    .map((id) => findQuotePackage(id))
    .filter((item): item is QuotePackage => item !== undefined)
    .map((item) => ({ id: item.id, name: item.name, price: item.price }))

  const subtotal = packages.reduce((sum, item) => sum + item.price, 0)
  const transfer = findQuoteTransfer(transferId)
  const transferPrice = packages.length > 0 ? transfer.price : 0

  return {
    packages,
    packageCount: packages.length,
    subtotal,
    transfer: packages.length > 0 ? transfer : null,
    transferPrice,
    total: subtotal + transferPrice,
  }
}
