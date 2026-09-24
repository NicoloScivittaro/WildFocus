import { useEffect, useState } from 'react'

/**
 * True only for devices with a real hovering pointer (mouse/trackpad).
 * Everything pointer-driven — custom cursor, magnetic hover, scroll-velocity
 * skew — is gated behind this so touch devices stay light and fast.
 */
export function usePointerFine(): boolean {
  const query = '(hover: hover) and (pointer: fine)'
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    const handleChange = () => setMatches(mediaQuery.matches)

    setMatches(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return matches
}
