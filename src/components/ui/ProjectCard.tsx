import { Link } from 'react-router-dom'
import { Film, Camera, Share2, Megaphone, PartyPopper, Sparkles } from 'lucide-react'
import type { Project, ProjectCategory } from '@/types/content'
import { FocusFrame } from '@/components/ui/FocusFrame'

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

// Each category gets its own barely-there dark tint — enough to break the
// "every cover looks identical" monotony while keeping the premium,
// cinematic dark treatment consistent across the whole grid.
const categoryGradient: Record<ProjectCategory, string> = {
  'video-editing': 'from-zinc-900 via-zinc-950 to-black',
  fotografia: 'from-stone-900 via-neutral-950 to-black',
  social: 'from-sky-950 via-slate-950 to-black',
  commercial: 'from-amber-950 via-zinc-950 to-black',
  eventi: 'from-violet-950 via-zinc-950 to-black',
  brand: 'from-emerald-950 via-zinc-950 to-black',
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
      className="group block overflow-hidden rounded-xl2 border border-ink/10 bg-surface transition hover:border-accent-deep/60"
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
            className={`flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br p-4 text-center text-white/60 ${categoryGradient[project.category]}`}
          >
            <div className="grain-overlay" />
            <CategoryIcon aria-hidden="true" />
            <span className="text-sm">
              {categoryLabels[project.category]} — {project.title}
            </span>
          </div>
        )}
        <FocusFrame
          size="sm"
          tone="accent"
          inset="inset-3"
          className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      </div>

      <div className="p-4">
        <p className="text-xs uppercase tracking-wide text-accent-deep">{categoryLabels[project.category]}</p>
        <h3 className="mt-1 font-display text-lg text-ink">{project.title}</h3>
        <p className="mt-1 text-sm text-ink-muted">{project.summary}</p>
      </div>
    </Link>
  )
}
