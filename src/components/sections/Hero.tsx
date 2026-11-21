import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { drawStrokes, popIn, revertAll, spin } from '../../animations/animeAnimations'
import { gsap, isFinePointer, prefersReducedMotion } from '../../animations/gsapConfig'
import { useAppState } from '../../hooks/useAppState'
import { useGsap } from '../../hooks/useGsap'
import { useSectionNav } from '../../hooks/useSectionNav'
import { brandColor } from '../../utils/constants'
import { Button } from '../common/Button'
import { BrandMarkShapes } from '../common/BrandMark'
import { SplitText } from '../common/SplitText'

const TICKS = 76
const TICK_COLORS = ['var(--lime)', 'var(--cobalt)', 'var(--iris)', 'var(--lime)']
const MARQUEE = [
  'Custom Software',
  'Web Platforms',
  'CRM & ERP',
  'Performance Marketing',
  'Brand Identity',
  'AI Automation',
  'Mobile Apps',
  'K76 Learn',
]

function useIstClock() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Kolkata',
    })
    const tick = () => setTime(fmt.format(new Date()))
    tick()
    const id = window.setInterval(tick, 15000)
    return () => window.clearInterval(id)
  }, [])
  return time
}

/** Custom geometric composition — a 76-tick dial, the K76 mark and a crosshair. */
function HeroVisual() {
  const R = 200
  return (
    <svg viewBox="-230 -230 460 460" className="h-full w-full overflow-visible" aria-hidden="true">
      <g data-depth="0.25">
        <circle data-stroke cx="0" cy="0" r={R} fill="none" stroke="currentColor" strokeWidth="1" />
        <circle data-stroke cx="0" cy="0" r={R * 0.62} fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 6" />
      </g>
      <g data-depth="0.35">
       <g data-dial>
        {Array.from({ length: TICKS }, (_, i) => {
          const a = (i / TICKS) * Math.PI * 2
          const long = i % 19 === 0
          const r1 = long ? R - 26 : R - 12
          return (
            <line
              key={i}
              data-tick
              x1={Math.cos(a) * r1}
              y1={Math.sin(a) * r1}
              x2={Math.cos(a) * R}
              y2={Math.sin(a) * R}
              stroke={long ? TICK_COLORS[(i / 19) % TICK_COLORS.length] : 'currentColor'}
              strokeWidth={long ? 3 : 1}
            />
          )
        })}
       </g>
      </g>
      <g data-depth="0.7">
        <g data-block>
          <g transform="translate(-68 -68) scale(1.36)">
            <BrandMarkShapes clipId="hero-mark" />
          </g>
        </g>
      </g>
      <g data-depth="1" stroke="currentColor" strokeWidth="1">
        <line data-stroke x1="-230" y1="0" x2="-84" y2="0" />
        <line data-stroke x1="84" y1="0" x2="230" y2="0" />
        <line data-stroke x1="0" y1="-230" x2="0" y2="-84" />
        <line data-stroke x1="0" y1="84" x2="0" y2="230" />
        <g data-orbit>
          <circle cx={R} cy="0" r="7" fill="var(--iris)" stroke="none" />
        </g>
      </g>
    </svg>
  )
}

