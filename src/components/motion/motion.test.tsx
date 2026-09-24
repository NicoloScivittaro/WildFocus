import { afterEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { SplitLines } from './SplitLines'
import { ImageReveal } from './ImageReveal'
import { MagneticButton } from './MagneticButton'
import { CustomCursor } from './CustomCursor'
import { Marquee } from './Marquee'
import { PageTransition } from './PageTransition'
import { startViewTransition } from '@/lib/viewTransition'

const originalMatchMedia = window.matchMedia

/**
 * The motion primitives are all gated on two media queries. Driving them
 * explicitly is the only way to prove the touch / reduced-motion paths keep
 * the site usable instead of just hiding content.
 */
function setMediaQueries({ reducedMotion = false, finePointer = false } = {}) {
  window.matchMedia = ((query: string) => ({
    matches: query.includes('prefers-reduced-motion')
      ? reducedMotion
      : query.includes('pointer: fine')
        ? finePointer
        : false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia
}

afterEach(() => {
  window.matchMedia = originalMatchMedia
  document.documentElement.classList.remove('has-custom-cursor')
})

describe('SplitLines', () => {
  it('keeps every line as real text inside the heading', () => {
    render(<SplitLines as="h2" lines={['WE CREATE', 'WHAT PEOPLE REMEMBER.']} />)

    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toHaveTextContent('WE CREATE')
    expect(heading).toHaveTextContent('WHAT PEOPLE REMEMBER.')
  })

  it('still renders the text under reduced motion', () => {
    setMediaQueries({ reducedMotion: true })
    render(<SplitLines as="h2" lines={['ONE', 'TWO']} />)

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('ONETWO')
  })
})

describe('ImageReveal', () => {
  it('renders its media', () => {
    render(
      <ImageReveal>
        <img alt="cover" src="/cover.png" />
      </ImageReveal>,
    )

    expect(screen.getByAltText('cover')).toBeInTheDocument()
  })
})

describe('MagneticButton', () => {
  it('leaves the interactive child fully usable', () => {
    render(
      <MagneticButton>
        <a href="/progetto">Start a project →</a>
      </MagneticButton>,
    )

    expect(screen.getByRole('link', { name: /start a project/i })).toHaveAttribute('href', '/progetto')
  })
})

describe('CustomCursor', () => {
  it('stays completely off when there is no fine pointer', () => {
    setMediaQueries({ finePointer: false })
    const { container } = render(<CustomCursor />)

    expect(container).toBeEmptyDOMElement()
  })

  it('stays off when reduced motion is requested', () => {
    setMediaQueries({ finePointer: true, reducedMotion: true })
    const { container } = render(<CustomCursor />)

    expect(container).toBeEmptyDOMElement()
  })

  it('activates on a fine pointer and hides the native cursor', () => {
    setMediaQueries({ finePointer: true })
    const { container } = render(<CustomCursor />)

    expect(container).not.toBeEmptyDOMElement()
    expect(document.documentElement).toHaveClass('has-custom-cursor')
  })
})

describe('Marquee', () => {
  it('renders its items', () => {
    render(<Marquee items={['WILDFOCUS', 'VIDEO', 'SOUND']} />)

    expect(screen.getAllByText('WILDFOCUS').length).toBeGreaterThan(0)
    expect(screen.getAllByText('VIDEO').length).toBeGreaterThan(0)
    expect(screen.getAllByText('SOUND').length).toBeGreaterThan(0)
  })

  it('renders a single static copy under reduced motion', () => {
    setMediaQueries({ reducedMotion: true })
    render(<Marquee items={['WILDFOCUS', 'VIDEO']} />)

    expect(screen.getAllByText('WILDFOCUS')).toHaveLength(1)
  })
})

describe('PageTransition', () => {
  it('renders a purely decorative overlay that cannot intercept input', () => {
    const { container } = render(
      <MemoryRouter>
        <PageTransition />
      </MemoryRouter>,
    )

    const overlay = container.firstElementChild
    expect(overlay).not.toBeNull()
    expect(overlay).toHaveClass('pointer-events-none')
    expect(overlay).toHaveAttribute('aria-hidden', 'true')
  })

  it('gets out of the way entirely under reduced motion', () => {
    setMediaQueries({ reducedMotion: true })
    const { container } = render(
      <MemoryRouter>
        <PageTransition />
      </MemoryRouter>,
    )

    expect(container).toBeEmptyDOMElement()
  })
})

describe('startViewTransition', () => {
  it('reports that it did not take over when the API is unavailable', () => {
    expect(startViewTransition(() => {})).toBe(false)
  })
})
