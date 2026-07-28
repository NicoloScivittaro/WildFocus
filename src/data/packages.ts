import type { PackagePlan } from '@/types/content'

export const packages: PackagePlan[] = [
  {
    slug: 'progetto-singolo',
    name: 'Progetto Singolo',
    description: 'Per chi ha un progetto puntuale: un video, uno shooting, una campagna con una scadenza precisa.',
    highlights: ['Un servizio o un set di contenuti definito', 'Revisioni incluse', 'Consegna nei formati concordati'],
    priceLabel: 'Preventivo personalizzato',
  },
  {
    slug: 'contenuti-mensili',
    name: 'Contenuti Mensili',
    description: 'Per aziende, creator e professionisti che hanno bisogno di contenuti con continuità, mese dopo mese.',
    highlights: ['Produzione ricorrente', 'Adattamento multipiattaforma', 'Supporto creativo continuativo'],
    priceLabel: 'Preventivo personalizzato',
  },
  {
    slug: 'produzione-personalizzata',
    name: 'Produzione Personalizzata',
    description: 'Per progetti complessi che richiedono più servizi combinati e un piano di lavoro su misura.',
    highlights: ['Combinazione di più servizi', 'Pianificazione dedicata', 'Punto di contatto unico'],
    priceLabel: 'Preventivo personalizzato',
  },
]
