import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ProjectCard } from './ProjectCard'
import type { Project } from '@/types/content'

const baseProject: Project = {
  slug: 'progetto-1',
  title: '[PROGETTO PORTFOLIO]',
  category: 'video-editing',
  summary: 'Sommario progetto',
  serviceProvided: 'Video Editing',
  clientGoal: 'Obiettivo',
  result: 'Risultato qualitativo',
}

describe('ProjectCard', () => {
  it('falls back to the local placeholder when no real media is set', () => {
    render(<ProjectCard project={baseProject} />, { wrapper: MemoryRouter })
    expect(screen.getByTestId('project-placeholder')).toBeInTheDocument()
  })

  it('renders the real image when coverImage is provided, without the placeholder', () => {
    render(<ProjectCard project={{ ...baseProject, coverImage: '/real.jpg' }} />, { wrapper: MemoryRouter })
    expect(screen.queryByTestId('project-placeholder')).not.toBeInTheDocument()
    expect(screen.getByAltText('[PROGETTO PORTFOLIO]')).toHaveAttribute('src', '/real.jpg')
  })

  it('links to the project detail route', () => {
    render(<ProjectCard project={baseProject} />, { wrapper: MemoryRouter })
    expect(screen.getByRole('link')).toHaveAttribute('href', '/portfolio/progetto-1')
  })
})
