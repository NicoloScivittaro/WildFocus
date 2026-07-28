import { useEffect, useState } from 'react'

const STORAGE_KEY = 'wildfocus-cookie-consent'

type ConsentValue = 'accepted' | 'rejected'

export function CookieConsent() {
  const [consent, setConsent] = useState<ConsentValue | null>(null)

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'accepted' || stored === 'rejected') {
      setConsent(stored)
    }
  }, [])

  function respond(value: ConsentValue) {
    window.localStorage.setItem(STORAGE_KEY, value)
    setConsent(value)
  }

  if (consent) return null

  return (
    <div
      role="dialog"
      aria-label="Preferenze cookie"
      className="fixed inset-x-4 bottom-4 z-50 rounded-xl2 border border-ink/10 bg-surface p-4 text-sm text-ink-muted md:inset-x-auto md:right-4 md:max-w-sm"
    >
      <p>
        Questo componente è predisposto per un futuro strumento di analytics, non ancora collegato. Al momento il
        sito non utilizza cookie di profilazione.
      </p>
      <div className="mt-3 flex justify-end gap-2">
        <button type="button" onClick={() => respond('rejected')} className="rounded-full border border-ink/20 px-4 py-2 text-ink">
          Rifiuta
        </button>
        <button type="button" onClick={() => respond('accepted')} className="rounded-full bg-accent px-4 py-2 font-semibold text-ink">
          Accetta
        </button>
      </div>
    </div>
  )
}
