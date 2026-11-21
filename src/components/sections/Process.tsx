import { useRef, useState } from 'react'
import { gsap, MQ, ScrollTrigger } from '../../animations/gsapConfig'
import { revealSplit } from '../../animations/scrollAnimations'
import { PROCESS } from '../../data/services'
import { useGsap } from '../../hooks/useGsap'
import { SectionLabel } from '../common/SectionLabel'
import { SplitText } from '../common/SplitText'

export function Process() {
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
    <section id="process" ref={root} data-nav-theme="dark" aria-labelledby="process-title" className="on-dark grain section">
      <div className="wrap">
        <SectionLabel index="04" label="Our approach" tone="dark" className="mb-10" />
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
                      className="t-index font-display text-[clamp(10rem,18vw,17rem)] font-medium leading-none tracking-[-0.07em] text-lime"
                    >
                      {p.index}
                    </p>
                  ))}
                </div>
              </div>
              <p className="t-label mt-6 text-paper/50">
                Stage {PROCESS[active].index} of 0{PROCESS.length} — {PROCESS[active].title}
              </p>
            </div>
          </div>

          <ol data-steps className="relative lg:col-span-7">
            <span aria-hidden="true" className="absolute bottom-0 left-[7px] top-0 w-px bg-paper/15">
              <span data-progress className="absolute inset-0 origin-top bg-lime" />
            </span>
            {PROCESS.map((p) => (
              <li
                key={p.index}
                data-step
                className="process-step group relative grid gap-3 pb-16 pl-12 last:pb-0 md:grid-cols-12 md:gap-6 md:pb-24 md:pl-16"
              >
                <span
                  aria-hidden="true"
                  className="process-dot absolute left-0 top-2 h-[15px] w-[15px] rounded-full border border-paper/40 bg-char transition-colors duration-500"
                />
                <span className="t-index text-sm text-paper/45 md:col-span-2">{p.index}</span>
                <div className="md:col-span-10">
                  <h3 className="process-title t-h3 uppercase transition-colors duration-500">{p.title}</h3>
                  <p className="process-body mt-4 max-w-md text-paper/60 transition-opacity duration-500">{p.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .process-step .process-title { color: rgb(245 243 237 / .3) }
          .process-step .process-body { opacity: .35 }
        }
        .process-step[data-state="active"] .process-title { color: var(--paper) }
        .process-step[data-state="active"] .process-body { opacity: 1 }
        .process-step[data-state="past"] .process-title { color: rgb(245 243 237 / .6) }
        .process-step[data-state="past"] .process-body { opacity: .6 }
        .process-step[data-state="active"] .process-dot,
        .process-step[data-state="past"] .process-dot { background: var(--lime); border-color: var(--lime) }
      `}</style>
    </section>
  )
}
