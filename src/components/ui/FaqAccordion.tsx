import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { FaqItem } from '@/types/content'

interface FaqAccordionProps {
  items: FaqItem[]
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="divide-y divide-white/10 rounded-xl2 border border-white/10 bg-surface">
      {items.map((item, index) => {
        const isOpen = openIndex === index
        const panelId = `faq-panel-${index}`
        const buttonId = `faq-button-${index}`

        return (
          <div key={item.question}>
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between px-5 py-4 text-left text-ink"
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={`transition-transform ${isOpen ? 'rotate-180 text-accent' : 'text-ink-muted'}`}
                  aria-hidden="true"
                />
              </button>
            </h3>
            {isOpen && (
              <div id={panelId} role="region" aria-labelledby={buttonId} className="px-5 pb-4 text-sm text-ink-muted">
                {item.answer}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
