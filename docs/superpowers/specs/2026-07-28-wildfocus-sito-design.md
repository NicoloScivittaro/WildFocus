# WildFocus — Sito web istituzionale/commerciale — Design Spec

Data: 2026-07-28
Stato: approvato dall'utente, pronto per il piano di implementazione

## 1. Obiettivo e posizionamento

WildFocus è un team creativo specializzato in video editing, fotografia e contenuti
social. Il sito deve trasformare i visitatori in richieste di contatto, mostrando
subito la qualità del lavoro svolto.

**Posizionamento (da usare in Hero, Chi siamo, meta description):**

> Video e contenuti visivi per aziende, creator e attività che vogliono aumentare
> attenzione, autorevolezza e conversioni.

- Servizio di punta: Video Editing (apre la Hero, primo tra i servizi).
- Cliente ideale: aziende/professionisti che comunicano tramite contenuti, creator
  con esigenza di produzione costante.
- Azione richiesta al visitatore: contattare WildFocus per parlare del proprio
  progetto (CTA primaria unica, vedi §9).

Frasi da evitare: "Siamo leader del settore", "Offriamo soluzioni innovative",
"Qualità a 360 gradi", "Il cliente al centro". Copy concreto, diretto, orientato al
risultato (esempi già validati nel brief originale, riusabili come riferimento di
tono).

## 2. Stack tecnico

- React 18 + TypeScript + Vite 5
- Tailwind CSS 3
- React Router v6 (routing SPA)
- Framer Motion (animazioni, rispetta `prefers-reduced-motion`)
- lucide-react (icone)
- react-helmet-async (meta tag per pagina — vedi limiti in §10)

Nessuna altra dipendenza runtime. Nessuna libreria UI/component-kit esterna.
`npm install && npm run dev` come punto di ingresso.

## 3. Struttura cartelle

```
src/
  components/       # componenti riutilizzabili (vedi §8)
  pages/             # una componente per rotta
  sections/          # blocchi di sezione composti da componenti (Hero, ServicesSummary, ...)
  data/              # services.ts, projects.ts, testimonials.ts, team.ts, faq.ts, siteConfig.ts, packages.ts
  hooks/             # hook custom (es. useInView, useReducedMotion helper, useContactForm)
  services/          # contactService.ts (adapter invio form, vedi §7)
  assets/            # font locali, icone statiche
  styles/            # tailwind base, font-face
  types/             # contratti dati stabili (vedi §6)
public/
  fonts/             # .woff2 self-hosted
  robots.txt
  sitemap.xml
docs/
  superpowers/specs/ # questo file
```

## 4. Routing

`/`, `/servizi`, `/portfolio`, `/portfolio/:slug`, `/chi-siamo`, `/processo`,
`/collaborazioni`, `/contatti`, `/privacy-policy`, `/cookie-policy`, `*` → 404.

Route-level code splitting con `React.lazy` + `Suspense`. Ogni pagina risolve i
propri meta (title/description/OG) in modo sincrono da dati locali — nessun fetch
client-only bloccante, per restare compatibile con un futuro prerendering (§10).

## 5. Design system

- Sfondo primario `#0A0A0B`, sfondo secondario/superfici `#16161A`.
- Testo primario `#F5F5F5`, testo secondario `#A0A0A8`.
- Accent unico: verde lime `#C4F135`, usato con parsimonia (CTA, hover, dettagli,
  micro-interazioni) — mai come sfondo di grandi aree.
- Bordi sottili (`border-white/10`), angoli arrotondati moderati (non pillole
  ovunque), glassmorphism leggero solo su navbar e card in evidenza, gradienti
  leggeri nei fondi hero.
- Tipografia: un font sans deciso per i titoli (peso alto, tracking stretto, taglie
  grandi) + un font più neutro per il body. **Self-hosted**, non Google Fonts
  runtime:
  - file `.woff2` in `public/fonts/`
  - `@font-face` con `font-display: swap`
  - preload solo dei pesi effettivamente usati nell'head
  - fallback di sistema (`system-ui, -apple-system, sans-serif`)
  - nessun `@import` o `<link>` verso fonts.googleapis.com
- Motion: fade/slide in-view una sola volta (no ripetizioni a ogni scroll), rispetto
  di `prefers-reduced-motion`, niente scroll-jacking o parallax pesante.

