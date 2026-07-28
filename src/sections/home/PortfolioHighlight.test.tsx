import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { PortfolioHighlight } from './PortfolioHighlight'
import { projects } from '@/data/projects'

describe('PortfolioHighlight', () => {
  it('renders only the first 3 projects', () => {
    render(<PortfolioHighlight />, { wrapper: MemoryRouter })
    const projectLinks = screen
      .getAllByRole('link')
      .filter((link) => link.getAttribute('href')?.startsWith('/portfolio/'))
    expect(projectLinks).toHaveLength(3)
    expect(projects.length).toBeGreaterThan(3)
  })
})
