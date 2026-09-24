import { Hero } from '@/sections/home/Hero'
import { PortfolioHighlight } from '@/sections/home/PortfolioHighlight'
import { ServicesSummary } from '@/sections/home/ServicesSummary'
import { FinalCta } from '@/sections/home/FinalCta'
import { Marquee } from '@/components/motion/Marquee'
import { Seo } from '@/seo/Seo'

export default function HomePage() {
  return (
    <>
      <Seo
        title="WildFocus — Video editing, fotografia e contenuti social"
        description="Video e contenuti visivi per aziende, creator e attività che vogliono aumentare attenzione, autorevolezza e conversioni."
      />
      <div className="mx-auto max-w-6xl px-4">
        <Hero />
        <PortfolioHighlight />

        {/* Typographic band: a breath between the work and the services. */}
        <Marquee
          items={['WILDFOCUS', 'VIDEO', 'SOUND', 'DESIGN', 'DIGITAL']}
          className="-mx-4 border-y border-ink/10 py-6 font-display text-3xl text-ink/30 md:text-5xl"
        />

        <ServicesSummary />
        <FinalCta />
      </div>
    </>
  )
}
