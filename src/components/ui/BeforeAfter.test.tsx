import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { BeforeAfter } from './BeforeAfter'
import type { ProjectBeforeAfter } from '@/types/content'

const data: ProjectBeforeAfter = {
  before: 'materiale grezzo',
  after: 'versione finale',
  note: 'Nota di lavorazione',
}

describe('BeforeAfter', () => {
  it('starts with the slider at the midpoint', () => {
    render(<BeforeAfter data={data} />)
    const slider = screen.getByLabelText('Trascina per confrontare prima e dopo') as HTMLInputElement
    expect(slider.value).toBe('50')
  })

  it('updates the reveal amount when the slider moves', () => {
    render(<BeforeAfter data={data} />)
    const slider = screen.getByLabelText('Trascina per confrontare prima e dopo') as HTMLInputElement
    fireEvent.change(slider, { target: { value: '80' } })
    expect(slider.value).toBe('80')
  })
})
