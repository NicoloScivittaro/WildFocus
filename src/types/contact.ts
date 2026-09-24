export type BudgetRange =
  | 'Meno di 500€'
  | '500-1.000€'
  | '1.000-2.500€'
  | '2.500-5.000€'
  | 'Oltre 5.000€'
  | 'Da definire'

export type ContactPreference = 'Email' | 'Telefono' | 'WhatsApp'

export interface ContactStepOneFields {
  fullName: string
  email: string
  service: string
  companyOrProject?: string
}

export interface ContactStepTwoFields {
  projectDescription: string
  timeline: string
  budget?: BudgetRange
}

export interface ContactStepThreeFields {
  materialsLink?: string
  phone?: string
  contactPreference?: ContactPreference
  privacyAccepted: boolean
}

export type ContactFormFields = ContactStepOneFields & ContactStepTwoFields & ContactStepThreeFields

export interface ContactPayload extends ContactFormFields {
  honeypot: string
  formRenderedAt: number
  submittedAt: number
}

export interface ContactResult {
  ok: boolean
  error?: string
}

/** Risposte raccolte dal configuratore progetto, prima dei dati di contatto. */
export interface ProjectBrief {
  /** Cosa stiamo realizzando — id di `projectKinds`. */
  kind: string
  /** Obiettivo del progetto — id di `projectGoals`. */
  goal: string
  budget?: BudgetRange
  deadline: string
  references: string
}
