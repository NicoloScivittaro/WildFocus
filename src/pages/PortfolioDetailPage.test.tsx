import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import PortfolioDetailPage from './PortfolioDetailPage'
import { projects } from '@/data/projects'

function renderAt(path: string) {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/portfolio/:slug" element={<PortfolioDetailPage />} />
          <Route path="/portfolio" element={<div>Portfolio index</div>} />
        </Routes>
      </MemoryRouter>
    </HelmetProvider>,
  )
}

describe('PortfolioDetailPage', () => {
  it('renders the matching project details', () => {
    const [firstProject] = projects
    renderAt(`/portfolio/${firstProject.slug}`)
    expect(screen.getByText(firstProject.clientGoal)).toBeInTheDocument()
  })

  it('redirects to /portfolio when the slug does not match any project', () => {
    renderAt('/portfolio/progetto-inesistente')
    expect(screen.getByText('Portfolio index')).toBeInTheDocument()
  })
})
