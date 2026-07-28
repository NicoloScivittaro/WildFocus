import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import PortfolioPage from './PortfolioPage'
import { projects } from '@/data/projects'

function renderPage() {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <PortfolioPage />
      </MemoryRouter>
    </HelmetProvider>,
  )
}

describe('PortfolioPage', () => {
  it('shows every project when "Tutti" is active', () => {
    renderPage()
    expect(screen.getAllByRole('link')).toHaveLength(projects.length)
  })

  it('filters projects by category', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: 'Fotografia' }))

    const expectedCount = projects.filter((project) => project.category === 'fotografia').length
    expect(screen.getAllByRole('link')).toHaveLength(expectedCount)
  })
})
