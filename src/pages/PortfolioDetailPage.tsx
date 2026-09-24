import { useEffect, useRef } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { CaseStudyCard } from '@/components/ui/CaseStudyCard'
import { BeforeAfter } from '@/components/ui/BeforeAfter'
import { CTASection } from '@/components/ui/CTASection'
import { ProjectCover } from '@/components/ui/ProjectCover'
import { FocusFrame } from '@/components/ui/FocusFrame'
import { Reveal } from '@/components/ui/Reveal'
import { projects } from '@/data/projects'
import { Seo } from '@/seo/Seo'
import type { Project } from '@/types/content'

/**
 * The arrival target of the shared-element opening. It deliberately carries
 * no entrance animation: the browser snapshots this element to morph the
 * clicked thumbnail into it, and an animated initial state would make the
 * new-page snapshot invisible.
 */
function ProjectHero({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    element.style.setProperty('view-transition-name', `project-${project.slug}`)
    return () => {
      element.style.removeProperty('view-transition-name')
    }
  }, [project.slug])

  return (
    <div ref={ref} className="relative mt-8 aspect-video w-full overflow-hidden rounded-xl2 border border-ink/10">
      <ProjectCover project={project} />
      <div className="grain-overlay" />
      <FocusFrame size="lg" tone="accent" inset="inset-4 md:inset-5" />
    </div>
  )
}

export default function PortfolioDetailPage() {
  const { slug } = useParams<{ slug: string }>()

  const project = projects.find((item) => item.slug === slug)

  if (!project) {
    return <Navigate to="/portfolio" replace />
  }

  return (
    <>
      <Seo title={`${project.title} — Portfolio WildFocus`} description={project.summary} />
      <div className="mx-auto max-w-4xl px-4 py-12">
        <SectionTitle eyebrow={project.serviceProvided} title={project.title} description={project.summary} />

        <ProjectHero project={project} />

        <Reveal variant="wild" className="mt-8">
          <CaseStudyCard project={project} />
        </Reveal>

        {project.beforeAfter && (
          <Reveal variant="mask-up" className="mt-8" delay={0.05}>
            <BeforeAfter data={project.beforeAfter} />
          </Reveal>
        )}

        <div className="mt-12">
          <CTASection title="Parliamo del tuo progetto" secondaryLabel="Guarda altri lavori" secondaryTo="/portfolio" />
        </div>
      </div>
    </>
  )
}
