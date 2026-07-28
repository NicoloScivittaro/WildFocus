import { useMemo, useState } from 'react'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { ProjectCard } from '@/components/ui/ProjectCard'
import { projects } from '@/data/projects'
import { Seo } from '@/seo/Seo'
import type { ProjectCategory } from '@/types/content'

type FilterValue = ProjectCategory | 'tutti'

const filters: { value: FilterValue; label: string }[] = [
  { value: 'tutti', label: 'Tutti' },
  { value: 'video-editing', label: 'Video Editing' },
  { value: 'fotografia', label: 'Fotografia' },
  { value: 'social', label: 'Social Content' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'eventi', label: 'Eventi' },
  { value: 'brand', label: 'Brand' },
]

export default function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState<FilterValue>('tutti')

  const filteredProjects = useMemo(
    () => (activeFilter === 'tutti' ? projects : projects.filter((project) => project.category === activeFilter)),
    [activeFilter],
  )

  return (
    <>
      <Seo
        title="Portfolio — WildFocus | Video, fotografia e contenuti social"
        description="I lavori realizzati da WildFocus: video editing, fotografia, contenuti social, commercial, eventi e brand."
      />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <SectionTitle
          eyebrow="Portfolio"
          title="I nostri lavori"
          description="Ogni progetto è pensato per un obiettivo preciso: coerenza visiva, attenzione, conversioni."
        />

        <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filtra per categoria">
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setActiveFilter(filter.value)}
              aria-pressed={activeFilter === filter.value}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                activeFilter === filter.value
                  ? 'border-accent bg-accent text-ink'
                  : 'border-ink/20 text-ink-muted hover:border-ink/40'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </>
  )
}
