interface SectionTitleProps {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  /** Use on a dark section background — flips text to the light/on-dark palette. */
  inverted?: boolean
}

export function SectionTitle({ eyebrow, title, description, align = 'left', inverted = false }: SectionTitleProps) {
  const eyebrowColor = inverted ? 'text-accent' : 'text-accent-deep'
  const titleColor = inverted ? 'text-base' : 'text-ink'
  const descriptionColor = inverted ? 'text-base/70' : 'text-ink-muted'

  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow && <p className={`text-sm font-semibold uppercase tracking-wide ${eyebrowColor}`}>{eyebrow}</p>}
      <h2 className={`mt-2 font-display text-3xl md:text-4xl ${titleColor}`}>{title}</h2>
      {description && <p className={`mt-3 ${descriptionColor}`}>{description}</p>}
    </div>
  )
}