## 6. Modello dati (CMS-ready)

Tipi stabili in `types/`, indipendenti dalla sorgente dati, così un domani un CMS
headless potrà sostituire l'import statico con una fetch che restituisce la stessa
forma, senza toccare i componenti:

```ts
interface Service {
  slug: string;
  title: string;
  outcomeStatement: string;   // frase orientata al risultato, non tecnica
  problemSolved: string;
  includes: string[];         // lavorazioni incluse (es. Reel/TikTok, color grading...)
  examples: string[];
  ctaLabel: string;
}

interface PackagePlan {
  slug: string;
  name: string;               // "Progetto Singolo" | "Contenuti Mensili" | "Produzione Personalizzata"
  description: string;
  highlights: string[];
  priceLabel: "Preventivo personalizzato";
}

interface Project {
  slug: string;
  title: string;
  category: "video-editing" | "fotografia" | "social" | "commercial" | "eventi" | "brand";
  coverImage?: string;         // se assente -> placeholder locale
  coverVideo?: string;
  summary: string;
  serviceProvided: string;
  clientGoal: string;
  result: string;              // qualitativo, mai percentuali inventate
  testimonial?: { quote: string; author: string; role: string };
  beforeAfter?: { before: string; after: string; note: string };
}

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  skills: string[];
  photo?: string;
  socials?: { platform: string; url: string }[];
}

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company?: string;
}

interface FaqItem {
  question: string;
  answer: string;
}
```

Dati demo in `data/*.ts`, con placeholder espliciti (`[PROGETTO PORTFOLIO]`,
`[NOME MEMBRO TEAM]`, `[TESTIMONIANZA CLIENTE]`, ecc.) centralizzati soprattutto in
`siteConfig.ts` per contatti/social/città.

## 7. Form contatti e invio dati

**Struttura a 3 step** (riduce l'abbandono rispetto a un form lungo unico):

- Step 1 — nome e cognome, email, servizio richiesto, azienda/progetto (opzionale)
- Step 2 — descrizione del progetto, tempistiche, budget indicativo (opzionale,
  fasce: Meno di 500€ · 500–1.000€ · 1.000–2.500€ · 2.500–5.000€ · Oltre 5.000€ ·
  Da definire)
- Step 3 — link a materiali (opzionale), telefono (opzionale), modalità di
  contatto preferita (opzionale), checkbox privacy (**obbligatoria**)

Nessun campo bloccante tranne nome, email, servizio, privacy.

Microcopy vicino all'invio: *"Dopo la richiesta riceverai una prima risposta entro
[TEMPO REALE]. Se il progetto è compatibile, organizziamo una breve call
conoscitiva, poi ti inviamo un preventivo su misura."*

Sulla pagina Contatti, fascia "Cosa succede dopo l'invio": Richiesta → Risposta/Call
→ Preventivo → Avvio progetto.

**Adapter di invio** — `src/services/contactService.ts`:

```ts
interface ContactPayload { /* campi dei 3 step */ }
interface ContactResult { ok: boolean; error?: string }

async function submitContactRequest(payload: ContactPayload): Promise<ContactResult>
```

Implementazione mock (simula latenza, valida, non effettua chiamate di rete reali,
logga in console in dev). Commento nel file + sezione README che spiega come
collegarla a Formspree / EmailJS / Netlify Forms / un backend proprio.

**Anti-spam base**: campo honeypot invisibile (bot-trap), tempo minimo prima
dell'invio (~3s dal mount del form, altrimenti submit rifiutato silenziosamente come
sospetto bot), sanitizzazione input prima del passaggio all'adapter. Validazione
server-side reale e CAPTCHA restano note esplicite per quando ci sarà un backend
vero (documentate, non implementate).

## 8. Componenti riutilizzabili

`Navbar`, `Footer`, `Hero`, `SectionTitle`, `ServiceCard` (macro-servizio, con lista
"cosa include"), `PackageCard` (pacchetti commerciali), `ProjectCard` (media reali
prioritari, placeholder locale come fallback), `TestimonialCard` (griglia statica,
no carosello), `CTASection`, `ContactForm`, `TeamMember`, `FaqAccordion`,
`VideoPlayer`, `BeforeAfter`, `CaseStudyCard`, `CookieConsent` (predisposto ma non
attivo di default, vedi §11).

