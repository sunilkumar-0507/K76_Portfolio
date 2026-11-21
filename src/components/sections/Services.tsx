import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { charWave } from '../../animations/animeAnimations'
import { gsap, MQ, ScrollTrigger } from '../../animations/gsapConfig'
import { revealSplit } from '../../animations/scrollAnimations'
import { VERTICALS } from '../../data/services'
import { useGsap } from '../../hooks/useGsap'
import { useIsDesktop } from '../../hooks/useMediaQuery'
import { SectionLabel } from '../common/SectionLabel'
import { SplitText } from '../common/SplitText'
import { VerticalGlyph } from './VerticalGlyph'

function ServiceItem({ label, n }: { label: string; n: number }) {
  const textRef = useRef<HTMLSpanElement>(null)
  return (
    <li
      className="group relative border-t border-paper/10 last:border-b"
      onPointerEnter={() => textRef.current && charWave(textRef.current.querySelectorAll('.ch'))}
    >
      <Link
        to="/services"
        className="flex items-center gap-5 py-4 transition-colors duration-300 group-hover:text-lime md:py-5"
        data-cursor="hover"
      >
        <span className="t-index w-7 text-xs text-paper/35">{String(n).padStart(2, '0')}</span>
        <span ref={textRef} className="flex-1 font-display text-[clamp(1.1rem,1.7vw,1.6rem)] tracking-[-0.02em]" aria-label={label}>
          {Array.from(label).map((c, i) => (
            <span key={i} className="ch inline-block whitespace-pre" aria-hidden="true">
              {c}
            </span>
          ))}
        </span>
        <ArrowUpRight
          size={20}
          className="-translate-x-3 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100"
          aria-hidden="true"
        />
      </Link>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-lime transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-x-100"
      />
    </li>
  )
}

export function Services() {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const isDesktop = useIsDesktop()

  useGsap(() => {
    const el = root.current!

    // Section entrance — the dark panel opens out from an inset frame.
    const mm = gsap.matchMedia()
    mm.add(MQ.motion, () => {
      gsap.fromTo(
        el,
        { clipPath: 'inset(6% 4% 0% 4% round 28px)' },
        {
          clipPath: 'inset(0% 0% 0% 0% round 0px)',
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 25%', scrub: true },
        },
      )
      revealSplit(el.querySelector('[data-services-title]')!, { stagger: 0.08 })
      el.querySelectorAll<HTMLElement>('[data-vertical]').forEach((v) => {
        gsap.from(v.querySelectorAll('[data-v-rise]'), {
          y: 50,
          autoAlpha: 0,
          stagger: 0.07,
          duration: 1.1,
          scrollTrigger: { trigger: v, start: 'top 78%', once: true },
        })
      })
    })

    // Which vertical is in focus (drives the sticky visual on desktop).
    const triggers = Array.from(el.querySelectorAll<HTMLElement>('[data-vertical]')).map((v, i) =>
      ScrollTrigger.create({
        trigger: v,
        start: 'top 55%',
        end: 'bottom 55%',
        onToggle: (self) => self.isActive && setActive(i),
      }),
    )

    return () => {
      triggers.forEach((t) => t.kill())
      mm.revert()
    }
  }, root)

  const current = VERTICALS[active]

  return (
    <section
      id="services"
      ref={root}
      data-nav-theme="dark"
      aria-labelledby="services-title"
      className="on-dark grain section relative"
    >
      <div className="wrap">
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <SectionLabel index="02" label="What we do" tone="dark" className="mb-10" />
            <div data-services-title>
              <SplitText as="h2" id="services-title" by="line" text={'One studio.\nThree engines.'} className="t-h2 uppercase" />
            </div>
          </div>
          <p className="max-w-sm text-paper/60 md:col-span-4 md:justify-self-end">
            Business Solutions builds and grows companies. K76 Learn trains the people who do the work. K76 Products turns
            what we build into software anyone can run.
          </p>
        </div>

        <div className="mt-20 grid gap-16 md:mt-28 lg:grid-cols-12 lg:gap-10">
          {/* Sticky visual panel — desktop */}
          {isDesktop ? (
            <div className="lg:col-span-5">
              <div className="sticky top-[18vh]">
                <div className="relative aspect-square w-full max-w-[440px] text-paper">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={current.id}
                      className="absolute inset-0"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1, transition: { duration: 0.5 } }}
                      exit={{ opacity: 0, scale: 1.03, transition: { duration: 0.3 } }}
                    >
                      <VerticalGlyph kind={current.glyph} className="h-full w-full" />
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="mt-10 flex items-baseline gap-5">
                  <span className="t-index text-sm text-lime">{current.index} / 03</span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={current.id}
                      className="t-label text-paper/60"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3 }}
                    >
                      {current.kicker}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          ) : null}

          <div className="space-y-24 md:space-y-32 lg:col-span-7">
            {VERTICALS.map((v, i) => (
              <article
                key={v.id}
                id={v.anchor}
                data-vertical
                onPointerEnter={() => setActive(i)}
                className={`scroll-mt-28 ${i === 1 ? 'lg:pl-[8%]' : i === 2 ? 'lg:pl-[16%]' : ''}`}
                aria-labelledby={`vertical-${v.id}`}
              >
                <div className="flex items-start justify-between gap-6">
                  <span
                    data-v-rise
                    className={`t-index t-outline font-display text-[clamp(4.5rem,12vw,10rem)] font-medium leading-[0.8] tracking-[-0.06em] transition-colors duration-500 ${
                      active === i ? 'text-lime' : 'text-paper/50'
                    }`}
                  >
                    {v.index}
                  </span>
                  {!isDesktop ? (
                    <VerticalGlyph kind={v.glyph} className="h-24 w-24 shrink-0 text-paper sm:h-32 sm:w-32" />
                  ) : null}
                </div>
                <h3 id={`vertical-${v.id}`} data-v-rise className="t-h3 mt-6 uppercase">
                  {v.title}
                </h3>
                <p data-v-rise className="mt-5 max-w-lg text-paper/60">
                  {v.summary}
                </p>
                <ul data-v-rise className="mt-10">
                  {v.items.map((item, n) => (
                    <ServiceItem key={item} label={item} n={n + 1} />
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
