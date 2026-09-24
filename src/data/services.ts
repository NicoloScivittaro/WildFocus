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
  {
    slug: 'sound-design',
    title: 'Sound Design',
    outcomeStatement:
      'Diamo identità sonora ai tuoi contenuti attraverso effetti, atmosfere e dettagli audio progettati per rendere ogni scena più immersiva e riconoscibile.',
    problemSolved:
      'Hai un video, un prodotto o un progetto creativo che visivamente funziona, ma a cui manca un comparto sonoro capace di valorizzarlo davvero.',
    includes: [
      'Sound design creativo',
      'Effetti sonori',
      'Foley',
      'Ambienti e atmosfere',
      'Editing e pulizia audio',
      'Mix e finalizzazione',
    ],
    examples: [
      'Sound design per uno spot pubblicitario',
      'Effetti e atmosfere per Reel e contenuti social',
      'Identità sonora per un brand o un prodotto',
    ],
    ctaLabel: 'Parliamo del tuo progetto',
  },
  {
    slug: 'produzione-musicale',
    title: 'Produzione Musicale',
    outcomeStatement:
      "Trasformiamo un'idea musicale in una produzione completa, curata nel suono e costruita per avere un'identità precisa e professionale.",
    problemSolved:
      "Hai una melodia, un testo o un'idea in testa, ma ti manca la produzione necessaria per trasformarla in un brano finito e pronto per essere pubblicato.",
    includes: [
      'Produzione e arrangiamento',
      'Beat making',
      'Registrazione e vocal production',
      'Editing vocale',
      'Mix',
      'Mastering',
    ],
    examples: [
      'Produzione completa di un singolo',
      'Beat originale per un artista',
      'Musica originale per contenuti, brand o campagne',
    ],
    ctaLabel: 'Parliamo del tuo progetto',
  },
]
