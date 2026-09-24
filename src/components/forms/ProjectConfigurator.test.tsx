import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProjectConfigurator } from './ProjectConfigurator'

type User = ReturnType<typeof userEvent.setup>

async function answerFirstTwoSteps(user: User) {
  await user.click(screen.getByRole('radio', { name: /^Video/ }))
  await user.click(screen.getByRole('button', { name: 'Continue' }))
  await user.click(screen.getByRole('radio', { name: /^Launch/ }))
  await user.click(screen.getByRole('button', { name: 'Continue' }))
}

describe('ProjectConfigurator', () => {
  it('opens on "What are we making?" with every option and a blocked Continue', () => {
    render(<ProjectConfigurator />)

    expect(screen.getByText('What are we making?')).toBeInTheDocument()
    expect(screen.getByText('Step 1 of 4')).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /^Something weird/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled()
  })

  it('asks for the goal once something is chosen', async () => {
    const user = userEvent.setup()
    render(<ProjectConfigurator />)

    await user.click(screen.getByRole('radio', { name: /^Music/ }))
    expect(screen.getByRole('button', { name: 'Continue' })).toBeEnabled()

    await user.click(screen.getByRole('button', { name: 'Continue' }))

    expect(screen.getByText("What's the goal?")).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /^I don't know yet/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled()
  })

  it('lets the user go back and change an answer', async () => {
    const user = userEvent.setup()
    render(<ProjectConfigurator />)

    await user.click(screen.getByRole('radio', { name: /^Music/ }))
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    await user.click(screen.getByRole('button', { name: 'Back' }))

    expect(screen.getByText('What are we making?')).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /^Music/ })).toBeChecked()
  })

  it('does not force budget, deadline or references', async () => {
    const user = userEvent.setup()
    render(<ProjectConfigurator />)

    await answerFirstTwoSteps(user)

    expect(screen.getByText('Give us the shape of it.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Continue' })).toBeEnabled()
  })

  it('closes on the contact step and confirms the brief', async () => {
    const startTime = 1_700_000_000_000
    const dateNowSpy = vi.spyOn(Date, 'now').mockReturnValue(startTime)
    const user = userEvent.setup()

    render(<ProjectConfigurator />)

    await answerFirstTwoSteps(user)

    await user.selectOptions(screen.getByLabelText('Indicative budget'), '1.000-2.500€')
    await user.type(screen.getByLabelText('Deadline'), 'mid-September')
    await user.type(screen.getByLabelText('References'), 'https://moodboard.example')
    await user.click(screen.getByRole('button', { name: 'Continue' }))

    expect(screen.getByText('Sounds like a WildFocus project.')).toBeInTheDocument()
    expect(screen.getByText('Tell us where to reach you.')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Name'), 'Mario Rossi')
    await user.type(screen.getByLabelText('Email'), 'mario@example.com')
    await user.click(screen.getByLabelText(/ho letto e accetto/i))

    // Jump past the anti-spam minimum-delay threshold without touching setTimeout.
    dateNowSpy.mockReturnValue(startTime + 4000)

    await user.click(screen.getByRole('button', { name: /send it/i }))

    expect(await screen.findByRole('status')).toHaveTextContent('Sounds like a WildFocus project.')

    dateNowSpy.mockRestore()
  })

  it('keeps a honeypot field hidden from keyboard and screen-reader users', () => {
    render(<ProjectConfigurator />)

    expect(screen.getByLabelText('Non compilare questo campo')).toHaveAttribute('tabIndex', '-1')
  })
})
