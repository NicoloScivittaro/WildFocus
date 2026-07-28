import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Reveal } from './Reveal'

describe('Reveal', () => {
  it('renders its children', () => {
    render(<Reveal>Contenuto</Reveal>)
    expect(screen.getByText('Contenuto')).toBeInTheDocument()
  })

  it('applies Framer Motion initial styling when motion is not reduced', () => {
    render(<Reveal>Contenuto animato</Reveal>)
    expect(screen.getByText('Contenuto animato')).toHaveAttribute('style')
  })

  it('skips motion styling entirely when the user prefers reduced motion', () => {
    const originalMatchMedia = window.matchMedia
    window.matchMedia = ((query: string) => ({
      matches: query.includes('reduce'),
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia

    render(<Reveal>Contenuto statico</Reveal>)
    expect(screen.getByText('Contenuto statico')).not.toHaveAttribute('style')

    window.matchMedia = originalMatchMedia
  })
})
