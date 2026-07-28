import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CaseStudyCard } from './CaseStudyCard'
import type { Project } from '@/types/content'

const project: Project = {
  slug: 'progetto-1',
  title: '[PROGETTO PORTFOLIO]',
  category: 'commercial',
  summary: 'Sommario',
  serviceProvided: 'Video Editing',
  clientGoal: 'Obiettivo del cliente',
  result: 'Risultato qualitativo',
}

describe('CaseStudyCard', () => {
  it('renders the client goal and the result', () => {
    render(<CaseStudyCard project={project} />)
    expect(screen.getByText('Obiettivo del cliente')).toBeInTheDocument()
    expect(screen.getByText('Risultato qualitativo')).toBeInTheDocument()
  })

  it('omits the testimonial block when no testimonial is present', () => {
    render(<CaseStudyCard project={project} />)
    expect(screen.queryByTestId('case-study-testimonial')).not.toBeInTheDocument()
  })

  it('shows the testimonial when present', () => {
    render(
      <CaseStudyCard
        project={{
          ...project,
          testimonial: { quote: '[TESTIMONIANZA CLIENTE]', author: '[NOME MEMBRO TEAM]', role: 'Cliente' },
        }}
      />,
    )
    expect(screen.getByTestId('case-study-testimonial')).toHaveTextContent('[TESTIMONIANZA CLIENTE]')
  })
})
