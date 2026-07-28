import { CTASection } from '@/components/ui/CTASection'
import { Reveal } from '@/components/ui/Reveal'

export function FinalCta() {
  return (
    <Reveal className="py-12">
      <CTASection
        title="Costruiamo il prossimo contenuto"
        description="Raccontaci il tuo progetto. Ti aiuteremo a trasformarlo in qualcosa che le persone vorranno guardare, ricordare e condividere."
        secondaryLabel="Scopri i nostri lavori"
        secondaryTo="/portfolio"
      />
    </Reveal>
  )
}
