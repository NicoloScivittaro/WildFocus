import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CustomCursor } from '@/components/motion/CustomCursor'
import { PageTransition } from '@/components/motion/PageTransition'
import { siteConfig } from '@/data/siteConfig'

const HomePage = lazy(() => import('@/pages/HomePage'))
const ServicesPage = lazy(() => import('@/pages/ServicesPage'))
const PortfolioPage = lazy(() => import('@/pages/PortfolioPage'))
const PortfolioDetailPage = lazy(() => import('@/pages/PortfolioDetailPage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const ProcessPage = lazy(() => import('@/pages/ProcessPage'))
const CollaborationsPage = lazy(() => import('@/pages/CollaborationsPage'))
const ProjectPage = lazy(() => import('@/pages/ProjectPage'))
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
      <CustomCursor />
      <PageTransition />
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
            <Route path="/progetto" element={<ProjectPage />} />
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
