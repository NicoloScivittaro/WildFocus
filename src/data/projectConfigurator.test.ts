import { describe, expect, it } from 'vitest'
import {
  briefToContactFields,
  buildProjectDescription,
  optionLabel,
  projectGoals,
  projectKinds,
} from './projectConfigurator'
import type { ProjectBrief } from '@/types/contact'

const baseBrief: ProjectBrief = {
  kind: 'video',
  goal: 'launch',
  budget: undefined,
  deadline: '',
  references: '',
}

describe('configurator options', () => {
  it('offers exactly the five ways to start, including something weird', () => {
    expect(projectKinds.map((option) => option.label)).toEqual([
      'Video',
      'Music',
      'Sound',
      'Website',
      'Something weird',
    ])
  })

  it('offers the five goals', () => {
    expect(projectGoals.map((option) => option.label)).toEqual([
      'Launch',
      'Sell',
      'Tell a story',
      'Build a brand',
      "I don't know yet",
    ])
  })

  it('gives every option a hint, so no card is bare', () => {
    const everyOption = [...projectKinds, ...projectGoals]

    everyOption.forEach((option) => {
      expect(option.hint.length).toBeGreaterThan(0)
    })
  })
})

describe('optionLabel', () => {
  it('falls back to the raw id when the option is unknown', () => {
    expect(optionLabel(projectKinds, 'non-esiste')).toBe('non-esiste')
  })
})

describe('buildProjectDescription', () => {
  it('summarises what is being made and why', () => {
    const description = buildProjectDescription(baseBrief)

    expect(description).toContain('Cosa: Video')
    expect(description).toContain('Obiettivo: Launch')
  })

  it('adds budget and deadline when the user provides them', () => {
    const description = buildProjectDescription({
      ...baseBrief,
      budget: '1.000-2.500€',
      deadline: 'mid-September',
    })

    expect(description).toContain('Budget: €1,000 – 2,500')
    expect(description).toContain('Deadline: mid-September')
  })
})

describe('briefToContactFields', () => {
  it('maps what is being made to the matching service', () => {
    expect(briefToContactFields({ ...baseBrief, kind: 'sound' }).service).toBe('sound-design')
    expect(briefToContactFields({ ...baseBrief, kind: 'music' }).service).toBe('produzione-musicale')
  })

  it('keeps a kind with no matching service as it is', () => {
    expect(briefToContactFields({ ...baseBrief, kind: 'something-weird' }).service).toBe('something-weird')
  })

  it('always sends a defined timeline', () => {
    expect(briefToContactFields(baseBrief).timeline).toBe('Da definire')
    expect(briefToContactFields({ ...baseBrief, deadline: ' mid-September ' }).timeline).toBe('mid-September')
  })

  it('passes references through as a materials link, ignoring blanks', () => {
    expect(briefToContactFields({ ...baseBrief, references: 'https://moodboard' }).materialsLink).toBe(
      'https://moodboard',
    )
    expect(briefToContactFields({ ...baseBrief, references: '   ' }).materialsLink).toBeUndefined()
  })
})
