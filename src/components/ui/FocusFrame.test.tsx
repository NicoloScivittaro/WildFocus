import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { FocusFrame } from './FocusFrame'

describe('FocusFrame', () => {
  it('renders four decorative corner marks hidden from assistive tech', () => {
    const { container } = render(<FocusFrame />)
    expect(container.querySelectorAll('span')).toHaveLength(4)
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })
})
