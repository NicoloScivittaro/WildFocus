import type { NavItem } from '@/types/content'

const nav: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Servizi', to: '/servizi' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Chi siamo', to: '/chi-siamo' },
  { label: 'Processo', to: '/processo' },
  { label: 'Collaborazioni', to: '/collaborazioni' },
  { label: 'Contatti', to: '/contatti' },
]

export const siteConfig = {
  name: 'WildFocus',
  positioning:
    'Video e contenuti visivi per aziende, creator e attività che vogliono aumentare attenzione, autorevolezza e conversioni.',
  primaryCta: 'Start a project →',
  startProjectPath: '/progetto',
  secondaryCta: 'Richiedi un preventivo',
  responseTime: 'entro 24h',
  email: 'Wildfocus.editing@gmail.com',
  whatsappNumber: '+39 351 908 9064',
  whatsappLink: 'https://wa.me/393519089064',
  socials: [
    {
      platform: 'Instagram',
      url: 'https://www.instagram.com/wildfocus.editing?stkn=MXQ4aDhhejZwN2VrMg%3D%3D&utm_source=qr',
    },
    { platform: 'TikTok', url: 'https://www.tiktok.com/@wildfocus.editing' },
  ],
  nav,
  trustStats: [
    { label: 'Progetti completati', value: '[XX]+' },
    { label: 'Clienti soddisfatti', value: '[XX]' },
    { label: 'Risposta media', value: 'Entro [XX] ore' },
  ],
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'WildFocus',
    description:
      'Video e contenuti visivi per aziende, creator e attività che vogliono aumentare attenzione, autorevolezza e conversioni.',
    email: 'Wildfocus.editing@gmail.com',
    sameAs: [
      'https://www.instagram.com/wildfocus.editing?stkn=MXQ4aDhhejZwN2VrMg%3D%3D&utm_source=qr',
      'https://www.tiktok.com/@wildfocus.editing',
    ],
  },
} as const

export type SiteConfig = typeof siteConfig
