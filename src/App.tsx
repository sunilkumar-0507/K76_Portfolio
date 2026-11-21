import { AnimatePresence } from 'framer-motion'
import { lazy, Suspense, useCallback, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { ScrollTrigger } from './animations/gsapConfig'
import { CustomCursor } from './components/common/CustomCursor'
import { Navbar } from './components/common/Navbar'
import { Preloader } from './components/common/Preloader'
import { ScrollProgress } from './components/common/ScrollProgress'
import { AppStateProvider, useAppState } from './hooks/useAppState'
import { LenisContext, scrollToTarget, useLenis, useLenisInstance } from './hooks/useLenis'
import Home from './pages/Home'

const AboutPage = lazy(() => import('./pages/About'))
const ServicesPage = lazy(() => import('./pages/Services'))
const ContactPage = lazy(() => import('./pages/Contact'))
const NotFound = lazy(() => import('./pages/NotFound'))

function Shell() {
  const location = useLocation()
  const lenis = useLenis()
  const { introDone, setIntroDone } = useAppState()

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
  }, [])

  // Hash deep-links on inner pages (the home page handles its own after the intro).
  useEffect(() => {
    if (location.pathname === '/' || !location.hash) return
    const t = window.setTimeout(() => {
      ScrollTrigger.refresh()
      const el = document.querySelector<HTMLElement>(location.hash)
      if (el) scrollToTarget(lenis, el, -40)
    }, 1000)
    return () => window.clearTimeout(t)
  }, [location.pathname, location.hash, lenis])

  const onExitComplete = useCallback(() => {
    lenis?.scrollTo(0, { immediate: true, force: true })
    window.scrollTo(0, 0)
    requestAnimationFrame(() => ScrollTrigger.refresh())
  }, [lenis])

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      {!introDone ? <Preloader onDone={() => setIntroDone(true)} /> : null}
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <AnimatePresence mode="wait" onExitComplete={onExitComplete}>
        <Suspense key={location.pathname} fallback={<div className="min-h-[100svh] bg-paper" />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </>
  )
}

export default function App() {
  const lenis = useLenisInstance()
  return (
    <LenisContext.Provider value={lenis}>
      <AppStateProvider>
        <Shell />
      </AppStateProvider>
    </LenisContext.Provider>
  )
}
