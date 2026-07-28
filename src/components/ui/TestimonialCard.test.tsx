import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TestimonialCard } from './TestimonialCard'
import type { Testimonial } from '@/types/content'

const testimonial: Testimonial = {
  quote: '[TESTIMONIANZA CLIENTE]',
  author: '[NOME MEMBRO TEAM]',
  role: 'Cliente',
}

describe('TestimonialCard', () => {
  it('renders the quote and the author', () => {
    render(<TestimonialCard testimonial={testimonial} />)
    expect(screen.getByText(/testimonianza cliente/i)).toBeInTheDocument()
    expect(screen.getByText('[NOME MEMBRO TEAM]')).toBeInTheDocument()
  })
})
