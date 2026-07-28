import { Navigate, useParams } from 'react-router-dom'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { CaseStudyCard } from '@/components/ui/CaseStudyCard'
import { BeforeAfter } from '@/components/ui/BeforeAfter'
import { CTASection } from '@/components/ui/CTASection'
import { projects } from '@/data/projects'
import { Seo } from '@/seo/Seo'

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

        <div className="mt-8">
          <CaseStudyCard project={project} />
        </div>

        {project.beforeAfter && (
          <div className="mt-8">
            <BeforeAfter data={project.beforeAfter} />
          </div>
        )}

        <div className="mt-12">
          <CTASection title="Parliamo del tuo progetto" secondaryLabel="Guarda altri lavori" secondaryTo="/portfolio" />
        </div>
      </div>
    </>
  )
}
