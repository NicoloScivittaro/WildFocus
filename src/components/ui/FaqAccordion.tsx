import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import type { FaqItem } from '@/types/content'
import { EASE_FOCUS } from '@/lib/motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

interface FaqAccordionProps {
  items: FaqItem[]
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <div className="divide-y divide-ink/10 rounded-xl2 border border-ink/10 bg-surface">
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
                className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-ink transition-colors duration-300 hover:bg-base/60"
              >
                <span className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5">
                  {item.question}
                </span>
                <ChevronDown
                  className={`shrink-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isOpen ? 'rotate-180 text-accent-deep' : 'text-ink-muted group-hover:translate-y-0.5'
                  }`}
                  aria-hidden="true"
                />
              </button>
            </h3>

            {isOpen &&
              (prefersReducedMotion ? (
                <div id={panelId} role="region" aria-labelledby={buttonId} className="px-5 pb-4 text-sm text-ink-muted">
                  {item.answer}
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  <motion.div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.36, ease: EASE_FOCUS }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-4 text-sm text-ink-muted">{item.answer}</div>
                  </motion.div>
                </AnimatePresence>
              ))}
          </div>
        )
      })}
    </div>
  )
}
