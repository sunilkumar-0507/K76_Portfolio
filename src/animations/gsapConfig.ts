import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let registered = false

export function setupGsap() {
  if (registered) return
  registered = true
  gsap.registerPlugin(ScrollTrigger)
  gsap.defaults({ ease: 'expo.out', duration: 0.9 })
  ScrollTrigger.config({ ignoreMobileResize: true })
}

setupGsap()

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const isFinePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches

/** Shared gsap.matchMedia conditions */
export const MQ = {
  desktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
  belowDesktop: '(max-width: 1023px) and (prefers-reduced-motion: no-preference)',
  motion: '(prefers-reduced-motion: no-preference)',
  reduced: '(prefers-reduced-motion: reduce)',
} as const

export { gsap, ScrollTrigger }
