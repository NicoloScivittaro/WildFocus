import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { useFormMountTime } from './useFormMountTime'

function Probe({ onValue }: { onValue: (value: number) => void }) {
  const mountedAt = useFormMountTime()
  onValue(mountedAt)
  return null
}

describe('useFormMountTime', () => {
  it('returns the same timestamp across re-renders', () => {
    const values: number[] = []
    const { rerender } = render(<Probe onValue={(v) => values.push(v)} />)
    rerender(<Probe onValue={(v) => values.push(v)} />)
    expect(values[0]).toBe(values[1])
  })
})
