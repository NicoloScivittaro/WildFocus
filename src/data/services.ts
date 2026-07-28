import type { Service } from '@/types/content'

export const services: Service[] = [
  {
    slug: 'video-editing',
    title: 'Video Editing',
    outcomeStatement:
      "Trasformiamo le tue riprese in video dinamici, costruiti per mantenere alta l'attenzione dello spettatore dal primo secondo.",
    problemSolved:
      'Hai materiale grezzo o riprese sparse e nessun tempo (o strumento) per trasformarlo in contenuti pronti da pubblicare.',
    includes: [
      'Montaggio narrativo',
      'Reel, TikTok e Shorts',
      'Video pubblicitari',
      'Video aziendali',
      'Color grading',
      'Post-produzione',
    ],
    examples: ['Reel prodotto per brand', 'Video promozionale per un lancio', 'Serie di Shorts per un canale YouTube'],
    ctaLabel: 'Parliamo del tuo progetto',
  },
  {
    slug: 'fotografia-shooting',
    title: 'Fotografia e Shooting',
    outcomeStatement:
      'Costruiamo un set di immagini coerenti che raccontano il tuo brand o il tuo prodotto con lo stesso linguaggio visivo, ovunque vengano pubblicate.',
    problemSolved: 'Le tue foto attuali sono discontinue, non trasmettono la qualità reale del tuo lavoro o non funzionano sui social.',
    includes: ['Shooting brand e prodotto', 'Ritratti professionali', 'Backstage e behind the scenes'],
    examples: ['Catalogo prodotto per e-commerce', 'Ritratti team per il sito', 'Backstage per i social'],
    ctaLabel: 'Parliamo del tuo progetto',
  },
  {
    slug: 'contenuti-social',
    title: 'Contenuti Social',
    outcomeStatement: "Ogni contenuto ha uno scopo: attirare attenzione, raccontare valore e portare il pubblico a compiere un'azione.",
    problemSolved: 'Pubblichi in modo irregolare o i contenuti non sono adattati al formato e al ritmo di ogni piattaforma.',
    includes: ['Pacchetti di contenuti', 'Adattamento multipiattaforma', 'Gestione di grandi volumi di materiale'],
    examples: ['Piano contenuti mensile', 'Adattamento di un video in 5 formati', 'Serie coordinata multi-piattaforma'],
    ctaLabel: 'Parliamo del tuo progetto',
  },
  {
    slug: 'produzione-brand-aziende',
    title: 'Produzione per Brand e Aziende',
    outcomeStatement: "Dalla prima idea alla consegna finale, trasformiamo il tuo progetto in un'esperienza visiva coerente e memorabile.",
    problemSolved: 'Devi comunicare un progetto, un evento o un lancio aziendale e hai bisogno di un partner che segua tutto il processo.',
    includes: ['Video istituzionali', 'Campagne pubblicitarie', 'Comunicazione aziendale'],
    examples: ['Video di presentazione aziendale', 'Campagna per un lancio prodotto', 'Copertura video di un evento'],
    ctaLabel: 'Parliamo del tuo progetto',
  },
]
