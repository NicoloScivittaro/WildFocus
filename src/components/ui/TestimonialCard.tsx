import type { Testimonial } from '@/types/content'

interface TestimonialCardProps {
  testimonial: Testimonial
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <figure className="rounded-xl2 border border-ink/10 bg-surface p-6">
      <blockquote className="text-ink">&ldquo;{testimonial.quote}&rdquo;</blockquote>
      <figcaption className="mt-4 text-sm text-ink-muted">
        <span className="text-ink">{testimonial.author}</span> — {testimonial.role}
        {testimonial.company ? `, ${testimonial.company}` : ''}
      </figcaption>
    </figure>
  )
}
