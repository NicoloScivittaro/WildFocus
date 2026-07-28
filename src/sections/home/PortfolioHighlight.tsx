import { Link } from 'react-router-dom'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { ProjectCard } from '@/components/ui/ProjectCard'
import { Reveal } from '@/components/ui/Reveal'
import { projects } from '@/data/projects'

export function PortfolioHighlight() {
  const highlighted = projects.slice(0, 3)

  return (
    <section className="py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionTitle eyebrow="Portfolio" title="Progetti in evidenza" />
        <Link to="/portfolio" className="text-sm font-semibold text-accent hover:underline">
          Scopri i nostri lavori
        </Link>
      </div>

      <Reveal className="mt-8 grid gap-6 md:grid-cols-3">
        {highlighted.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </Reveal>
    </section>
  )
}
