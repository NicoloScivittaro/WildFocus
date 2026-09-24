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
  city: '[CITTÀ]',
  responseTime: '[TEMPO REALE]',
  email: '[EMAIL WILDFOCUS]',
  whatsappNumber: '[NUMERO WHATSAPP]',
  whatsappLink: 'https://wa.me/[NUMERO WHATSAPP]',
  socials: [
    { platform: 'Instagram', url: '[LINK INSTAGRAM]' },
    { platform: 'TikTok', url: '[LINK TIKTOK]' },
    { platform: 'YouTube', url: '[LINK YOUTUBE]' },
    { platform: 'LinkedIn', url: '[LINK LINKEDIN]' },
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
    areaServed: '[CITTÀ]',
    email: '[EMAIL WILDFOCUS]',
    sameAs: ['[LINK INSTAGRAM]', '[LINK TIKTOK]', '[LINK YOUTUBE]', '[LINK LINKEDIN]'],
  },
} as const

export type SiteConfig = typeof siteConfig
