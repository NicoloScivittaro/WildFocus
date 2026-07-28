import { Link } from 'react-router-dom'
import { siteConfig } from '@/data/siteConfig'

export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-base">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <p className="font-display text-lg text-ink">WildFocus</p>
          <p className="mt-2 text-sm text-ink-muted">{siteConfig.positioning}</p>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink">Naviga</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-muted">
            {siteConfig.nav.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink">Contatti</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-muted">
            <li>{siteConfig.email}</li>
            <li>{siteConfig.city}</li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink">Social</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-muted">
            {siteConfig.socials.map((social) => (
              <li key={social.platform}>
                <a href={social.url} target="_blank" rel="noreferrer" className="hover:text-ink">
                  {social.platform}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-ink/10 px-4 py-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 text-xs text-ink-muted md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} WildFocus. Tutti i diritti riservati.</p>
          <div className="flex gap-4">
            <Link to="/privacy-policy" className="hover:text-ink">
              Privacy Policy
            </Link>
            <Link to="/cookie-policy" className="hover:text-ink">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
