# WildFocus Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the full WildFocus marketing/commercial website (11 routes, reusable component library, typed content data, mock-but-swappable contact pipeline) as specified in `docs/superpowers/specs/2026-07-28-wildfocus-sito-design.md`.

**Architecture:** Vite + React 18 + TypeScript SPA, Tailwind CSS design system, React Router v6 client routing with lazy-loaded pages, typed content in `src/data/*.ts` consumed by presentational components, Framer Motion for restrained in-view animation. Logic-bearing pieces (contact form state machine, anti-spam timing, portfolio filtering, accordion behavior, media fallback) get real Vitest + React Testing Library coverage; purely presentational composition is verified via `tsc --noEmit` and `vite build`.

**Tech Stack:** React 18, TypeScript 5, Vite 5, Tailwind CSS 3, React Router v6, Framer Motion, lucide-react, react-helmet-async. Dev-only: Vitest, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event, jsdom, ESLint (typescript-eslint).

## Global Constraints

These apply to every task below; they are not repeated per-task.

- **Dependencies:** runtime limited to `react`, `react-dom`, `react-router-dom`, `framer-motion`, `lucide-react`, `react-helmet-async`. No UI kit, no CSS-in-JS library, no extra runtime deps without updating the spec.
- **Colors:** background `#0A0A0B` (base), surface `#16161A`, text `#F5F5F5` (ink) / `#A0A0A8` (ink-muted), accent `#C4F135` (lime) — accent used only on interactive/small elements, never as a large fill.
- **Fonts:** self-hosted `.woff2` only, referenced from `/public/fonts`, `font-display: swap`, preload only the weights actually used in `index.html`, system fallback stack (`system-ui, -apple-system, sans-serif`). No Google Fonts `@import`/`<link>`.
- **Motion:** Framer Motion `whileInView` animations fire once (`viewport={{ once: true }}`), everything respects `prefers-reduced-motion` (global CSS override + component-level checks where JS drives timing), no scroll-jacking or heavy parallax.
- **CTA copy:** single primary CTA site-wide is **"Parliamo del tuo progetto"** (navbar, hero, section CTAs). **"Richiedi un preventivo"** is the secondary CTA, used only on the Contatti page. Other CTA labels from the spec are page-local secondary CTAs, never visually competing with the primary one.
- **Pricing:** never invent a price. Packages always show `"Preventivo personalizzato"`.
- **Portfolio results:** qualitative language only (e.g. "serie coerente di 12 contenuti in 3 formati"). Never present invented percentages as real data. Bracketed placeholder stats (e.g. `[XX]+ progetti completati`) are only used in sitewide trust sections, never per-project.
- **Placeholders:** use the exact bracketed tokens from the spec (`[EMAIL WILDFOCUS]`, `[NUMERO WHATSAPP]`, `[LINK INSTAGRAM]`, `[LINK TIKTOK]`, `[LINK YOUTUBE]`, `[LINK LINKEDIN]`, `[CITTÀ]`, `[NOME MEMBRO TEAM]`, `[PROGETTO PORTFOLIO]`, `[TESTIMONIANZA CLIENTE]`, `[TEMPO REALE]`), centralized in `src/data/siteConfig.ts` and the other `data/*.ts` files.
- **Sections per page:** 3–6 compact sections per page; Home is capped at 5 (Hero, Portfolio in evidenza, Servizi sintetici, Prova sociale, CTA finale) with the process mini-steps folded into the Servizi section, not a standalone section.
- **Accessibility:** visible focus ring on every interactive element, `aria-label` on icon-only buttons, `alt` text on every image/placeholder, full keyboard navigation, `prefers-reduced-motion` honored.
- **TypeScript hygiene:** `noUnusedLocals` / `noUnusedParameters` enabled; `npm run build` (which runs `tsc --noEmit` then `vite build`) must pass with zero errors at all times.
- **Path alias:** import app code via `@/` (mapped to `src/`) rather than deep relative paths.

## File Structure

```
index.html
package.json
tsconfig.json
tsconfig.node.json
vite.config.ts
tailwind.config.ts
postcss.config.js
.eslintrc.cjs
.gitignore
public/
  fonts/                      # .woff2 files go here (placeholders until real fonts supplied)
  favicon.svg
  robots.txt
  sitemap.xml
src/
  main.tsx                    # ReactDOM root, HelmetProvider, BrowserRouter
  App.tsx                     # Route table (lazy pages) + Layout
  styles/
    index.css                 # Tailwind directives + base layer + focus/reduced-motion
    fonts.css                 # @font-face declarations
  test/
    setup.ts                  # vitest + jest-dom setup
  types/
    content.ts                 # Service, PackagePlan, Project, TeamMember, Testimonial, FaqItem, NavItem
    contact.ts                  # ContactPayload, ContactStepFields, ContactResult
  data/
    siteConfig.ts              # nav, contacts, socials, JSON-LD business info, positioning copy
    services.ts
    packages.ts
    projects.ts
    team.ts
    testimonials.ts
    faq.ts
  hooks/
    useFormMountTime.ts         # anti-spam min-elapsed-time hook
    usePrefersReducedMotion.ts
  services/
    contactService.ts           # submitContactRequest mock adapter + validation/sanitization
  lib/
    antiSpam.ts                 # pure honeypot/min-time functions (used by contactService + tested directly)
    placeholderPoster.ts        # code-generated gradient data URI used as the Hero showreel poster
  components/
    layout/
      Navbar.tsx
      Footer.tsx
    ui/
      SectionTitle.tsx
      CTASection.tsx
      VideoPlayer.tsx
      ServiceCard.tsx
      PackageCard.tsx
      ProjectCard.tsx
      TestimonialCard.tsx
      TeamMember.tsx
      FaqAccordion.tsx
      BeforeAfter.tsx
      CaseStudyCard.tsx
      CookieConsent.tsx
      Reveal.tsx                 # Framer Motion in-view fade/slide, respects prefers-reduced-motion
    forms/
      ContactForm.tsx
      useContactFormState.ts     # step state machine + validation (pure/testable)
  sections/
    home/
      Hero.tsx
      PortfolioHighlight.tsx
      ServicesSummary.tsx        # includes the compact "come lavoriamo" 3-step strip
      SocialProof.tsx
      FinalCta.tsx
  pages/
    HomePage.tsx
    ServicesPage.tsx
    PortfolioPage.tsx
    PortfolioDetailPage.tsx
    AboutPage.tsx
    ProcessPage.tsx
    CollaborationsPage.tsx
    ContactPage.tsx
    PrivacyPolicyPage.tsx
    CookiePolicyPage.tsx
    NotFoundPage.tsx
  seo/
    Seo.tsx                      # thin Helmet wrapper (title/description/OG/JSON-LD)
README.md
```

---

## Task 1: Project scaffold and verified toolchain

**Files:**
- Create: `package.json`, `tsconfig.json`, `tsconfig.node.json`, `vite.config.ts`, `.gitignore`
- Create: `index.html`, `src/main.tsx`, `src/App.tsx`, `src/styles/index.css`
- Create: `src/test/setup.ts`
- Test: `src/App.test.tsx`

**Interfaces:**
- Produces: a working `npm install`, `npm run dev`, `npm run build`, `npm run test` pipeline that every later task relies on. `App` default-exported from `src/App.tsx`.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "wildfocus",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint . --ext ts,tsx"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.0",
    "framer-motion": "^11.3.0",
    "lucide-react": "^0.417.0",
    "react-helmet-async": "^2.0.5"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.8",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.5.2",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@typescript-eslint/eslint-plugin": "^7.16.1",
    "@typescript-eslint/parser": "^7.16.1",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "eslint": "^8.57.0",
    "eslint-plugin-react-hooks": "^4.6.2",
    "eslint-plugin-react-refresh": "^0.4.9",
    "jsdom": "^24.1.1",
    "postcss": "^8.4.40",
    "tailwindcss": "^3.4.7",
    "typescript": "^5.5.4",
    "vite": "^5.3.4",
    "vitest": "^2.0.5"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] },
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 3: Create `tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 4: Create `vite.config.ts`**

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
})
```

- [ ] **Step 5: Create `.gitignore`**

```
node_modules
dist
dist-ssr
.env
.env.local
*.local
.DS_Store
```

- [ ] **Step 6: Create `src/test/setup.ts`**

```ts
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 7: Create minimal `index.html`**

```html
<!doctype html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>WildFocus</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 8: Create minimal `src/styles/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

(Tailwind isn't configured with a `tailwind.config.ts` yet — that's Task 2. Vite will still build without it; the directives just won't produce brand tokens yet.)

- [ ] **Step 9: Run `npm install`**

Run: `npm install`
Expected: installs without errors, creates `node_modules` and `package-lock.json`.

- [ ] **Step 10: Write the failing smoke test — `src/App.test.tsx`**

```tsx
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the WildFocus heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /wildfocus/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 11: Run the test to verify it fails**

Run: `npm run test`
Expected: FAIL — `src/App.tsx` does not exist (module not found).

- [ ] **Step 12: Implement `src/App.tsx`**

```tsx
function App() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black text-white">
      <h1 className="text-4xl font-bold">WildFocus</h1>
    </main>
  )
}

export default App
```

