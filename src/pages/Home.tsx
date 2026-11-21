import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ScrollTrigger } from '../animations/gsapConfig'
import { Footer } from '../components/common/Footer'
import { PageTransition } from '../components/common/PageTransition'
import { organizationJsonLd, Seo, websiteJsonLd } from '../components/common/Seo'
import { About } from '../components/sections/About'
import { Contact } from '../components/sections/Contact'
import { Ecosystem } from '../components/sections/Ecosystem'
import { Hero } from '../components/sections/Hero'
import { Introduction } from '../components/sections/Introduction'
import { Process } from '../components/sections/Process'
import { Services } from '../components/sections/Services'
import { NAV_ITEMS } from '../data/navigation'
import { useAppState } from '../hooks/useAppState'
import { scrollToTarget, useLenis } from '../hooks/useLenis'

/** Highlights the nav item for whichever section is in view. */
function useSectionSpy() {
  const { setActiveSection } = useAppState()

  useEffect(() => {
    const active = new Set<HTMLElement>()
    const pick = () => {
      // The most specific (smallest) active section wins, e.g. "learn" inside "services".
      const best = [...active].sort((a, b) => a.offsetHeight - b.offsetHeight)[0]
      // Between nav sections (e.g. Process) keep the last highlighted item.
      if (best) setActiveSection(best.id)
    }
    const triggers = NAV_ITEMS.map((n) => document.getElementById(n.section))
      .filter((el): el is HTMLElement => !!el)
      .map((el) =>
        ScrollTrigger.create({
          trigger: el,
          start: 'top 45%',
          end: 'bottom 45%',
          onToggle: (self) => {
            if (self.isActive) active.add(el)
            else active.delete(el)
            pick()
          },
        }),
      )
    return () => triggers.forEach((t) => t.kill())
  }, [setActiveSection])
}

export default function Home() {
  const { introDone } = useAppState()
  const lenis = useLenis()
  const { hash } = useLocation()

  useSectionSpy()

  // Recalculate trigger positions once fonts have settled.
  useEffect(() => {
    let cancelled = false
    document.fonts?.ready.then(() => !cancelled && ScrollTrigger.refresh())
    return () => {
      cancelled = true
    }
  }, [])

  // Deep links such as /#services — wait for the intro to finish.
  useEffect(() => {
    if (!introDone || !hash) return
    const t = window.setTimeout(() => {
      ScrollTrigger.refresh()
      const target = document.querySelector<HTMLElement>(hash)
      if (target) scrollToTarget(lenis, target)
    }, 350)
    return () => window.clearTimeout(t)
  }, [introDone, hash, lenis])

  return (
    <PageTransition>
      <Seo
        title="K76 Business Solutions — Software, Marketing, Branding & AI | Chennai"
        description="K76 Business Solutions builds websites, custom software, CRMs, brands, marketing and AI automation for growing businesses, and trains talent through K76 Learn. Chennai & Tenkasi, India."
        path="/"
        jsonLd={[organizationJsonLd, websiteJsonLd]}
      />
      <main id="main">
        <Hero />
        <Introduction />
        <Services />
        <Process />
        <Ecosystem />
        <About />
        <Contact />
      </main>
      <Footer />
    </PageTransition>
  )
}