`VideoPlayer`: poster obbligatorio, `preload="none"`, caricamento del video reale
solo al click play, muto di default, pulsante play esplicito, fallback a sola
immagine con `prefers-reduced-motion` o connessione lenta
(`navigator.connection?.saveData`). Senza un file reale mostra poster con gradiente
animato leggero, pronto per lo swap con un mp4/embed reale.

## 9. Pagine

### Home (5 sezioni, non 6+)
Hero (headline forte, sottotitolo, CTA primaria+secondaria, `VideoPlayer` showreel)
→ Portfolio in evidenza (3-4 progetti) → Servizi sintetici (le 4 macro-aree, card
compatte, con una fascia orizzontale compatta di 3 mini-step "come lavoriamo"
incorporata, non una sezione a sé) → Prova sociale (testimonianze in griglia +
trust indicator, sezione unica) → CTA finale.

### Servizi
4 macro-servizi (non più 10 card separate):
- **Video Editing** — include: montaggio narrativo, Reel/TikTok/Shorts, video
  pubblicitari, video aziendali, color grading, post-produzione
- **Fotografia e Shooting** — shooting brand/prodotto, ritratti professionali,
  backstage
- **Contenuti Social** — pacchetti di contenuti, adattamento multipiattaforma,
  gestione volumi
- **Produzione per Brand e Aziende** — video istituzionali, campagne,
  comunicazione aziendale

Ogni card: descrizione orientata al risultato (non tecnica), problema risolto,
lavorazioni incluse, CTA dedicata verso Contatti con servizio preselezionato
(query param).

3 pacchetti commerciali, nomi descrittivi (non "Starter/Growth/Custom"):
**Progetto Singolo · Contenuti Mensili · Produzione Personalizzata**, tutti con
dicitura "Preventivo personalizzato", nessun prezzo inventato.

### Portfolio
Griglia filtrabile per categoria (stato React locale): Tutti, Video Editing,
Fotografia, Social Content, Commercial, Eventi, Brand. `ProjectCard` con media
reali come prop primaria, placeholder locale (gradiente + icona categoria + label)
solo come fallback quando il media manca. Hover leggero, nessun autoplay audio.
Click → `/portfolio/:slug` con obiettivo cliente, risultato qualitativo,
testimonianza opzionale, blocco `BeforeAfter`/`CaseStudyCard` opzionale per
breakdown prima/dopo.

### Chi siamo
Storia, visione, metodo, valori (creatività, attenzione ai dettagli, comunicazione
trasparente, puntualità, qualità, ricerca continua, orientamento ai risultati) in
grid di badge. Sezione team con `TeamMember` (foto placeholder, nome, ruolo, bio,
skill, social opzionali) da `data/team.ts`.

### Processo
4 fasi (non 8 step piatti): **Scoperta** (brief + analisi obiettivi) →
**Ideazione** (ideazione creativa) → **Produzione** (ricezione materiali + editing
e color) → **Consegna** (revisione + consegna finale + supporto successivo). Ogni
fase è una card con 2-3 sotto-step elencati dentro.

FAQ (`FaqAccordion`) con le 8 domande del brief originale (tempi, revisioni,
riprese proprie, lavoro da remoto, pacchetti mensili, file sorgente, aziende vs
privati, calcolo preventivo).

### Collaborazioni
Pagina dedicata a pacchetti mensili/ricorrenti per aziende, creator, professionisti:
montaggio Reel mensile, post-produzione continuativa, shooting periodici, gestione
volumi, adattamento multipiattaforma, formati coordinati, supporto creativo
continuativo. CTA verso Contatti con servizio "Collaborazione continuativa"
preselezionato.

### Contatti
`ContactForm` a 3 step (§7), pulsante WhatsApp (discreto, verde lime del brand, non
il verde WhatsApp, **solo su questa pagina**, niente bottone fluttuante globale),
email, link social (Instagram/TikTok/YouTube/LinkedIn), microcopy rassicurante sui
tempi di risposta, fascia "cosa succede dopo l'invio", stato finale di
ringraziamento.

