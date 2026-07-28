# WildFocus — Sito web

Sito istituzionale/commerciale di WildFocus (video editing, fotografia, contenuti
social), costruito con React, TypeScript, Vite e Tailwind CSS.

## Requisiti

- Node.js 18+

## Installazione e avvio

```bash
npm install
npm run dev
```

## Script disponibili

- `npm run dev` — avvia il server di sviluppo
- `npm run build` — verifica i tipi (`tsc --noEmit`) e crea la build di produzione in `dist/`
- `npm run preview` — serve la build di produzione in locale
- `npm run test` — esegue la suite di test (Vitest + React Testing Library)
- `npm run test:watch` — esegue i test in modalità watch
- `npm run lint` — esegue ESLint

## Struttura del progetto

- `src/data/` — contenuti del sito (servizi, pacchetti, portfolio, team, testimonianze, FAQ, configurazione generale). Modifica questi file per aggiornare i testi senza toccare i componenti.
- `src/components/` — componenti riutilizzabili (layout, UI, form)
- `src/sections/` — blocchi di sezione composti, usati dalla Home
- `src/pages/` — una pagina per rotta
- `src/services/contactService.ts` — adapter di invio del form contatti
- `src/types/` — contratti dati stabili, pensati per un futuro CMS headless

## Sostituire i placeholder

Tutti i placeholder sono racchiusi tra parentesi quadre e centralizzati
principalmente in `src/data/siteConfig.ts` e negli altri file in `src/data/`:
`[EMAIL WILDFOCUS]`, `[NUMERO WHATSAPP]`, `[LINK INSTAGRAM]`, `[LINK TIKTOK]`,
`[LINK YOUTUBE]`, `[LINK LINKEDIN]`, `[CITTÀ]`, `[NOME MEMBRO TEAM]`,
`[PROGETTO PORTFOLIO]`, `[TESTIMONIANZA CLIENTE]`, `[TEMPO REALE]`,
`[XX]` (statistiche), `[URL SITO WILDFOCUS]` (in `src/seo/Seo.tsx`,
`public/robots.txt` e `public/sitemap.xml`).

## Aggiungere i font reali

I font sono self-hosted. Aggiungi i file `.woff2` reali in `public/fonts/` con i
nomi già referenziati in `src/styles/fonts.css` (`wild-display-700.woff2`,
`wild-body-400.woff2`, `wild-body-600.woff2`) e aggiorna i `<link rel="preload">`
in `index.html` se cambi i nomi dei file. Finché i file non esistono, il sito usa
automaticamente il fallback di sistema definito in `tailwind.config.ts`, senza
errori visibili.

## Aggiungere media reali al portfolio

Ogni progetto in `src/data/projects.ts` accetta `coverImage`/`coverVideo`
opzionali. Se assenti, `ProjectCard` mostra automaticamente un placeholder locale
(gradiente + icona categoria). Basta valorizzare questi campi con URL reali per far
sparire il placeholder, senza modificare i componenti.

## Collegare il form contatti a un servizio reale

`src/services/contactService.ts` espone `submitContactRequest(payload)` con
un'implementazione mock (nessuna chiamata di rete reale). Per collegarlo a un
servizio reale (Formspree, EmailJS, Netlify Forms, o un backend proprio), sostituisci
il corpo della funzione con una chiamata HTTP reale, mantenendo i controlli
honeypot/tempo minimo già presenti e aggiungendo la validazione lato server
sull'endpoint di destinazione.

## Attivare il banner cookie

`src/components/ui/CookieConsent.tsx` esiste già ma non è montato in `src/App.tsx`,
perché il sito non usa attualmente cookie di profilazione. Quando verrà collegato un
vero strumento di analytics, importa e monta `<CookieConsent />` in `App.tsx` e
aggiorna il testo in `src/pages/CookiePolicyPage.tsx`.

## SEO e limiti noti

Il sito è una SPA client-side: i meta tag per pagina (title, description, Open
Graph, JSON-LD) sono gestiti con `react-helmet-async` mediante il componente
`src/seo/Seo.tsx`, ma questo non equivale a un sito prerenderizzato o SSR ai fini
dell'indicizzazione. L'architettura è già predisposta per un eventuale
prerendering futuro (routing statico, meta risolvibili in modo sincrono da dati
locali): il prossimo passo consigliato è introdurre `vite-plugin-prerender-pages`
per le pagine pubbliche, oppure valutare una migrazione a un framework con
supporto SSR/SSG nativo (Astro, Next.js) quando il traffico organico diventa
prioritario.

## Pagine legali

`src/pages/PrivacyPolicyPage.tsx` e `src/pages/CookiePolicyPage.tsx` contengono
testo placeholder chiaramente etichettato come bozza. Vanno fatte revisionare da un
professionista legale prima della pubblicazione del sito.
