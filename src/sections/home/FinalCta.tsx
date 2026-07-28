import { CTASection } from '@/components/ui/CTASection'

export function FinalCta() {
  return (
    <div className="py-12">
      <CTASection
        title="Costruiamo il prossimo contenuto"
        description="Raccontaci il tuo progetto. Ti aiuteremo a trasformarlo in qualcosa che le persone vorranno guardare, ricordare e condividere."
        secondaryLabel="Scopri i nostri lavori"
        secondaryTo="/portfolio"
      />
    </div>
  )
}
