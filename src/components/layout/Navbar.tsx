import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { siteConfig } from '@/data/siteConfig'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-base/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <NavLink to="/" className="font-display text-lg text-ink" onClick={() => setIsOpen(false)}>
          WildFocus
        </NavLink>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Navigazione principale">
          {siteConfig.nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `text-sm transition-colors ${isActive ? 'text-accent' : 'text-ink-muted hover:text-ink'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink
            to="/contatti"
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-ink hover:opacity-90"
          >
            {siteConfig.primaryCta}
          </NavLink>
        </nav>

        <button
          type="button"
          className="md:hidden"
          aria-label={isOpen ? 'Chiudi il menu' : 'Apri il menu'}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <X className="text-ink" /> : <Menu className="text-ink" />}
        </button>
      </div>

      {isOpen && (
        <nav className="border-t border-ink/10 px-4 py-4 md:hidden" aria-label="Navigazione mobile">
          <ul className="flex flex-col gap-4">
            {siteConfig.nav.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.to === '/'} className="text-ink" onClick={() => setIsOpen(false)}>
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li>
              <NavLink
                to="/contatti"
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
