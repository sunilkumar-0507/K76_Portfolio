import { useRef, useState } from 'react'
import { gsap, MQ, ScrollTrigger } from '../../animations/gsapConfig'
import { revealSplit } from '../../animations/scrollAnimations'
import { PROCESS } from '../../data/services'
import { useGsap } from '../../hooks/useGsap'
import { SectionLabel } from '../common/SectionLabel'
import { SplitText } from '../common/SplitText'
import { SectionGlitter } from '../common/GlitterField'

export function Process({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const dark = tone === 'dark'
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  useGsap(() => {
    const el = root.current!
    const list = el.querySelector<HTMLElement>('[data-steps]')!
    revealSplit(el.querySelector('[data-process-title]')!, { stagger: 0.08 })

    const mm = gsap.matchMedia()
    mm.add(MQ.motion, () => {
      // Progress line fills as the list scrolls through the viewport centre.
      gsap.fromTo(
        el.querySelector('[data-progress]'),
        { scaleY: 0 },
        { scaleY: 1, ease: 'none', scrollTrigger: { trigger: list, start: 'top 55%', end: 'bottom 55%', scrub: 0.4 } },
      )
    })

    const steps = Array.from(list.querySelectorAll<HTMLElement>('[data-step]'))
    const triggers = steps.map((step, i) =>
      ScrollTrigger.create({
        trigger: step,
        start: 'top 58%',
        end: 'bottom 58%',
        onToggle: (self) => {
          step.dataset.state = self.isActive ? 'active' : self.progress >= 1 ? 'past' : ''
          if (self.isActive) setActive(i)
        },
        onLeave: () => (step.dataset.state = 'past'),
        onLeaveBack: () => (step.dataset.state = ''),
      }),
    )

    return () => {
      triggers.forEach((t) => t.kill())
      mm.revert()
    }
  }, root)

  return (
    <section
      id="process"
      ref={root}
      data-nav-theme={tone}
      data-tone={tone}
      aria-labelledby="process-title"
      className={`relative isolate grain section ${dark ? 'on-dark' : 'bg-paper text-ink'}`}
    >
      <SectionGlitter tone={tone} />
      <div className="wrap">
        <SectionLabel index="03" label="Our approach" tone={tone} className="mb-10" />
        <div data-process-title>
          <SplitText as="h2" id="process-title" by="line" text={'From first call\nto compounding.'} className="t-h2 uppercase" />
        </div>

        <div className="mt-20 grid gap-12 md:mt-28 lg:grid-cols-12">
          {/* Sticky stage counter */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-[24vh]">
              <div className="relative h-[clamp(10rem,18vw,17rem)] overflow-hidden" aria-hidden="true">
                <div
                  className="transition-transform duration-700 ease-[var(--ease-out)]"
                  style={{ transform: `translateY(-${active * (100 / PROCESS.length)}%)` }}
                >
                  {PROCESS.map((p) => (
                    <p
                      key={p.index}
                      className={`t-index font-display text-[clamp(10rem,18vw,17rem)] font-medium leading-none tracking-[-0.07em] ${dark ? 'text-lime' : 'text-cobalt'}`}
                    >
                      {p.index}
                    </p>
                  ))}
                </div>
              </div>
              <p className={`t-label mt-6 ${dark ? 'text-paper/50' : 'text-ink/50'}`}>
                Stage {PROCESS[active].index} of 0{PROCESS.length} — {PROCESS[active].title}
              </p>
            </div>
          </div>

          <ol data-steps className="relative lg:col-span-7">
            <span aria-hidden="true" className={`absolute bottom-0 left-[7px] top-0 w-px ${dark ? 'bg-paper/15' : 'bg-ink/15'}`}>
              <span
                data-progress
                className="absolute inset-0 origin-top"
                style={{ background: 'linear-gradient(to bottom, var(--lime) 0 33.33%, var(--cobalt) 33.33% 66.66%, var(--iris) 66.66% 100%)' }}
              />
            </span>
            {PROCESS.map((p) => (
              <li
                key={p.index}
                data-step
                className="process-step group relative grid gap-3 pb-16 pl-12 last:pb-0 md:grid-cols-12 md:gap-6 md:pb-24 md:pl-16"
              >
                <span
                  aria-hidden="true"
                  className={`process-dot absolute left-0 top-2 h-[15px] w-[15px] rounded-full border transition-colors duration-500 ${dark ? 'border-paper/40 bg-char' : 'border-ink/30 bg-paper'}`}
                />
                <span className={`t-index text-sm md:col-span-2 ${dark ? 'text-paper/45' : 'text-ink/45'}`}>{p.index}</span>
                <div className="md:col-span-10">
                  <h3 className="process-title t-h3 uppercase transition-colors duration-500">{p.title}</h3>
                  <p className={`process-body mt-4 max-w-md transition-opacity duration-500 ${dark ? 'text-paper/60' : 'text-ink/65'}`}>{p.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <style>{`
        #process { --step-dim: rgb(245 243 237 / .3); --step-on: var(--paper); --step-past: rgb(245 243 237 / .6) }
        #process[data-tone="light"] { --step-dim: rgb(23 23 23 / .28); --step-on: var(--ink); --step-past: rgb(23 23 23 / .6) }
        @media (prefers-reduced-motion: no-preference) {
          .process-step .process-title { color: var(--step-dim) }
          .process-step .process-body { opacity: .35 }
        }
        .process-step[data-state="active"] .process-title { color: var(--step-on) }
        .process-step[data-state="active"] .process-body { opacity: 1 }
        .process-step[data-state="past"] .process-title { color: var(--step-past) }
        .process-step[data-state="past"] .process-body { opacity: .6 }
        .process-step:nth-child(3n+2)[data-state] .process-dot { --dot: var(--lime) }
        .process-step:nth-child(3n+3)[data-state] .process-dot { --dot: var(--cobalt) }
        .process-step:nth-child(3n+4)[data-state] .process-dot { --dot: var(--iris) }
        .process-step[data-state="active"] .process-dot,
        .process-step[data-state="past"] .process-dot { background: var(--dot, var(--lime)); border-color: var(--dot, var(--lime)) }
      `}</style>
    </section>
  )
}
