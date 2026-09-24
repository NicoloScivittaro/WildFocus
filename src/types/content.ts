export interface NavItem {
  label: string
  to: string
}

export interface Service {
  slug: string
  title: string
  outcomeStatement: string
  problemSolved: string
  includes: string[]
  examples: string[]
  ctaLabel: string
}

export interface PackagePlan {
  slug: string
  name: string
  description: string
  highlights: string[]
  priceLabel: 'Preventivo personalizzato'
}

export interface QuoteZone {
  id: string
  label: string
  /** Coefficiente logistico/trasferta applicato al subtotale dei servizi. */
  multiplier: number
}

export interface QuoteDiscountTier {
  /** Numero minimo di servizi selezionati perché lo sconto si applichi. */
  minServices: number
  /** Sconto combinazione, espresso come frazione (0.12 = 12%). */
  rate: number
}

export interface QuoteEstimate {
  serviceCount: number
  /** Somma dei listini generici dei servizi selezionati. */
  subtotal: number
  zoneMultiplier: number
  /** Quota aggiunta (o rimossa) dal coefficiente di zona. */
  zoneAdjustment: number
  discountRate: number
  discountAmount: number
  total: number
  /** Sconto raggiungibile aggiungendo un servizio, se esiste. */
  nextTier: QuoteDiscountTier | null
}

export type ProjectCategory = 'video-editing' | 'fotografia' | 'social' | 'commercial' | 'eventi' | 'brand'

export interface ProjectTestimonial {
  quote: string
  author: string
  role: string
}

export interface ProjectBeforeAfter {
  before: string
  after: string
  note: string
}

export interface Project {
  slug: string
  title: string
  category: ProjectCategory
  coverImage?: string
  coverVideo?: string
  summary: string
  serviceProvided: string
  clientGoal: string
  result: string
  testimonial?: ProjectTestimonial
  beforeAfter?: ProjectBeforeAfter
}

export interface TeamSocial {
  platform: string
  url: string
}

export interface TeamMemberData {
  name: string
  role: string
  bio: string
  skills: string[]
  photo?: string
  socials?: TeamSocial[]
}

export interface Testimonial {
  quote: string
  author: string
  role: string
  company?: string
}

export interface FaqItem {
  question: string
  answer: string
}
