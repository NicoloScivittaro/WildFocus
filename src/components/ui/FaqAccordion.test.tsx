import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FaqAccordion } from './FaqAccordion'
import type { FaqItem } from '@/types/content'

const items: FaqItem[] = [
  { question: 'Domanda 1?', answer: 'Risposta 1' },
  { question: 'Domanda 2?', answer: 'Risposta 2' },
]

describe('FaqAccordion', () => {
  it('shows an answer only after its question is clicked', async () => {
    const user = userEvent.setup()
    render(<FaqAccordion items={items} />)

    expect(screen.queryByText('Risposta 1')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Domanda 1?' }))
    expect(screen.getByText('Risposta 1')).toBeInTheDocument()
  })

  it('closes the previously open answer when a new question is opened', async () => {
    const user = userEvent.setup()
    render(<FaqAccordion items={items} />)

    await user.click(screen.getByRole('button', { name: 'Domanda 1?' }))
    expect(screen.getByText('Risposta 1')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Domanda 2?' }))
    expect(screen.queryByText('Risposta 1')).not.toBeInTheDocument()
    expect(screen.getByText('Risposta 2')).toBeInTheDocument()
  })
})
