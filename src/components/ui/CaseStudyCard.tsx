import type { Project } from '@/types/content'

interface CaseStudyCardProps {
  project: Project
}

export function CaseStudyCard({ project }: CaseStudyCardProps) {
  return (
    <article className="rounded-xl2 border border-white/10 bg-surface p-6">
      <p className="text-xs uppercase tracking-wide text-accent">{project.serviceProvided}</p>
      <h3 className="mt-1 font-display text-lg text-ink">{project.title}</h3>

      <dl className="mt-4 space-y-3 text-sm">
        <div>
          <dt className="text-ink-muted">Obiettivo del cliente</dt>
          <dd className="text-ink">{project.clientGoal}</dd>
        </div>
        <div>
          <dt className="text-ink-muted">Risultato</dt>
          <dd className="text-ink">{project.result}</dd>
        </div>
      </dl>

      {project.testimonial && (
        <blockquote data-testid="case-study-testimonial" className="mt-4 border-l-2 border-accent pl-3 text-sm text-ink-muted">
          &ldquo;{project.testimonial.quote}&rdquo; — {project.testimonial.author}
        </blockquote>
      )}
    </article>
  )
}
