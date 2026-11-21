import Lenis from 'lenis'
import { createContext, useContext, useEffect, useState } from 'react'
import { gsap, prefersReducedMotion, ScrollTrigger } from '../animations/gsapConfig'

export const LenisContext = createContext<Lenis | null>(null)

/**
 * Creates one Lenis instance driven by the GSAP ticker so Lenis and
 * ScrollTrigger share a single RAF loop (no competing scroll listeners).
 * Touch devices keep native scrolling. Reduced-motion users get no Lenis.
 */
export function useLenisInstance() {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return

    const instance = new Lenis({
      lerp: 0.095,
      wheelMultiplier: 0.95,
      smoothWheel: true,
      syncTouch: false,
      anchors: false,
    })

    instance.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => instance.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    setLenis(instance)

    return () => {
      gsap.ticker.remove(tick)
      gsap.ticker.lagSmoothing(500, 33)
      instance.destroy()
      setLenis(null)
    }
  }, [])

  return lenis
}

export const useLenis = () => useContext(LenisContext)

/** Scroll to an element/position through Lenis, falling back to native scrolling. */
export function scrollToTarget(lenis: Lenis | null, target: string | number | HTMLElement, offset = 0) {
  const immediate = prefersReducedMotion()
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.4, immediate, force: true })
    return
  }
  const behavior: ScrollBehavior = immediate ? 'auto' : 'smooth'
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior })
    return
  }
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY + offset
  window.scrollTo({ top, behavior })
}
