import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { siteConfig } from '@/data/siteConfig'
import { Logo } from '@/components/ui/Logo'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

/**
 * The navbar gets out of the way while you read and comes back the moment you
 * scroll up. Direction is sampled inside a rAF tick so the scroll handler
 * never does layout work on the critical path.
 */
export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    let lastY = window.scrollY
    let ticking = false

    const update = () => {
      const y = window.scrollY
      setIsScrolled(y > 12)

      if (Math.abs(y - lastY) > 6) {
        setIsHidden(y > lastY && y > 140)
        lastY = y
      }

      ticking = false
    }

    const handleScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const shouldHide = isHidden && !isOpen && !prefersReducedMotion

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-base/80 backdrop-blur transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        shouldHide ? '-translate-y-full' : 'translate-y-0'
      } ${isScrolled ? 'border-ink/10 shadow-[0_1px_24px_rgba(35,32,26,0.07)]' : 'border-transparent'}`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between px-4 transition-[padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isScrolled ? 'py-2' : 'py-3'
        }`}
      >
        <NavLink to="/" onClick={() => setIsOpen(false)} className="transition-transform duration-300 hover:-translate-y-px">
          <Logo />
        </NavLink>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Navigazione principale">
          {siteConfig.nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `link-underline text-sm transition-colors ${isActive ? 'text-accent-deep' : 'text-ink-muted hover:text-ink'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink
            to={siteConfig.startProjectPath}
            data-cursor="GO →"
            className="group relative overflow-hidden rounded-full bg-accent px-4 py-2 text-sm font-semibold text-ink"
          >
            <span className="absolute inset-0 -translate-x-full bg-accent-deep transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0" />
            <span className="relative transition-colors duration-500 group-hover:text-base">{siteConfig.primaryCta}</span>
          </NavLink>
        </nav>

        <button
          type="button"
          className="relative flex h-9 w-9 flex-col items-center justify-center gap-[5px] md:hidden"
          aria-label={isOpen ? 'Chiudi il menu' : 'Apri il menu'}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span
            className={`block h-px w-6 bg-ink transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isOpen ? 'translate-y-[3px] rotate-45' : ''
            }`}
          />
          <span
            className={`block h-px w-6 bg-ink transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isOpen ? '-translate-y-[3px] -rotate-45' : ''
            }`}
          />
        </button>
      </div>

      {isOpen && (
        <nav className="menu-reveal border-t border-ink/10 px-4 py-4 md:hidden" aria-label="Navigazione mobile">
          <ul className="flex flex-col gap-4">
            {siteConfig.nav.map((item, index) => (
              <li key={item.to} className="menu-reveal" style={{ animationDelay: `${60 + index * 40}ms` }}>
                <NavLink to={item.to} end={item.to === '/'} className="text-ink" onClick={() => setIsOpen(false)}>
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li className="menu-reveal" style={{ animationDelay: `${60 + siteConfig.nav.length * 40}ms` }}>
              <NavLink
                to={siteConfig.startProjectPath}
                className="inline-block rounded-full bg-accent px-4 py-2 text-sm font-semibold text-ink"
                onClick={() => setIsOpen(false)}
              >
                {siteConfig.primaryCta}
              </NavLink>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
