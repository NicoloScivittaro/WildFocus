import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { ProjectCard } from '@/components/ui/ProjectCard'
import { projects } from '@/data/projects'
import { VIEWPORT, staggerContainer, staggerItem } from '@/lib/motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

export function PortfolioHighlight() {
  const highlighted = projects.slice(0, 3)
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <section className="py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionTitle eyebrow="Portfolio" title="Progetti in evidenza" />
        <Link
          to="/portfolio"
          data-cursor="GO →"
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-accent-deep"
        >
          <span className="link-underline">Scopri i nostri lavori</span>
          <span
            aria-hidden="true"
            className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </div>

      <motion.div
        className="mt-8 grid gap-6 md:grid-cols-3"
        variants={prefersReducedMotion ? undefined : staggerContainer(0.08)}
        initial={prefersReducedMotion ? undefined : 'hidden'}
        whileInView={prefersReducedMotion ? undefined : 'show'}
        viewport={VIEWPORT}
      >
        {highlighted.map((project) => (
          <motion.div key={project.slug} variants={prefersReducedMotion ? undefined : staggerItem}>
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
