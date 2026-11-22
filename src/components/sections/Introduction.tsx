import { useRef } from 'react'
import { countTo, revertAll } from '../../animations/animeAnimations'
import { gsap, prefersReducedMotion, ScrollTrigger } from '../../animations/gsapConfig'
import { riseIn, scrubWords } from '../../animations/scrollAnimations'
import { ABOUT, FIGURES } from '../../data/company'
import { useGsap } from '../../hooks/useGsap'
import { SectionLabel } from '../common/SectionLabel'
import { SplitText } from '../common/SplitText'

export function Introduction() {
  const root = useRef<HTMLElement>(null)

  useGsap(() => {
    const el = root.current!
    if (prefersReducedMotion()) return

    el.querySelectorAll<HTMLElement>('[data-statement]').forEach((s) => scrubWords(s))

    // Marker under "possibilities" grows with the scroll.
    gsap.fromTo(
      el.querySelector('[data-marker]'),
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: el.querySelector('[data-statement-2]'), start: 'top 70%', end: 'bottom 45%', scrub: 0.6 },
      },
    )

    // Subtle background shift as the section ends — sets up the dark vertical section.
    gsap.fromTo(
      el,
      { backgroundColor: '#f5f3ed' },
      {
        backgroundColor: '#ebe8df',
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'center center', end: 'bottom top', scrub: true },
      },
    )

    riseIn(el.querySelectorAll('[data-rise]'), el.querySelector('[data-intro-body]')!, { stagger: 0.1 })

    const anims: Array<{ revert: () => unknown } | undefined> = []
    const counters = el.querySelectorAll<HTMLElement>('[data-count]')
    const st = ScrollTrigger.create({
      trigger: el.querySelector('[data-figures]'),
      start: 'top 85%',
      once: true,
      onEnter: () => counters.forEach((c) => anims.push(countTo(c, Number(c.dataset.count)))),
    })
    return () => {
      st.kill()
      revertAll(anims)
    }
  }, root)

  return (
    <section id="intro" ref={root} data-nav-theme="light" className="relative isolate section bg-paper" aria-labelledby="intro-heading">
      <div className="wrap">
        <SectionLabel index="01" label="Introduction" className="mb-14 md:mb-20" />

        <h2 id="intro-heading" className="sr-only">
          We don’t just build digital products. We build business possibilities.
        </h2>
        <div aria-hidden="true">
          <div data-statement>
            <SplitText as="p" by="word" mask={false} text={"We don't just build\ndigital products."} className="t-statement max-w-[15ch] text-ink" />
          </div>
          <div data-statement data-statement-2 className="mt-4 md:mt-8 md:pl-[24%]">
            <p className="t-statement text-ink">
              <SplitText as="span" by="word" mask={false} text="We build business" className="block" />
              <span className="relative inline-block">
                <SplitText as="span" by="word" mask={false} text="possibilities." className="relative z-[1] block" />
                <span
                  data-marker
                  className="absolute bottom-[0.08em] left-0 h-[0.32em] w-full origin-left bg-lime"
                  aria-hidden="true"
                />
              </span>
            </p>
          </div>
        </div>

        <div data-intro-body className="mt-24 grid gap-12 md:mt-36 md:grid-cols-12">
          <p data-rise className="t-label text-ink/50 md:col-span-3">
            Who we are
          </p>
          <div className="md:col-span-7 md:col-start-5">
            <p data-rise className="font-display text-[clamp(1.35rem,2.3vw,2.1rem)] leading-[1.2] tracking-[-0.025em] text-ink text-pretty">
              {ABOUT.who}
            </p>
            <p data-rise className="mt-8 max-w-xl text-ink/65">
              {ABOUT.today}
            </p>
          </div>
        </div>

        <dl data-figures className="mt-20 grid grid-cols-2 border-t border-ink/15 md:mt-28 md:grid-cols-4">
          {FIGURES.map((f, i) => {
            const numeric = /^(\d+)(\+?)$/.exec(f.value)
            const isYear = f.label === 'Founded'
            return (
              <div
                key={f.label}
                className={`flex flex-col gap-3 border-ink/15 py-8 md:py-10 ${i % 2 === 1 ? 'border-l pl-5 md:pl-8' : ''} ${
                  i >= 2 ? 'border-t md:border-t-0' : ''
                } ${i === 2 ? 'md:border-l md:pl-8' : ''}`}
              >
                <dt className="t-label order-2 text-ink/50">{f.label}</dt>
                <dd className="t-index order-1 font-display text-[clamp(2.8rem,6vw,5.5rem)] font-medium leading-none tracking-[-0.05em]">
                  {numeric && !isYear ? (
                    <>
                      <span data-count={numeric[1]}>{numeric[1]}</span>
                      {numeric[2] ? <span className="text-lime-deep">+</span> : null}
                    </>
                  ) : (
                    f.value
                  )}
                </dd>
              </div>
            )
          })}
        </dl>
      </div>
    </section>
  )
}
