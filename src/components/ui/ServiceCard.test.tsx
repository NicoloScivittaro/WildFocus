import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ServiceCard } from './ServiceCard'
import type { Service } from '@/types/content'

const service: Service = {
  slug: 'video-editing',
  title: 'Video Editing',
  outcomeStatement: 'Statement',
  problemSolved: 'Problem',
  includes: ['Reel', 'Color grading'],
  examples: [],
  ctaLabel: 'Parliamo del tuo progetto',
}

describe('ServiceCard', () => {
  it('links the CTA to the contact page with the service slug', () => {
    render(<ServiceCard service={service} />, { wrapper: MemoryRouter })
    expect(screen.getByRole('link', { name: 'Parliamo del tuo progetto' })).toHaveAttribute(
      'href',
      '/contatti?servizio=video-editing',
    )
  })

  it('lists every included work item', () => {
    render(<ServiceCard service={service} />, { wrapper: MemoryRouter })
    expect(screen.getByText('· Reel')).toBeInTheDocument()
    expect(screen.getByText('· Color grading')).toBeInTheDocument()
  })

  it('shows an "Esempi" list only when examples are provided', () => {
    render(<ServiceCard service={service} />, { wrapper: MemoryRouter })
    expect(screen.queryByText('Esempi')).not.toBeInTheDocument()

    render(<ServiceCard service={{ ...service, examples: ['Reel prodotto per brand'] }} />, { wrapper: MemoryRouter })
    expect(screen.getByText('Esempi')).toBeInTheDocument()
    expect(screen.getByText('· Reel prodotto per brand')).toBeInTheDocument()
  })
})
