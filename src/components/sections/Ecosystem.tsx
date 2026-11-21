import { createDrawable, utils } from 'animejs'
import { useMemo, useRef, useState } from 'react'
import { drawStrokes, popIn, pulse, revertAll, travelSignal } from '../../animations/animeAnimations'
import { gsap, prefersReducedMotion, ScrollTrigger } from '../../animations/gsapConfig'
import { revealSplit } from '../../animations/scrollAnimations'
import { useGsap } from '../../hooks/useGsap'
import { useIsDesktop } from '../../hooks/useMediaQuery'
import { SectionLabel } from '../common/SectionLabel'
import { SplitText } from '../common/SplitText'

type NodeId = 'solutions' | 'learn' | 'products'
type Pt = [number, number]

const COLOR: Record<NodeId, string> = { solutions: 'var(--lime)', learn: 'var(--cobalt)', products: 'var(--iris)' }

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
      const reduce = prefersReducedMotion()

      if (!reduce) {
        utils.set(createDrawable(svg.querySelectorAll('[data-edge], [data-signal]')), { draw: '0 0' })
        gsap.set(svg.querySelectorAll('[data-node], [data-pulse]'), { opacity: 0 })
        gsap.set(el.querySelectorAll('[data-eco-label]'), { autoAlpha: 0, y: 16 })
      }

      let anims: Array<{ revert: () => unknown } | undefined> = []
      const st = ScrollTrigger.create({
        trigger: svg,
        start: 'top 72%',
        once: true,
        onEnter: () => {
          if (reduce) return
          anims = [
            popIn(svg.querySelectorAll('[data-node]'), { from: 'center' }),
            drawStrokes(svg.querySelectorAll('[data-edge]'), { duration: 1600, staggerMs: 140, delay: 300 }),
            travelSignal(svg.querySelectorAll('[data-signal]'), { duration: 3600, delay: 1900 }),
            pulse(svg.querySelectorAll('[data-pulse]'), { scale: 2.4, duration: 2200 }),
          ]
          gsap.to(el.querySelectorAll('[data-eco-label]'), { autoAlpha: 1, y: 0, stagger: 0.12, delay: 0.7, duration: 1 })
        },
      })

      gsap.from(el.querySelectorAll('[data-eco-col]'), {
        y: 40,
        autoAlpha: 0,
        stagger: 0.1,
        scrollTrigger: { trigger: el.querySelector('[data-eco-cols]'), start: 'top 85%', once: true },
      })

      return () => {
        st.kill()
        revertAll(anims)
      }
    },
    root,
    [isDesktop],
  )

  const pct = (p: Pt) => ({ left: `${(p[0] / L.w) * 100}%`, top: `${(p[1] / L.h) * 100}%` })
  const isLit = (a: NodeId, b?: NodeId) => focus === null || focus === a || focus === b

  return (
    <section id="ecosystem" ref={root} data-nav-theme="light" aria-labelledby="eco-title" className="section relative bg-paper-2">
      <div className="wrap">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <SectionLabel index="05" label="The K76 ecosystem" className="mb-10" />
            <div data-eco-title>
              <SplitText as="h2" id="eco-title" by="line" text={'Three parts.\nOne system.'} className="t-h2 uppercase" />
            </div>
          </div>
          <p className="max-w-sm text-ink/60 md:col-span-4 md:justify-self-end">
            Each part of K76 makes the others stronger. Hover a part to trace how it connects.
          </p>
        </div>

        <div className="relative mx-auto mt-16 w-full max-w-[1200px] md:mt-24" style={{ aspectRatio: `${L.w} / ${L.h}` }}>
          <svg viewBox={`0 0 ${L.w} ${L.h}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true" fill="none">
            {/* outer flows */}
            {geometry.flows.map((f) => (
              <g key={`${f.from}-${f.to}`} className="transition-opacity duration-500" opacity={isLit(f.from, f.to) ? 1 : 0.15}>
                <path data-edge d={f.d} stroke="var(--ink)" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="4 7" />
                <path data-signal d={f.d} stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
              </g>
            ))}
            {/* spokes to the core */}
            {geometry.spokes.map((s) => (
              <g key={s.id} className="transition-opacity duration-500" opacity={isLit(s.id) ? 1 : 0.15}>
                <path data-edge d={s.d} stroke="var(--ink)" strokeWidth="1.25" />
                <path data-signal d={s.d} stroke={COLOR[s.id]} strokeWidth="3" strokeLinecap="round" />
              </g>
            ))}
            {/* nodes */}
            {(Object.keys(L.nodes) as NodeId[]).map((id) => {
              const [x, y] = L.nodes[id]
              return (
                <g key={id}>
                  <circle data-pulse cx={x} cy={y} r="12" fill={COLOR[id]} style={{ transformOrigin: `${x}px ${y}px` }} />
                  <circle
                    data-node
                    cx={x}
                    cy={y}
                    r={focus === id ? 16 : 12}
                    fill={COLOR[id]}
                    stroke="var(--paper-2)"
                    strokeWidth={focus === id ? 4 : 0}
                    style={{ transformOrigin: `${x}px ${y}px`, transition: 'r .4s, fill .4s' }}
                  />
                </g>
              )
            })}
            {/* core */}
            <g data-node style={{ transformOrigin: `${L.core[0]}px ${L.core[1]}px` }}>
              <circle cx={L.core[0]} cy={L.core[1]} r={isDesktop ? 92 : 64} fill="var(--ink)" />
              <circle cx={L.core[0]} cy={L.core[1]} r={isDesktop ? 112 : 80} stroke="var(--ink)" strokeOpacity="0.25" strokeDasharray="2 6" />
              <text
                x={L.core[0]}
                y={L.core[1] + (isDesktop ? 14 : 10)}
                textAnchor="middle"
                fill="var(--lime)"
                fontFamily="Space Grotesk, sans-serif"
                fontWeight="600"
                fontSize={isDesktop ? 46 : 34}
                letterSpacing="-2"
              >
                K76
              </text>
            </g>
            {/* flow captions */}
            {isDesktop
              ? geometry.flows.map((f) => (
                  <text
                    key={`t-${f.from}`}
                    x={f.mid[0]}
                    y={f.mid[1]}
                    textAnchor="middle"
                    fill="var(--ink)"
                    fillOpacity={isLit(f.from, f.to) ? 0.6 : 0.15}
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
                <span className="flex items-center gap-2 text-xs text-ink/45">
                  <span className="h-2 w-2" style={{ background: COLOR[p.id] }} aria-hidden="true" />
                  <span className="t-index">{p.index}</span>
                </span>
                <span
                  className={`block font-display text-[clamp(1.05rem,2.2vw,2rem)] font-medium uppercase leading-[0.95] tracking-[-0.035em] transition-colors duration-300 ${
                    focus === p.id ? 'text-ink' : focus ? 'text-ink/35' : 'text-ink'
                  }`}
                >
                  {p.title.replace('K76 ', '')}
                </span>
                <span className="t-label mt-1.5 block text-ink/50">{p.role}</span>
              </button>
            )
          })}
        </div>

        <div data-eco-cols className="mt-20 grid gap-10 border-t border-ink/15 pt-10 md:mt-28 md:grid-cols-3">
          {PARTS.map((p) => (
            <div
              key={p.id}
              data-eco-col
              className={`transition-opacity duration-500 ${focus && focus !== p.id ? 'opacity-40' : 'opacity-100'}`}
            >
              <p className="flex items-center gap-2 text-sm text-ink/45">
                <span className="h-2.5 w-2.5" style={{ background: COLOR[p.id] }} aria-hidden="true" />
                <span className="t-index">{p.index}</span>
              </p>
              <h3 className="mt-3 font-display text-xl font-medium tracking-[-0.02em]">{p.title}</h3>
              <p className="mt-3 max-w-sm text-sm text-ink/65">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
