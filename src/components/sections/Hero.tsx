import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'
import { drawStrokes, popIn, revertAll, spin } from '../../animations/animeAnimations'
import { gsap, isFinePointer, prefersReducedMotion } from '../../animations/gsapConfig'
import { useAppState } from '../../hooks/useAppState'
import { useGsap } from '../../hooks/useGsap'
import { useSectionNav } from '../../hooks/useSectionNav'
import { SITE } from '../../utils/constants'
import { Button } from '../common/Button'
import { SplitText } from '../common/SplitText'

const TICKS = 76
const TICK_COLORS = ['var(--lime)', 'var(--cobalt)', 'var(--iris)', 'var(--lime)']

/** A 76-tick dial with a lavender disc and crosshair — the K76 character sits inside it. */
function HeroVisual() {
  const R = 200
  return (
    <svg viewBox="-230 -230 460 460" className="h-full w-full overflow-visible" aria-hidden="true">
      <defs>
        <radialGradient id="hero-disc" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#dccbfb" />
          <stop offset="70%" stopColor="#e6dafc" />
          <stop offset="100%" stopColor="#efe8fd" />
        </radialGradient>
      </defs>
      <g data-depth="0.15">
        <g data-glow>
          <circle cx="0" cy="0" r={R * 0.74} fill="var(--lavender)" opacity="0.6" />
          <circle cx="0" cy="0" r={R * 0.62} fill="url(#hero-disc)" />
          <circle data-stroke cx="0" cy="0" r={R * 0.74} fill="none" stroke="#d9cbf6" strokeWidth="1" />
        </g>
      </g>
      <g data-depth="0.25">
        <circle data-stroke cx="0" cy="0" r={R} fill="none" stroke="currentColor" strokeWidth="1" />
      </g>
      <g data-depth="0.35">
        <g data-dial>
          {Array.from({ length: TICKS }, (_, i) => {
            const a = (i / TICKS) * Math.PI * 2
            const long = i % 19 === 9
            const r1 = long ? R - 28 : R - 12
            return (
              <line
                key={i}
                data-tick
                x1={Math.cos(a) * r1}
                y1={Math.sin(a) * r1}
                x2={Math.cos(a) * R}
                y2={Math.sin(a) * R}
                stroke={long ? TICK_COLORS[Math.floor(i / 19) % TICK_COLORS.length] : 'currentColor'}
                strokeWidth={long ? 3.5 : 1}
                strokeLinecap="round"
              />
            )
          })}
        </g>
      </g>
      <g data-depth="1" stroke="currentColor" strokeWidth="1">
        <line data-stroke x1="-232" y1="0" x2={-R * 0.78} y2="0" />
        <line data-stroke x1={R * 0.78} y1="0" x2="232" y2="0" />
        <line data-stroke x1="0" y1="-238" x2="0" y2={-R * 0.8} />
        <g data-orbit>
          <circle cx={R} cy="0" r="8" fill="var(--iris)" stroke="none" />
        </g>
      </g>
    </svg>
  )
}

