import { useEffect, useRef, useState } from 'react'
import { gsap } from '../../animations/gsapConfig'
import { useFinePointer, useReducedMotionPref } from '../../hooks/useMediaQuery'

/**
 * Desktop-only cursor: a precise dot plus a trailing ring. Elements with
 * `data-cursor` grow the ring; `data-cursor="view"` etc. shows a label.
 */
export function CustomCursor() {
  const fine = useFinePointer()
  const reduce = useReducedMotionPref()
  const enabled = fine && !reduce

  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState('')

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current) return
    const html = document.documentElement
    html.classList.add('has-cursor')

    const d = dot.current
    const r = ring.current
    gsap.set([d, r], { xPercent: -50, yPercent: -50, autoAlpha: 0 })
    const dx = gsap.quickTo(d, 'x', { duration: 0.12, ease: 'power3.out' })
    const dy = gsap.quickTo(d, 'y', { duration: 0.12, ease: 'power3.out' })
    const rx = gsap.quickTo(r, 'x', { duration: 0.55, ease: 'power3.out' })
    const ry = gsap.quickTo(r, 'y', { duration: 0.55, ease: 'power3.out' })

    let visible = false
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      if (!visible) {
        visible = true
        gsap.set([d, r], { x: e.clientX, y: e.clientY })
        gsap.to([d, r], { autoAlpha: 1, duration: 0.3 })
      }
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)
    }

    const over = (e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest<HTMLElement>('[data-cursor], a, button, input, textarea, select')
      if (!target) {
        r.dataset.state = ''
        setLabel('')
        return
      }
      if (target.matches('input, textarea')) {
        r.dataset.state = 'text'
        setLabel('')
        return
      }
      const value = target.dataset.cursor ?? 'hover'
      r.dataset.state = value === 'hover' ? 'hover' : 'label'
      setLabel(value === 'hover' ? '' : value)
    }

    const leave = () => {
      visible = false
      gsap.to([d, r], { autoAlpha: 0, duration: 0.3 })
    }
    const down = () => gsap.to(r, { scale: 0.82, duration: 0.2 })
    const up = () => gsap.to(r, { scale: 1, duration: 0.35, ease: 'back.out(2)' })

    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerover', over, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)

    return () => {
      html.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
      document.documentElement.removeEventListener('pointerleave', leave)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      gsap.killTweensOf([d, r])
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[140]">
      <div ref={dot} className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-paper mix-blend-difference" />
      <div
        ref={ring}
        data-state=""
        className="cursor-ring fixed left-0 top-0 flex items-center justify-center rounded-full"
      >
        <span className="cursor-label t-label text-[0.65rem] text-ink">{label}</span>
      </div>
      <style>{`
        .cursor-ring{width:38px;height:38px;border:1px solid rgb(245 243 237 / .9);mix-blend-mode:difference;
          transition:width .45s var(--ease-out),height .45s var(--ease-out),background-color .3s,border-color .3s,mix-blend-mode 0s}
        .cursor-ring[data-state="hover"]{width:64px;height:64px;background:rgb(245 243 237 / 1);}
        .cursor-ring[data-state="text"]{width:4px;height:32px;border-radius:2px;background:rgb(245 243 237 / 1)}
        .cursor-ring[data-state="label"]{width:96px;height:96px;background:var(--lime);border-color:var(--lime);mix-blend-mode:normal}
        .cursor-label{opacity:0;transition:opacity .25s}
        .cursor-ring[data-state="label"] .cursor-label{opacity:1}
      `}</style>
    </div>
  )
}
