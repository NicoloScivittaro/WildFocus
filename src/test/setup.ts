import '@testing-library/jest-dom/vitest'

if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia
}

if (typeof window !== 'undefined' && !('IntersectionObserver' in window)) {
  class IntersectionObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return []
    }
  }

  // @ts-expect-error jsdom lacks IntersectionObserver; minimal stub so Framer Motion's viewport features don't throw
  window.IntersectionObserver = IntersectionObserverStub
  // @ts-expect-error some libraries read the global rather than window
  global.IntersectionObserver = IntersectionObserverStub
}