- [ ] **Step 13: Implement `src/main.tsx`**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/index.css'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element #root not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
)
```

- [ ] **Step 14: Run the test to verify it passes**

Run: `npm run test`
Expected: PASS — 1 test passed.

- [ ] **Step 15: Verify the build pipeline end to end**

Run: `npm run build`
Expected: `tsc --noEmit` reports no errors, `vite build` completes, `dist/` is produced.

- [ ] **Step 16: Commit**

```bash
git add package.json package-lock.json tsconfig.json tsconfig.node.json vite.config.ts .gitignore index.html src/main.tsx src/App.tsx src/App.test.tsx src/styles/index.css src/test/setup.ts
git commit -m "chore: scaffold Vite + React + TS + Vitest toolchain"
```

---

## Task 2: Design tokens, self-hosted fonts, base styles

**Files:**
- Create: `tailwind.config.ts`, `postcss.config.js`, `src/styles/fonts.css`
- Modify: `src/styles/index.css`, `index.html`

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: Tailwind theme tokens (`bg-base`, `bg-surface`, `text-ink`, `text-ink-muted`, `text-accent`/`bg-accent`, `font-display`, `font-body`) used by every component task from here on.

- [ ] **Step 1: Create `postcss.config.js`**

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 2: Create `tailwind.config.ts`**

```ts
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: '#0A0A0B',
          surface: '#16161A',
        },
        ink: {
          DEFAULT: '#F5F5F5',
          muted: '#A0A0A8',
        },
        accent: {
          DEFAULT: '#C4F135',
        },
      },
      fontFamily: {
        display: ['"Wild Display"', 'system-ui', '-apple-system', 'sans-serif'],
        body: ['"Wild Body"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
} satisfies Config
```

- [ ] **Step 3: Create `src/styles/fonts.css`**

```css
/*
  Placeholder font files: drop real .woff2 exports into /public/fonts using
  these exact names, or update the src paths here. Until real files exist,
  browsers silently fall back to the system stack defined in
  tailwind.config.ts (no visual break, no console error).
*/
@font-face {
  font-family: 'Wild Display';
  src: url('/fonts/wild-display-700.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Wild Body';
  src: url('/fonts/wild-body-400.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Wild Body';
  src: url('/fonts/wild-body-600.woff2') format('woff2');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}
```

- [ ] **Step 4: Update `src/styles/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import './fonts.css';

:root {
  color-scheme: dark;
}

body {
  @apply bg-base text-ink font-body antialiased;
}

h1, h2, h3, h4 {
  @apply font-display;
}

:focus-visible {
  outline: 2px solid theme('colors.accent.DEFAULT');
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 5: Update `index.html`** — add `lang`, base meta, and font preloads for the weights declared in `fonts.css`

```html
<!doctype html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preload" href="/fonts/wild-display-700.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/fonts/wild-body-400.woff2" as="font" type="font/woff2" crossorigin />
    <title>WildFocus</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Update `src/App.tsx` to use the new tokens (verifies Tailwind actually picks them up)**

```tsx
function App() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-base text-ink">
      <h1 className="font-display text-4xl">WildFocus</h1>
    </main>
  )
}

export default App
```

- [ ] **Step 7: Verify build**

Run: `npm run build`
Expected: succeeds with no errors; `dist/assets/*.css` contains the `bg-base`/`text-ink`/`font-display` rules (spot-check by grepping the built CSS file for `0a0a0b`).

- [ ] **Step 8: Run existing tests to confirm nothing broke**

Run: `npm run test`
Expected: PASS (the Task 1 smoke test still passes).

- [ ] **Step 9: Commit**

```bash
git add tailwind.config.ts postcss.config.js src/styles/fonts.css src/styles/index.css index.html src/App.tsx
git commit -m "feat: add WildFocus design tokens and self-hosted font setup"
```

---

## Task 3: Content types

**Files:**
- Create: `src/types/content.ts`, `src/types/contact.ts`

**Interfaces:**
- Produces the type contracts every `data/*.ts` file (Tasks 4-7) and every component/page implements against:

```ts
// content.ts
export interface NavItem { label: string; to: string }

export interface Service {
  slug: string
  title: string
  outcomeStatement: string
  problemSolved: string
  includes: string[]
  examples: string[]
  ctaLabel: string
}

export interface PackagePlan {
  slug: string
  name: string
  description: string
  highlights: string[]
  priceLabel: 'Preventivo personalizzato'
}

export type ProjectCategory = 'video-editing' | 'fotografia' | 'social' | 'commercial' | 'eventi' | 'brand'

export interface ProjectTestimonial { quote: string; author: string; role: string }
export interface ProjectBeforeAfter { before: string; after: string; note: string }

export interface Project {
  slug: string
  title: string
  category: ProjectCategory
  coverImage?: string
  coverVideo?: string
  summary: string
  serviceProvided: string
  clientGoal: string
  result: string
  testimonial?: ProjectTestimonial
  beforeAfter?: ProjectBeforeAfter
}

export interface TeamSocial { platform: string; url: string }

export interface TeamMemberData {
  name: string
  role: string
  bio: string
  skills: string[]
  photo?: string
  socials?: TeamSocial[]
}

export interface Testimonial {
  quote: string
  author: string
  role: string
  company?: string
}

export interface FaqItem {
  question: string
  answer: string
}
```

```ts
// contact.ts
export type BudgetRange =
  | 'Meno di 500€'
  | '500-1.000€'
  | '1.000-2.500€'
  | '2.500-5.000€'
  | 'Oltre 5.000€'
  | 'Da definire'

export type ContactPreference = 'Email' | 'Telefono' | 'WhatsApp'

export interface ContactStepOneFields {
  fullName: string
  email: string
  service: string
  companyOrProject?: string
}

export interface ContactStepTwoFields {
  projectDescription: string
  timeline: string
  budget?: BudgetRange
}

export interface ContactStepThreeFields {
  materialsLink?: string
  phone?: string
  contactPreference?: ContactPreference
  privacyAccepted: boolean
}

export type ContactFormFields = ContactStepOneFields & ContactStepTwoFields & ContactStepThreeFields

export interface ContactPayload extends ContactFormFields {
  honeypot: string
  formRenderedAt: number
  submittedAt: number
}

export interface ContactResult {
  ok: boolean
  error?: string
}
```

- [ ] **Step 1: Create `src/types/content.ts`** with the interfaces shown above.

- [ ] **Step 2: Create `src/types/contact.ts`** with the interfaces shown above.

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npm run build`
Expected: succeeds (these are type-only files, nothing consumes them yet, so no errors possible other than syntax — confirms syntax is valid).

- [ ] **Step 4: Commit**

```bash
git add src/types/content.ts src/types/contact.ts
git commit -m "feat: add content and contact form type contracts"
```

---

## Task 4: Site config data (nav, contacts, socials, JSON-LD, positioning)

**Files:**
- Create: `src/data/siteConfig.ts`

**Interfaces:**
- Consumes: `NavItem` from `@/types/content`.
- Produces: `siteConfig` default export, consumed by `Navbar`, `Footer`, `Seo`, `ContactPage` (Tasks 9, 28, 26).

```ts
export interface SiteConfig {
  name: string
  positioning: string
  primaryCta: string
  secondaryCta: string
  city: string
  responseTime: string
  email: string
  whatsappNumber: string
  whatsappLink: string
  socials: { platform: 'Instagram' | 'TikTok' | 'YouTube' | 'LinkedIn'; url: string }[]
  nav: NavItem[]
  trustStats: { label: string; value: string }[]
  jsonLd: Record<string, unknown>
}
```

- [ ] **Step 1: Create `src/data/siteConfig.ts`**

```ts
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
  primaryCta: 'Parliamo del tuo progetto',
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
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/data/siteConfig.ts
git commit -m "feat: add site configuration data with explicit placeholders"
```

---

## Task 5: Services and packages data

**Files:**
- Create: `src/data/services.ts`, `src/data/packages.ts`

**Interfaces:**
- Consumes: `Service`, `PackagePlan` from `@/types/content`.
- Produces: `services: Service[]` and `packages: PackagePlan[]` default/named exports, consumed by `ServiceCard`/`PackageCard` (Task 12) and `ServicesPage`/`ServicesSummary` (Tasks 21, 20).

- [ ] **Step 1: Create `src/data/services.ts`**

```ts
import type { Service } from '@/types/content'

export const services: Service[] = [
  {
    slug: 'video-editing',
    title: 'Video Editing',
    outcomeStatement:
      'Trasformiamo le tue riprese in video dinamici, costruiti per mantenere alta l\'attenzione dello spettatore dal primo secondo.',
    problemSolved: 'Hai materiale grezzo o riprese sparse e nessun tempo (o strumento) per trasformarlo in contenuti pronti da pubblicare.',
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
    outcomeStatement:
      'Ogni contenuto ha uno scopo: attirare attenzione, raccontare valore e portare il pubblico a compiere un\'azione.',
    problemSolved: 'Pubblichi in modo irregolare o i contenuti non sono adattati al formato e al ritmo di ogni piattaforma.',
    includes: ['Pacchetti di contenuti', 'Adattamento multipiattaforma', 'Gestione di grandi volumi di materiale'],
    examples: ['Piano contenuti mensile', 'Adattamento di un video in 5 formati', 'Serie coordinata multi-piattaforma'],
    ctaLabel: 'Parliamo del tuo progetto',
  },
  {
    slug: 'produzione-brand-aziende',
    title: 'Produzione per Brand e Aziende',
    outcomeStatement:
      'Dalla prima idea alla consegna finale, trasformiamo il tuo progetto in un\'esperienza visiva coerente e memorabile.',
    problemSolved: 'Devi comunicare un progetto, un evento o un lancio aziendale e hai bisogno di un partner che segua tutto il processo.',
    includes: ['Video istituzionali', 'Campagne pubblicitarie', 'Comunicazione aziendale'],
    examples: ['Video di presentazione aziendale', 'Campagna per un lancio prodotto', 'Copertura video di un evento'],
    ctaLabel: 'Parliamo del tuo progetto',
  },
]
```

- [ ] **Step 2: Create `src/data/packages.ts`**

```ts
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
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/data/services.ts src/data/packages.ts
git commit -m "feat: add services and commercial packages data"
```

---

## Task 6: Portfolio, team, testimonials, FAQ data

**Files:**
- Create: `src/data/projects.ts`, `src/data/team.ts`, `src/data/testimonials.ts`, `src/data/faq.ts`

**Interfaces:**
- Consumes: `Project`, `TeamMemberData`, `Testimonial`, `FaqItem` from `@/types/content`.
- Produces: `projects`, `team`, `testimonials`, `faqItems` arrays consumed by Portfolio pages (Task 22), About page (Task 23), Home sections (Task 20), Process page (Task 24).

- [ ] **Step 1: Create `src/data/projects.ts`** (no `coverImage`/`coverVideo` set — every card falls back to the local placeholder per spec §6/§9 until real media is supplied)

```ts
import type { Project } from '@/types/content'

export const projects: Project[] = [
  {
    slug: 'progetto-video-editing-1',
    title: '[PROGETTO PORTFOLIO]',
    category: 'video-editing',
    summary: 'Serie di Reel realizzata per rilanciare la presenza social di un brand locale.',
    serviceProvided: 'Video Editing — Reel e Shorts',
    clientGoal: 'Aumentare la coerenza visiva e la frequenza di pubblicazione sui social.',
    result: 'Serie coerente di 12 contenuti in 3 formati, pubblicata su Instagram e TikTok.',
    testimonial: { quote: '[TESTIMONIANZA CLIENTE]', author: '[NOME MEMBRO TEAM]', role: 'Cliente' },
  },
  {
    slug: 'progetto-fotografia-1',
    title: '[PROGETTO PORTFOLIO]',
    category: 'fotografia',
    summary: 'Shooting prodotto per il rilancio di un catalogo e-commerce.',
    serviceProvided: 'Fotografia e Shooting — Prodotto',
    clientGoal: 'Ottenere un set fotografico coerente per tutte le schede prodotto.',
    result: 'Maggiore coerenza visiva del catalogo e riconoscibilità del brand.',
  },
  {
    slug: 'progetto-social-1',
    title: '[PROGETTO PORTFOLIO]',
    category: 'social',
    summary: 'Pacchetto di contenuti mensile per un professionista che comunica sui social.',
    serviceProvided: 'Contenuti Social — Pacchetto mensile',
    clientGoal: 'Mantenere una presenza costante senza gestire la produzione internamente.',
    result: 'Adattamento multipiattaforma di ogni contenuto, pubblicazione regolare.',
  },
  {
    slug: 'progetto-commercial-1',
    title: '[PROGETTO PORTFOLIO]',
    category: 'commercial',
    summary: 'Video pubblicitario per il lancio di un nuovo prodotto.',
    serviceProvided: 'Video Editing — Video pubblicitario',
    clientGoal: 'Comunicare in modo chiaro il valore del prodotto in meno di 30 secondi.',
    result: 'Miglioramento del ritmo narrativo rispetto alla versione grezza del materiale.',
    beforeAfter: {
      before: '[PROGETTO PORTFOLIO] — materiale grezzo',
      after: '[PROGETTO PORTFOLIO] — versione finale',
      note: 'Ricomposizione del ritmo di montaggio e color grading per uniformare le riprese.',
    },
  },
  {
    slug: 'progetto-eventi-1',
    title: '[PROGETTO PORTFOLIO]',
    category: 'eventi',
    summary: 'Copertura video di un evento aziendale con consegna in 48 ore.',
    serviceProvided: 'Produzione per Brand e Aziende — Copertura evento',
    clientGoal: 'Avere un ricordo video professionale da condividere subito dopo l\'evento.',
    result: 'Consegna di un video riassuntivo e di clip social nei tempi concordati.',
  },
  {
    slug: 'progetto-brand-1',
    title: '[PROGETTO PORTFOLIO]',
    category: 'brand',
    summary: 'Video istituzionale di presentazione per un\'azienda in fase di rebranding.',
    serviceProvided: 'Produzione per Brand e Aziende — Video istituzionale',
    clientGoal: 'Comunicare la nuova identità del brand a clienti e partner.',
    result: 'Video coerente con la nuova identità visiva, utilizzato su sito e social.',
  },
]
```

- [ ] **Step 2: Create `src/data/team.ts`**

```ts
import type { TeamMemberData } from '@/types/content'

export const team: TeamMemberData[] = [
  {
    name: '[NOME MEMBRO TEAM]',
    role: 'Video Editor & Founder',
    bio: 'Cura il ritmo e la struttura narrativa di ogni progetto, dal primo taglio alla consegna finale.',
    skills: ['Montaggio narrativo', 'Color grading', 'Motion graphics'],
    socials: [{ platform: 'Instagram', url: '[LINK INSTAGRAM]' }],
  },
  {
    name: '[NOME MEMBRO TEAM]',
    role: 'Fotografo',
    bio: 'Costruisce set fotografici coerenti per brand e prodotti, dallo studio al backstage.',
    skills: ['Fotografia prodotto', 'Ritrattistica', 'Post-produzione fotografica'],
    socials: [{ platform: 'Instagram', url: '[LINK INSTAGRAM]' }],
  },
  {
    name: '[NOME MEMBRO TEAM]',
    role: 'Social Media Content Creator',
    bio: 'Adatta ogni contenuto al formato e al ritmo giusto per ogni piattaforma social.',
    skills: ['Content strategy', 'Reel e Shorts', 'Copywriting social'],
    socials: [{ platform: 'TikTok', url: '[LINK TIKTOK]' }],
  },
]
```

- [ ] **Step 3: Create `src/data/testimonials.ts`** (grid of 3, per spec §9 — no carousel)

```ts
import type { Testimonial } from '@/types/content'

export const testimonials: Testimonial[] = [
  { quote: '[TESTIMONIANZA CLIENTE]', author: '[NOME MEMBRO TEAM]', role: 'Fondatore', company: '[PROGETTO PORTFOLIO]' },
  { quote: '[TESTIMONIANZA CLIENTE]', author: '[NOME MEMBRO TEAM]', role: 'Marketing Manager', company: '[PROGETTO PORTFOLIO]' },
  { quote: '[TESTIMONIANZA CLIENTE]', author: '[NOME MEMBRO TEAM]', role: 'Content Creator' },
]
```

- [ ] **Step 4: Create `src/data/faq.ts`**

```ts
import type { FaqItem } from '@/types/content'

export const faqItems: FaqItem[] = [
  { question: 'Quanto tempo richiede un progetto?', answer: 'Dipende dalla complessità: un singolo Reel richiede pochi giorni, un progetto video completo può richiedere alcune settimane. Ti diamo una stima precisa dopo il brief iniziale.' },
  { question: 'Quante revisioni sono incluse?', answer: 'Ogni progetto include un numero di revisioni concordato in fase di preventivo, sufficiente a rifinire il risultato senza rallentare la consegna.' },
  { question: 'Possiamo inviare noi le riprese?', answer: 'Sì. Puoi inviarci il materiale già girato oppure affidarci anche la produzione, in base al servizio scelto.' },
  { question: 'Lavorate anche da remoto?', answer: 'Sì, gran parte del lavoro di editing e post-produzione viene svolto da remoto, con aggiornamenti costanti durante il progetto.' },
  { question: 'Realizzate pacchetti mensili?', answer: 'Sì, per aziende, creator e professionisti che hanno bisogno di contenuti con continuità. Vedi la pagina Collaborazioni.' },
  { question: 'Consegnate i file sorgente?', answer: 'I file sorgente possono essere inclusi su richiesta e vengono concordati in fase di preventivo.' },
  { question: 'Lavorate con aziende e privati?', answer: 'Sì, lavoriamo sia con aziende sia con professionisti e privati che hanno bisogno di contenuti di qualità.' },
  { question: 'Come viene calcolato il preventivo?', answer: 'In base al servizio richiesto, alla quantità di contenuti, alle tempistiche e alla complessità della produzione. Ogni preventivo è personalizzato.' },
]
```

- [ ] **Step 5: Verify TypeScript compiles**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/data/projects.ts src/data/team.ts src/data/testimonials.ts src/data/faq.ts
git commit -m "feat: add portfolio, team, testimonials and FAQ data"
```

---

## Task 7: Anti-spam primitives and the mock contact service

**Files:**
- Create: `src/lib/antiSpam.ts`, `src/services/contactService.ts`
- Test: `src/lib/antiSpam.test.ts`, `src/services/contactService.test.ts`

**Interfaces:**
- Consumes: `ContactPayload`, `ContactResult` from `@/types/contact`.
- Produces: `isHoneypotFilled(value: string): boolean`, `hasElapsedMinimumTime(renderedAt: number, submittedAt: number, minMs?: number): boolean`, `sanitizeInput(value: string): string` from `antiSpam.ts`; `submitContactRequest(payload: ContactPayload): Promise<ContactResult>` from `contactService.ts`. `ContactForm` (Tasks 17-18) depends on `submitContactRequest`.

- [ ] **Step 1: Write the failing tests — `src/lib/antiSpam.test.ts`**

```ts
import { describe, expect, it } from 'vitest'
import { hasElapsedMinimumTime, isHoneypotFilled, sanitizeInput } from './antiSpam'

describe('isHoneypotFilled', () => {
  it('returns false for an empty honeypot', () => {
    expect(isHoneypotFilled('')).toBe(false)
  })

  it('returns true when the honeypot has been filled by a bot', () => {
    expect(isHoneypotFilled('http://spam.example')).toBe(true)
  })
})

describe('hasElapsedMinimumTime', () => {
  it('returns false when submitted before the minimum delay', () => {
    expect(hasElapsedMinimumTime(1000, 2000, 3000)).toBe(false)
  })

  it('returns true when submitted after the minimum delay', () => {
    expect(hasElapsedMinimumTime(1000, 4500, 3000)).toBe(true)
  })
})

describe('sanitizeInput', () => {
  it('trims whitespace and strips HTML tags', () => {
    expect(sanitizeInput('  <script>alert(1)</script>Ciao  ')).toBe('alert(1)Ciao')
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm run test`
Expected: FAIL — `src/lib/antiSpam.ts` does not exist.

- [ ] **Step 3: Implement `src/lib/antiSpam.ts`**

```ts
export function isHoneypotFilled(honeypotValue: string): boolean {
  return honeypotValue.trim().length > 0
}

export function hasElapsedMinimumTime(renderedAt: number, submittedAt: number, minMs = 3000): boolean {
  return submittedAt - renderedAt >= minMs
}

export function sanitizeInput(value: string): string {
  return value.trim().replace(/<[^>]*>/g, '')
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 5: Write the failing tests — `src/services/contactService.test.ts`**

```ts
import { describe, expect, it } from 'vitest'
import { submitContactRequest } from './contactService'
import type { ContactPayload } from '@/types/contact'

function buildPayload(overrides: Partial<ContactPayload> = {}): ContactPayload {
  const now = Date.now()
  return {
    fullName: 'Mario Rossi',
    email: 'mario@example.com',
    service: 'video-editing',
    projectDescription: 'Ho bisogno di un video promozionale.',
    timeline: 'Entro un mese',
    privacyAccepted: true,
    honeypot: '',
    formRenderedAt: now - 5000,
    submittedAt: now,
    ...overrides,
  }
}

describe('submitContactRequest', () => {
  it('rejects submissions where the honeypot field is filled', async () => {
    const result = await submitContactRequest(buildPayload({ honeypot: 'im-a-bot' }))
    expect(result.ok).toBe(false)
  })

  it('rejects submissions faster than the minimum time threshold', async () => {
    const now = Date.now()
    const result = await submitContactRequest(buildPayload({ formRenderedAt: now, submittedAt: now + 500 }))
    expect(result.ok).toBe(false)
  })

  it('rejects submissions without privacy consent', async () => {
    const result = await submitContactRequest(buildPayload({ privacyAccepted: false }))
    expect(result.ok).toBe(false)
  })

  it('accepts a well-formed submission', async () => {
    const result = await submitContactRequest(buildPayload())
    expect(result.ok).toBe(true)
  })
})
```

Note: `ContactPayload` fields beyond the ones set above (`companyOrProject`, `budget`, `materialsLink`, `phone`, `contactPreference`) are optional per the Task 3 type definition, so this partial object satisfies the type once cast — if `tsc` complains, extend `buildPayload`'s return type assertion to `as ContactPayload` since all required fields are present.

- [ ] **Step 6: Run the tests to verify they fail**

Run: `npm run test`
Expected: FAIL — `src/services/contactService.ts` does not exist.

- [ ] **Step 7: Implement `src/services/contactService.ts`**

```ts
import type { ContactPayload, ContactResult } from '@/types/contact'
import { hasElapsedMinimumTime, isHoneypotFilled, sanitizeInput } from '@/lib/antiSpam'

const MIN_SUBMIT_DELAY_MS = 3000

/**
 * Mock contact adapter. Replace the body below with a real POST to
 * Formspree / EmailJS / Netlify Forms / a custom backend, forwarding
 * `sanitized`. Keep the honeypot + timing checks even after wiring a real
 * endpoint, and add matching server-side validation there too.
 */
export async function submitContactRequest(payload: ContactPayload): Promise<ContactResult> {
  if (isHoneypotFilled(payload.honeypot)) {
    return { ok: false, error: 'Richiesta non valida.' }
  }

  if (!hasElapsedMinimumTime(payload.formRenderedAt, payload.submittedAt, MIN_SUBMIT_DELAY_MS)) {
    return { ok: false, error: 'Richiesta non valida.' }
  }

  if (!payload.privacyAccepted) {
    return { ok: false, error: 'Devi accettare la privacy policy per continuare.' }
  }

  const sanitized: ContactPayload = {
    ...payload,
    fullName: sanitizeInput(payload.fullName),
    email: sanitizeInput(payload.email),
    projectDescription: sanitizeInput(payload.projectDescription),
  }

  await new Promise((resolve) => setTimeout(resolve, 400))
  console.info('[contactService] mock submission', sanitized)

  return { ok: true }
}
```

- [ ] **Step 8: Run the tests to verify they pass**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/lib/antiSpam.ts src/lib/antiSpam.test.ts src/services/contactService.ts src/services/contactService.test.ts
git commit -m "feat: add anti-spam checks and mock contact service adapter"
```

---

## Task 8: Reduced-motion and form-timing hooks

**Files:**
- Create: `src/hooks/usePrefersReducedMotion.ts`, `src/hooks/useFormMountTime.ts`
- Modify: `src/test/setup.ts` (add a `matchMedia` mock — jsdom doesn't implement it)
- Test: `src/hooks/usePrefersReducedMotion.test.tsx`, `src/hooks/useFormMountTime.test.tsx`

**Interfaces:**
- Produces: `usePrefersReducedMotion(): boolean` (used by `VideoPlayer`, Task 11) and `useFormMountTime(): number` (used by `ContactForm`, Task 18).

- [ ] **Step 1: Update `src/test/setup.ts`** to mock `window.matchMedia`

```ts
import '@testing-library/jest-dom/vitest'

if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia
}
```

- [ ] **Step 2: Write the failing test — `src/hooks/usePrefersReducedMotion.test.tsx`**

```tsx
import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

function Probe({ onValue }: { onValue: (value: boolean) => void }) {
  const prefersReducedMotion = usePrefersReducedMotion()
  onValue(prefersReducedMotion)
  return null
}

describe('usePrefersReducedMotion', () => {
  it('reflects the mocked matchMedia result (false by default in tests)', () => {
    const values: boolean[] = []
    render(<Probe onValue={(v) => values.push(v)} />)
    expect(values[0]).toBe(false)
  })
})
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm run test`
Expected: FAIL — `src/hooks/usePrefersReducedMotion.ts` does not exist.

- [ ] **Step 4: Implement `src/hooks/usePrefersReducedMotion.ts`**

```ts
import { useEffect, useState } from 'react'

export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 6: Write the failing test — `src/hooks/useFormMountTime.test.tsx`**

```tsx
import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { useFormMountTime } from './useFormMountTime'

function Probe({ onValue }: { onValue: (value: number) => void }) {
  const mountedAt = useFormMountTime()
  onValue(mountedAt)
  return null
}

describe('useFormMountTime', () => {
  it('returns the same timestamp across re-renders', () => {
    const values: number[] = []
    const { rerender } = render(<Probe onValue={(v) => values.push(v)} />)
    rerender(<Probe onValue={(v) => values.push(v)} />)
    expect(values[0]).toBe(values[1])
  })
})
```

- [ ] **Step 7: Run the test to verify it fails**

Run: `npm run test`
Expected: FAIL — `src/hooks/useFormMountTime.ts` does not exist.

- [ ] **Step 8: Implement `src/hooks/useFormMountTime.ts`**

```ts
import { useRef } from 'react'

export function useFormMountTime(): number {
  const mountTimeRef = useRef(Date.now())
  return mountTimeRef.current
}
```

- [ ] **Step 9: Run the tests to verify they pass**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 10: Commit**

```bash
git add src/test/setup.ts src/hooks/usePrefersReducedMotion.ts src/hooks/usePrefersReducedMotion.test.tsx src/hooks/useFormMountTime.ts src/hooks/useFormMountTime.test.tsx
git commit -m "feat: add reduced-motion and form-mount-time hooks"
```

---

## Task 9: Navbar and Footer

**Files:**
- Create: `src/components/layout/Navbar.tsx`, `src/components/layout/Footer.tsx`
- Test: `src/components/layout/Navbar.test.tsx`, `src/components/layout/Footer.test.tsx`

**Interfaces:**
- Consumes: `siteConfig` from `@/data/siteConfig`.
- Produces: `Navbar` and `Footer` components, used by `App.tsx` (Task 28).

- [ ] **Step 1: Write the failing tests — `src/components/layout/Navbar.test.tsx`**

```tsx
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { Navbar } from './Navbar'

describe('Navbar', () => {
  it('toggles the mobile menu when the hamburger button is clicked', async () => {
    const user = userEvent.setup()
    render(<Navbar />, { wrapper: MemoryRouter })

    expect(screen.queryByLabelText('Navigazione mobile')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /apri il menu/i }))
    expect(screen.getByLabelText('Navigazione mobile')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /chiudi il menu/i }))
    expect(screen.queryByLabelText('Navigazione mobile')).not.toBeInTheDocument()
  })

  it('shows the primary CTA label from siteConfig', () => {
    render(<Navbar />, { wrapper: MemoryRouter })
    expect(screen.getAllByText('Parliamo del tuo progetto').length).toBeGreaterThan(0)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test`
Expected: FAIL — `src/components/layout/Navbar.tsx` does not exist.

- [ ] **Step 3: Implement `src/components/layout/Navbar.tsx`**

```tsx
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { siteConfig } from '@/data/siteConfig'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-base/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <NavLink to="/" className="font-display text-lg text-ink" onClick={() => setIsOpen(false)}>
          WildFocus
        </NavLink>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Navigazione principale">
          {siteConfig.nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `text-sm transition-colors ${isActive ? 'text-accent' : 'text-ink-muted hover:text-ink'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink
            to="/contatti"
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-base hover:opacity-90"
          >
            {siteConfig.primaryCta}
          </NavLink>
        </nav>

        <button
          type="button"
          className="md:hidden"
          aria-label={isOpen ? 'Chiudi il menu' : 'Apri il menu'}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <X className="text-ink" /> : <Menu className="text-ink" />}
        </button>
      </div>

      {isOpen && (
        <nav className="border-t border-white/10 px-4 py-4 md:hidden" aria-label="Navigazione mobile">
          <ul className="flex flex-col gap-4">
            {siteConfig.nav.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.to === '/'} className="text-ink" onClick={() => setIsOpen(false)}>
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li>
              <NavLink
                to="/contatti"
                className="inline-block rounded-full bg-accent px-4 py-2 text-sm font-semibold text-base"
                onClick={() => setIsOpen(false)}
              >
                {siteConfig.primaryCta}
              </NavLink>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 5: Write the failing test — `src/components/layout/Footer.test.tsx`**

```tsx
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Footer } from './Footer'

describe('Footer', () => {
  it('links to the privacy and cookie policy pages', () => {
    render(<Footer />, { wrapper: MemoryRouter })
    expect(screen.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '/privacy-policy')
    expect(screen.getByRole('link', { name: 'Cookie Policy' })).toHaveAttribute('href', '/cookie-policy')
  })
})
```

- [ ] **Step 6: Run the test to verify it fails**

Run: `npm run test`
Expected: FAIL — `src/components/layout/Footer.tsx` does not exist.

- [ ] **Step 7: Implement `src/components/layout/Footer.tsx`**

```tsx
import { Link } from 'react-router-dom'
import { siteConfig } from '@/data/siteConfig'

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-base">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <p className="font-display text-lg text-ink">WildFocus</p>
          <p className="mt-2 text-sm text-ink-muted">{siteConfig.positioning}</p>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink">Naviga</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-muted">
            {siteConfig.nav.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink">Contatti</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-muted">
            <li>{siteConfig.email}</li>
            <li>{siteConfig.city}</li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink">Social</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-muted">
            {siteConfig.socials.map((social) => (
              <li key={social.platform}>
                <a href={social.url} target="_blank" rel="noreferrer" className="hover:text-ink">
                  {social.platform}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 text-xs text-ink-muted md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} WildFocus. Tutti i diritti riservati.</p>
          <div className="flex gap-4">
            <Link to="/privacy-policy" className="hover:text-ink">Privacy Policy</Link>
            <Link to="/cookie-policy" className="hover:text-ink">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 8: Run the tests to verify they pass**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/components/layout/Navbar.tsx src/components/layout/Navbar.test.tsx src/components/layout/Footer.tsx src/components/layout/Footer.test.tsx
git commit -m "feat: add Navbar and Footer layout components"
```

---

## Task 10: SectionTitle and CTASection

**Files:**
- Create: `src/components/ui/SectionTitle.tsx`, `src/components/ui/CTASection.tsx`
- Test: `src/components/ui/CTASection.test.tsx`

**Interfaces:**
- Consumes: `siteConfig` from `@/data/siteConfig`.
- Produces: `SectionTitle` (props: `eyebrow?`, `title`, `description?`, `align?: 'left' | 'center'`) and `CTASection` (props: `title`, `description?`, `ctaLabel?`, `ctaTo?`, `secondaryLabel?`, `secondaryTo?`), used by every page/section task from here on.

- [ ] **Step 1: Implement `src/components/ui/SectionTitle.tsx`** (pure presentational — no dedicated unit test, exercised indirectly wherever it's used; verified via `npm run build`)

```tsx
interface SectionTitleProps {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
}

export function SectionTitle({ eyebrow, title, description, align = 'left' }: SectionTitleProps) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow && <p className="text-sm font-semibold uppercase tracking-wide text-accent">{eyebrow}</p>}
      <h2 className="mt-2 font-display text-3xl text-ink md:text-4xl">{title}</h2>
      {description && <p className="mt-3 text-ink-muted">{description}</p>}
    </div>
  )
}
```

- [ ] **Step 2: Write the failing test — `src/components/ui/CTASection.test.tsx`**

```tsx
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CTASection } from './CTASection'

describe('CTASection', () => {
  it('renders the primary CTA pointing to /contatti by default', () => {
    render(<CTASection title="Parliamo del tuo progetto" />, { wrapper: MemoryRouter })
    expect(screen.getByRole('link', { name: 'Parliamo del tuo progetto' })).toHaveAttribute('href', '/contatti')
  })

  it('renders a secondary CTA only when explicitly provided', () => {
    render(<CTASection title="Test" />, { wrapper: MemoryRouter })
    expect(screen.queryByRole('link', { name: 'Richiedi un preventivo' })).not.toBeInTheDocument()

    render(
      <CTASection title="Test" secondaryLabel="Richiedi un preventivo" secondaryTo="/contatti" />,
      { wrapper: MemoryRouter },
    )
    expect(screen.getByRole('link', { name: 'Richiedi un preventivo' })).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm run test`
Expected: FAIL — `src/components/ui/CTASection.tsx` does not exist.

- [ ] **Step 4: Implement `src/components/ui/CTASection.tsx`**

```tsx
import { Link } from 'react-router-dom'
import { siteConfig } from '@/data/siteConfig'

interface CTASectionProps {
  title: string
  description?: string
  ctaLabel?: string
  ctaTo?: string
  secondaryLabel?: string
  secondaryTo?: string
}

export function CTASection({
  title,
  description,
  ctaLabel = siteConfig.primaryCta,
  ctaTo = '/contatti',
  secondaryLabel,
  secondaryTo,
}: CTASectionProps) {
  return (
    <section className="rounded-xl2 border border-white/10 bg-surface px-6 py-10 text-center md:px-12 md:py-14">
      <h2 className="font-display text-2xl text-ink md:text-3xl">{title}</h2>
      {description && <p className="mx-auto mt-3 max-w-xl text-ink-muted">{description}</p>}
      <div className="mt-6 flex flex-col items-center justify-center gap-3 md:flex-row">
        <Link to={ctaTo} className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-base hover:opacity-90">
          {ctaLabel}
        </Link>
        {secondaryLabel && secondaryTo && (
          <Link to={secondaryTo} className="rounded-full border border-white/20 px-6 py-3 text-sm text-ink hover:border-white/40">
            {secondaryLabel}
          </Link>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/SectionTitle.tsx src/components/ui/CTASection.tsx src/components/ui/CTASection.test.tsx
git commit -m "feat: add SectionTitle and CTASection UI components"
```

---

## Task 11: VideoPlayer (showreel component)

**Files:**
- Create: `src/components/ui/VideoPlayer.tsx`
- Test: `src/components/ui/VideoPlayer.test.tsx`

**Interfaces:**
- Consumes: `usePrefersReducedMotion` from `@/hooks/usePrefersReducedMotion`.
- Produces: `VideoPlayer` (props: `title: string`, `poster: string`, `src?: string`), used by `Hero` (Task 20) and `PortfolioDetailPage` (Task 22).

- [ ] **Step 1: Write the failing tests — `src/components/ui/VideoPlayer.test.tsx`**

```tsx
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { VideoPlayer } from './VideoPlayer'

describe('VideoPlayer', () => {
  it('shows the poster and a play button when a src is provided', () => {
    render(<VideoPlayer title="Showreel WildFocus" poster="/poster.jpg" src="/showreel.mp4" />)
    expect(screen.getByAltText('Showreel WildFocus')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /riproduci showreel wildfocus/i })).toBeInTheDocument()
  })

  it('loads the video element only after the play button is clicked', async () => {
    const user = userEvent.setup()
    render(<VideoPlayer title="Showreel WildFocus" poster="/poster.jpg" src="/showreel.mp4" />)
    expect(document.querySelector('video')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /riproduci showreel wildfocus/i }))
    expect(document.querySelector('video')).toBeInTheDocument()
  })

  it('shows a static placeholder poster with no play button when no src is provided', () => {
    render(<VideoPlayer title="Showreel WildFocus" poster="/poster.jpg" />)
    expect(screen.queryByRole('button', { name: /riproduci/i })).not.toBeInTheDocument()
    expect(screen.getByText(/showreel — \[placeholder\]/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm run test`
Expected: FAIL — `src/components/ui/VideoPlayer.tsx` does not exist.

- [ ] **Step 3: Implement `src/components/ui/VideoPlayer.tsx`**

```tsx
import { useState } from 'react'
import { Play } from 'lucide-react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

interface VideoPlayerProps {
  title: string
  poster: string
  src?: string
}

function isSlowConnection(): boolean {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
  return Boolean(connection?.saveData)
}

export function VideoPlayer({ title, poster, src }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()
  const showStaticPosterOnly = !src || prefersReducedMotion || isSlowConnection()

  if (isPlaying && src && !showStaticPosterOnly) {
    return (
      <video
        className="aspect-video w-full rounded-xl2 border border-white/10 object-cover"
        src={src}
        poster={poster}
        controls
        autoPlay
        muted
        playsInline
        aria-label={title}
      />
    )
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl2 border border-white/10">
      <img src={poster} alt={title} className="h-full w-full object-cover" loading="lazy" />
      {!showStaticPosterOnly && (
        <button
          type="button"
          onClick={() => setIsPlaying(true)}
          aria-label={`Riproduci ${title}`}
          className="absolute inset-0 flex items-center justify-center bg-black/30 transition hover:bg-black/40"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-base">
            <Play fill="currentColor" />
          </span>
        </button>
      )}
      {showStaticPosterOnly && (
        <p className="absolute bottom-3 left-3 rounded-full bg-black/50 px-3 py-1 text-xs text-ink">
          Showreel — [PLACEHOLDER]
        </p>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/VideoPlayer.tsx src/components/ui/VideoPlayer.test.tsx
git commit -m "feat: add VideoPlayer showreel component"
```

---

## Task 12: ServiceCard and PackageCard

**Files:**
- Create: `src/components/ui/ServiceCard.tsx`, `src/components/ui/PackageCard.tsx`
- Test: `src/components/ui/ServiceCard.test.tsx`, `src/components/ui/PackageCard.test.tsx`

**Interfaces:**
- Consumes: `Service`, `PackagePlan` from `@/types/content`.
- Produces: `ServiceCard` (props: `service: Service`) and `PackageCard` (props: `plan: PackagePlan`), used by `ServicesPage`/`ServicesSummary` (Tasks 21, 20).

- [ ] **Step 1: Write the failing test — `src/components/ui/ServiceCard.test.tsx`**

```tsx
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ServiceCard } from './ServiceCard'
import type { Service } from '@/types/content'

const service: Service = {
  slug: 'video-editing',
  title: 'Video Editing',
  outcomeStatement: 'Statement',
  problemSolved: 'Problem',
  includes: ['Reel', 'Color grading'],
  examples: [],
  ctaLabel: 'Parliamo del tuo progetto',
}

describe('ServiceCard', () => {
  it('links the CTA to the contact page with the service slug', () => {
    render(<ServiceCard service={service} />, { wrapper: MemoryRouter })
    expect(screen.getByRole('link', { name: 'Parliamo del tuo progetto' })).toHaveAttribute(
      'href',
      '/contatti?servizio=video-editing',
    )
  })

  it('lists every included work item', () => {
    render(<ServiceCard service={service} />, { wrapper: MemoryRouter })
    expect(screen.getByText('· Reel')).toBeInTheDocument()
    expect(screen.getByText('· Color grading')).toBeInTheDocument()
  })

  it('shows an "Esempi" list only when examples are provided', () => {
    render(<ServiceCard service={service} />, { wrapper: MemoryRouter })
    expect(screen.queryByText('Esempi')).not.toBeInTheDocument()

    render(<ServiceCard service={{ ...service, examples: ['Reel prodotto per brand'] }} />, { wrapper: MemoryRouter })
    expect(screen.getByText('Esempi')).toBeInTheDocument()
    expect(screen.getByText('· Reel prodotto per brand')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test`
Expected: FAIL — `src/components/ui/ServiceCard.tsx` does not exist.

- [ ] **Step 3: Implement `src/components/ui/ServiceCard.tsx`**

```tsx
import { Link } from 'react-router-dom'
import type { Service } from '@/types/content'

interface ServiceCardProps {
  service: Service
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article className="flex flex-col rounded-xl2 border border-white/10 bg-surface p-6">
      <h3 className="font-display text-xl text-ink">{service.title}</h3>
      <p className="mt-3 text-ink-muted">{service.outcomeStatement}</p>
      <p className="mt-3 text-sm text-ink-muted">
        <span className="text-ink">Risolve:</span> {service.problemSolved}
      </p>

      <ul className="mt-4 space-y-1 text-sm text-ink-muted">
        {service.includes.map((item) => (
          <li key={item}>· {item}</li>
        ))}
      </ul>

      {service.examples.length > 0 && (
        <div className="mt-4">
          <p className="text-xs uppercase tracking-wide text-ink-muted">Esempi</p>
          <ul className="mt-1 space-y-1 text-sm text-ink-muted">
            {service.examples.map((example) => (
              <li key={example}>· {example}</li>
            ))}
          </ul>
        </div>
      )}

      <Link
        to={`/contatti?servizio=${service.slug}`}
        className="mt-6 inline-block rounded-full border border-accent px-4 py-2 text-center text-sm font-semibold text-accent hover:bg-accent hover:text-base"
      >
        {service.ctaLabel}
      </Link>
    </article>
  )
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 5: Write the failing test — `src/components/ui/PackageCard.test.tsx`**

```tsx
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { PackageCard } from './PackageCard'
import type { PackagePlan } from '@/types/content'

const plan: PackagePlan = {
  slug: 'progetto-singolo',
  name: 'Progetto Singolo',
  description: 'Descrizione',
  highlights: ['Un servizio definito'],
  priceLabel: 'Preventivo personalizzato',
}

describe('PackageCard', () => {
  it('never shows an invented price, only "Preventivo personalizzato"', () => {
    render(<PackageCard plan={plan} />, { wrapper: MemoryRouter })
    expect(screen.getByText('Preventivo personalizzato')).toBeInTheDocument()
    expect(screen.queryByText(/€\d/)).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 6: Run the test to verify it fails**

Run: `npm run test`
Expected: FAIL — `src/components/ui/PackageCard.tsx` does not exist.

- [ ] **Step 7: Implement `src/components/ui/PackageCard.tsx`**

```tsx
import { Link } from 'react-router-dom'
import type { PackagePlan } from '@/types/content'

interface PackageCardProps {
  plan: PackagePlan
}

export function PackageCard({ plan }: PackageCardProps) {
  return (
    <article className="flex flex-col rounded-xl2 border border-white/10 bg-surface p-6">
      <h3 className="font-display text-xl text-ink">{plan.name}</h3>
      <p className="mt-3 text-ink-muted">{plan.description}</p>

      <ul className="mt-4 space-y-1 text-sm text-ink-muted">
        {plan.highlights.map((item) => (
          <li key={item}>· {item}</li>
        ))}
      </ul>

      <p className="mt-6 font-display text-lg text-accent">{plan.priceLabel}</p>

      <Link
        to={`/contatti?pacchetto=${plan.slug}`}
        className="mt-3 inline-block rounded-full bg-accent px-4 py-2 text-center text-sm font-semibold text-base hover:opacity-90"
      >
        Parliamo del tuo progetto
      </Link>
    </article>
  )
}
```

- [ ] **Step 8: Run the test to verify it passes**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/components/ui/ServiceCard.tsx src/components/ui/ServiceCard.test.tsx src/components/ui/PackageCard.tsx src/components/ui/PackageCard.test.tsx
git commit -m "feat: add ServiceCard and PackageCard components"
```

---

## Task 13: ProjectCard (media-first with placeholder fallback)

**Files:**
- Create: `src/components/ui/ProjectCard.tsx`
- Test: `src/components/ui/ProjectCard.test.tsx`

**Interfaces:**
- Consumes: `Project`, `ProjectCategory` from `@/types/content`.
- Produces: `ProjectCard` (props: `project: Project`), used by `PortfolioPage` (Task 22) and `PortfolioHighlight` (Task 20).

- [ ] **Step 1: Write the failing tests — `src/components/ui/ProjectCard.test.tsx`**

```tsx
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ProjectCard } from './ProjectCard'
import type { Project } from '@/types/content'

const baseProject: Project = {
  slug: 'progetto-1',
  title: '[PROGETTO PORTFOLIO]',
  category: 'video-editing',
  summary: 'Sommario progetto',
  serviceProvided: 'Video Editing',
  clientGoal: 'Obiettivo',
  result: 'Risultato qualitativo',
}

describe('ProjectCard', () => {
  it('falls back to the local placeholder when no real media is set', () => {
    render(<ProjectCard project={baseProject} />, { wrapper: MemoryRouter })
    expect(screen.getByTestId('project-placeholder')).toBeInTheDocument()
  })

  it('renders the real image when coverImage is provided, without the placeholder', () => {
    render(<ProjectCard project={{ ...baseProject, coverImage: '/real.jpg' }} />, { wrapper: MemoryRouter })
    expect(screen.queryByTestId('project-placeholder')).not.toBeInTheDocument()
    expect(screen.getByAltText('[PROGETTO PORTFOLIO]')).toHaveAttribute('src', '/real.jpg')
  })

  it('links to the project detail route', () => {
    render(<ProjectCard project={baseProject} />, { wrapper: MemoryRouter })
    expect(screen.getByRole('link')).toHaveAttribute('href', '/portfolio/progetto-1')
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm run test`
Expected: FAIL — `src/components/ui/ProjectCard.tsx` does not exist.

- [ ] **Step 3: Implement `src/components/ui/ProjectCard.tsx`**

```tsx
import { Link } from 'react-router-dom'
import { Film, Camera, Share2, Megaphone, PartyPopper, Sparkles } from 'lucide-react'
import type { Project, ProjectCategory } from '@/types/content'

const categoryLabels: Record<ProjectCategory, string> = {
  'video-editing': 'Video Editing',
  fotografia: 'Fotografia',
  social: 'Social Content',
  commercial: 'Commercial',
  eventi: 'Eventi',
  brand: 'Brand',
}

const categoryIcons: Record<ProjectCategory, typeof Film> = {
  'video-editing': Film,
  fotografia: Camera,
  social: Share2,
  commercial: Megaphone,
  eventi: PartyPopper,
  brand: Sparkles,
}

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const CategoryIcon = categoryIcons[project.category]
  const hasRealMedia = Boolean(project.coverImage || project.coverVideo)

  return (
    <Link
      to={`/portfolio/${project.slug}`}
      className="group block overflow-hidden rounded-xl2 border border-white/10 bg-surface transition hover:border-accent/60"
    >
      <div className="relative aspect-video w-full">
        {hasRealMedia && project.coverImage ? (
          <img
            src={project.coverImage}
            alt={project.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div
            data-testid="project-placeholder"
            className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-zinc-900 to-black p-4 text-center text-ink-muted"
          >
            <CategoryIcon aria-hidden="true" />
            <span className="text-sm">
              {categoryLabels[project.category]} — {project.title}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs uppercase tracking-wide text-accent">{categoryLabels[project.category]}</p>
        <h3 className="mt-1 font-display text-lg text-ink">{project.title}</h3>
        <p className="mt-1 text-sm text-ink-muted">{project.summary}</p>
      </div>
    </Link>
  )
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/ProjectCard.tsx src/components/ui/ProjectCard.test.tsx
git commit -m "feat: add ProjectCard with media-first placeholder fallback"
```

---

## Task 14: TestimonialCard and TeamMember

**Files:**
- Create: `src/components/ui/TestimonialCard.tsx`, `src/components/ui/TeamMember.tsx`
- Test: `src/components/ui/TestimonialCard.test.tsx`, `src/components/ui/TeamMember.test.tsx`

**Interfaces:**
- Consumes: `Testimonial`, `TeamMemberData` from `@/types/content`.
- Produces: `TestimonialCard` (props: `testimonial: Testimonial`) and `TeamMember` (props: `member: TeamMemberData`), used by `SocialProof` (Task 20) and `AboutPage` (Task 23).

- [ ] **Step 1: Write the failing test — `src/components/ui/TestimonialCard.test.tsx`**

```tsx
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TestimonialCard } from './TestimonialCard'
import type { Testimonial } from '@/types/content'

const testimonial: Testimonial = {
  quote: '[TESTIMONIANZA CLIENTE]',
  author: '[NOME MEMBRO TEAM]',
  role: 'Cliente',
}

describe('TestimonialCard', () => {
  it('renders the quote and the author', () => {
    render(<TestimonialCard testimonial={testimonial} />)
    expect(screen.getByText(/testimonianza cliente/i)).toBeInTheDocument()
    expect(screen.getByText('[NOME MEMBRO TEAM]')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test`
Expected: FAIL — `src/components/ui/TestimonialCard.tsx` does not exist.

- [ ] **Step 3: Implement `src/components/ui/TestimonialCard.tsx`**

```tsx
import type { Testimonial } from '@/types/content'

interface TestimonialCardProps {
  testimonial: Testimonial
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <figure className="rounded-xl2 border border-white/10 bg-surface p-6">
      <blockquote className="text-ink">&ldquo;{testimonial.quote}&rdquo;</blockquote>
      <figcaption className="mt-4 text-sm text-ink-muted">
        <span className="text-ink">{testimonial.author}</span> — {testimonial.role}
        {testimonial.company ? `, ${testimonial.company}` : ''}
      </figcaption>
    </figure>
  )
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 5: Write the failing test — `src/components/ui/TeamMember.test.tsx`**

```tsx
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
```

- [ ] **Step 6: Run the test to verify it fails**

Run: `npm run test`
Expected: FAIL — `src/components/ui/TeamMember.tsx` does not exist.

- [ ] **Step 7: Implement `src/components/ui/TeamMember.tsx`**

```tsx
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
```

- [ ] **Step 8: Run the tests to verify they pass**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/components/ui/TestimonialCard.tsx src/components/ui/TestimonialCard.test.tsx src/components/ui/TeamMember.tsx src/components/ui/TeamMember.test.tsx
git commit -m "feat: add TestimonialCard and TeamMember components"
```

---

## Task 15: FaqAccordion

**Files:**
- Create: `src/components/ui/FaqAccordion.tsx`
- Test: `src/components/ui/FaqAccordion.test.tsx`

**Interfaces:**
- Consumes: `FaqItem` from `@/types/content`.
- Produces: `FaqAccordion` (props: `items: FaqItem[]`), used by `ProcessPage` (Task 24).

- [ ] **Step 1: Write the failing tests — `src/components/ui/FaqAccordion.test.tsx`**

```tsx
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FaqAccordion } from './FaqAccordion'
import type { FaqItem } from '@/types/content'

const items: FaqItem[] = [
  { question: 'Domanda 1?', answer: 'Risposta 1' },
  { question: 'Domanda 2?', answer: 'Risposta 2' },
]

describe('FaqAccordion', () => {
  it('shows an answer only after its question is clicked', async () => {
    const user = userEvent.setup()
    render(<FaqAccordion items={items} />)

    expect(screen.queryByText('Risposta 1')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Domanda 1?' }))
    expect(screen.getByText('Risposta 1')).toBeInTheDocument()
  })

  it('closes the previously open answer when a new question is opened', async () => {
    const user = userEvent.setup()
    render(<FaqAccordion items={items} />)

    await user.click(screen.getByRole('button', { name: 'Domanda 1?' }))
    expect(screen.getByText('Risposta 1')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Domanda 2?' }))
    expect(screen.queryByText('Risposta 1')).not.toBeInTheDocument()
    expect(screen.getByText('Risposta 2')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm run test`
Expected: FAIL — `src/components/ui/FaqAccordion.tsx` does not exist.

- [ ] **Step 3: Implement `src/components/ui/FaqAccordion.tsx`**

```tsx
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { FaqItem } from '@/types/content'

interface FaqAccordionProps {
  items: FaqItem[]
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="divide-y divide-white/10 rounded-xl2 border border-white/10 bg-surface">
      {items.map((item, index) => {
        const isOpen = openIndex === index
        const panelId = `faq-panel-${index}`
        const buttonId = `faq-button-${index}`

        return (
          <div key={item.question}>
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between px-5 py-4 text-left text-ink"
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={`transition-transform ${isOpen ? 'rotate-180 text-accent' : 'text-ink-muted'}`}
                  aria-hidden="true"
                />
              </button>
            </h3>
            {isOpen && (
              <div id={panelId} role="region" aria-labelledby={buttonId} className="px-5 pb-4 text-sm text-ink-muted">
                {item.answer}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/FaqAccordion.tsx src/components/ui/FaqAccordion.test.tsx
git commit -m "feat: add single-open FaqAccordion component"
```

---

## Task 16: BeforeAfter and CaseStudyCard

**Files:**
- Create: `src/components/ui/BeforeAfter.tsx`, `src/components/ui/CaseStudyCard.tsx`
- Test: `src/components/ui/BeforeAfter.test.tsx`, `src/components/ui/CaseStudyCard.test.tsx`

**Interfaces:**
- Consumes: `ProjectBeforeAfter`, `Project` from `@/types/content`.
- Produces: `BeforeAfter` (props: `data: ProjectBeforeAfter`) and `CaseStudyCard` (props: `project: Project`), used by `PortfolioDetailPage` (Task 22).

- [ ] **Step 1: Write the failing tests — `src/components/ui/BeforeAfter.test.tsx`**

```tsx
import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { BeforeAfter } from './BeforeAfter'
import type { ProjectBeforeAfter } from '@/types/content'

const data: ProjectBeforeAfter = {
  before: 'materiale grezzo',
  after: 'versione finale',
  note: 'Nota di lavorazione',
}

describe('BeforeAfter', () => {
  it('starts with the slider at the midpoint', () => {
    render(<BeforeAfter data={data} />)
    const slider = screen.getByLabelText('Trascina per confrontare prima e dopo') as HTMLInputElement
    expect(slider.value).toBe('50')
  })

  it('updates the reveal amount when the slider moves', () => {
    render(<BeforeAfter data={data} />)
    const slider = screen.getByLabelText('Trascina per confrontare prima e dopo') as HTMLInputElement
    fireEvent.change(slider, { target: { value: '80' } })
    expect(slider.value).toBe('80')
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm run test`
Expected: FAIL — `src/components/ui/BeforeAfter.tsx` does not exist.

- [ ] **Step 3: Implement `src/components/ui/BeforeAfter.tsx`**

```tsx
import { useState } from 'react'
import type { ProjectBeforeAfter } from '@/types/content'

interface BeforeAfterProps {
  data: ProjectBeforeAfter
}

export function BeforeAfter({ data }: BeforeAfterProps) {
  const [revealPercent, setRevealPercent] = useState(50)

  return (
    <div className="rounded-xl2 border border-white/10 bg-surface p-4">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-900">
        <div className="absolute inset-0 flex items-center justify-center px-4 text-center text-sm text-ink-muted">
          Dopo — {data.after}
        </div>
        <div
          className="absolute inset-y-0 left-0 flex items-center overflow-hidden border-r-2 border-accent bg-black px-4 text-sm text-ink-muted"
          style={{ width: `${revealPercent}%` }}
        >
          <span className="whitespace-nowrap">Prima — {data.before}</span>
        </div>
      </div>

      <label className="mt-4 block text-sm text-ink-muted" htmlFor="before-after-slider">
        Trascina per confrontare prima e dopo
      </label>
      <input
        id="before-after-slider"
        type="range"
        min={0}
        max={100}
        value={revealPercent}
        aria-valuetext={`${revealPercent}% prima`}
        onChange={(event) => setRevealPercent(Number(event.target.value))}
        className="mt-2 w-full accent-accent"
      />
      <p className="mt-3 text-sm text-ink-muted">{data.note}</p>
    </div>
  )
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 5: Write the failing tests — `src/components/ui/CaseStudyCard.test.tsx`**

```tsx
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CaseStudyCard } from './CaseStudyCard'
import type { Project } from '@/types/content'

const project: Project = {
  slug: 'progetto-1',
  title: '[PROGETTO PORTFOLIO]',
  category: 'commercial',
  summary: 'Sommario',
  serviceProvided: 'Video Editing',
  clientGoal: 'Aumentare la coerenza visiva del brand',
  result: 'Risultato qualitativo',
}

describe('CaseStudyCard', () => {
  it('renders the client goal and the result', () => {
    render(<CaseStudyCard project={project} />)
    expect(screen.getByText('Aumentare la coerenza visiva del brand')).toBeInTheDocument()
    expect(screen.getByText('Risultato qualitativo')).toBeInTheDocument()
  })

  it('omits the testimonial block when no testimonial is present', () => {
    render(<CaseStudyCard project={project} />)
    expect(screen.queryByTestId('case-study-testimonial')).not.toBeInTheDocument()
  })

  it('shows the testimonial when present', () => {
    render(
      <CaseStudyCard
        project={{
          ...project,
          testimonial: { quote: '[TESTIMONIANZA CLIENTE]', author: '[NOME MEMBRO TEAM]', role: 'Cliente' },
        }}
      />,
    )
    expect(screen.getByTestId('case-study-testimonial')).toHaveTextContent('[TESTIMONIANZA CLIENTE]')
  })
})
```

- [ ] **Step 6: Run the tests to verify they fail**

Run: `npm run test`
Expected: FAIL — `src/components/ui/CaseStudyCard.tsx` does not exist.

- [ ] **Step 7: Implement `src/components/ui/CaseStudyCard.tsx`**

```tsx
import type { Project } from '@/types/content'

interface CaseStudyCardProps {
  project: Project
}

export function CaseStudyCard({ project }: CaseStudyCardProps) {
  return (
    <article className="rounded-xl2 border border-white/10 bg-surface p-6">
      <p className="text-xs uppercase tracking-wide text-accent">{project.serviceProvided}</p>
      <h3 className="mt-1 font-display text-lg text-ink">{project.title}</h3>

      <dl className="mt-4 space-y-3 text-sm">
        <div>
          <dt className="text-ink-muted">Obiettivo del cliente</dt>
          <dd className="text-ink">{project.clientGoal}</dd>
        </div>
        <div>
          <dt className="text-ink-muted">Risultato</dt>
          <dd className="text-ink">{project.result}</dd>
        </div>
      </dl>

      {project.testimonial && (
        <blockquote data-testid="case-study-testimonial" className="mt-4 border-l-2 border-accent pl-3 text-sm text-ink-muted">
          &ldquo;{project.testimonial.quote}&rdquo; — {project.testimonial.author}
        </blockquote>
      )}
    </article>
  )
}
```

- [ ] **Step 8: Run the tests to verify they pass**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/components/ui/BeforeAfter.tsx src/components/ui/BeforeAfter.test.tsx src/components/ui/CaseStudyCard.tsx src/components/ui/CaseStudyCard.test.tsx
git commit -m "feat: add BeforeAfter slider and CaseStudyCard components"
```

---

## Task 17: Contact form state machine

**Files:**
- Create: `src/components/forms/useContactFormState.ts`
- Test: `src/components/forms/useContactFormState.test.ts`

**Interfaces:**
- Consumes: `ContactFormFields`, `BudgetRange`, `ContactPreference` from `@/types/contact`.
- Produces:

```ts
export type ContactFormStep = 1 | 2 | 3
export function isStepValid(step: ContactFormStep, fields: ContactFormFields): boolean
export function useContactFormState(): {
  step: ContactFormStep
  fields: ContactFormFields
  updateField: <K extends keyof ContactFormFields>(key: K, value: ContactFormFields[K]) => void
  goNext: () => void
  goBack: () => void
  isStepValid: boolean
}
```

Used by `ContactForm` (Task 18).

- [ ] **Step 1: Write the failing tests — `src/components/forms/useContactFormState.test.ts`**

```ts
import { describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useContactFormState } from './useContactFormState'

describe('useContactFormState', () => {
  it('does not advance to step 2 while step 1 is invalid', () => {
    const { result } = renderHook(() => useContactFormState())

    act(() => result.current.goNext())
    expect(result.current.step).toBe(1)
  })

  it('advances to step 2 once name, email and service are filled', () => {
    const { result } = renderHook(() => useContactFormState())

    act(() => {
      result.current.updateField('fullName', 'Mario Rossi')
      result.current.updateField('email', 'mario@example.com')
      result.current.updateField('service', 'video-editing')
    })
    act(() => result.current.goNext())

    expect(result.current.step).toBe(2)
  })

  it('goBack moves from step 2 to step 1', () => {
    const { result } = renderHook(() => useContactFormState())
    act(() => {
      result.current.updateField('fullName', 'Mario Rossi')
      result.current.updateField('email', 'mario@example.com')
      result.current.updateField('service', 'video-editing')
    })
    act(() => result.current.goNext())
    expect(result.current.step).toBe(2)

    act(() => result.current.goBack())
    expect(result.current.step).toBe(1)
  })

  it('step 1 starts invalid until the required fields are filled', () => {
    const { result } = renderHook(() => useContactFormState())
    expect(result.current.isStepValid).toBe(false)

    act(() => {
      result.current.updateField('fullName', 'Mario Rossi')
      result.current.updateField('email', 'mario@example.com')
      result.current.updateField('service', 'video-editing')
    })
    expect(result.current.isStepValid).toBe(true)
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm run test`
Expected: FAIL — `src/components/forms/useContactFormState.ts` does not exist.

- [ ] **Step 3: Implement `src/components/forms/useContactFormState.ts`**

```ts
import { useState } from 'react'
import type { ContactFormFields } from '@/types/contact'

export type ContactFormStep = 1 | 2 | 3

const initialFields: ContactFormFields = {
  fullName: '',
  email: '',
  service: '',
  companyOrProject: '',
  projectDescription: '',
  timeline: '',
  budget: undefined,
  materialsLink: '',
  phone: '',
  contactPreference: undefined,
  privacyAccepted: false,
}

export function isStepValid(step: ContactFormStep, fields: ContactFormFields): boolean {
  if (step === 1) {
    return fields.fullName.trim().length > 0 && /\S+@\S+\.\S+/.test(fields.email) && fields.service.trim().length > 0
  }
  if (step === 2) {
    return fields.projectDescription.trim().length > 0 && fields.timeline.trim().length > 0
  }
  return fields.privacyAccepted
}

export function useContactFormState() {
  const [step, setStep] = useState<ContactFormStep>(1)
  const [fields, setFields] = useState<ContactFormFields>(initialFields)

  function updateField<K extends keyof ContactFormFields>(key: K, value: ContactFormFields[K]) {
    setFields((prev) => ({ ...prev, [key]: value }))
  }

  function goNext() {
    if (!isStepValid(step, fields)) return
    setStep((prev) => (prev < 3 ? ((prev + 1) as ContactFormStep) : prev))
  }

  function goBack() {
    setStep((prev) => (prev > 1 ? ((prev - 1) as ContactFormStep) : prev))
  }

  return { step, fields, updateField, goNext, goBack, isStepValid: isStepValid(step, fields) }
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/forms/useContactFormState.ts src/components/forms/useContactFormState.test.ts
git commit -m "feat: add contact form step state machine and validation"
```

---

## Task 18: ContactForm UI (3 steps, anti-spam, submission)

**Files:**
- Create: `src/components/forms/ContactForm.tsx`
- Test: `src/components/forms/ContactForm.test.tsx`

**Interfaces:**
- Consumes: `useContactFormState` (Task 17), `useFormMountTime` (Task 8), `submitContactRequest` (Task 7), `services` (Task 5), `BudgetRange`/`ContactPreference`/`ContactPayload` (Task 3).
- Produces: `ContactForm` (no props — self-contained), used by `ContactPage` (Task 26).

- [ ] **Step 1: Write the failing tests — `src/components/forms/ContactForm.test.tsx`**

```tsx
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactForm } from './ContactForm'

describe('ContactForm', () => {
  it('keeps "Continua" disabled until step 1 is valid', () => {
    render(<ContactForm />)
    expect(screen.getByRole('button', { name: 'Continua' })).toBeDisabled()
  })

  it('renders a honeypot field hidden from keyboard/screen-reader users', () => {
    render(<ContactForm />)
    const honeypot = screen.getByLabelText('Non compilare questo campo')
    expect(honeypot).toHaveAttribute('tabIndex', '-1')
  })

  it('completes the 3-step flow and shows the confirmation message', async () => {
    const startTime = 1_700_000_000_000
    const dateNowSpy = vi.spyOn(Date, 'now').mockReturnValue(startTime)
    const user = userEvent.setup()

    render(<ContactForm />)

    await user.type(screen.getByLabelText('Nome e cognome'), 'Mario Rossi')
    await user.type(screen.getByLabelText('Email'), 'mario@example.com')
    await user.selectOptions(screen.getByLabelText('Servizio richiesto'), 'video-editing')
    await user.click(screen.getByRole('button', { name: 'Continua' }))

    await user.type(screen.getByLabelText('Descrizione del progetto'), 'Ho bisogno di un video promozionale.')
    await user.type(screen.getByLabelText('Tempistiche'), 'Entro un mese')
    await user.click(screen.getByRole('button', { name: 'Continua' }))

    await user.click(screen.getByLabelText(/ho letto e accetto/i))

    // Jump the clock forward past the anti-spam minimum-delay threshold
    // without touching setTimeout, so userEvent's own internal timing is untouched.
    dateNowSpy.mockReturnValue(startTime + 4000)

    await user.click(screen.getByRole('button', { name: 'Richiedi un preventivo' }))

    expect(await screen.findByRole('status')).toHaveTextContent('Richiesta inviata')

    dateNowSpy.mockRestore()
  })
})
```

Note: an earlier draft of this test used `vi.useFakeTimers()` + `userEvent.setup({ delay: null })`. That combination deadlocks — `userEvent`'s internal scheduling and React's async state updates depend on real timers, so the test hangs until Vitest's default 5000ms timeout kills it. Mocking `Date.now` directly (as above) achieves the same anti-spam-timing control without touching `setTimeout`, so `userEvent` and the `contactService` mock's own `setTimeout(resolve, 400)` keep running on real time.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm run test`
Expected: FAIL — `src/components/forms/ContactForm.tsx` does not exist.

- [ ] **Step 3: Implement `src/components/forms/ContactForm.tsx`**

```tsx
import { useState, type FormEvent } from 'react'
import { useContactFormState } from './useContactFormState'
import { useFormMountTime } from '@/hooks/useFormMountTime'
import { submitContactRequest } from '@/services/contactService'
import { services } from '@/data/services'
import type { BudgetRange, ContactPayload, ContactPreference } from '@/types/contact'

const budgetOptions: BudgetRange[] = [
  'Meno di 500€',
  '500-1.000€',
  '1.000-2.500€',
  '2.500-5.000€',
  'Oltre 5.000€',
  'Da definire',
]

const contactPreferenceOptions: ContactPreference[] = ['Email', 'Telefono', 'WhatsApp']

export function ContactForm() {
  const { step, fields, updateField, goNext, goBack, isStepValid } = useContactFormState()
  const formRenderedAt = useFormMountTime()
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!isStepValid) return

    setStatus('submitting')
    setErrorMessage(null)

    const payload: ContactPayload = {
      ...fields,
      honeypot,
      formRenderedAt,
      submittedAt: Date.now(),
    }

    const result = await submitContactRequest(payload)
    if (result.ok) {
      setStatus('success')
    } else {
      setStatus('error')
      setErrorMessage(result.error ?? 'Si è verificato un errore. Riprova.')
    }
  }

  if (status === 'success') {
    return (
      <div role="status" className="rounded-xl2 border border-accent/40 bg-surface p-8 text-center">
        <h3 className="font-display text-2xl text-ink">Richiesta inviata</h3>
        <p className="mt-3 text-ink-muted">
          Grazie! Dopo la richiesta riceverai una prima risposta entro [TEMPO REALE]. Se il progetto è compatibile,
          organizziamo una breve call conoscitiva, poi ti inviamo un preventivo su misura.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-xl2 border border-white/10 bg-surface p-6 md:p-8">
      <p className="text-sm text-ink-muted">Passo {step} di 3</p>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Non compilare questo campo</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      {step === 1 && (
        <fieldset className="mt-4 space-y-4">
          <legend className="sr-only">I tuoi dati</legend>
          <div>
            <label htmlFor="fullName" className="block text-sm text-ink">Nome e cognome</label>
            <input
              id="fullName"
              required
              value={fields.fullName}
              onChange={(event) => updateField('fullName', event.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-base px-3 py-2 text-ink"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm text-ink">Email</label>
            <input
              id="email"
              type="email"
              required
              value={fields.email}
              onChange={(event) => updateField('email', event.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-base px-3 py-2 text-ink"
            />
          </div>
          <div>
            <label htmlFor="service" className="block text-sm text-ink">Servizio richiesto</label>
            <select
              id="service"
              required
              value={fields.service}
              onChange={(event) => updateField('service', event.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-base px-3 py-2 text-ink"
            >
              <option value="">Seleziona un servizio</option>
              {services.map((service) => (
                <option key={service.slug} value={service.slug}>
                  {service.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="companyOrProject" className="block text-sm text-ink">Azienda o progetto (facoltativo)</label>
            <input
              id="companyOrProject"
              value={fields.companyOrProject ?? ''}
              onChange={(event) => updateField('companyOrProject', event.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-base px-3 py-2 text-ink"
            />
          </div>
        </fieldset>
      )}

      {step === 2 && (
        <fieldset className="mt-4 space-y-4">
          <legend className="sr-only">Il tuo progetto</legend>
          <div>
            <label htmlFor="projectDescription" className="block text-sm text-ink">Descrizione del progetto</label>
            <textarea
              id="projectDescription"
              required
              rows={4}
              value={fields.projectDescription}
              onChange={(event) => updateField('projectDescription', event.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-base px-3 py-2 text-ink"
            />
          </div>
          <div>
            <label htmlFor="timeline" className="block text-sm text-ink">Tempistiche</label>
            <input
              id="timeline"
              required
              value={fields.timeline}
              onChange={(event) => updateField('timeline', event.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-base px-3 py-2 text-ink"
            />
          </div>
          <div>
            <label htmlFor="budget" className="block text-sm text-ink">Budget indicativo (facoltativo)</label>
            <select
              id="budget"
              value={fields.budget ?? ''}
              onChange={(event) =>
                updateField('budget', (event.target.value || undefined) as BudgetRange | undefined)
              }
              className="mt-1 w-full rounded-lg border border-white/10 bg-base px-3 py-2 text-ink"
            >
              <option value="">Preferisco non specificare</option>
              {budgetOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </fieldset>
      )}

      {step === 3 && (
        <fieldset className="mt-4 space-y-4">
          <legend className="sr-only">Ultimi dettagli</legend>
          <div>
            <label htmlFor="materialsLink" className="block text-sm text-ink">Link a materiali (facoltativo)</label>
            <input
              id="materialsLink"
              value={fields.materialsLink ?? ''}
              onChange={(event) => updateField('materialsLink', event.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-base px-3 py-2 text-ink"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm text-ink">Telefono (facoltativo)</label>
            <input
              id="phone"
              value={fields.phone ?? ''}
              onChange={(event) => updateField('phone', event.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-base px-3 py-2 text-ink"
            />
          </div>
          <div>
            <label htmlFor="contactPreference" className="block text-sm text-ink">
              Modalità di contatto preferita (facoltativo)
            </label>
            <select
              id="contactPreference"
              value={fields.contactPreference ?? ''}
              onChange={(event) =>
                updateField('contactPreference', (event.target.value || undefined) as ContactPreference | undefined)
              }
              className="mt-1 w-full rounded-lg border border-white/10 bg-base px-3 py-2 text-ink"
            >
              <option value="">Nessuna preferenza</option>
              {contactPreferenceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-start gap-2">
            <input
              id="privacyAccepted"
              type="checkbox"
              required
              checked={fields.privacyAccepted}
              onChange={(event) => updateField('privacyAccepted', event.target.checked)}
              className="mt-1"
            />
            <label htmlFor="privacyAccepted" className="text-sm text-ink-muted">
              Ho letto e accetto la{' '}
              <a href="/privacy-policy" className="text-accent underline">
                Privacy Policy
              </a>
              .
            </label>
          </div>
        </fieldset>
      )}

      {status === 'error' && <p role="alert" className="mt-4 text-sm text-red-400">{errorMessage}</p>}

      <div className="mt-6 flex items-center justify-between">
        {step > 1 ? (
          <button type="button" onClick={goBack} className="text-sm text-ink-muted hover:text-ink">
            Indietro
          </button>
        ) : (
          <span />
        )}

        {step < 3 ? (
          <button
            type="button"
            onClick={goNext}
            disabled={!isStepValid}
            className="rounded-full bg-accent px-6 py-2 text-sm font-semibold text-base disabled:opacity-40"
          >
            Continua
          </button>
        ) : (
          <button
            type="submit"
            disabled={!isStepValid || status === 'submitting'}
            className="rounded-full bg-accent px-6 py-2 text-sm font-semibold text-base disabled:opacity-40"
          >
            {status === 'submitting' ? 'Invio in corso…' : 'Richiedi un preventivo'}
          </button>
        )}
      </div>

      <p className="mt-4 text-xs text-ink-muted">
        Dopo la richiesta riceverai una prima risposta entro [TEMPO REALE]. Se il progetto è compatibile,
        organizziamo una breve call conoscitiva, poi ti inviamo un preventivo su misura.
      </p>
    </form>
  )
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 5: Verify the build**

Run: `npm run build`
Expected: succeeds with no TypeScript errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/forms/ContactForm.tsx src/components/forms/ContactForm.test.tsx
git commit -m "feat: add 3-step ContactForm with anti-spam and mock submission"
```

---

## Task 19: CookieConsent (dormant by default)

**Files:**
- Create: `src/components/ui/CookieConsent.tsx`
- Test: `src/components/ui/CookieConsent.test.tsx`

**Interfaces:**
- Produces: `CookieConsent` (no props, reads/writes `localStorage` key `wildfocus-cookie-consent`). **Not mounted in `App.tsx`** (Task 28) — the site currently uses no profiling cookies, so the banner stays available but inactive until a real analytics tool is wired in (per spec §11). Documented again in the README task (Task 31).

- [ ] **Step 1: Write the failing tests — `src/components/ui/CookieConsent.test.tsx`**

```tsx
import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CookieConsent } from './CookieConsent'

describe('CookieConsent', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('is visible when no consent has been stored yet', () => {
    render(<CookieConsent />)
    expect(screen.getByRole('dialog', { name: 'Preferenze cookie' })).toBeInTheDocument()
  })

  it('hides and persists the choice after accepting', async () => {
    const user = userEvent.setup()
    render(<CookieConsent />)

    await user.click(screen.getByRole('button', { name: 'Accetta' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(window.localStorage.getItem('wildfocus-cookie-consent')).toBe('accepted')
  })

  it('does not render when consent was already stored on a previous visit', () => {
    window.localStorage.setItem('wildfocus-cookie-consent', 'rejected')
    render(<CookieConsent />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm run test`
Expected: FAIL — `src/components/ui/CookieConsent.tsx` does not exist.

- [ ] **Step 3: Implement `src/components/ui/CookieConsent.tsx`**

```tsx
import { useEffect, useState } from 'react'

const STORAGE_KEY = 'wildfocus-cookie-consent'

type ConsentValue = 'accepted' | 'rejected'

export function CookieConsent() {
  const [consent, setConsent] = useState<ConsentValue | null>(null)

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'accepted' || stored === 'rejected') {
      setConsent(stored)
    }
  }, [])

  function respond(value: ConsentValue) {
    window.localStorage.setItem(STORAGE_KEY, value)
    setConsent(value)
  }

  if (consent) return null

  return (
    <div
      role="dialog"
      aria-label="Preferenze cookie"
      className="fixed inset-x-4 bottom-4 z-50 rounded-xl2 border border-white/10 bg-surface p-4 text-sm text-ink-muted md:inset-x-auto md:right-4 md:max-w-sm"
    >
      <p>
        Questo componente è predisposto per un futuro strumento di analytics, non ancora collegato. Al momento il
        sito non utilizza cookie di profilazione.
      </p>
      <div className="mt-3 flex justify-end gap-2">
        <button type="button" onClick={() => respond('rejected')} className="rounded-full border border-white/20 px-4 py-2 text-ink">
          Rifiuta
        </button>
        <button type="button" onClick={() => respond('accepted')} className="rounded-full bg-accent px-4 py-2 font-semibold text-base">
          Accetta
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/CookieConsent.tsx src/components/ui/CookieConsent.test.tsx
git commit -m "feat: add dormant CookieConsent component ready for future analytics"
```

---

## Task 20: Seo component and Home page (5 sections)

**Files:**
- Create: `src/seo/Seo.tsx`, `src/lib/placeholderPoster.ts`
- Create: `src/sections/home/Hero.tsx`, `src/sections/home/PortfolioHighlight.tsx`, `src/sections/home/ServicesSummary.tsx`, `src/sections/home/SocialProof.tsx`, `src/sections/home/FinalCta.tsx`
- Create: `src/pages/HomePage.tsx`
- Test: `src/seo/Seo.test.tsx`, `src/sections/home/PortfolioHighlight.test.tsx`, `src/pages/HomePage.test.tsx`

**Interfaces:**
- Consumes: `VideoPlayer` (Task 11), `SectionTitle`/`CTASection`/`ProjectCard`/`ServiceCard`/`TestimonialCard` (Tasks 10, 12, 13, 14), `projects`/`services`/`testimonials`/`siteConfig` data (Tasks 4-6).
- Produces: `Seo` (props: `title: string`, `description: string`, `path?: string`, `jsonLd?: Record<string, unknown>`) — reused by **every** page task from here on (21-27). `HomePage` default export, wired into routing in Task 28.

- [ ] **Step 1: Write the failing test — `src/seo/Seo.test.tsx`**

```tsx
import { describe, expect, it } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { Seo } from './Seo'

describe('Seo', () => {
  it('sets the document title via Helmet', async () => {
    render(
      <HelmetProvider>
        <Seo title="WildFocus — Home" description="Descrizione di test" />
      </HelmetProvider>,
    )

    await waitFor(() => {
      expect(document.title).toBe('WildFocus — Home')
    })
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test`
Expected: FAIL — `src/seo/Seo.tsx` does not exist.

- [ ] **Step 3: Implement `src/seo/Seo.tsx`**

```tsx
import { Helmet } from 'react-helmet-async'

interface SeoProps {
  title: string
  description: string
  path?: string
  jsonLd?: Record<string, unknown>
}

const SITE_URL_PLACEHOLDER = '[URL SITO WILDFOCUS]'

export function Seo({ title, description, path = '/', jsonLd }: SeoProps) {
  const url = `${SITE_URL_PLACEHOLDER}${path}`

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  )
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 5: Create `src/lib/placeholderPoster.ts`** (a code-generated gradient poster — no missing-image request while no real showreel frame exists yet)

```ts
export const heroPosterDataUri =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0%" stop-color="#16161A" />' +
      '<stop offset="100%" stop-color="#0A0A0B" />' +
      '</linearGradient></defs>' +
      '<rect width="960" height="540" fill="url(#g)" />' +
      '</svg>',
  )
```

- [ ] **Step 6: Implement `src/sections/home/Hero.tsx`**

```tsx
import { Link } from 'react-router-dom'
import { VideoPlayer } from '@/components/ui/VideoPlayer'
import { siteConfig } from '@/data/siteConfig'
import { heroPosterDataUri } from '@/lib/placeholderPoster'

export function Hero() {
  return (
    <section className="grid gap-10 py-12 md:grid-cols-2 md:items-center md:py-20">
      <div>
        <h1 className="font-display text-4xl leading-tight text-ink md:text-5xl">
          Contenuti che catturano l&apos;attenzione.
          <br />
          Immagini che fanno crescere il tuo brand.
        </h1>
        <p className="mt-4 max-w-lg text-ink-muted">{siteConfig.positioning}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/contatti" className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-base hover:opacity-90">
            {siteConfig.primaryCta}
          </Link>
          <Link to="/portfolio" className="rounded-full border border-white/20 px-6 py-3 text-sm text-ink hover:border-white/40">
            Guarda i nostri lavori
          </Link>
        </div>
      </div>

      <VideoPlayer title="Showreel WildFocus" poster={heroPosterDataUri} />
    </section>
  )
}
```

- [ ] **Step 7: Write the failing test — `src/sections/home/PortfolioHighlight.test.tsx`**

```tsx
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { PortfolioHighlight } from './PortfolioHighlight'
import { projects } from '@/data/projects'

describe('PortfolioHighlight', () => {
  it('renders only the first 3 projects', () => {
    render(<PortfolioHighlight />, { wrapper: MemoryRouter })
    expect(screen.getAllByRole('link')).toHaveLength(3)
    expect(projects.length).toBeGreaterThan(3)
  })
})
```

- [ ] **Step 8: Run the test to verify it fails**

Run: `npm run test`
Expected: FAIL — `src/sections/home/PortfolioHighlight.tsx` does not exist.

- [ ] **Step 9: Implement `src/sections/home/PortfolioHighlight.tsx`**

```tsx
import { Link } from 'react-router-dom'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { ProjectCard } from '@/components/ui/ProjectCard'
import { projects } from '@/data/projects'

export function PortfolioHighlight() {
  const highlighted = projects.slice(0, 3)

  return (
    <section className="py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionTitle eyebrow="Portfolio" title="Progetti in evidenza" />
        <Link to="/portfolio" className="text-sm font-semibold text-accent hover:underline">
          Scopri i nostri lavori
        </Link>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {highlighted.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 10: Run the test to verify it passes**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 11: Implement `src/sections/home/ServicesSummary.tsx`** (includes the compact 3-step "come lavoriamo" strip, per the Global Constraints — no standalone process section on Home)

```tsx
import { SectionTitle } from '@/components/ui/SectionTitle'
import { ServiceCard } from '@/components/ui/ServiceCard'
import { services } from '@/data/services'

const miniSteps = [
  { step: '1', label: 'Brief e obiettivi' },
  { step: '2', label: 'Produzione ed editing' },
  { step: '3', label: 'Consegna e supporto' },
]

export function ServicesSummary() {
  return (
    <section className="py-12">
      <SectionTitle
        eyebrow="Servizi"
        title="Cosa facciamo"
        description="Quattro aree di lavoro, un solo obiettivo: contenuti che generano risultati."
      />

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {services.map((service) => (
          <ServiceCard key={service.slug} service={service} />
        ))}
      </div>

      <div className="mt-10 flex flex-col gap-4 rounded-xl2 border border-white/10 bg-surface p-6 md:flex-row md:items-center md:justify-between">
        {miniSteps.map((item) => (
          <div key={item.step} className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-semibold text-base">
              {item.step}
            </span>
            <span className="text-sm text-ink-muted">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 12: Implement `src/sections/home/SocialProof.tsx`**

```tsx
import { SectionTitle } from '@/components/ui/SectionTitle'
import { TestimonialCard } from '@/components/ui/TestimonialCard'
import { testimonials } from '@/data/testimonials'
import { siteConfig } from '@/data/siteConfig'

export function SocialProof() {
  return (
    <section className="py-12">
      <SectionTitle eyebrow="Prova sociale" title="Chi ha lavorato con noi" align="center" />

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.author + testimonial.quote} testimonial={testimonial} />
        ))}
      </div>

      <dl className="mt-10 grid grid-cols-1 gap-6 text-center sm:grid-cols-3">
        {siteConfig.trustStats.map((stat) => (
          <div key={stat.label}>
            <dt className="text-sm text-ink-muted">{stat.label}</dt>
            <dd className="mt-1 font-display text-2xl text-accent">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
```

- [ ] **Step 13: Implement `src/sections/home/FinalCta.tsx`**

```tsx
import { CTASection } from '@/components/ui/CTASection'

export function FinalCta() {
  return (
    <div className="py-12">
      <CTASection
        title="Costruiamo il prossimo contenuto"
        description="Raccontaci il tuo progetto. Ti aiuteremo a trasformarlo in qualcosa che le persone vorranno guardare, ricordare e condividere."
        secondaryLabel="Scopri i nostri lavori"
        secondaryTo="/portfolio"
      />
    </div>
  )
}
```

Note: the secondary CTA here is **"Scopri i nostri lavori" → `/portfolio`**, not "Richiedi un preventivo". Per the Global Constraints, "Richiedi un preventivo" is reserved for the Contatti page only — every other page's `CTASection` pairs the primary CTA with a different, page-local secondary action so the two buttons never point at the same destination.

- [ ] **Step 14: Write the failing test — `src/pages/HomePage.test.tsx`**

```tsx
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import HomePage from './HomePage'

describe('HomePage', () => {
  it('renders the hero headline as the page h1', () => {
    render(
      <HelmetProvider>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </HelmetProvider>,
    )

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/contenuti che catturano l'attenzione/i)
  })
})
```

- [ ] **Step 15: Run the test to verify it fails**

Run: `npm run test`
Expected: FAIL — `src/pages/HomePage.tsx` does not exist.

- [ ] **Step 16: Implement `src/pages/HomePage.tsx`**

```tsx
import { Hero } from '@/sections/home/Hero'
import { PortfolioHighlight } from '@/sections/home/PortfolioHighlight'
import { ServicesSummary } from '@/sections/home/ServicesSummary'
import { SocialProof } from '@/sections/home/SocialProof'
import { FinalCta } from '@/sections/home/FinalCta'
import { Seo } from '@/seo/Seo'

export default function HomePage() {
  return (
    <>
      <Seo
        title="WildFocus — Video editing, fotografia e contenuti social"
        description="Video e contenuti visivi per aziende, creator e attività che vogliono aumentare attenzione, autorevolezza e conversioni."
      />
      <div className="mx-auto max-w-6xl px-4">
        <Hero />
        <PortfolioHighlight />
        <ServicesSummary />
        <SocialProof />
        <FinalCta />
      </div>
    </>
  )
}
```

- [ ] **Step 17: Run the tests to verify they pass**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 18: Verify the build**

Run: `npm run build`
Expected: succeeds with no TypeScript errors.

- [ ] **Step 19: Commit**

```bash
git add src/seo/Seo.tsx src/seo/Seo.test.tsx src/lib/placeholderPoster.ts src/sections/home/Hero.tsx src/sections/home/PortfolioHighlight.tsx src/sections/home/PortfolioHighlight.test.tsx src/sections/home/ServicesSummary.tsx src/sections/home/SocialProof.tsx src/sections/home/FinalCta.tsx src/pages/HomePage.tsx src/pages/HomePage.test.tsx
git commit -m "feat: add Seo component and assemble the 5-section Home page"
```

---

## Task 21: Services page

**Files:**
- Create: `src/pages/ServicesPage.tsx`
- Test: `src/pages/ServicesPage.test.tsx`

**Interfaces:**
- Consumes: `Seo` (Task 20), `SectionTitle`/`ServiceCard`/`PackageCard`/`CTASection` (Tasks 10, 12), `services`/`packages` data (Task 5).
- Produces: `ServicesPage` default export, wired into routing in Task 28.

- [ ] **Step 1: Write the failing test — `src/pages/ServicesPage.test.tsx`**

```tsx
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import ServicesPage from './ServicesPage'
import { services } from '@/data/services'
import { packages } from '@/data/packages'

describe('ServicesPage', () => {
  it('renders every macro-service and every package, never an invented price', () => {
    render(
      <HelmetProvider>
        <MemoryRouter>
          <ServicesPage />
        </MemoryRouter>
      </HelmetProvider>,
    )

    services.forEach((service) => {
      expect(screen.getByRole('heading', { name: service.title })).toBeInTheDocument()
    })
    packages.forEach((plan) => {
      expect(screen.getByRole('heading', { name: plan.name })).toBeInTheDocument()
    })
    expect(screen.queryByText(/€\d/)).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test`
Expected: FAIL — `src/pages/ServicesPage.tsx` does not exist.

- [ ] **Step 3: Implement `src/pages/ServicesPage.tsx`**

```tsx
import { SectionTitle } from '@/components/ui/SectionTitle'
import { ServiceCard } from '@/components/ui/ServiceCard'
import { PackageCard } from '@/components/ui/PackageCard'
import { CTASection } from '@/components/ui/CTASection'
import { services } from '@/data/services'
import { packages } from '@/data/packages'
import { Seo } from '@/seo/Seo'

export default function ServicesPage() {
  return (
    <>
      <Seo
        title="Servizi — WildFocus | Video editing, fotografia, contenuti social"
        description="Video editing, fotografia e shooting, contenuti social, produzione per brand e aziende. Preventivo personalizzato per ogni progetto."
      />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <SectionTitle
          eyebrow="Servizi"
          title="Le nostre aree di lavoro"
          description="Quattro macro-servizi, ogni lavorazione pensata per un risultato concreto."
        />

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>

        <div className="mt-16">
          <SectionTitle
            eyebrow="Pacchetti"
            title="Come possiamo collaborare"
            description="Ogni pacchetto viene definito su misura. Nessun prezzo standard: solo preventivi personalizzati."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {packages.map((plan) => (
              <PackageCard key={plan.slug} plan={plan} />
            ))}
          </div>
        </div>

        <div className="mt-16">
          <CTASection title="Parliamo del tuo progetto" secondaryLabel="Scopri i nostri lavori" secondaryTo="/portfolio" />
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/ServicesPage.tsx src/pages/ServicesPage.test.tsx
git commit -m "feat: add Services page with 4 macro-services and 3 packages"
```

---

## Task 22: Portfolio page (filterable grid) and Portfolio detail page

**Files:**
- Create: `src/pages/PortfolioPage.tsx`, `src/pages/PortfolioDetailPage.tsx`
- Test: `src/pages/PortfolioPage.test.tsx`, `src/pages/PortfolioDetailPage.test.tsx`

**Interfaces:**
- Consumes: `Seo` (Task 20), `SectionTitle`/`ProjectCard`/`CaseStudyCard`/`BeforeAfter`/`CTASection` (Tasks 10, 13, 16), `projects` data (Task 6), `ProjectCategory` (Task 3).
- Produces: `PortfolioPage` and `PortfolioDetailPage` default exports, wired into routing (`/portfolio`, `/portfolio/:slug`) in Task 28.

- [ ] **Step 1: Write the failing tests — `src/pages/PortfolioPage.test.tsx`**

```tsx
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import PortfolioPage from './PortfolioPage'
import { projects } from '@/data/projects'

function renderPage() {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <PortfolioPage />
      </MemoryRouter>
    </HelmetProvider>,
  )
}

describe('PortfolioPage', () => {
  it('shows every project when "Tutti" is active', () => {
    renderPage()
    expect(screen.getAllByRole('link')).toHaveLength(projects.length)
  })

  it('filters projects by category', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: 'Fotografia' }))

    const expectedCount = projects.filter((project) => project.category === 'fotografia').length
    expect(screen.getAllByRole('link')).toHaveLength(expectedCount)
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm run test`
Expected: FAIL — `src/pages/PortfolioPage.tsx` does not exist.

- [ ] **Step 3: Implement `src/pages/PortfolioPage.tsx`**

```tsx
import { useMemo, useState } from 'react'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { ProjectCard } from '@/components/ui/ProjectCard'
import { projects } from '@/data/projects'
import { Seo } from '@/seo/Seo'
import type { ProjectCategory } from '@/types/content'

type FilterValue = ProjectCategory | 'tutti'

const filters: { value: FilterValue; label: string }[] = [
  { value: 'tutti', label: 'Tutti' },
  { value: 'video-editing', label: 'Video Editing' },
  { value: 'fotografia', label: 'Fotografia' },
  { value: 'social', label: 'Social Content' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'eventi', label: 'Eventi' },
  { value: 'brand', label: 'Brand' },
]

export default function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState<FilterValue>('tutti')

  const filteredProjects = useMemo(
    () => (activeFilter === 'tutti' ? projects : projects.filter((project) => project.category === activeFilter)),
    [activeFilter],
  )

  return (
    <>
      <Seo
        title="Portfolio — WildFocus | Video, fotografia e contenuti social"
        description="I lavori realizzati da WildFocus: video editing, fotografia, contenuti social, commercial, eventi e brand."
      />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <SectionTitle
          eyebrow="Portfolio"
          title="I nostri lavori"
          description="Ogni progetto è pensato per un obiettivo preciso: coerenza visiva, attenzione, conversioni."
        />

        <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filtra per categoria">
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setActiveFilter(filter.value)}
              aria-pressed={activeFilter === filter.value}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                activeFilter === filter.value
                  ? 'border-accent bg-accent text-base'
                  : 'border-white/20 text-ink-muted hover:border-white/40'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 5: Write the failing tests — `src/pages/PortfolioDetailPage.test.tsx`**

```tsx
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import PortfolioDetailPage from './PortfolioDetailPage'
import { projects } from '@/data/projects'

function renderAt(path: string) {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/portfolio/:slug" element={<PortfolioDetailPage />} />
          <Route path="/portfolio" element={<div>Portfolio index</div>} />
        </Routes>
      </MemoryRouter>
    </HelmetProvider>,
  )
}

describe('PortfolioDetailPage', () => {
  it('renders the matching project details', () => {
    const [firstProject] = projects
    renderAt(`/portfolio/${firstProject.slug}`)
    expect(screen.getByText(firstProject.clientGoal)).toBeInTheDocument()
  })

  it('redirects to /portfolio when the slug does not match any project', () => {
    renderAt('/portfolio/progetto-inesistente')
    expect(screen.getByText('Portfolio index')).toBeInTheDocument()
  })
})
```

- [ ] **Step 6: Run the tests to verify they fail**

Run: `npm run test`
Expected: FAIL — `src/pages/PortfolioDetailPage.tsx` does not exist.

- [ ] **Step 7: Implement `src/pages/PortfolioDetailPage.tsx`**

```tsx
import { Navigate, useParams } from 'react-router-dom'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { CaseStudyCard } from '@/components/ui/CaseStudyCard'
import { BeforeAfter } from '@/components/ui/BeforeAfter'
import { CTASection } from '@/components/ui/CTASection'
import { projects } from '@/data/projects'
import { Seo } from '@/seo/Seo'

export default function PortfolioDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const project = projects.find((item) => item.slug === slug)

  if (!project) {
    return <Navigate to="/portfolio" replace />
  }

  return (
    <>
      <Seo title={`${project.title} — Portfolio WildFocus`} description={project.summary} />
      <div className="mx-auto max-w-4xl px-4 py-12">
        <SectionTitle eyebrow={project.serviceProvided} title={project.title} description={project.summary} />

        <div className="mt-8">
          <CaseStudyCard project={project} />
        </div>

        {project.beforeAfter && (
          <div className="mt-8">
            <BeforeAfter data={project.beforeAfter} />
          </div>
        )}

        <div className="mt-12">
          <CTASection title="Parliamo del tuo progetto" secondaryLabel="Guarda altri lavori" secondaryTo="/portfolio" />
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 8: Run the tests to verify they pass**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/pages/PortfolioPage.tsx src/pages/PortfolioPage.test.tsx src/pages/PortfolioDetailPage.tsx src/pages/PortfolioDetailPage.test.tsx
git commit -m "feat: add filterable Portfolio page and Portfolio detail page"
```

---

## Task 23: About page (Chi siamo)

**Files:**
- Create: `src/pages/AboutPage.tsx`
- Test: `src/pages/AboutPage.test.tsx`

**Interfaces:**
- Consumes: `Seo` (Task 20), `SectionTitle`/`TeamMember`/`CTASection` (Tasks 10, 14), `team` data (Task 6).
- Produces: `AboutPage` default export, wired into routing in Task 28.

- [ ] **Step 1: Write the failing test — `src/pages/AboutPage.test.tsx`**

```tsx
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import AboutPage from './AboutPage'
import { team } from '@/data/team'

describe('AboutPage', () => {
  it('renders every team member', () => {
    render(
      <HelmetProvider>
        <MemoryRouter>
          <AboutPage />
        </MemoryRouter>
      </HelmetProvider>,
    )

    team.forEach((member) => {
      expect(screen.getByText(member.role)).toBeInTheDocument()
    })
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test`
Expected: FAIL — `src/pages/AboutPage.tsx` does not exist.

- [ ] **Step 3: Implement `src/pages/AboutPage.tsx`**

```tsx
import { SectionTitle } from '@/components/ui/SectionTitle'
import { TeamMember } from '@/components/ui/TeamMember'
import { CTASection } from '@/components/ui/CTASection'
import { team } from '@/data/team'
import { Seo } from '@/seo/Seo'

const values = [
  'Creatività',
  'Attenzione ai dettagli',
  'Comunicazione trasparente',
  'Puntualità',
  'Qualità',
  'Ricerca continua',
  'Orientamento ai risultati',
]

export default function AboutPage() {
  return (
    <>
      <Seo
        title="Chi siamo — WildFocus"
        description="WildFocus è un team creativo specializzato in video editing, fotografia e contenuti social, nato per trasformare idee in contenuti che generano risultati."
      />
      <div className="mx-auto max-w-5xl px-4 py-12">
        <SectionTitle
          eyebrow="Chi siamo"
          title="Un team creativo, non un'agenzia generica"
          description="WildFocus nasce dall'idea che ogni contenuto debba avere uno scopo: attirare attenzione, raccontare valore e portare il pubblico a compiere un'azione."
        />

        <ul className="mt-8 flex flex-wrap gap-3">
          {values.map((value) => (
            <li key={value} className="rounded-full border border-white/10 bg-surface px-4 py-2 text-sm text-ink-muted">
              {value}
            </li>
          ))}
        </ul>

        <div className="mt-16">
          <SectionTitle eyebrow="Il team" title="Le persone dietro WildFocus" />
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {team.map((member) => (
              <TeamMember key={member.name + member.role} member={member} />
            ))}
          </div>
        </div>

        <div className="mt-16">
          <CTASection title="Parliamo del tuo progetto" />
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/AboutPage.tsx src/pages/AboutPage.test.tsx
git commit -m "feat: add About page with values and team section"
```

---

## Task 24: Process page (4 phases + FAQ)

**Files:**
- Create: `src/pages/ProcessPage.tsx`
- Test: `src/pages/ProcessPage.test.tsx`

**Interfaces:**
- Consumes: `Seo` (Task 20), `SectionTitle`/`FaqAccordion`/`CTASection` (Tasks 10, 15), `faqItems` data (Task 6).
- Produces: `ProcessPage` default export, wired into routing in Task 28.

- [ ] **Step 1: Write the failing test — `src/pages/ProcessPage.test.tsx`**

```tsx
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import ProcessPage from './ProcessPage'
import { faqItems } from '@/data/faq'

function renderPage() {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <ProcessPage />
      </MemoryRouter>
    </HelmetProvider>,
  )
}

describe('ProcessPage', () => {
  it('renders all four process phases', () => {
    renderPage()
    ;['Scoperta', 'Ideazione', 'Produzione', 'Consegna'].forEach((phase) => {
      expect(screen.getByRole('heading', { name: phase })).toBeInTheDocument()
    })
  })

  it('renders every FAQ question', () => {
    renderPage()
    faqItems.forEach((item) => {
      expect(screen.getByRole('button', { name: item.question })).toBeInTheDocument()
    })
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm run test`
Expected: FAIL — `src/pages/ProcessPage.tsx` does not exist.

- [ ] **Step 3: Implement `src/pages/ProcessPage.tsx`**

```tsx
import { SectionTitle } from '@/components/ui/SectionTitle'
import { FaqAccordion } from '@/components/ui/FaqAccordion'
import { CTASection } from '@/components/ui/CTASection'
import { faqItems } from '@/data/faq'
import { Seo } from '@/seo/Seo'

const phases = [
  { name: 'Scoperta', steps: ['Brief iniziale', 'Analisi degli obiettivi'] },
  { name: 'Ideazione', steps: ['Ideazione creativa'] },
  { name: 'Produzione', steps: ['Produzione o ricezione dei materiali', 'Editing e post-produzione'] },
  { name: 'Consegna', steps: ['Revisione', 'Consegna finale', 'Supporto successivo'] },
]

export default function ProcessPage() {
  return (
    <>
      <Seo
        title="Processo — WildFocus | Come lavoriamo"
        description="Dal brief iniziale alla consegna finale: il metodo di lavoro WildFocus in quattro fasi, pensato per essere semplice e rassicurante."
      />
      <div className="mx-auto max-w-5xl px-4 py-12">
        <SectionTitle
          eyebrow="Processo"
          title="Come lavoriamo"
          description="Quattro fasi, un percorso chiaro dal primo contatto alla consegna finale."
        />

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {phases.map((phase, index) => (
            <div key={phase.name} className="rounded-xl2 border border-white/10 bg-surface p-6">
              <span className="text-sm font-semibold text-accent">Fase {index + 1}</span>
              <h3 className="mt-1 font-display text-xl text-ink">{phase.name}</h3>
              <ul className="mt-3 space-y-1 text-sm text-ink-muted">
                {phase.steps.map((step) => (
                  <li key={step}>· {step}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <SectionTitle eyebrow="FAQ" title="Domande frequenti" />
          <div className="mt-8">
            <FaqAccordion items={faqItems} />
          </div>
        </div>

        <div className="mt-16">
          <CTASection title="Parliamo del tuo progetto" secondaryLabel="Guarda cosa possiamo creare" secondaryTo="/portfolio" />
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/ProcessPage.tsx src/pages/ProcessPage.test.tsx
git commit -m "feat: add Process page with 4 phases and FAQ accordion"
```

---

## Task 25: Collaborations page

**Files:**
- Create: `src/pages/CollaborationsPage.tsx`
- Test: `src/pages/CollaborationsPage.test.tsx`

**Interfaces:**
- Consumes: `Seo` (Task 20), `SectionTitle`/`CTASection` (Task 10).
- Produces: `CollaborationsPage` default export, wired into routing in Task 28.

- [ ] **Step 1: Write the failing test — `src/pages/CollaborationsPage.test.tsx`**

```tsx
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import CollaborationsPage from './CollaborationsPage'

describe('CollaborationsPage', () => {
  it('links its primary CTA to Contatti with the collaboration service preselected', () => {
    render(
      <HelmetProvider>
        <MemoryRouter>
          <CollaborationsPage />
        </MemoryRouter>
      </HelmetProvider>,
    )

    expect(screen.getByRole('link', { name: 'Parliamo del tuo progetto' })).toHaveAttribute(
      'href',
      '/contatti?servizio=collaborazione-continuativa',
    )
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test`
Expected: FAIL — `src/pages/CollaborationsPage.tsx` does not exist.

- [ ] **Step 3: Implement `src/pages/CollaborationsPage.tsx`**

```tsx
import { SectionTitle } from '@/components/ui/SectionTitle'
import { CTASection } from '@/components/ui/CTASection'
import { Seo } from '@/seo/Seo'

const recurringServices = [
  'Montaggio di Reel mensili',
  'Post-produzione continuativa',
  'Shooting periodici',
  'Gestione di grandi quantità di contenuti',
  'Adattamento dei video per più piattaforme',
  'Creazione di formati coordinati',
  'Supporto creativo continuativo',
]

export default function CollaborationsPage() {
  return (
    <>
      <Seo
        title="Collaborazioni — WildFocus | Contenuti mensili per aziende e creator"
        description="Pacchetti di contenuti mensili e collaborazioni continuative per aziende, creator e professionisti che hanno bisogno di produzione costante."
      />
      <div className="mx-auto max-w-5xl px-4 py-12">
        <SectionTitle
          eyebrow="Collaborazioni"
          title="Contenuti con continuità, mese dopo mese"
          description="Per aziende, creator e professionisti che non possono permettersi cali di presenza: una produzione costante, coordinata su più formati e piattaforme."
        />

        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {recurringServices.map((service) => (
            <li key={service} className="rounded-xl border border-white/10 bg-surface p-4 text-sm text-ink-muted">
              {service}
            </li>
          ))}
        </ul>

        <div className="mt-16">
          <CTASection
            title="Costruiamo il prossimo contenuto"
            description="Raccontaci le tue esigenze mensili: troviamo insieme il ritmo di produzione giusto."
            ctaTo="/contatti?servizio=collaborazione-continuativa"
          />
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/CollaborationsPage.tsx src/pages/CollaborationsPage.test.tsx
git commit -m "feat: add Collaborations page for recurring monthly packages"
```

---

## Task 26: Contact page

**Files:**
- Create: `src/pages/ContactPage.tsx`
- Test: `src/pages/ContactPage.test.tsx`

**Interfaces:**
- Consumes: `Seo` (Task 20), `SectionTitle` (Task 10), `ContactForm` (Task 18), `siteConfig` (Task 4).
- Produces: `ContactPage` default export, wired into routing in Task 28.

- [ ] **Step 1: Write the failing tests — `src/pages/ContactPage.test.tsx`**

```tsx
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import ContactPage from './ContactPage'

describe('ContactPage', () => {
  it('shows the preselected service from the query string', () => {
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={['/contatti?servizio=video-editing']}>
          <ContactPage />
        </MemoryRouter>
      </HelmetProvider>,
    )

    expect(screen.getByText('video-editing')).toBeInTheDocument()
  })

  it('renders a WhatsApp link only on this page\'s contact block', () => {
    render(
      <HelmetProvider>
        <MemoryRouter>
          <ContactPage />
        </MemoryRouter>
      </HelmetProvider>,
    )

    expect(screen.getByRole('link', { name: 'Scrivici su WhatsApp' })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm run test`
Expected: FAIL — `src/pages/ContactPage.tsx` does not exist.

- [ ] **Step 3: Implement `src/pages/ContactPage.tsx`**

```tsx
import { useSearchParams } from 'react-router-dom'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { ContactForm } from '@/components/forms/ContactForm'
import { siteConfig } from '@/data/siteConfig'
import { Seo } from '@/seo/Seo'

const afterSubmitSteps = ['Richiesta', 'Risposta e call conoscitiva', 'Preventivo su misura', 'Avvio del progetto']

export default function ContactPage() {
  const [searchParams] = useSearchParams()
  const preselectedService = searchParams.get('servizio')

  return (
    <>
      <Seo
        title="Contatti — WildFocus | Richiedi un preventivo"
        description="Raccontaci il tuo progetto: video editing, fotografia, contenuti social o produzione per brand. Ti risponderemo con i prossimi passi."
      />
      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 md:grid-cols-[1.1fr,0.9fr]">
        <div>
          <SectionTitle
            eyebrow="Contatti"
            title="Raccontaci il tuo progetto"
            description="Ti aiuteremo a trasformarlo in qualcosa che le persone vorranno guardare, ricordare e condividere."
          />

          {preselectedService && (
            <p className="mt-3 text-sm text-ink-muted">
              Servizio selezionato: <span className="text-accent">{preselectedService}</span>
            </p>
          )}

          <ol className="mt-8 space-y-3 text-sm text-ink-muted">
            {afterSubmitSteps.map((step, index) => (
              <li key={step} className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface text-xs text-accent">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>

          <div className="mt-8 space-y-2 text-sm text-ink-muted">
            <p>
              Email:{' '}
              <a href={`mailto:${siteConfig.email}`} className="text-accent hover:underline">
                {siteConfig.email}
              </a>
            </p>
            <p>
              WhatsApp:{' '}
              <a href={siteConfig.whatsappLink} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                Scrivici su WhatsApp
              </a>
            </p>
            <div className="flex gap-4 pt-2">
              {siteConfig.socials.map((social) => (
                <a key={social.platform} href={social.url} target="_blank" rel="noreferrer" className="hover:text-ink">
                  {social.platform}
                </a>
              ))}
            </div>
          </div>
        </div>

        <ContactForm />
      </div>
    </>
  )
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/ContactPage.tsx src/pages/ContactPage.test.tsx
git commit -m "feat: add Contact page with preselected service and WhatsApp link"
```

---

## Task 27: Privacy Policy, Cookie Policy and 404 pages

**Files:**
- Create: `src/pages/PrivacyPolicyPage.tsx`, `src/pages/CookiePolicyPage.tsx`, `src/pages/NotFoundPage.tsx`
- Test: `src/pages/LegalAndNotFoundPages.test.tsx`

**Interfaces:**
- Consumes: `Seo` (Task 20), `SectionTitle` (Task 10), `siteConfig` (Task 4).
- Produces: `PrivacyPolicyPage`, `CookiePolicyPage`, `NotFoundPage` default exports, wired into routing in Task 28.

- [ ] **Step 1: Write the failing tests — `src/pages/LegalAndNotFoundPages.test.tsx`**

```tsx
import type { ReactElement } from 'react'
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import PrivacyPolicyPage from './PrivacyPolicyPage'
import CookiePolicyPage from './CookiePolicyPage'
import NotFoundPage from './NotFoundPage'

function renderWithProviders(ui: ReactElement) {
  return render(
    <HelmetProvider>
      <MemoryRouter>{ui}</MemoryRouter>
    </HelmetProvider>,
  )
}

describe('Legal and 404 pages', () => {
  it('shows the draft disclaimer on the Privacy Policy page', () => {
    renderWithProviders(<PrivacyPolicyPage />)
    expect(screen.getByRole('note')).toHaveTextContent(/bozza/i)
  })

  it('shows the draft disclaimer on the Cookie Policy page', () => {
    renderWithProviders(<CookiePolicyPage />)
    expect(screen.getByRole('note')).toHaveTextContent(/bozza/i)
  })

  it('links back to the Home page from the 404 page', () => {
    renderWithProviders(<NotFoundPage />)
    expect(screen.getByRole('link', { name: 'Torna alla Home' })).toHaveAttribute('href', '/')
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm run test`
Expected: FAIL — none of the three page files exist yet.

- [ ] **Step 3: Implement `src/pages/PrivacyPolicyPage.tsx`**

```tsx
import { SectionTitle } from '@/components/ui/SectionTitle'
import { siteConfig } from '@/data/siteConfig'
import { Seo } from '@/seo/Seo'

export default function PrivacyPolicyPage() {
  return (
    <>
      <Seo title="Privacy Policy — WildFocus" description="Informativa sul trattamento dei dati raccolti tramite il form contatti di WildFocus." />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div role="note" className="rounded-xl2 border border-accent/40 bg-surface p-4 text-sm text-ink">
          Bozza — testo non definitivo, da far revisionare da un professionista legale prima della pubblicazione.
        </div>

        <div className="mt-8">
          <SectionTitle title="Privacy Policy" />
          <div className="mt-4 space-y-4 text-sm text-ink-muted">
            <p>
              I dati inseriti nel form contatti (nome, email, eventuale telefono, dettagli del progetto) vengono
              utilizzati esclusivamente per rispondere alla richiesta e, se necessario, formulare un preventivo.
            </p>
            <p>
              Allo stato attuale il sito non utilizza cookie di profilazione o strumenti di analytics. Per i dettagli
              sui cookie tecnici, consulta la{' '}
              <a href="/cookie-policy" className="text-accent underline">
                Cookie Policy
              </a>
              .
            </p>
            <p>Titolare del trattamento: WildFocus, {siteConfig.email}.</p>
          </div>
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 4: Implement `src/pages/CookiePolicyPage.tsx`**

```tsx
import { SectionTitle } from '@/components/ui/SectionTitle'
import { Seo } from '@/seo/Seo'

export default function CookiePolicyPage() {
  return (
    <>
      <Seo title="Cookie Policy — WildFocus" description="Informativa sui cookie utilizzati dal sito WildFocus." />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div role="note" className="rounded-xl2 border border-accent/40 bg-surface p-4 text-sm text-ink">
          Bozza — testo non definitivo, da far revisionare da un professionista legale prima della pubblicazione.
        </div>

        <div className="mt-8">
          <SectionTitle title="Cookie Policy" />
          <div className="mt-4 space-y-4 text-sm text-ink-muted">
            <p>
              Il sito, allo stato attuale, utilizza esclusivamente cookie tecnici necessari al funzionamento di base.
              Non sono attivi cookie di profilazione o strumenti di analytics.
            </p>
            <p>
              Se in futuro verranno attivati strumenti di analisi (es. Google Analytics), questa pagina verrà
              aggiornata e verrà mostrato un banner di consenso prima dell&apos;attivazione di qualsiasi cookie non
              tecnico.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 5: Implement `src/pages/NotFoundPage.tsx`**

```tsx
import { Link } from 'react-router-dom'
import { Seo } from '@/seo/Seo'

export default function NotFoundPage() {
  return (
    <>
      <Seo title="Pagina non trovata — WildFocus" description="La pagina che cerchi non esiste o è stata spostata." />
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="font-display text-6xl text-accent">404</p>
        <h1 className="mt-4 font-display text-2xl text-ink">Pagina non trovata</h1>
        <p className="mt-3 text-ink-muted">La pagina che cerchi non esiste o è stata spostata.</p>
        <Link
          to="/"
          className="mt-8 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-base hover:opacity-90"
        >
          Torna alla Home
        </Link>
      </div>
    </>
  )
}
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/pages/PrivacyPolicyPage.tsx src/pages/CookiePolicyPage.tsx src/pages/NotFoundPage.tsx src/pages/LegalAndNotFoundPages.test.tsx
git commit -m "feat: add Privacy Policy, Cookie Policy and 404 pages"
```

---

## Task 28: Routing shell (App.tsx)

**Files:**
- Modify: `src/App.tsx`, `src/App.test.tsx` (both created in Task 1 as a placeholder; this task replaces their contents)

**Interfaces:**
- Consumes: `Navbar`/`Footer` (Task 9), all 11 page default exports (Tasks 20-27), `siteConfig` (Task 4).
- Produces: the fully routed `App` component consumed by `src/main.tsx` (already wired in Task 1 — no change needed there).

- [ ] **Step 1: Write the failing tests — replace `src/App.test.tsx`**

```tsx
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import { siteConfig } from '@/data/siteConfig'

function renderApp(initialPath: string) {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[initialPath]}>
        <App />
      </MemoryRouter>
    </HelmetProvider>,
  )
}

describe('App routing', () => {
  it('renders the Navbar brand link on every route', () => {
    renderApp('/')
    expect(screen.getByRole('link', { name: 'WildFocus' })).toHaveAttribute('href', '/')
  })

  it('renders the Home hero heading at the root route', async () => {
    renderApp('/')
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent(
      /contenuti che catturano l'attenzione/i,
    )
  })

  it('renders the 404 page for an unknown route', async () => {
    renderApp('/questa-pagina-non-esiste')
    expect(await screen.findByText('Pagina non trovata')).toBeInTheDocument()
  })

  it('does not 404 for any navbar link', async () => {
    for (const item of siteConfig.nav) {
      const { unmount } = renderApp(item.to)
      expect(await screen.findByRole('link', { name: 'WildFocus' })).toBeInTheDocument()
      expect(screen.queryByText('Pagina non trovata')).not.toBeInTheDocument()
      unmount()
    }
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm run test`
Expected: FAIL — the Task 1 `App.tsx` placeholder has no routing, so the Home heading/404 assertions fail.

- [ ] **Step 3: Replace `src/App.tsx`**

```tsx
import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { siteConfig } from '@/data/siteConfig'

const HomePage = lazy(() => import('@/pages/HomePage'))
const ServicesPage = lazy(() => import('@/pages/ServicesPage'))
const PortfolioPage = lazy(() => import('@/pages/PortfolioPage'))
const PortfolioDetailPage = lazy(() => import('@/pages/PortfolioDetailPage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const ProcessPage = lazy(() => import('@/pages/ProcessPage'))
const CollaborationsPage = lazy(() => import('@/pages/CollaborationsPage'))
const ContactPage = lazy(() => import('@/pages/ContactPage'))
const PrivacyPolicyPage = lazy(() => import('@/pages/PrivacyPolicyPage'))
const CookiePolicyPage = lazy(() => import('@/pages/CookiePolicyPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-base text-ink">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(siteConfig.jsonLd)}</script>
      </Helmet>
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<div className="px-4 py-24 text-center text-ink-muted">Caricamento…</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/servizi" element={<ServicesPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/portfolio/:slug" element={<PortfolioDetailPage />} />
            <Route path="/chi-siamo" element={<AboutPage />} />
            <Route path="/processo" element={<ProcessPage />} />
            <Route path="/collaborazioni" element={<CollaborationsPage />} />
            <Route path="/contatti" element={<ContactPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/cookie-policy" element={<CookiePolicyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

export default App
```

Note: `CookieConsent` (Task 19) is deliberately **not** mounted here — it stays available but inactive until a real analytics tool is wired in, per spec §11.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 5: Verify the build**

Run: `npm run build`
Expected: succeeds with no TypeScript errors; `dist/assets` contains one chunk per lazy-loaded page (confirms code splitting is active).

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx src/App.test.tsx
git commit -m "feat: wire up full route table with lazy-loaded pages"
```

---

## Task 29: Static SEO files (robots.txt, sitemap.xml)

**Files:**
- Create: `public/robots.txt`, `public/sitemap.xml`

**Interfaces:**
- Consumes: nothing (static files copied verbatim by Vite from `public/` to `dist/`).
- Produces: crawlable `robots.txt` and `sitemap.xml` at the site root once deployed.

- [ ] **Step 1: Create `public/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: [URL SITO WILDFOCUS]/sitemap.xml
```

- [ ] **Step 2: Create `public/sitemap.xml`**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>[URL SITO WILDFOCUS]/</loc></url>
  <url><loc>[URL SITO WILDFOCUS]/servizi</loc></url>
  <url><loc>[URL SITO WILDFOCUS]/portfolio</loc></url>
  <url><loc>[URL SITO WILDFOCUS]/chi-siamo</loc></url>
  <url><loc>[URL SITO WILDFOCUS]/processo</loc></url>
  <url><loc>[URL SITO WILDFOCUS]/collaborazioni</loc></url>
  <url><loc>[URL SITO WILDFOCUS]/contatti</loc></url>
  <url><loc>[URL SITO WILDFOCUS]/privacy-policy</loc></url>
  <url><loc>[URL SITO WILDFOCUS]/cookie-policy</loc></url>
</urlset>
```

Note: `[URL SITO WILDFOCUS]` is the same placeholder used in `src/seo/Seo.tsx` (Task 20) — replace both together once the site has a real domain. Portfolio detail routes (`/portfolio/:slug`) are intentionally omitted until real projects (and real slugs) replace the demo data.

- [ ] **Step 3: Verify the files are included in the production build**

Run: `npm run build`
Expected: `dist/robots.txt` and `dist/sitemap.xml` exist and match the `public/` sources.

- [ ] **Step 4: Commit**

```bash
git add public/robots.txt public/sitemap.xml
git commit -m "feat: add robots.txt and sitemap.xml"
```

---

## Task 30: Restrained in-view motion (Reveal component)

**Files:**
- Modify: `src/test/setup.ts` (add an `IntersectionObserver` stub — jsdom doesn't implement it, and Framer Motion's `whileInView` needs it)
- Create: `src/components/ui/Reveal.tsx`
- Test: `src/components/ui/Reveal.test.tsx`
- Modify: `src/sections/home/Hero.tsx`, `src/sections/home/PortfolioHighlight.tsx`, `src/sections/home/ServicesSummary.tsx`, `src/sections/home/SocialProof.tsx`, `src/sections/home/FinalCta.tsx`

**Interfaces:**
- Consumes: `usePrefersReducedMotion` (Task 8).
- Produces: `Reveal` (props: `children: ReactNode`, `className?: string`) — the first real usage of the `framer-motion` dependency declared in Task 1, satisfying the Global Constraints' "fade/slide in-view once, respects `prefers-reduced-motion`" rule. Wraps the Home section content built in Task 20.

- [ ] **Step 1: Update `src/test/setup.ts`** to stub `IntersectionObserver`

```ts
import '@testing-library/jest-dom/vitest'

if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia
}

if (typeof window !== 'undefined' && !('IntersectionObserver' in window)) {
  class IntersectionObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return []
    }
  }

  // @ts-expect-error jsdom lacks IntersectionObserver; minimal stub so Framer Motion's viewport features don't throw
  window.IntersectionObserver = IntersectionObserverStub
  // @ts-expect-error some libraries read the global rather than window
  global.IntersectionObserver = IntersectionObserverStub
}
```

- [ ] **Step 2: Write the failing tests — `src/components/ui/Reveal.test.tsx`**

```tsx
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Reveal } from './Reveal'

describe('Reveal', () => {
  it('renders its children', () => {
    render(<Reveal>Contenuto</Reveal>)
    expect(screen.getByText('Contenuto')).toBeInTheDocument()
  })

  it('applies Framer Motion initial styling when motion is not reduced', () => {
    render(<Reveal>Contenuto animato</Reveal>)
    expect(screen.getByText('Contenuto animato')).toHaveAttribute('style')
  })

  it('skips motion styling entirely when the user prefers reduced motion', () => {
    const originalMatchMedia = window.matchMedia
    window.matchMedia = ((query: string) => ({
      matches: query.includes('reduce'),
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia

    render(<Reveal>Contenuto statico</Reveal>)
    expect(screen.getByText('Contenuto statico')).not.toHaveAttribute('style')

    window.matchMedia = originalMatchMedia
  })
})
```

- [ ] **Step 3: Run the tests to verify they fail**

Run: `npm run test`
Expected: FAIL — `src/components/ui/Reveal.tsx` does not exist.

- [ ] **Step 4: Implement `src/components/ui/Reveal.tsx`**

```tsx
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

interface RevealProps {
  children: ReactNode
  className?: string
}

export function Reveal({ children, className }: RevealProps) {
  const prefersReducedMotion = usePrefersReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 6: Wrap the Home sections in `Reveal`** — replace `src/sections/home/Hero.tsx`

```tsx
import { Link } from 'react-router-dom'
import { VideoPlayer } from '@/components/ui/VideoPlayer'
import { Reveal } from '@/components/ui/Reveal'
import { siteConfig } from '@/data/siteConfig'
import { heroPosterDataUri } from '@/lib/placeholderPoster'

export function Hero() {
  return (
    <section className="grid gap-10 py-12 md:grid-cols-2 md:items-center md:py-20">
      <Reveal>
        <h1 className="font-display text-4xl leading-tight text-ink md:text-5xl">
          Contenuti che catturano l&apos;attenzione.
          <br />
          Immagini che fanno crescere il tuo brand.
        </h1>
        <p className="mt-4 max-w-lg text-ink-muted">{siteConfig.positioning}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/contatti" className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-base hover:opacity-90">
            {siteConfig.primaryCta}
          </Link>
          <Link to="/portfolio" className="rounded-full border border-white/20 px-6 py-3 text-sm text-ink hover:border-white/40">
            Guarda i nostri lavori
          </Link>
        </div>
      </Reveal>

      <Reveal>
        <VideoPlayer title="Showreel WildFocus" poster={heroPosterDataUri} />
      </Reveal>
    </section>
  )
}
```

- [ ] **Step 7: Replace `src/sections/home/PortfolioHighlight.tsx`**

```tsx
import { Link } from 'react-router-dom'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { ProjectCard } from '@/components/ui/ProjectCard'
import { Reveal } from '@/components/ui/Reveal'
import { projects } from '@/data/projects'

export function PortfolioHighlight() {
  const highlighted = projects.slice(0, 3)

  return (
    <section className="py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionTitle eyebrow="Portfolio" title="Progetti in evidenza" />
        <Link to="/portfolio" className="text-sm font-semibold text-accent hover:underline">
          Scopri i nostri lavori
        </Link>
      </div>

      <Reveal className="mt-8 grid gap-6 md:grid-cols-3">
        {highlighted.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </Reveal>
    </section>
  )
}
```

- [ ] **Step 8: Replace `src/sections/home/ServicesSummary.tsx`**

```tsx
import { SectionTitle } from '@/components/ui/SectionTitle'
import { ServiceCard } from '@/components/ui/ServiceCard'
import { Reveal } from '@/components/ui/Reveal'
import { services } from '@/data/services'

const miniSteps = [
  { step: '1', label: 'Brief e obiettivi' },
  { step: '2', label: 'Produzione ed editing' },
  { step: '3', label: 'Consegna e supporto' },
]

export function ServicesSummary() {
  return (
    <section className="py-12">
      <SectionTitle
        eyebrow="Servizi"
        title="Cosa facciamo"
        description="Quattro aree di lavoro, un solo obiettivo: contenuti che generano risultati."
      />

      <Reveal className="mt-8 grid gap-6 md:grid-cols-2">
        {services.map((service) => (
          <ServiceCard key={service.slug} service={service} />
        ))}
      </Reveal>

      <Reveal className="mt-10 flex flex-col gap-4 rounded-xl2 border border-white/10 bg-surface p-6 md:flex-row md:items-center md:justify-between">
        {miniSteps.map((item) => (
          <div key={item.step} className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-semibold text-base">
              {item.step}
            </span>
            <span className="text-sm text-ink-muted">{item.label}</span>
          </div>
        ))}
      </Reveal>
    </section>
  )
}
```

- [ ] **Step 9: Replace `src/sections/home/SocialProof.tsx`**

```tsx
import { SectionTitle } from '@/components/ui/SectionTitle'
import { TestimonialCard } from '@/components/ui/TestimonialCard'
import { Reveal } from '@/components/ui/Reveal'
import { testimonials } from '@/data/testimonials'
import { siteConfig } from '@/data/siteConfig'

export function SocialProof() {
  return (
    <section className="py-12">
      <SectionTitle eyebrow="Prova sociale" title="Chi ha lavorato con noi" align="center" />

      <Reveal className="mt-8 grid gap-6 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.author + testimonial.quote} testimonial={testimonial} />
        ))}
      </Reveal>

      <dl className="mt-10 grid grid-cols-1 gap-6 text-center sm:grid-cols-3">
        {siteConfig.trustStats.map((stat) => (
          <div key={stat.label}>
            <dt className="text-sm text-ink-muted">{stat.label}</dt>
            <dd className="mt-1 font-display text-2xl text-accent">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
```

- [ ] **Step 10: Replace `src/sections/home/FinalCta.tsx`**

```tsx
import { CTASection } from '@/components/ui/CTASection'
import { Reveal } from '@/components/ui/Reveal'

export function FinalCta() {
  return (
    <Reveal className="py-12">
      <CTASection
        title="Costruiamo il prossimo contenuto"
        description="Raccontaci il tuo progetto. Ti aiuteremo a trasformarlo in qualcosa che le persone vorranno guardare, ricordare e condividere."
        secondaryLabel="Scopri i nostri lavori"
        secondaryTo="/portfolio"
      />
    </Reveal>
  )
}
```

- [ ] **Step 11: Run the full test suite**

Run: `npm run test`
Expected: PASS — including `HomePage.test.tsx` and `PortfolioHighlight.test.tsx` from Task 20, which still pass unchanged since `Reveal` renders its children either way.

- [ ] **Step 12: Verify the build**

Run: `npm run build`
Expected: succeeds with no TypeScript errors.

- [ ] **Step 13: Commit**

```bash
git add src/test/setup.ts src/components/ui/Reveal.tsx src/components/ui/Reveal.test.tsx src/sections/home/Hero.tsx src/sections/home/PortfolioHighlight.tsx src/sections/home/ServicesSummary.tsx src/sections/home/SocialProof.tsx src/sections/home/FinalCta.tsx
git commit -m "feat: add Reveal in-view motion and use it across Home sections"
```

---

## Task 31: ESLint config, README, and final verification pass

**Files:**
- Create: `.eslintrc.cjs`, `README.md`

**Interfaces:**
- Consumes: nothing — this task closes out the plan with project-wide tooling and documentation.

- [ ] **Step 1: Create `.eslintrc.cjs`**

```js
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react-hooks/recommended'],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'vite.config.ts'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  },
}
```

- [ ] **Step 2: Run lint and fix anything it reports**

Run: `npm run lint`
Expected: no errors. If it reports unused imports or hook-dependency warnings introduced in earlier tasks, fix them now (e.g. remove the import, add the missing dependency) — do not disable rules to silence real findings.

- [ ] **Step 3: Create `README.md`**

```markdown
# WildFocus — Sito web

Sito istituzionale/commerciale di WildFocus (video editing, fotografia, contenuti
social), costruito con React, TypeScript, Vite e Tailwind CSS.

## Requisiti

- Node.js 18+

## Installazione e avvio

\`\`\`bash
npm install
npm run dev
\`\`\`

## Script disponibili

- \`npm run dev\` — avvia il server di sviluppo
- \`npm run build\` — verifica i tipi (\`tsc --noEmit\`) e crea la build di produzione in \`dist/\`
- \`npm run preview\` — serve la build di produzione in locale
- \`npm run test\` — esegue la suite di test (Vitest + React Testing Library)
- \`npm run test:watch\` — esegue i test in modalità watch
- \`npm run lint\` — esegue ESLint

## Struttura del progetto

- \`src/data/\` — contenuti del sito (servizi, pacchetti, portfolio, team, testimonianze, FAQ, configurazione generale). Modifica questi file per aggiornare i testi senza toccare i componenti.
- \`src/components/\` — componenti riutilizzabili (layout, UI, form)
- \`src/sections/\` — blocchi di sezione composti, usati dalla Home
- \`src/pages/\` — una pagina per rotta
- \`src/services/contactService.ts\` — adapter di invio del form contatti
- \`src/types/\` — contratti dati stabili, pensati per un futuro CMS headless

## Sostituire i placeholder

Tutti i placeholder sono racchiusi tra parentesi quadre e centralizzati
principalmente in \`src/data/siteConfig.ts\` e negli altri file in \`src/data/\`:
\`[EMAIL WILDFOCUS]\`, \`[NUMERO WHATSAPP]\`, \`[LINK INSTAGRAM]\`, \`[LINK TIKTOK]\`,
\`[LINK YOUTUBE]\`, \`[LINK LINKEDIN]\`, \`[CITTÀ]\`, \`[NOME MEMBRO TEAM]\`,
\`[PROGETTO PORTFOLIO]\`, \`[TESTIMONIANZA CLIENTE]\`, \`[TEMPO REALE]\`,
\`[XX]\` (statistiche), \`[URL SITO WILDFOCUS]\` (in \`src/seo/Seo.tsx\`,
\`public/robots.txt\` e \`public/sitemap.xml\`).

## Aggiungere i font reali

I font sono self-hosted. Aggiungi i file \`.woff2\` reali in \`public/fonts/\` con i
nomi già referenziati in \`src/styles/fonts.css\` (\`wild-display-700.woff2\`,
\`wild-body-400.woff2\`, \`wild-body-600.woff2\`) e aggiorna i \`<link rel="preload">\`
in \`index.html\` se cambi i nomi dei file. Finché i file non esistono, il sito usa
automaticamente il fallback di sistema definito in \`tailwind.config.ts\`, senza
errori visibili.

## Aggiungere media reali al portfolio

Ogni progetto in \`src/data/projects.ts\` accetta \`coverImage\`/\`coverVideo\`
opzionali. Se assenti, \`ProjectCard\` mostra automaticamente un placeholder locale
(gradiente + icona categoria). Basta valorizzare questi campi con URL reali per far
sparire il placeholder, senza modificare i componenti.

## Collegare il form contatti a un servizio reale

\`src/services/contactService.ts\` espone \`submitContactRequest(payload)\` con
un'implementazione mock (nessuna chiamata di rete reale). Per collegarlo a un
servizio reale (Formspree, EmailJS, Netlify Forms, o un backend proprio), sostituisci
il corpo della funzione con una chiamata HTTP reale, mantenendo i controlli
honeypot/tempo minimo già presenti e aggiungendo la validazione lato server
sull'endpoint di destinazione.

## Attivare il banner cookie

\`src/components/ui/CookieConsent.tsx\` esiste già ma non è montato in \`src/App.tsx\`,
perché il sito non usa attualmente cookie di profilazione. Quando verrà collegato un
vero strumento di analytics, importa e monta \`<CookieConsent />\` in \`App.tsx\` e
aggiorna il testo in \`src/pages/CookiePolicyPage.tsx\`.

## SEO e limiti noti

Il sito è una SPA client-side: i meta tag per pagina (title, description, Open
Graph, JSON-LD) sono gestiti con \`react-helmet-async\` mediante il componente
\`src/seo/Seo.tsx\`, ma questo non equivale a un sito prerenderizzato o SSR ai fini
dell'indicizzazione. L'architettura è già predisposta per un eventuale
prerendering futuro (routing statico, meta risolvibili in modo sincrono da dati
locali): il prossimo passo consigliato è introdurre \`vite-plugin-prerender-pages\`
per le pagine pubbliche, oppure valutare una migrazione a un framework con
supporto SSR/SSG nativo (Astro, Next.js) quando il traffico organico diventa
prioritario.

## Pagine legali

\`src/pages/PrivacyPolicyPage.tsx\` e \`src/pages/CookiePolicyPage.tsx\` contengono
testo placeholder chiaramente etichettato come bozza. Vanno fatte revisionare da un
professionista legale prima della pubblicazione del sito.
```

- [ ] **Step 4: Run the full test suite**

Run: `npm run test`
Expected: PASS — every test file written across Tasks 1-30 passes.

- [ ] **Step 5: Run the production build**

Run: `npm run build`
Expected: `tsc --noEmit` reports zero errors, `vite build` completes successfully.

- [ ] **Step 6: Manual smoke test in the browser**

Run: `npm run dev`, then open the printed local URL and manually verify:
- Every navbar link (desktop and mobile hamburger menu) navigates correctly and highlights the active page.
- The Home showreel placeholder shows the play button; clicking it swaps in the (empty) `<video>` element without a console error.
- The Portfolio category filters correctly narrow the grid.
- The Contatti form advances through all 3 steps, blocks progression on invalid steps, and shows the "Richiesta inviata" confirmation after a real (non-instant) submission.
- Resize the window to a mobile width (375px) and confirm the layout stays usable, the hamburger menu works, and no section requires excessive scrolling.
- Enable "prefers reduced motion" in the OS/browser and confirm the Home page no longer plays entrance animations.

- [ ] **Step 7: Commit**

```bash
git add .eslintrc.cjs README.md
git commit -m "docs: add ESLint config and README with placeholder/setup instructions"
```

---
