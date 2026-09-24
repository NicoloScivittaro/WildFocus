import type { ConfiguratorOption } from '@/types/content'
import type { BudgetRange, ContactFormFields, ProjectBrief } from '@/types/contact'

/**
 * Opzioni del configuratore progetto. Le domande sono volutamente corte e
 * parlate: servono a far sentire l'utente dentro un percorso, non davanti a
 * un modulo.
 */
export const projectKinds: ConfiguratorOption[] = [
  { id: 'video', label: 'Video', hint: 'Editing, reel, spot, brand film' },
  { id: 'music', label: 'Music', hint: 'Produzione, beat, brani originali' },
  { id: 'sound', label: 'Sound', hint: 'Sound design, foley, mix e finalizzazione' },
  { id: 'website', label: 'Website', hint: 'Sito, landing page, portfolio' },
  { id: 'something-weird', label: 'Something weird', hint: "L'idea che non entra in nessuna casella" },
]

export const projectGoals: ConfiguratorOption[] = [
  { id: 'launch', label: 'Launch', hint: 'Far partire qualcosa' },
  { id: 'sell', label: 'Sell', hint: 'Portare a una conversione' },
  { id: 'tell-a-story', label: 'Tell a story', hint: 'Far capire chi sei' },
  { id: 'build-a-brand', label: 'Build a brand', hint: 'Costruire riconoscibilità' },
  { id: 'dont-know-yet', label: "I don't know yet", hint: 'Ci pensiamo insieme' },
]

/**
 * Etichette in inglese per restare coerenti con la voce del configuratore,
 * mentre il valore salvato resta il `BudgetRange` canonico usato dal form.
 */
export const projectBudgetChoices: { value: BudgetRange; label: string }[] = [
  { value: 'Meno di 500€', label: 'Under €500' },
  { value: '500-1.000€', label: '€500 – 1,000' },
  { value: '1.000-2.500€', label: '€1,000 – 2,500' },
  { value: '2.500-5.000€', label: '€2,500 – 5,000' },
  { value: 'Oltre 5.000€', label: 'Over €5,000' },
  { value: 'Da definire', label: 'Not sure yet' },
]

/** A quale servizio del sito corrisponde ciò che si sta realizzando. */
const kindToService: Record<string, string> = {
  video: 'video-editing',
  music: 'produzione-musicale',
  sound: 'sound-design',
}

export function optionLabel(options: ConfiguratorOption[], id: string): string {
  return options.find((option) => option.id === id)?.label ?? id
}

export function budgetLabel(budget: BudgetRange | undefined): string {
  if (!budget) return 'Da definire'
  return projectBudgetChoices.find((choice) => choice.value === budget)?.label ?? budget
}

/**
 * Traduce il brief in una descrizione leggibile per chi legge la richiesta.
 */
export function buildProjectDescription(brief: ProjectBrief): string {
  const parts = [
    `Cosa: ${optionLabel(projectKinds, brief.kind)}`,
    `Obiettivo: ${optionLabel(projectGoals, brief.goal)}`,
  ]

  if (brief.budget) parts.push(`Budget: ${budgetLabel(brief.budget)}`)
  if (brief.deadline.trim().length > 0) parts.push(`Deadline: ${brief.deadline.trim()}`)

  return parts.join(' · ')
}

/**
 * Mappa il brief sui campi attesi dal servizio contatti, così il
 * configuratore resta compatibile con `submitContactRequest`.
 */
export function briefToContactFields(
  brief: ProjectBrief,
): Pick<ContactFormFields, 'service' | 'projectDescription' | 'timeline' | 'budget' | 'materialsLink'> {
  return {
    service: kindToService[brief.kind] ?? brief.kind,
    projectDescription: buildProjectDescription(brief),
    timeline: brief.deadline.trim() || 'Da definire',
    budget: brief.budget,
    materialsLink: brief.references.trim() || undefined,
  }
}
