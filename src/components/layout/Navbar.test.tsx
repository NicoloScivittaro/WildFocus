import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { Navbar } from './Navbar'

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

  it('shows the primary CTA label from siteConfig', () => {
    render(<Navbar />, { wrapper: MemoryRouter })
    expect(screen.getAllByText('Parliamo del tuo progetto').length).toBeGreaterThan(0)
  })
})
