import { SplitLines } from '@/components/motion/SplitLines'
import { Reveal } from '@/components/ui/Reveal'

interface SectionTitleProps {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  /** Use on a dark section background — flips text to the light/on-dark palette. */
  inverted?: boolean
}

/**
 * Every section heading on the site passes through here, which makes it the
 * one place to give the whole page its editorial rhythm: the headline wipes
 * in through an overflow mask, the supporting lines settle in behind it.
 */
export function SectionTitle({ eyebrow, title, description, align = 'left', inverted = false }: SectionTitleProps) {
  const eyebrowColor = inverted ? 'text-accent' : 'text-accent-deep'
  const titleColor = inverted ? 'text-base' : 'text-ink'
  const descriptionColor = inverted ? 'text-base/70' : 'text-ink-muted'

  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow && (
        <Reveal variant="fade" amount={0.4}>
          <p className={`text-sm font-semibold uppercase tracking-wide ${eyebrowColor}`}>{eyebrow}</p>
        </Reveal>
      )}

      <SplitLines
        as="h2"
        mode="inView"
        lines={[title]}
        className={`mt-2 font-display text-3xl md:text-4xl ${titleColor}`}
      />

      {description && (
        <Reveal variant="up" amount={0.4} delay={0.12}>
          <p className={`mt-3 ${descriptionColor}`}>{description}</p>
        </Reveal>
      )}
    </div>
  )
}
