import type { TeamMemberData } from '@/types/content'
import { siteConfig } from '@/data/siteConfig'

function socialUrl(platform: string): string {
  return siteConfig.socials.find((social) => social.platform === platform)?.url ?? ''
}

export const team: TeamMemberData[] = [
  {
    name: '[NOME MEMBRO TEAM]',
    role: 'Video Editor & Founder',
    bio: 'Cura il ritmo e la struttura narrativa di ogni progetto, dal primo taglio alla consegna finale.',
    skills: ['Montaggio narrativo', 'Color grading', 'Motion graphics'],
    socials: [{ platform: 'Instagram', url: socialUrl('Instagram') }],
  },
  {
    name: '[NOME MEMBRO TEAM]',
    role: 'Fotografo',
    bio: 'Costruisce set fotografici coerenti per brand e prodotti, dallo studio al backstage.',
    skills: ['Fotografia prodotto', 'Ritrattistica', 'Post-produzione fotografica'],
    socials: [{ platform: 'Instagram', url: socialUrl('Instagram') }],
  },
  {
    name: '[NOME MEMBRO TEAM]',
    role: 'Social Media Content Creator',
    bio: 'Adatta ogni contenuto al formato e al ritmo giusto per ogni piattaforma social.',
    skills: ['Content strategy', 'Reel e Shorts', 'Copywriting social'],
    socials: [{ platform: 'TikTok', url: socialUrl('TikTok') }],
  },
]
