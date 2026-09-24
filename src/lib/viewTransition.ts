type DocumentWithViewTransition = Document & {
  startViewTransition?: (callback: () => void) => unknown
}

export function supportsViewTransitions(): boolean {
  return typeof document !== 'undefined' && typeof (document as DocumentWithViewTransition).startViewTransition === 'function'
}

/**
 * Progressive enhancement for continuity between pages.
 *
 * When the View Transitions API is available we hand the route change to the
 * browser, which morphs elements that share a `view-transition-name` — the
 * clicked project thumbnail grows into the case-study hero instead of the
 * page simply being replaced.
 *
 * Returns `true` when the transition took ownership of the navigation, so the
 * caller knows to call `preventDefault()`. Everywhere else this is a no-op and
 * the normal `<Link>` navigation happens untouched.
 */
export function startViewTransition(update: () => void): boolean {
  if (!supportsViewTransitions()) return false

  ;(document as DocumentWithViewTransition).startViewTransition?.(update)
  return true
}
