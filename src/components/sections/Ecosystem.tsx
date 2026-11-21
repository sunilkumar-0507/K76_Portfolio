import { createDrawable, utils } from 'animejs'
import { useMemo, useRef, useState } from 'react'
import { drawStrokes, popIn, pulse, revertAll, spin, travelSignal } from '../../animations/animeAnimations'
import { gsap, isFinePointer, prefersReducedMotion, ScrollTrigger } from '../../animations/gsapConfig'
import { revealSplit } from '../../animations/scrollAnimations'
import { useGsap } from '../../hooks/useGsap'
import { useIsDesktop } from '../../hooks/useMediaQuery'
import { LOGO } from '../common/BrandMark'
import { GlitterField } from '../common/GlitterField'
import { SectionLabel } from '../common/SectionLabel'
import { SplitText } from '../common/SplitText'

type NodeId = 'solutions' | 'learn' | 'products'
type Pt = [number, number]

const COLOR: Record<NodeId, string> = { solutions: 'var(--lime)', learn: 'var(--cobalt)', products: 'var(--iris)' }
/** Brighter versions for glowing strokes and text on the dark stage. */
const GLOW: Record<NodeId, string> = { solutions: '#b5dc4f', learn: '#5b8cf5', products: '#a77bf5' }

const PARTS: Array<{ id: NodeId; index: string; title: string; role: string; body: string }> = [
  {
    id: 'solutions',
    index: '01',
    title: 'K76 Business Solutions',
    role: 'Builds & grows',
    body: 'Websites, software, marketing, branding and automation for client businesses — where problems are met first-hand.',
  },
  {
    id: 'learn',
    index: '02',
    title: 'K76 Learn',
    role: 'Trains talent',
    body: 'Career-focused cohorts in development, design and marketing — taught by people doing the work every day.',
  },
  {
    id: 'products',
    index: '03',
    title: 'K76 Products',
    role: 'Packages what works',
    body: 'CRMs, business management and finance software — repeatable tools shaped by real client operations.',
  },
]

const LAYOUTS = {
  desktop: {
    w: 1200,
    h: 720,
    core: [600, 410] as Pt,
    nodes: { learn: [600, 120], solutions: [170, 590], products: [1030, 590] } as Record<NodeId, Pt>,
  },
  mobile: {
    w: 400,
    h: 860,
    core: [200, 410] as Pt,
    nodes: { learn: [200, 100], solutions: [80, 740], products: [320, 740] } as Record<NodeId, Pt>,
  },
}

/** Quadratic curve from a→b bowed by `bend` px. Returns path + midpoint. */
function edge(a: Pt, b: Pt, bend: number) {
  const mx = (a[0] + b[0]) / 2
  const my = (a[1] + b[1]) / 2
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const len = Math.hypot(dx, dy) || 1
  const cx = mx + (-dy / len) * bend
  const cy = my + (dx / len) * bend
  const mid: Pt = [0.25 * a[0] + 0.5 * cx + 0.25 * b[0], 0.25 * a[1] + 0.5 * cy + 0.25 * b[1]]
  return { d: `M${a[0]} ${a[1]} Q${cx} ${cy} ${b[0]} ${b[1]}`, mid }
}

const FLOWS: Array<{ from: NodeId; to: NodeId; label: string }> = [
  { from: 'learn', to: 'solutions', label: 'Skilled people' },
  { from: 'solutions', to: 'products', label: 'Proven solutions' },
  { from: 'products', to: 'learn', label: 'Real tools to learn on' },
]

