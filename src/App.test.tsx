import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import { siteConfig } from '@/data/siteConfig'

function renderApp(initialPath: string) {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[initialPath]}>
        <App />
      </MemoryRouter>
    </HelmetProvider>,
  )
}

describe('App routing', () => {
  it('renders the Navbar brand link on every route', () => {
    renderApp('/')
    expect(screen.getByRole('link', { name: 'WildFocus' })).toHaveAttribute('href', '/')
  })

  it('renders the Home hero heading at the root route', async () => {
    renderApp('/')
    expect(
      await screen.findByRole('heading', { level: 1 }, { timeout: 5000 }),
    ).toHaveTextContent(/contenuti che catturano l'attenzione/i)
  })

  it('renders the 404 page for an unknown route', async () => {
    renderApp('/questa-pagina-non-esiste')
    expect(await screen.findByText('Pagina non trovata', {}, { timeout: 5000 })).toBeInTheDocument()
  })

  it(
    'does not 404 for any navbar link',
    async () => {
      for (const item of siteConfig.nav) {
        const { unmount } = renderApp(item.to)
        expect(await screen.findByRole('link', { name: 'WildFocus' }, { timeout: 5000 })).toBeInTheDocument()
        expect(screen.queryByText('Pagina non trovata')).not.toBeInTheDocument()
        unmount()
      }
    },
    20000,
  )
})