export function Hero() {
  const root = useRef<HTMLElement>(null)
  const { introDone } = useAppState()
  const goTo = useSectionNav()
  const time = useIstClock()

  // Initial hidden state is applied before paint so nothing flashes under the preloader.
  useGsap(
    () => {
      const el = root.current!
      const reduce = prefersReducedMotion()
      const chars = el.querySelectorAll('[data-split-id="hero-title"] .split-inner')
      const fades = el.querySelectorAll('[data-hero-fade]')
      const visual = el.querySelector('[data-hero-visual]')!

      if (reduce) return

      gsap.set(chars, { yPercent: 115, rotate: 6 })
      gsap.set(fades, { autoAlpha: 0, y: 24 })
      gsap.set(visual, { autoAlpha: 0, scale: 0.86, rotate: -12 })
      gsap.set(el.querySelectorAll('[data-tick], [data-block]'), { opacity: 0 })

      if (!introDone) return

      const anims: Array<{ revert: () => unknown } | undefined> = []
      const tl = gsap.timeline({ delay: 0.05 })
      tl.to(chars, { yPercent: 0, rotate: 0, duration: 1.35, stagger: 0.035, ease: 'expo.out' })
        .to(visual, { autoAlpha: 1, scale: 1, rotate: 0, duration: 1.8, ease: 'expo.out' }, 0.25)
        .add(() => {
          anims.push(drawStrokes(el.querySelectorAll('[data-hero-visual] [data-stroke]'), { duration: 1500, staggerMs: 120 }))
          anims.push(popIn(el.querySelectorAll('[data-tick]'), { from: 'first' }))
          anims.push(popIn(el.querySelectorAll('[data-block]'), { delay: 500 }))
          anims.push(spin(el.querySelector('[data-dial]')!, 90000))
          anims.push(spin(el.querySelector('[data-orbit]')!, 24000))
        }, 0.3)
        .to(fades, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.08 }, 0.7)

      // Scroll: title drifts and fades, visual travels faster (parallax).
      gsap.to(el.querySelector('[data-split-id="hero-title"]'), {
        yPercent: -18,
        opacity: 0.25,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to(el.querySelector('[data-hero-visual-wrap]'), {
        yPercent: -35,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to(el.querySelector('[data-hero-grid]'), {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
      })

      // Mouse: depth-layered drift on fine pointers only.
      let onMove: ((e: PointerEvent) => void) | undefined
      if (isFinePointer()) {
        const layers = Array.from(el.querySelectorAll<SVGGElement>('[data-depth]')).map((node) => ({
          depth: Number(node.dataset.depth ?? 0.5),
          x: gsap.quickTo(node, 'x', { duration: 1.2, ease: 'power3.out' }),
          y: gsap.quickTo(node, 'y', { duration: 1.2, ease: 'power3.out' }),
        }))
        const titleX = gsap.quickTo(el.querySelector('[data-split-id="hero-title"]'), 'x', { duration: 1.6, ease: 'power3.out' })
        onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5
          const ny = e.clientY / window.innerHeight - 0.5
          layers.forEach((l) => {
            l.x(nx * 46 * l.depth)
            l.y(ny * 46 * l.depth)
          })
          titleX(nx * -14)
        }
        window.addEventListener('pointermove', onMove, { passive: true })
      }

      return () => {
        if (onMove) window.removeEventListener('pointermove', onMove)
        revertAll(anims)
      }
    },
    root,
    [introDone],
  )

  return (
    <section
      id="top"
      ref={root}
      data-nav-theme="light"
      aria-labelledby="hero-title"
      className="grain relative flex min-h-[100svh] flex-col overflow-hidden bg-paper pt-[calc(var(--nav-h)+1.5rem)]"
    >
      {/* Column grid */}
      <div data-hero-grid aria-hidden="true" className="pointer-events-none absolute inset-0 -top-[10%] h-[120%]">
        <div className="wrap grid h-full grid-cols-4 md:grid-cols-12">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className={`h-full border-l border-ink/[0.06] ${i >= 4 ? 'hidden md:block' : ''}`} />
          ))}
        </div>
      </div>

      <div className="wrap relative flex items-start justify-between gap-6">
        <p data-hero-fade className="t-label max-w-[24rem] text-ink/55">
          K76 Business Solutions
          <br />
          Software · Marketing · Brand · AI · Learn
        </p>
        <p data-hero-fade className="t-label hidden text-right text-ink/55 sm:block">
          Chennai / Tenkasi — India
          <br />
          <span className="t-index">IST {time}</span>
        </p>
      </div>

      <div className="wrap relative flex flex-1 flex-col justify-center py-10 md:py-0">
        <div
          data-hero-visual-wrap
          className="pointer-events-none absolute right-[var(--gutter)] top-0 w-[34vw] max-w-[540px] translate-y-0 text-ink/70 sm:w-[40vw] md:top-1/2 md:-translate-y-1/2 lg:w-[28vw]"
        >
          <div data-hero-visual className="aspect-square">
            <HeroVisual />
          </div>
        </div>

        <SplitText
          as="h1"
          id="hero-title"
          by="char"
          text={"Building\nwhat's next."}
          className="t-display t-mega relative z-[1] text-ink"
          lineClassName="[&:nth-child(2)]:pl-[4vw] md:[&:nth-child(2)]:pl-[7vw]"
        />
      </div>

      <div className="wrap relative grid gap-8 pb-8 md:grid-cols-12 md:items-end md:pb-10">
        <p data-hero-fade className="t-lead max-w-md text-pretty text-ink/75 md:col-span-5">
          We combine technology, creativity and strategy to build businesses that move forward.
        </p>
        <div data-hero-fade className="flex flex-wrap gap-3 md:col-span-4">
          <Button variant="ink" size="lg" icon={<ArrowUpRight size={18} />} onClick={() => goTo('contact')}>
            Start a project
          </Button>
          <Button variant="outline" size="lg" onClick={() => goTo('work')}>
            See the work
          </Button>
        </div>
        <button
          type="button"
          data-hero-fade
          onClick={() => goTo('intro')}
          className="group hidden items-center justify-end gap-4 md:col-span-3 md:flex"
          aria-label="Scroll to introduction"
        >
          <span className="t-label text-ink/55">Scroll</span>
          <span className="relative h-14 w-px overflow-hidden bg-ink/15">
            <span className="cue-dot absolute left-0 top-0 h-5 w-px bg-ink" />
          </span>
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 transition-colors group-hover:bg-ink group-hover:text-paper">
            <ArrowDown size={16} />
          </span>
        </button>
      </div>

      <div data-hero-fade className="marquee relative overflow-hidden border-t border-ink/10 py-4" aria-hidden="true">
        <div className="marquee-track flex w-max">
          {[0, 1].map((dup) => (
            <ul key={dup} className="flex shrink-0 items-center">
              {MARQUEE.map((m, n) => (
                <li key={m} className="flex items-center font-display text-sm uppercase tracking-[0.12em] text-ink/60">
                  <span className="px-6">{m}</span>
                  <span className="h-1.5 w-1.5" style={{ background: brandColor(n) }} />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  )
}
