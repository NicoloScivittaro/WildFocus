import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { ProjectCard } from '@/components/ui/ProjectCard'
import { projects } from '@/data/projects'
import { Seo } from '@/seo/Seo'
import { VIEWPORT, staggerContainer, staggerItem } from '@/lib/motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
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
  const prefersReducedMotion = usePrefersReducedMotion()

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
          {filters.map((filter) => {
            const isActive = activeFilter === filter.value

            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => setActiveFilter(filter.value)}
                aria-pressed={isActive}
                className={`relative rounded-full border px-4 py-2 text-sm transition-colors duration-300 ${
                  isActive ? 'border-accent text-ink' : 'border-ink/20 text-ink-muted hover:border-ink/40 hover:text-ink'
                }`}
              >
                {/* The active pill slides between filters instead of blinking. */}
                {isActive &&
                  (prefersReducedMotion ? (
                    <span className="absolute inset-0 rounded-full bg-accent" />
                  ) : (
                    <motion.span
                      layoutId="portfolio-filter-pill"
                      className="absolute inset-0 rounded-full bg-accent"
                      transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                    />
                  ))}
                <span className="relative">{filter.label}</span>
              </button>
            )
          })}
        </div>

        <motion.div
          className="mt-8 grid gap-6 md:grid-cols-3"
          variants={prefersReducedMotion ? undefined : staggerContainer(0.07)}
          initial={prefersReducedMotion ? undefined : 'hidden'}
          whileInView={prefersReducedMotion ? undefined : 'show'}
          viewport={VIEWPORT}
        >
          {filteredProjects.map((project) => (
            <motion.div key={project.slug} variants={prefersReducedMotion ? undefined : staggerItem}>
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </>
  )
}
