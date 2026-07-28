import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactForm } from './ContactForm'

describe('ContactForm', () => {
  it('keeps "Continua" disabled until step 1 is valid', () => {
    render(<ContactForm />)
    expect(screen.getByRole('button', { name: 'Continua' })).toBeDisabled()
  })

  it('renders a honeypot field hidden from keyboard/screen-reader users', () => {
    render(<ContactForm />)
    const honeypot = screen.getByLabelText('Non compilare questo campo')
    expect(honeypot).toHaveAttribute('tabIndex', '-1')
  })

  it('completes the 3-step flow and shows the confirmation message', async () => {
    const startTime = 1_700_000_000_000
    const dateNowSpy = vi.spyOn(Date, 'now').mockReturnValue(startTime)
    const user = userEvent.setup()

    render(<ContactForm />)

    await user.type(screen.getByLabelText('Nome e cognome'), 'Mario Rossi')
    await user.type(screen.getByLabelText('Email'), 'mario@example.com')
    await user.selectOptions(screen.getByLabelText('Servizio richiesto'), 'video-editing')
    await user.click(screen.getByRole('button', { name: 'Continua' }))

    await user.type(screen.getByLabelText('Descrizione del progetto'), 'Ho bisogno di un video promozionale.')
    await user.type(screen.getByLabelText('Tempistiche'), 'Entro un mese')
    await user.click(screen.getByRole('button', { name: 'Continua' }))

    await user.click(screen.getByLabelText(/ho letto e accetto/i))

    // Jump the clock forward past the anti-spam minimum-delay threshold
    // without touching setTimeout, so userEvent's own internal timing is untouched.
    dateNowSpy.mockReturnValue(startTime + 4000)

    await user.click(screen.getByRole('button', { name: 'Richiedi un preventivo' }))

    expect(await screen.findByRole('status')).toHaveTextContent('Richiesta inviata')

    dateNowSpy.mockRestore()
  })
})
