import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import HomePage from './HomePage'

describe('HomePage', () => {
  it('renders the hero headline as the page h1', () => {
    render(
      <HelmetProvider>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </HelmetProvider>,
    )

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/contenuti che catturano l'attenzione/i)
  })
})
