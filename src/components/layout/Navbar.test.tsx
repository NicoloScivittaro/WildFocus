import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { Navbar } from './Navbar'
import { siteConfig } from '@/data/siteConfig'

describe('Navbar', () => {
  it('toggles the mobile menu when the hamburger button is clicked', async () => {
    const user = userEvent.setup()
    render(<Navbar />, { wrapper: MemoryRouter })

    expect(screen.queryByLabelText('Navigazione mobile')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /apri il menu/i }))
    expect(screen.getByLabelText('Navigazione mobile')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /chiudi il menu/i }))
    expect(screen.queryByLabelText('Navigazione mobile')).not.toBeInTheDocument()
  })

  it('points the primary CTA at the project configurator', () => {
    render(<Navbar />, { wrapper: MemoryRouter })

    expect(screen.getAllByText(siteConfig.primaryCta).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: siteConfig.primaryCta })[0]).toHaveAttribute(
      'href',
      siteConfig.startProjectPath,
    )
  })
})
