import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { QuoteCategoryId } from '@/types/content'
import { SectionTitle } from '@/components/ui/SectionTitle'
import {
  estimateQuote,
  quoteCategories,
  quotePackagesByCategory,
  quoteServiceSlug,
  quoteTransfers,
} from '@/data/quote'

const currency = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

/**
 * Preventivatore a pacchetti: l'utente sceglie i pacchetti concreti e il
 * trasferimento. Il totale è la somma dei pacchetti più il trasferimento
 * fisso, applicato una sola volta e valido per andata e ritorno.
 */
export function QuoteEstimator() {
  const [categoryId, setCategoryId] = useState<QuoteCategoryId | null>(null)
  const [selectedPackages, setSelectedPackages] = useState<string[]>([])
  const [transferId, setTransferId] = useState(quoteTransfers[0].id)

  const estimate = useMemo(() => estimateQuote(selectedPackages, transferId), [selectedPackages, transferId])

  function togglePackage(packageId: string) {
    setSelectedPackages((prev) =>
      prev.includes(packageId) ? prev.filter((item) => item !== packageId) : [...prev, packageId],
    )
  }

  const hasSelection = estimate.packageCount > 0

  const contactParams = new URLSearchParams()
  if (hasSelection) {
    contactParams.set('pacchetti', selectedPackages.join(','))
    contactParams.set('trasferimento', transferId)
    contactParams.set('totale', String(estimate.total))
    const serviceSlug = quoteServiceSlug(selectedPackages)
    if (serviceSlug) contactParams.set('servizio', serviceSlug)
  }
  const contactHref = `/contatti?${contactParams.toString()}`

  return (
    <section className="rounded-xl2 border border-ink/10 bg-surface px-6 py-10 md:px-10 md:py-12">
      <SectionTitle
        eyebrow="Preventivo"
        title="Calcola un preventivo indicativo"
        description="Inizia dalla categoria, scegli i pacchetti e aggiungi l’eventuale trasferta."
      />

      <fieldset className="mt-8">
        <legend className="font-display text-lg text-ink">1. Scegli la categoria</legend>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {quoteCategories.map((category) => (
            <label
              key={category.id}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border bg-base p-4 transition-colors ${
                categoryId === category.id ? 'border-accent-deep' : 'border-ink/10 hover:border-accent-deep/40'
              }`}
            >
              <input
                type="radio"
                name="quote-category"
                value={category.id}
                checked={categoryId === category.id}
                onChange={() => {
                  setCategoryId(category.id)
                  setSelectedPackages([])
                  setTransferId(quoteTransfers[0].id)
                }}
                className="mt-1 accent-accent-deep"
              />
              <span>
                <span className="block font-semibold text-ink">{category.label}</span>
                <span className="mt-1 block text-xs text-ink-muted">{category.description}</span>
              </span>
            </label>
          ))}
        </div>
        <p className="mt-3 text-xs text-ink-muted">
          Cambiando categoria inizi un nuovo preventivo.
        </p>
      </fieldset>

      {categoryId !== null && (
      <div className="mt-8 grid items-start gap-6 md:grid-cols-[1.15fr,0.85fr]">
        <div>
          {quoteCategories.filter((category) => category.id === categoryId).map((category) => (
            <fieldset key={category.id} className="mt-8 first:mt-0">
              <legend className="font-display text-lg text-ink">2. Scegli i pacchetti — {category.label}</legend>
              <p className="mt-1 text-xs text-ink-muted">{category.description}</p>

              <div className="mt-3 grid gap-2">
                {quotePackagesByCategory(category.id).map((pkg) => {
                  const checked = selectedPackages.includes(pkg.id)
                  return (
                    <label
                      key={pkg.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition-colors ${
                        checked ? 'border-accent-deep bg-base' : 'border-ink/10 bg-base hover:border-accent-deep/40'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => togglePackage(pkg.id)}
                        className="mt-1"
                      />
                      <span className="flex-1">
                        <span className="flex items-baseline justify-between gap-3">
                          <span className="text-sm font-semibold text-ink">{pkg.name}</span>
                          <span className="shrink-0 text-sm text-accent-deep">{currency.format(pkg.price)}</span>
                        </span>
                        {pkg.priceNote && <span className="mt-0.5 block text-xs text-ink-muted">{pkg.priceNote}</span>}
                        {pkg.features.length > 0 && (
                          <ul className="mt-1 space-y-0.5 text-xs text-ink-muted">
                            {pkg.features.map((feature) => (
                              <li key={feature}>· {feature}</li>
                            ))}
                          </ul>
                        )}
                      </span>
                    </label>
                  )
                })}
              </div>
            </fieldset>
          ))}

          {hasSelection && (
          <fieldset className="mt-8">
            <legend className="text-sm font-semibold text-ink">3. Scegli la trasferta</legend>
            <p className="mt-1 text-xs text-ink-muted">
              Costo fisso per andata e ritorno, applicato una sola volta al totale.
            </p>

            <div className="mt-3 grid gap-2">
              {quoteTransfers.map((option) => {
                const checked = transferId === option.id
                return (
                  <label
                    key={option.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition-colors ${
                      checked ? 'border-accent-deep bg-base' : 'border-ink/10 bg-base hover:border-accent-deep/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="quote-transfer"
                      checked={checked}
                      onChange={() => setTransferId(option.id)}
                      className="mt-1"
                    />
                    <span className="flex-1">
                      <span className="flex items-baseline justify-between gap-3">
                        <span className="text-sm font-semibold text-ink">{option.label}</span>
                        <span className="shrink-0 text-sm text-accent-deep">
                          {option.price === 0 ? 'Incluso' : currency.format(option.price)}
                        </span>
                      </span>
                      <span className="mt-0.5 block text-xs text-ink-muted">{option.description}</span>
                    </span>
                  </label>
                )
              })}
            </div>
          </fieldset>
          )}
        </div>

        <div className="flex flex-col rounded-xl2 border border-ink/10 bg-base p-6">
          <h3 className="font-display text-lg text-ink">Riepilogo</h3>

          {!hasSelection ? (
            <p className="mt-3 text-sm text-ink-muted">Seleziona almeno un pacchetto per vedere il totale.</p>
          ) : (
            <>
              <dl className="mt-4 space-y-2 text-sm">
                {estimate.packages.map((line) => (
                  <div key={line.id} className="flex items-baseline justify-between gap-4">
                    <dt className="text-ink-muted">{line.name}</dt>
                    <dd className="text-ink">{currency.format(line.price)}</dd>
                  </div>
                ))}

                {estimate.transfer && estimate.transferPrice > 0 && (
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-ink-muted">Trasferimento — {estimate.transfer.label}</dt>
                    <dd className="text-ink">{currency.format(estimate.transferPrice)}</dd>
                  </div>
                )}
              </dl>

              <div className="mt-4 border-t border-ink/10 pt-4">
                <p className="text-xs uppercase tracking-wide text-ink-muted">Totale indicativo</p>
                <p className="mt-1 font-display text-3xl text-accent-deep">{currency.format(estimate.total)}</p>
                <p className="mt-1 text-xs text-ink-muted">IVA esclusa</p>
              </div>
            </>
          )}

          <p className="mt-4 text-xs text-ink-muted">
            Prezzi indicativi e non vincolanti: il preventivo definitivo viene confermato dopo il brief. I servizi su
            misura restano disponibili su richiesta.
          </p>

          {hasSelection ? (
            <Link
              to={contactHref}
              className="mt-6 block rounded-full bg-accent px-6 py-3 text-center text-sm font-semibold text-ink hover:opacity-90"
            >
              Richiedi il preventivo su misura
            </Link>
          ) : (
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="mt-6 block w-full cursor-not-allowed rounded-full bg-accent px-6 py-3 text-center text-sm font-semibold text-ink opacity-40"
            >
              Richiedi il preventivo su misura
            </button>
          )}
        </div>
      </div>
      )}
    </section>
  )
}
