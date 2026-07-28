import { User } from 'lucide-react'
import type { TeamMemberData } from '@/types/content'

interface TeamMemberProps {
  member: TeamMemberData
}

export function TeamMember({ member }: TeamMemberProps) {
  return (
    <article className="rounded-xl2 border border-white/10 bg-surface p-6 text-center">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-base text-ink-muted">
        {member.photo ? (
          <img src={member.photo} alt={member.name} className="h-24 w-24 rounded-full object-cover" />
        ) : (
          <User aria-hidden="true" />
        )}
      </div>
      <h3 className="mt-4 font-display text-lg text-ink">{member.name}</h3>
      <p className="text-sm text-accent">{member.role}</p>
      <p className="mt-3 text-sm text-ink-muted">{member.bio}</p>
      <ul className="mt-3 flex flex-wrap justify-center gap-2 text-xs text-ink-muted">
        {member.skills.map((skill) => (
          <li key={skill} className="rounded-full border border-white/10 px-2 py-1">
            {skill}
          </li>
        ))}
      </ul>
      {member.socials && member.socials.length > 0 && (
        <div className="mt-3 flex justify-center gap-3 text-sm text-ink-muted">
          {member.socials.map((social) => (
            <a
              key={social.platform}
              href={social.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`${member.name} su ${social.platform}`}
              className="hover:text-ink"
            >
              {social.platform}
            </a>
          ))}
        </div>
      )}
    </article>
  )
}