### Privacy Policy / Cookie Policy
Banner in cima ben visibile: *"Bozza — testo non definitivo, da far revisionare da
un professionista legale prima della pubblicazione."* Testo placeholder onesto sui
dati trattati (form contatti) e sull'assenza di cookie di profilazione allo stato
attuale.

## 10. SEO (limiti dichiarati)

- `react-helmet-async` per title/description/OG per pagina + JSON-LD
  `ProfessionalService`/`LocalBusiness` in `siteConfig.ts` (placeholder città/area).
- Heading gerarchici corretti, alt text su ogni immagine/placeholder, URL leggibili,
  `sitemap.xml`/`robots.txt` statici.
- **Limite esplicito**: essendo una SPA client-side, i meta dinamici via Helmet
  aiutano ma non garantiscono l'indicizzazione/anteprima social di un sito
  prerenderizzato o SSR. Architettura predisposta per un eventuale prerendering
  futuro (meta e dati risolvibili in modo sincrono, routing statico) — documentato
  nel README come prossimo passo consigliato (es. `vite-plugin-prerender-pages` o
  migrazione a Astro/Next), non implementato in questa fase.
- Parole chiave target (placeholder città): video editor professionale, video
  editing per aziende, fotografo per brand, produzione contenuti social, montaggio
  Reel, video promozionali, shooting fotografico, content creator per aziende.

## 11. Cookie e privacy (implementazione onesta)

Il sito, così com'è, non usa cookie di profilazione/analytics reali. Il banner
cookie **non viene mostrato di default**. Componente `CookieConsent` predisposto ma
non montato/attivo, con istruzioni nel README su come attivarlo quando verrà
collegato un vero strumento di analytics (es. Google Analytics). Checkbox privacy
obbligatoria nel form contatti collegata alla pagina Privacy Policy.

## 12. CTA coerente

CTA primaria unica in quasi tutto il sito: **"Parliamo del tuo progetto"** (navbar,
hero, CTA di sezione). **"Richiedi un preventivo"** resta come CTA secondaria,
specifica della pagina Contatti/vicino al form. Altre varianti (Guarda i nostri
lavori, Scopri i nostri lavori, Costruiamo il prossimo contenuto, Porta il tuo brand
a fuoco, Inizia una collaborazione) restano CTA secondarie contestuali per pagina,
mai in competizione visiva con quella primaria.

## 13. Accessibilità

Contrasto verificato (testo chiaro su sfondo scuro, accent lime solo su elementi
interattivi con contrasto sufficiente), navigazione da tastiera completa, focus
visibile su tutti gli elementi interattivi, aria-label su bottoni icona e form,
alt text su ogni immagine/placeholder, `prefers-reduced-motion` rispettato in tutte
le animazioni Framer Motion.

## 14. Placeholder da sostituire

Centralizzati principalmente in `siteConfig.ts` e `data/*.ts`: `[EMAIL WILDFOCUS]`,
`[NUMERO WHATSAPP]`, `[LINK INSTAGRAM]`, `[LINK TIKTOK]`, `[LINK YOUTUBE]`,
`[LINK LINKEDIN]`, `[CITTÀ]`, `[NOME MEMBRO TEAM]`, `[PROGETTO PORTFOLIO]`,
`[TESTIMONIANZA CLIENTE]`, `[TEMPO REALE]`, `[XX]+ progetti completati`,
`[XX] clienti soddisfatti`, `Risposta entro [XX] ore`.

## 15. Setup progetto

- `git init` nella cartella corrente (non ancora un repository Git) + primo commit
  con questo spec.
- `npm install && npm run dev` come punto di ingresso funzionante.
- README con istruzioni di installazione, struttura cartelle, come sostituire i
  placeholder, come collegare `contactService.ts` a un servizio reale, come
  attivare `CookieConsent`, nota sul prerendering futuro per SEO.

## 16. Fuori scope (dichiarato esplicitamente)

- Nessun backend/CRM reale collegato al form (solo adapter mock documentato).
- Nessun prerendering/SSR reale implementato (solo architettura predisposta).
- Nessun asset fotografico/video reale (solo placeholder locali, media reali
  innestabili senza refactor).
- Nessun sistema CAPTCHA implementato (solo nota per integrazione futura).
- Nessun cookie banner attivo (solo componente predisposto).
