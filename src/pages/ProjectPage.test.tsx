import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import ProjectPage from './ProjectPage'

describe('ProjectPage', () => {
  it('starts the project configurator instead of the classic contact form', () => {
    render(
      <HelmetProvider>
        <MemoryRouter>
          <ProjectPage />
        </MemoryRouter>
      </HelmetProvider>,
    )

    expect(screen.getByText('What are we making?')).toBeInTheDocument()
    expect(screen.queryByLabelText('Servizio richiesto')).not.toBeInTheDocument()
  })
})
