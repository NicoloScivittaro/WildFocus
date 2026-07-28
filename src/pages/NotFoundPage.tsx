import { Link } from 'react-router-dom'
import { Seo } from '@/seo/Seo'

export default function NotFoundPage() {
  return (
    <>
      <Seo title="Pagina non trovata — WildFocus" description="La pagina che cerchi non esiste o è stata spostata." />
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="font-display text-6xl text-accent">404</p>
        <h1 className="mt-4 font-display text-2xl text-ink">Pagina non trovata</h1>
        <p className="mt-3 text-ink-muted">La pagina che cerchi non esiste o è stata spostata.</p>
        <Link
          to="/"
          className="mt-8 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-base hover:opacity-90"
        >
          Torna alla Home
        </Link>
      </div>
    </>
  )
}
