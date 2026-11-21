import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { gsap, ScrollTrigger } from '../../animations/gsapConfig'

/** Hairline progress indicator pinned to the top edge. */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()

  useEffect(() => {
    if (!bar.current) return
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => gsap.set(bar.current, { scaleX: self.progress }),
    })
    return () => st.kill()
  }, [pathname])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px]">
      <div ref={bar} className="h-full origin-left scale-x-0 bg-lime" />
    </div>
  )
}
