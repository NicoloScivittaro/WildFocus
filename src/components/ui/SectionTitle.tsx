interface SectionTitleProps {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
}

export function SectionTitle({ eyebrow, title, description, align = 'left' }: SectionTitleProps) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow && <p className="text-sm font-semibold uppercase tracking-wide text-accent">{eyebrow}</p>}
      <h2 className="mt-2 font-display text-3xl text-ink md:text-4xl">{title}</h2>
      {description && <p className="mt-3 text-ink-muted">{description}</p>}
    </div>
  )
}
