import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import AboutPage from './AboutPage'
import { team } from '@/data/team'

describe('AboutPage', () => {
  it('renders every team member', () => {
    render(
      <HelmetProvider>
        <MemoryRouter>
          <AboutPage />
        </MemoryRouter>
      </HelmetProvider>,
    )

    team.forEach((member) => {
      expect(screen.getByText(member.role)).toBeInTheDocument()
    })
  })
})