export function Ecosystem() {
  const root = useRef<HTMLElement>(null)
  const isDesktop = useIsDesktop()
  const [focus, setFocus] = useState<NodeId | null>(null)
  const L = isDesktop ? LAYOUTS.desktop : LAYOUTS.mobile

  const geometry = useMemo(() => {
    const spokes = (Object.keys(L.nodes) as NodeId[]).map((id) => ({ id, ...edge(L.core, L.nodes[id], id === 'learn' ? 0 : 40) }))
    const flows = FLOWS.map((f) => ({ ...f, ...edge(L.nodes[f.from], L.nodes[f.to], isDesktop ? 120 : 70) }))
    return { spokes, flows }
  }, [L, isDesktop])

  useGsap(
    () => {
      const el = root.current!
      revealSplit(el.querySelector('[data-eco-title]')!, { stagger: 0.08 })
      const svg = el.querySelector('svg')!
      const core = el.querySelector<HTMLElement>('[data-core]')!
      const tilt = el.querySelector<HTMLElement>('[data-core-tilt]')!
      const reduce = prefersReducedMotion()

      if (!reduce) {
        utils.set(createDrawable(svg.querySelectorAll('[data-edge], [data-signal], [data-ring-draw]')), { draw: '0 0' })
        gsap.set(svg.querySelectorAll('[data-node], [data-pulse], [data-orbit-dot]'), { opacity: 0 })
        gsap.set(el.querySelectorAll('[data-eco-label]'), { autoAlpha: 0, y: 16 })
        gsap.set(core, { autoAlpha: 0, scale: 0.55, rotationY: -100, transformPerspective: 900 })
        gsap.set(el.querySelector('[data-core-glow]'), { autoAlpha: 0, scale: 0.5 })
      }

      let anims: Array<{ revert: () => unknown } | undefined> = []
      let sheenLoop: gsap.core.Tween | undefined
      const st = ScrollTrigger.create({
        trigger: svg,
        start: 'top 72%',
        once: true,
        onEnter: () => {
          if (reduce) return
          // Core: the logo flips in from depth and ignites its glow.
          gsap.to(core, { autoAlpha: 1, scale: 1, rotationY: 0, duration: 1.6, ease: 'expo.out' })
          gsap.to(el.querySelector('[data-core-glow]'), { autoAlpha: 1, scale: 1, duration: 1.8, ease: 'power2.out', delay: 0.2 })
          sheenLoop = gsap.fromTo(
            el.querySelector('[data-core-sheen]'),
            { xPercent: -160 },
            { xPercent: 260, duration: 1.3, ease: 'power2.inOut', repeat: -1, repeatDelay: 3.2, delay: 1 },
          )
          anims = [
            drawStrokes(svg.querySelectorAll('[data-ring-draw]'), { duration: 1800, staggerMs: 200, delay: 200 }),
            popIn(svg.querySelectorAll('[data-orbit-dot]'), { delay: 900 }),
            spin(svg.querySelector('[data-orbit-a]')!, 40000),
            spin(svg.querySelector('[data-orbit-b]')!, 26000, true),
            popIn(svg.querySelectorAll('[data-node]'), { from: 'center', delay: 500 }),
            drawStrokes(svg.querySelectorAll('[data-edge]'), { duration: 1600, staggerMs: 140, delay: 600 }),
            travelSignal(svg.querySelectorAll('[data-signal]'), { duration: 3400, delay: 2000 }),
            pulse(svg.querySelectorAll('[data-pulse]'), { scale: 2.6, duration: 2400 }),
          ]
          gsap.to(el.querySelectorAll('[data-eco-label]'), { autoAlpha: 1, y: 0, stagger: 0.12, delay: 0.9, duration: 1 })
        },
      })

      // 3D tilt of the logo toward the pointer (desktop only).
      let onMove: ((e: PointerEvent) => void) | undefined
      let onLeave: (() => void) | undefined
      if (!reduce && isFinePointer()) {
        const rx = gsap.quickTo(tilt, 'rotationX', { duration: 0.9, ease: 'power3.out' })
        const ry = gsap.quickTo(tilt, 'rotationY', { duration: 0.9, ease: 'power3.out' })
        onMove = (e: PointerEvent) => {
          const r = core.getBoundingClientRect()
          const nx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth
          const ny = (e.clientY - (r.top + r.height / 2)) / window.innerHeight
          ry(gsap.utils.clamp(-22, 22, nx * 60))
          rx(gsap.utils.clamp(-22, 22, -ny * 60))
        }
        onLeave = () => {
          rx(0)
          ry(0)
        }
        el.addEventListener('pointermove', onMove)
        el.addEventListener('pointerleave', onLeave)
      }

      gsap.from(el.querySelectorAll('[data-eco-col]'), {
        y: 40,
        autoAlpha: 0,
        stagger: 0.1,
        scrollTrigger: { trigger: el.querySelector('[data-eco-cols]'), start: 'top 85%', once: true },
      })

      return () => {
        st.kill()
        sheenLoop?.kill()
        if (onMove) el.removeEventListener('pointermove', onMove)
        if (onLeave) el.removeEventListener('pointerleave', onLeave)
        revertAll(anims)
      }
    },
    root,
    [isDesktop],
  )

  const pct = (p: Pt) => ({ left: `${(p[0] / L.w) * 100}%`, top: `${(p[1] / L.h) * 100}%` })
  const isLit = (a: NodeId, b?: NodeId) => focus === null || focus === a || focus === b
  const [cx, cy] = L.core
  const coreR = isDesktop ? 118 : 82
  const orbitDots: Array<[NodeId, number]> = [
    ['solutions', 210],
    ['learn', 330],
    ['products', 90],
  ]

  return (
    <section
      id="ecosystem"
      ref={root}
      data-nav-theme="dark"
      aria-labelledby="eco-title"
      className="on-dark section relative overflow-hidden bg-[#0b0b0b]"
    >
      <div aria-hidden="true" className="absolute inset-0">
        <GlitterField density={1} intensity={0.85} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,transparent_35%,rgba(11,11,11,0.85)_100%)]" />
      </div>

      <div className="wrap relative">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <SectionLabel index="04" label="The K76 ecosystem" tone="dark" className="mb-10" />
            <div data-eco-title>
              <SplitText as="h2" id="eco-title" by="line" text={'Three parts.\nOne system.'} className="t-h2 uppercase" />
            </div>
          </div>
          <p className="max-w-sm text-paper/60 md:col-span-4 md:justify-self-end">
            Each part of K76 makes the others stronger. Hover a part to trace how it connects.
          </p>
        </div>

        <div className="relative mx-auto mt-16 w-full max-w-[1200px] md:mt-24" style={{ aspectRatio: `${L.w} / ${L.h}` }}>
          <svg viewBox={`0 0 ${L.w} ${L.h}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true" fill="none">
            <defs>
              <filter id="eco-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* outer flows */}
            {geometry.flows.map((f) => (
              <g key={`${f.from}-${f.to}`} className="transition-opacity duration-500" opacity={isLit(f.from, f.to) ? 1 : 0.15}>
                <path data-edge d={f.d} stroke="var(--paper)" strokeOpacity="0.22" strokeWidth="1" strokeDasharray="4 7" />
                <path data-signal d={f.d} stroke="#ffffff" strokeOpacity="0.9" strokeWidth="1.6" strokeLinecap="round" filter="url(#eco-glow)" />
              </g>
            ))}
            {/* spokes to the core */}
            {geometry.spokes.map((s) => (
              <g key={s.id} className="transition-opacity duration-500" opacity={isLit(s.id) ? 1 : 0.15}>
                <path data-edge d={s.d} stroke={GLOW[s.id]} strokeOpacity="0.45" strokeWidth="1.25" />
                <path data-signal d={s.d} stroke={GLOW[s.id]} strokeWidth="3" strokeLinecap="round" filter="url(#eco-glow)" />
              </g>
            ))}

            {/* orbit rings around the logo */}
            <g data-orbit-a style={{ transformOrigin: `${cx}px ${cy}px` }}>
              <circle data-ring-draw cx={cx} cy={cy} r={coreR} stroke="var(--paper)" strokeOpacity="0.28" strokeDasharray="2 7" />
            </g>
            <g data-orbit-b style={{ transformOrigin: `${cx}px ${cy}px` }}>
              <circle data-ring-draw cx={cx} cy={cy} r={coreR * 1.28} stroke="var(--paper)" strokeOpacity="0.14" />
              {orbitDots.map(([id, deg]) => {
                const a = (deg * Math.PI) / 180
                const x = cx + Math.cos(a) * coreR * 1.28
                const y = cy + Math.sin(a) * coreR * 1.28
                return (
                  <circle
                    key={id}
                    data-orbit-dot
                    cx={x}
                    cy={y}
                    r={isDesktop ? 5 : 4}
                    fill={GLOW[id]}
                    filter="url(#eco-glow)"
                    style={{ transformOrigin: `${x}px ${y}px` }}
                  />
                )
              })}
            </g>

            {/* nodes */}
            {(Object.keys(L.nodes) as NodeId[]).map((id) => {
              const [x, y] = L.nodes[id]
              return (
                <g key={id}>
                  <circle data-pulse cx={x} cy={y} r="12" fill={GLOW[id]} style={{ transformOrigin: `${x}px ${y}px` }} />
                  <circle
                    data-node
                    cx={x}
                    cy={y}
                    r={focus === id ? 16 : 12}
                    fill={COLOR[id]}
                    stroke={GLOW[id]}
                    strokeWidth={focus === id ? 3 : 1.5}
                    filter="url(#eco-glow)"
                    style={{ transformOrigin: `${x}px ${y}px`, transition: 'r .4s' }}
                  />
                </g>
              )
            })}

            {/* flow captions */}
            {isDesktop
              ? geometry.flows.map((f) => (
                  <text
                    key={`t-${f.from}`}
                    x={f.mid[0]}
                    y={f.mid[1]}
                    textAnchor="middle"
                    fill="var(--paper)"
                    fillOpacity={isLit(f.from, f.to) ? 0.55 : 0.15}
                    fontFamily="Space Grotesk, sans-serif"
                    fontSize="13"
                    letterSpacing="1.8"
                    style={{ textTransform: 'uppercase', transition: 'fill-opacity .4s' }}
                  >
                    {f.label}
                  </text>
                ))
              : null}
          </svg>

          {/* Core: the original K76 logo, glowing, tilting in 3D */}
          <div
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
            style={{ ...pct(L.core), width: `${((coreR * 1.5) / L.w) * 100}%`, perspective: '900px' }}
          >
            <div data-core className="relative aspect-square" style={{ transformStyle: 'preserve-3d' }}>
              <div data-core-glow aria-hidden="true" className="absolute -inset-[45%]">
                <div className="eco-aurora absolute inset-0 rounded-full opacity-90 blur-2xl" />
              </div>
              <div data-core-tilt className="relative h-full w-full" style={{ transformStyle: 'preserve-3d' }}>
                <img
                  src={LOGO.webp}
                  alt="K76 Business Solutions logo"
                  width={388}
                  height={388}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="relative h-full w-full select-none drop-shadow-[0_24px_40px_rgba(0,0,0,0.6)]"
                />
                <div aria-hidden="true" className="absolute inset-0 overflow-hidden" style={{ borderRadius: '13.4%' }}>
                  <div
                    data-core-sheen
                    className="absolute -inset-y-1/4 left-0 w-1/2 -skew-x-12 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)] mix-blend-screen"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Typographic node labels */}
          {PARTS.map((p) => {
            const pos = pct(L.nodes[p.id])
            const placement =
              p.id === 'learn'
                ? 'translate-x-6 -translate-y-1/2 md:translate-x-8'
                : p.id === 'solutions'
                  ? '-translate-x-[10%] translate-y-8 md:translate-x-0 md:translate-y-10'
                  : '-translate-x-[90%] translate-y-8 md:-translate-x-full md:translate-y-10'
            return (
              <button
                key={p.id}
                type="button"
                data-eco-label
                onPointerEnter={() => setFocus(p.id)}
                onPointerLeave={() => setFocus(null)}
                onFocus={() => setFocus(p.id)}
                onBlur={() => setFocus(null)}
                onClick={() => setFocus((f) => (f === p.id ? null : p.id))}
                aria-pressed={focus === p.id}
                className={`absolute w-max max-w-[44vw] text-left md:max-w-none ${placement}`}
                style={pos}
              >
                <span className="flex items-center gap-2 text-xs text-paper/45">
                  <span className="h-2 w-2" style={{ background: GLOW[p.id] }} aria-hidden="true" />
                  <span className="t-index">{p.index}</span>
                </span>
                <span
                  className={`block font-display text-[clamp(1.05rem,2.2vw,2rem)] font-medium uppercase leading-[0.95] tracking-[-0.035em] transition-colors duration-300 ${
                    focus && focus !== p.id ? 'text-paper/35' : 'text-paper'
                  }`}
                  style={focus === p.id ? { color: GLOW[p.id] } : undefined}
                >
                  {p.title.replace('K76 ', '')}
                </span>
                <span className="t-label mt-1.5 block text-paper/50">{p.role}</span>
              </button>
            )
          })}
        </div>

        <div data-eco-cols className="mt-20 grid gap-10 border-t border-paper/15 pt-10 md:mt-28 md:grid-cols-3">
          {PARTS.map((p) => (
            <div
              key={p.id}
              data-eco-col
              className={`transition-opacity duration-500 ${focus && focus !== p.id ? 'opacity-40' : 'opacity-100'}`}
            >
              <p className="flex items-center gap-2 text-sm text-paper/45">
                <span className="h-2.5 w-2.5" style={{ background: GLOW[p.id] }} aria-hidden="true" />
                <span className="t-index">{p.index}</span>
              </p>
              <h3 className="mt-3 font-display text-xl font-medium tracking-[-0.02em]">{p.title}</h3>
              <p className="mt-3 max-w-sm text-sm text-paper/65">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
