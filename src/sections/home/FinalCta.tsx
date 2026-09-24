import { Link } from 'react-router-dom'
import { Reveal } from '@/components/ui/Reveal'
import { siteConfig } from '@/data/siteConfig'

export function FinalCta() {
  return (
    <div className="py-12">
      <Reveal className="rounded-xl2 bg-ink px-6 py-14 text-center md:px-12 md:py-16">
        <h2 className="font-display text-2xl text-base md:text-3xl">Costruiamo il prossimo contenuto</h2>
        <p className="mx-auto mt-3 max-w-xl text-base/70">
          Raccontaci il tuo progetto. Ti aiuteremo a trasformarlo in qualcosa che le persone vorranno guardare,
          ricordare e condividere.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 md:flex-row">
          <Link
            to={siteConfig.startProjectPath}
            className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-ink hover:opacity-90 focus-visible:outline-accent"
          >
            {siteConfig.primaryCta}
          </Link>
          <Link
            to="/portfolio"
            className="rounded-full border border-base/20 px-6 py-3 text-sm text-base hover:border-base/40 focus-visible:outline-accent"
          >
            Scopri i nostri lavori
          </Link>
        </div>
      </Reveal>
    </div>
  )
}
