import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TeamMember } from './TeamMember'
import type { TeamMemberData } from '@/types/content'

const member: TeamMemberData = {
  name: '[NOME MEMBRO TEAM]',
  role: 'Video Editor',
  bio: 'Bio del membro del team.',
  skills: ['Montaggio'],
  socials: [{ platform: 'Instagram', url: '[LINK INSTAGRAM]' }],
}

describe('TeamMember', () => {
  it('renders a labelled social link when socials are provided', () => {
    render(<TeamMember member={member} />)
    expect(screen.getByRole('link', { name: '[NOME MEMBRO TEAM] su Instagram' })).toHaveAttribute(
      'href',
      '[LINK INSTAGRAM]',
    )
  })

  it('falls back to a placeholder icon when no photo is provided', () => {
    render(<TeamMember member={member} />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })
})
