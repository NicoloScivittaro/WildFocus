import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

function Probe({ onValue }: { onValue: (value: boolean) => void }) {
  const prefersReducedMotion = usePrefersReducedMotion()
  onValue(prefersReducedMotion)
  return null
}

describe('usePrefersReducedMotion', () => {
  it('reflects the mocked matchMedia result (false by default in tests)', () => {
    const values: boolean[] = []
    render(<Probe onValue={(v) => values.push(v)} />)
    expect(values[0]).toBe(false)
  })
})
