import { Link } from 'react-router-dom'
import { Film, Camera, Share2, Megaphone, PartyPopper, Sparkles } from 'lucide-react'
import type { Project, ProjectCategory } from '@/types/content'

const categoryLabels: Record<ProjectCategory, string> = {
  'video-editing': 'Video Editing',
  fotografia: 'Fotografia',
  social: 'Social Content',
  commercial: 'Commercial',
  eventi: 'Eventi',
  brand: 'Brand',
}

const categoryIcons: Record<ProjectCategory, typeof Film> = {
  'video-editing': Film,
  fotografia: Camera,
  social: Share2,
  commercial: Megaphone,
  eventi: PartyPopper,
  brand: Sparkles,
}

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const CategoryIcon = categoryIcons[project.category]
  const hasRealMedia = Boolean(project.coverImage || project.coverVideo)

  return (
    <Link
      to={`/portfolio/${project.slug}`}
      className="group block overflow-hidden rounded-xl2 border border-white/10 bg-surface transition hover:border-accent/60"
    >
      <div className="relative aspect-video w-full">
        {hasRealMedia && project.coverImage ? (
          <img
            src={project.coverImage}
            alt={project.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div
            data-testid="project-placeholder"
            className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-zinc-900 to-black p-4 text-center text-ink-muted"
          >
            <CategoryIcon aria-hidden="true" />
            <span className="text-sm">
              {categoryLabels[project.category]} — {project.title}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs uppercase tracking-wide text-accent">{categoryLabels[project.category]}</p>
        <h3 className="mt-1 font-display text-lg text-ink">{project.title}</h3>
        <p className="mt-1 text-sm text-ink-muted">{project.summary}</p>
      </div>
    </Link>
  )
}
