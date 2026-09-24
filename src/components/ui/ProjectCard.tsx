import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { MouseEvent } from 'react'
import type { Project } from '@/types/content'
import { FocusFrame } from '@/components/ui/FocusFrame'
import { ProjectCover } from '@/components/ui/ProjectCover'
import { categoryLabels } from '@/lib/projectVisuals'
import { startViewTransition } from '@/lib/viewTransition'
import { usePointerFine } from '@/hooks/usePointerFine'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const pointerFine = usePointerFine()
  const prefersReducedMotion = usePrefersReducedMotion()
  const navigate = useNavigate()
  const mediaRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  // A silent looping preview is mounted only while hovered, so it costs
  // nothing on load and never fights the poster for bandwidth.
  const showPreview = pointerFine && !prefersReducedMotion && isHovered && Boolean(project.coverVideo)

  // Names the thumbnail so the case-study hero can morph out of it.
  useEffect(() => {
    const element = mediaRef.current
    if (!element) return

    element.style.setProperty('view-transition-name', `project-${project.slug}`)
    return () => {
      element.style.removeProperty('view-transition-name')
    }
  }, [project.slug])

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (prefersReducedMotion) return

    // When the View Transitions API is unavailable (non-Chromium browsers and
    // jsdom in tests) this returns false and the plain <Link> takes over.
    const handled = startViewTransition(() => navigate(`/portfolio/${project.slug}`))
    if (handled) event.preventDefault()
  }

  return (
    <Link
      to={`/portfolio/${project.slug}`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-cursor="VIEW"
      className="group block overflow-hidden rounded-xl2 border border-ink/10 bg-surface transition-colors duration-500 hover:border-accent-deep/60"
    >
      <div ref={mediaRef} className="relative aspect-video w-full overflow-hidden">
        {/* Media drifts + scales a hair on hover: the frame stays, the image breathes. */}
        <div className="h-full w-full transition-transform duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:scale-[1.05]">
          <ProjectCover project={project} />
        </div>

        {showPreview && (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={project.coverVideo}
            poster={project.coverImage}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          />
        )}

        {/* Overlay deepens gradually instead of popping in. */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <span className="absolute bottom-3 left-3 inline-flex translate-y-2 items-center gap-1.5 rounded-full bg-base/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100">
          View project
          <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-0.5">
            →
          </span>
        </span>

        <FocusFrame
          size="sm"
          tone="accent"
          inset="inset-3"
          className="opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      </div>

      <div className="p-4">
        <p className="text-xs uppercase tracking-wide text-accent-deep transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5">
          {categoryLabels[project.category]}
        </p>
        <h3 className="mt-1 font-display text-lg text-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5">
          {project.title}
        </h3>
        <p className="mt-1 text-sm text-ink-muted">{project.summary}</p>
      </div>
    </Link>
  )
}
