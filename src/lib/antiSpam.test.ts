import { describe, expect, it } from 'vitest'
import { hasElapsedMinimumTime, isHoneypotFilled, sanitizeInput } from './antiSpam'

describe('isHoneypotFilled', () => {
  it('returns false for an empty honeypot', () => {
    expect(isHoneypotFilled('')).toBe(false)
  })

  it('returns true when the honeypot has been filled by a bot', () => {
    expect(isHoneypotFilled('http://spam.example')).toBe(true)
  })
})

describe('hasElapsedMinimumTime', () => {
  it('returns false when submitted before the minimum delay', () => {
    expect(hasElapsedMinimumTime(1000, 2000, 3000)).toBe(false)
  })

  it('returns true when submitted after the minimum delay', () => {
    expect(hasElapsedMinimumTime(1000, 4500, 3000)).toBe(true)
  })
})

describe('sanitizeInput', () => {
  it('trims whitespace and strips HTML tags', () => {
    expect(sanitizeInput('  <script>alert(1)</script>Ciao  ')).toBe('alert(1)Ciao')
  })
})
