import { Hero } from '@/sections/home/Hero'
import { PortfolioHighlight } from '@/sections/home/PortfolioHighlight'
import { ServicesSummary } from '@/sections/home/ServicesSummary'
import { SocialProof } from '@/sections/home/SocialProof'
import { FinalCta } from '@/sections/home/FinalCta'
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
        <ServicesSummary />
        <SocialProof />
        <FinalCta />
      </div>
    </>
  )
}
