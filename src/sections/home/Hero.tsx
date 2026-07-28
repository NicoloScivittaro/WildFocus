import { Link } from 'react-router-dom'
import { VideoPlayer } from '@/components/ui/VideoPlayer'
import { Reveal } from '@/components/ui/Reveal'
import { siteConfig } from '@/data/siteConfig'
import { heroPosterDataUri } from '@/lib/placeholderPoster'

export function Hero() {
  return (
    <section className="grid gap-10 py-12 md:grid-cols-2 md:items-center md:py-20">
      <Reveal>
        <h1 className="font-display text-4xl leading-tight text-ink md:text-5xl">
          Contenuti che catturano l&apos;attenzione.
          <br />
          Immagini che fanno crescere il tuo brand.
        </h1>
        <p className="mt-4 max-w-lg text-ink-muted">{siteConfig.positioning}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/contatti" className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-ink hover:opacity-90">
            {siteConfig.primaryCta}
          </Link>
          <Link to="/portfolio" className="rounded-full border border-ink/20 px-6 py-3 text-sm text-ink hover:border-ink/40">
            Guarda i nostri lavori
          </Link>
        </div>
      </Reveal>

      <Reveal>
        <VideoPlayer title="Showreel WildFocus" poster={heroPosterDataUri} />
      </Reveal>
    </section>
  )
}
