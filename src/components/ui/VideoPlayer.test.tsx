import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { VideoPlayer } from './VideoPlayer'

describe('VideoPlayer', () => {
  it('shows the poster and a play button when a src is provided', () => {
    render(<VideoPlayer title="Showreel WildFocus" poster="/poster.jpg" src="/showreel.mp4" />)
    expect(screen.getByAltText('Showreel WildFocus')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /riproduci showreel wildfocus/i })).toBeInTheDocument()
  })

  it('loads the video element only after the play button is clicked', async () => {
    const user = userEvent.setup()
    render(<VideoPlayer title="Showreel WildFocus" poster="/poster.jpg" src="/showreel.mp4" />)
    expect(document.querySelector('video')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /riproduci showreel wildfocus/i }))
    expect(document.querySelector('video')).toBeInTheDocument()
  })

  it('shows a static placeholder poster with no play button when no src is provided', () => {
    render(<VideoPlayer title="Showreel WildFocus" poster="/poster.jpg" />)
    expect(screen.queryByRole('button', { name: /riproduci/i })).not.toBeInTheDocument()
    expect(screen.getByText(/showreel — \[placeholder\]/i)).toBeInTheDocument()
  })
})
