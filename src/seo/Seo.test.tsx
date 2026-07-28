import { describe, expect, it } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { Seo } from './Seo'

describe('Seo', () => {
  it('sets the document title via Helmet', async () => {
    render(
      <HelmetProvider>
        <Seo title="WildFocus — Home" description="Descrizione di test" />
      </HelmetProvider>,
    )

    await waitFor(() => {
      expect(document.title).toBe('WildFocus — Home')
    })
  })
})
