import { describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useContactFormState } from './useContactFormState'

describe('useContactFormState', () => {
  it('does not advance to step 2 while step 1 is invalid', () => {
    const { result } = renderHook(() => useContactFormState())

    act(() => result.current.goNext())
    expect(result.current.step).toBe(1)
  })

  it('advances to step 2 once name, email and service are filled', () => {
    const { result } = renderHook(() => useContactFormState())

    act(() => {
      result.current.updateField('fullName', 'Mario Rossi')
      result.current.updateField('email', 'mario@example.com')
      result.current.updateField('service', 'video-editing')
    })
    act(() => result.current.goNext())

    expect(result.current.step).toBe(2)
  })

  it('goBack moves from step 2 to step 1', () => {
    const { result } = renderHook(() => useContactFormState())
    act(() => {
      result.current.updateField('fullName', 'Mario Rossi')
      result.current.updateField('email', 'mario@example.com')
      result.current.updateField('service', 'video-editing')
    })
    act(() => result.current.goNext())
    expect(result.current.step).toBe(2)

    act(() => result.current.goBack())
    expect(result.current.step).toBe(1)
  })

  it('step 1 starts invalid until the required fields are filled', () => {
    const { result } = renderHook(() => useContactFormState())
    expect(result.current.isStepValid).toBe(false)

    act(() => {
      result.current.updateField('fullName', 'Mario Rossi')
      result.current.updateField('email', 'mario@example.com')
      result.current.updateField('service', 'video-editing')
    })
    expect(result.current.isStepValid).toBe(true)
  })
})
