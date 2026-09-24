import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ServiceSummaryCard } from './ServiceSummaryCard'
import type { Service } from '@/types/content'

const service: Service = {
  slug: 'video-editing',
  title: 'Video Editing',
  outcomeStatement: 'Statement orientato al risultato.',
  problemSolved: 'Problem',
  includes: ['Reel', 'Color grading'],
  examples: ['Esempio 1'],
  ctaLabel: 'Parliamo del tuo progetto',
}

describe('ServiceSummaryCard', () => {
  it('renders the title and outcome statement, condensed (no includes/examples list)', () => {
    render(<ServiceSummaryCard service={service} />)
    expect(screen.getByText('Video Editing')).toBeInTheDocument()
    expect(screen.getByText('Statement orientato al risultato.')).toBeInTheDocument()
    expect(screen.queryByText('· Reel')).not.toBeInTheDocument()
    expect(screen.queryByText('· Esempio 1')).not.toBeInTheDocument()
  })

  it('gives the hovered card more presence and lets the others recede', () => {
    const { container, unmount } = render(<ServiceSummaryCard service={service} isActive isDimmed={false} />)
    expect(container.firstElementChild?.className).toContain('border-accent')
    expect(container.firstElementChild?.className).toContain('opacity-100')
    unmount()

    const { container: dimmed } = render(<ServiceSummaryCard service={service} isActive={false} isDimmed />)
    expect(dimmed.firstElementChild?.className).toContain('opacity-50')
  })
})
