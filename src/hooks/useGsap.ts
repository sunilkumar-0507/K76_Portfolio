import { useLayoutEffect, useRef } from 'react'
import type { DependencyList, RefObject } from 'react'
import { gsap } from '../animations/gsapConfig'

/**
 * Runs GSAP code inside a gsap.context scoped to `scope`, and reverts every
 * tween / ScrollTrigger / matchMedia created inside it on unmount or when
 * deps change. The callback may return an extra cleanup (e.g. Anime.js reverts,
 * event listeners).
 */
export function useGsap(
  setup: (self: gsap.Context) => void | (() => void),
  scope: RefObject<HTMLElement | null>,
  deps: DependencyList = [],
) {
  const setupRef = useRef(setup)
  setupRef.current = setup

  useLayoutEffect(() => {
    if (!scope.current) return
    let extraCleanup: void | (() => void)
    const ctx = gsap.context((self) => {
      extraCleanup = setupRef.current(self)
    }, scope.current)
    return () => {
      if (typeof extraCleanup === 'function') extraCleanup()
      ctx.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
