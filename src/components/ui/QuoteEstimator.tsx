import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { QuoteCategoryId } from '@/types/content'
import { SectionTitle } from '@/components/ui/SectionTitle'
import {
  estimateQuote,
  quoteMacroCategories,
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
  const [selectedMacroId, setSelectedMacroId] = useState<string | null>(null)
  const [selectedPackages, setSelectedPackages] = useState<string[]>([])
  const [transferId, setTransferId] = useState(quoteTransfers[0].id)

  const estimate = useMemo(() => estimateQuote(selectedPackages, transferId), [selectedPackages, transferId])

  function selectPackage(packageId: string, categoryId: QuoteCategoryId) {
    setSelectedPackages((prev) => {
      const packageIdsInCategory = quotePackagesByCategory(categoryId).map((p) => p.id)
      const filtered = prev.filter((id) => !packageIdsInCategory.includes(id))
      return filtered.includes(packageId) ? filtered.filter((id) => id !== packageId) : [...filtered, packageId]
    })
  }

  const hasSelection = estimate.packageCount > 0
  const categoriesInMacro = selectedMacroId
    ? quoteCategories.filter((c) => c.parentId === selectedMacroId)
    : []

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
        description="Scegli i pacchetti che ti servono da una o più categorie e aggiungi l'eventuale trasferta."
      />

      <div className="mt-8 grid items-start gap-6 md:grid-cols-[1.15fr,0.85fr]">
        <div>
          {/* Macrocategorie */}
          <fieldset className="mt-8 first:mt-0">
            <legend className="font-display text-lg text-ink">Categoria</legend>

            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {quoteMacroCategories.map((macro) => (
                <label
                  key={macro.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition-colors ${
                    selectedMacroId === macro.id
                      ? 'border-accent-deep bg-base'
                      : 'border-ink/10 bg-base hover:border-accent-deep/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="quote-macro"
                    value={macro.id}
                    checked={selectedMacroId === macro.id}
                    onChange={() => setSelectedMacroId(macro.id)}
                    className="mt-1"
                  />
                  <span className="text-sm font-semibold text-ink">{macro.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Sottocategorie e pacchetti */}
          {selectedMacroId && categoriesInMacro.length > 0 && (
            <>
              {categoriesInMacro.map((category) => (
                <fieldset key={category.id} className="mt-8">
                  <legend className="font-display text-lg text-ink">{category.label}</legend>
                  {category.description && (
                    <p className="mt-1 text-xs text-ink-muted">{category.description}</p>
                  )}

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
                            type="radio"
                            name={`quote-category-${category.id}`}
                            value={pkg.id}
                            checked={checked}
                            onChange={() => selectPackage(pkg.id, category.id)}
                            className="mt-1"
                          />
                          <span className="flex-1">
                            <span className="flex items-baseline justify-between gap-3">
                              <span className="text-sm font-semibold text-ink">{pkg.name}</span>
                              <span className="shrink-0 text-sm text-accent-deep">{currency.format(pkg.price)}</span>
                            </span>
                            {pkg.priceNote && (
                              <span className="mt-0.5 block text-xs text-ink-muted">{pkg.priceNote}</span>
                            )}
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

              {/* Trasferta */}
              {hasSelection && (
                <fieldset className="mt-8">
                  <legend className="text-sm font-semibold text-ink">Trasferta</legend>
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
                                {option.id === 'oltre-50-km'
                                  ? 'Da stipulare'
                                  : option.price === 0
                                    ? 'Incluso'
                                    : currency.format(option.price)}
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
            </>
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
    </section>
  )
}
