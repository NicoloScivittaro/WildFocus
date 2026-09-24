import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { services } from '@/data/services'
import { estimateQuote, quoteServiceRates, quoteZones } from '@/data/quote'

const currency = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

const percent = new Intl.NumberFormat('it-IT', {
  style: 'percent',
  maximumFractionDigits: 0,
})

/**
 * Preventivatore indicativo: l'utente sceglie uno o più servizi e la zona in
 * Italia, e vede subito una stima generica con lo sconto che cresce al
 * crescere dei servizi combinati. I numeri sono placeholder: il preventivo
 * vero resta su misura.
 */
export function QuoteEstimator() {
  const [selected, setSelected] = useState<string[]>([services[0].slug])
  const [zoneId, setZoneId] = useState(quoteZones[0].id)

  const estimate = useMemo(() => estimateQuote(selected, zoneId), [selected, zoneId])
  const zone = quoteZones.find((item) => item.id === zoneId) ?? quoteZones[0]

  function toggleService(slug: string) {
    setSelected((prev) => (prev.includes(slug) ? prev.filter((item) => item !== slug) : [...prev, slug]))
  }

  const contactParams = new URLSearchParams()
  if (selected.length > 0) contactParams.set('servizio', selected[0])
  if (selected.length > 1) contactParams.set('servizi', selected.join(','))
  contactParams.set('zona', zoneId)

  return (
    <section className="rounded-xl2 border border-ink/10 bg-surface px-6 py-10 md:px-10 md:py-12">
      <SectionTitle
        eyebrow="Preventivo"
        title="Calcola un preventivo indicativo"
        description="Scegli uno o più servizi e dove si svolge il progetto: vedi subito una stima generica. Più servizi combini, più alta è la percentuale di sconto."
      />

      <div className="mt-8 grid gap-6 md:grid-cols-[1.15fr,0.85fr]">
        <div>
          <fieldset>
            <legend className="text-sm font-semibold text-ink">Cosa devi fare</legend>
            <p className="mt-1 text-xs text-ink-muted">Puoi selezionare più di un servizio.</p>

            <div className="mt-4 grid gap-2">
              {services.map((service) => {
                const rate = quoteServiceRates[service.slug]
                const checked = selected.includes(service.slug)
                return (
                  <label
                    key={service.slug}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition-colors ${
                      checked ? 'border-accent-deep bg-base' : 'border-ink/10 bg-base hover:border-accent-deep/40'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleService(service.slug)}
                      className="mt-1"
                    />
                    <span className="flex-1">
                      <span className="block text-sm font-semibold text-ink">{service.title}</span>
                      {rate !== undefined && (
                        <span className="block text-xs text-ink-muted">a partire da {currency.format(rate)}</span>
                      )}
                    </span>
                  </label>
                )
              })}
            </div>
          </fieldset>

          <div className="mt-6">
            <label htmlFor="quote-zone" className="block text-sm font-semibold text-ink">
              Dove si svolge il progetto
            </label>
            <select
              id="quote-zone"
              value={zoneId}
              onChange={(event) => setZoneId(event.target.value)}
              className="mt-2 w-full rounded-lg border border-ink/10 bg-base px-3 py-2 text-ink"
            >
              {quoteZones.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-ink-muted">
              {zone.multiplier === 1
                ? 'Nessun adeguamento per trasferta e logistica.'
                : `Trasferta e logistica: +${percent.format(zone.multiplier - 1)}.`}
            </p>
          </div>
        </div>

        <div className="flex flex-col rounded-xl2 border border-ink/10 bg-base p-6">
          <h3 className="font-display text-lg text-ink">Riepilogo indicativo</h3>

          {estimate.serviceCount === 0 ? (
            <p className="mt-3 text-sm text-ink-muted">Seleziona almeno un servizio per vedere una stima.</p>
          ) : (
            <>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-ink-muted">
                    Servizi selezionati ({estimate.serviceCount})
                  </dt>
                  <dd className="text-ink">{currency.format(estimate.subtotal)}</dd>
                </div>

                {estimate.zoneAdjustment !== 0 && (
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-ink-muted">Adeguamento zona — {zone.label}</dt>
                    <dd className="text-ink">+{currency.format(estimate.zoneAdjustment)}</dd>
                  </div>
                )}

                {estimate.discountRate > 0 && (
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-accent-deep">Sconto combinazione</dt>
                    <dd className="text-accent-deep">
                      −{currency.format(estimate.discountAmount)} (−{percent.format(estimate.discountRate)})
                    </dd>
                  </div>
                )}
              </dl>

              <div className="mt-4 border-t border-ink/10 pt-4">
                <p className="text-xs uppercase tracking-wide text-ink-muted">Totale indicativo</p>
                <p className="mt-1 font-display text-3xl text-accent-deep">{currency.format(estimate.total)}</p>
                <p className="mt-1 text-xs text-ink-muted">a partire da, IVA esclusa</p>
              </div>

              {estimate.nextTier && (
                <p className="mt-4 rounded-lg bg-accent/20 px-3 py-2 text-xs text-ink">
                  Aggiungi un servizio e lo sconto sale al {percent.format(estimate.nextTier.rate)}.
                </p>
              )}
            </>
          )}

          <p className="mt-4 text-xs text-ink-muted">
            Stima generica e non vincolante: prezzi indicativi che non tengono conto di durata, complessità e numero di
            revisioni. Il preventivo definitivo viene sempre definito su misura.
          </p>

          <Link
            to={`/contatti?${contactParams.toString()}`}
            className="mt-6 block rounded-full bg-accent px-6 py-3 text-center text-sm font-semibold text-ink hover:opacity-90"
          >
            Richiedi il preventivo su misura
          </Link>
        </div>
      </div>
    </section>
  )
}
