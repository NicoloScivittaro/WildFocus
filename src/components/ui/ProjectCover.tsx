import type { Project } from '@/types/content'
import { categoryGradient, categoryIcons, categoryLabels } from '@/lib/projectVisuals'

interface ProjectCoverProps {
  project: Project
}

/**
 * The visual body of a project, shared by the portfolio card and the
 * case-study hero so the two can be morphed into each other by the
 * browser's View Transitions API without drifting apart.
 */
export function ProjectCover({ project }: ProjectCoverProps) {
  if (project.coverImage) {
    return (
      <img src={project.coverImage} alt={project.title} className="h-full w-full object-cover" loading="lazy" />
    )
  }

  const CategoryIcon = categoryIcons[project.category]

  return (
    <div
      data-testid="project-placeholder"
      className={`flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br p-4 text-center text-white/60 ${categoryGradient[project.category]}`}
    >
      <div className="grain-overlay" />
      <CategoryIcon aria-hidden="true" />
      <span className="text-sm">
        {categoryLabels[project.category]} — {project.title}
      </span>
    </div>
  )
}