export function Hero() {
  const root = useRef<HTMLElement>(null)
  const { introDone } = useAppState()
  const goTo = useSectionNav()

  // Initial hidden state is applied before paint so nothing flashes under the preloader.
  useGsap(
    () => {
      const el = root.current!
      const reduce = prefersReducedMotion()
      const chars = el.querySelectorAll('[data-split-id="hero-title"] .split-inner')
      const fades = el.querySelectorAll('[data-hero-fade]')
      const visual = el.querySelector('[data-hero-visual]')!
      const bar = el.querySelector('[data-hero-bar]')

      if (reduce) return

      gsap.set(chars, { yPercent: 115, rotate: 6 })
      gsap.set(fades, { autoAlpha: 0, y: 24 })
      gsap.set(bar, { scaleX: 0 })
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
        .to(bar, { scaleX: 1, duration: 1, ease: 'expo.out' }, 0.75)
        .to(fades, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.08 }, 0.7)

      // Scroll: title drifts and fades, visual travels faster (parallax).
      gsap.to(el.querySelector('[data-split-id="hero-title"]'), {
        yPercent: -14,
        opacity: 0.3,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to(el.querySelector('[data-hero-visual-wrap]'), {
        yPercent: -18,
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
        const layers = Array.from(el.querySelectorAll<HTMLElement>('[data-depth]')).map((node) => ({
          depth: Number(node.dataset.depth ?? 0.5),
          x: gsap.quickTo(node, 'x', { duration: 1.2, ease: 'power3.out' }),
          y: gsap.quickTo(node, 'y', { duration: 1.2, ease: 'power3.out' }),
        }))
        const titleX = gsap.quickTo(el.querySelector('[data-split-id="hero-title"]'), 'x', { duration: 1.6, ease: 'power3.out' })
        onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5
          const ny = e.clientY / window.innerHeight - 0.5
          layers.forEach((l) => {
            l.x(nx * 40 * l.depth)
            l.y(ny * 40 * l.depth)
          })
          titleX(nx * -10)
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
      className="isolate grain relative flex min-h-[100svh] flex-col overflow-clip bg-paper pt-[calc(var(--nav-h)+1.5rem)]"
    >
      {/* Column grid */}
      <div data-hero-grid aria-hidden="true" className="pointer-events-none absolute inset-0 -top-[10%] -z-10 h-[120%]">
        <div className="wrap grid h-full grid-cols-4 md:grid-cols-12">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className={`h-full border-l border-ink/[0.05] ${i >= 4 ? 'hidden md:block' : ''}`} />
          ))}
        </div>
      </div>

      <div className="wrap relative flex items-start justify-between gap-6">
        <p data-hero-fade className="t-label max-w-[26rem] leading-[1.6] text-ink/60">
          K76 Business Solutions
          <br />
          Software – Marketing – Brand – AI – Learn
        </p>
        <p data-hero-fade className="t-label hidden text-right leading-[1.6] text-ink/60 sm:block [@media(max-height:520px)]:sm:hidden">
          Chennai | Tenkasi | India
          <br />
          Est. {SITE.founded}
        </p>
      </div>

      <div className="wrap relative grid flex-1 content-center items-center gap-8 pb-12 pt-8 md:grid-cols-12 md:gap-4 md:pb-20 md:pt-2 [@media(max-height:520px)]:pb-10">
        {/* Visual — the K76 character inside the dial */}
        <div
          data-hero-visual-wrap
          className="pointer-events-none relative w-[min(72vw,38svh,320px)] justify-self-center text-ink/45 md:order-last md:col-span-6 md:-ml-[4vw] md:w-[calc(100%+4vw)] md:max-w-[min(calc(100%+4vw),74svh)] md:justify-self-center"
        >
          <div data-hero-visual className="relative aspect-square">
            <HeroVisual />
            <div className="absolute left-1/2 top-[13%] w-[60%] -translate-x-1/2">
              <div data-depth="0.6">
                <div data-block className="hero-man">
                  <img
                    src="/brand/k76-man.webp"
                    alt=""
                    width={316}
                    height={356}
                    fetchPriority="high"
                    decoding="async"
                    className="block h-auto w-full select-none"
                    draggable={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copy */}
        <div className="relative z-[1] md:col-span-6">
          <SplitText as="h1" id="hero-title" by="char" accent text={"Building\nwhat’s next."} className="t-display t-hero text-ink" />
          <span data-hero-bar aria-hidden="true" className="mt-6 block h-1 w-16 origin-left rounded-full bg-lime md:mt-8 md:w-20" />
          <p data-hero-fade className="t-lead mt-6 max-w-[34rem] text-pretty text-ink/75 md:mt-8">
            We combine technology, creativity and strategy to build businesses that move forward.
          </p>
          <div data-hero-fade className="mt-8 flex flex-wrap gap-3 md:mt-10 md:gap-4">
            <Button variant="ink" size="lg" icon={<ArrowUpRight size={18} />} onClick={() => goTo('contact')}>
              Start a project
            </Button>
            <Button variant="outline" size="lg" onClick={() => goTo('services')}>
              See services
            </Button>
          </div>
        </div>
      </div>

      <button
        type="button"
        data-hero-fade
        onClick={() => goTo('intro')}
        className="group absolute bottom-8 right-[var(--gutter)] hidden items-center gap-4 md:flex"
        aria-label="Scroll to introduction"
      >
        <span className="t-label text-ink/60">Scroll</span>
        <span className="relative h-14 w-px overflow-hidden bg-ink/15">
          <span className="cue-dot absolute left-0 top-0 h-5 w-px bg-ink" />
        </span>
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/20 bg-white/40 transition-colors group-hover:bg-ink group-hover:text-paper">
          <ArrowDown size={16} />
        </span>
      </button>
    </section>
  )
}
