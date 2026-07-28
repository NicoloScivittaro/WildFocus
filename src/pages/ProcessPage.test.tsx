import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import ProcessPage from './ProcessPage'
import { faqItems } from '@/data/faq'

function renderPage() {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <ProcessPage />
      </MemoryRouter>
    </HelmetProvider>,
  )
}

describe('ProcessPage', () => {
  it('renders all four process phases', () => {
    renderPage()
    ;['Scoperta', 'Ideazione', 'Produzione', 'Consegna'].forEach((phase) => {
      expect(screen.getByRole('heading', { name: phase })).toBeInTheDocument()
    })
  })

  it('renders every FAQ question', () => {
    renderPage()
    faqItems.forEach((item) => {
      expect(screen.getByRole('button', { name: item.question })).toBeInTheDocument()
    })
  })
})
