import { ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'
import { parallax, revealSplit, riseIn } from '../../animations/scrollAnimations'
import { gsap, MQ } from '../../animations/gsapConfig'
import { ABOUT, FOUNDER, WHY_K76 } from '../../data/company'
import { useGsap } from '../../hooks/useGsap'
import { Button } from '../common/Button'
import { SectionLabel } from '../common/SectionLabel'
import { SplitText } from '../common/SplitText'

const PILLARS = [
  { k: 'Who we are', v: ABOUT.who },
  { k: 'Our mission', v: ABOUT.mission },
  { k: 'Our vision', v: ABOUT.vision },
  { k: 'Our approach', v: 'Strategy, design, engineering and growth — run by one senior team, reported on weekly.' },
]

export function About() {
  const root = useRef<HTMLElement>(null)

  useGsap(() => {
    const el = root.current!
    revealSplit(el.querySelector('[data-about-title]')!, { stagger: 0.08 })
    revealSplit(el.querySelector('[data-quote]')!, { stagger: 0.05, start: 'top 80%' })
    riseIn(el.querySelectorAll('[data-pillar]'), el.querySelector('[data-pillars]')!, { stagger: 0.08 })
    riseIn(el.querySelectorAll('[data-why]'), el.querySelector('[data-whys]')!, { stagger: 0.08 })

    const mm = gsap.matchMedia()
    mm.add(MQ.motion, () => {
      parallax(el.querySelector('[data-year]')!, 18, el)
    })
    return () => mm.revert()
  }, root)

  return (
    <section id="about" ref={root} data-nav-theme="light" aria-labelledby="about-title" className="section relative overflow-hidden bg-paper">
      {/* Oversized outlined founding year */}
      <p
        data-year
        aria-hidden="true"
        className="t-outline pointer-events-none absolute -right-[4vw] top-[8%] select-none font-display text-[clamp(8rem,30vw,30rem)] font-medium leading-none tracking-[-0.07em] text-ink/10"
      >
        2021
      </p>

      <div className="wrap relative">
        <SectionLabel index="06" label="About K76" className="mb-10" />

        <div className="grid gap-12 md:grid-cols-12">
          <div data-about-title className="md:col-span-7">
            <SplitText as="h2" id="about-title" by="line" text={'Built because\nnothing\nconnected.'} className="t-h2 uppercase" />
          </div>
          <div className="space-y-6 text-ink/70 md:col-span-4 md:col-start-9 md:pt-4">
            <p className="text-pretty">{ABOUT.origin}</p>
            <p className="text-pretty">{ABOUT.today}</p>
            <p className="t-label pt-2 text-ink/45">Founded 2021 · Chennai &amp; Tenkasi</p>
          </div>
        </div>

        {/* Founder quote */}
        <figure className="mt-24 grid gap-8 border-t border-ink/15 pt-12 md:mt-36 md:grid-cols-12 md:pt-16">
          <span aria-hidden="true" className="font-display text-[6rem] leading-[0.6] text-lime-deep md:col-span-1">
            “
          </span>
          <blockquote data-quote className="md:col-span-9">
            <SplitText
              as="p"
              by="line"
              text={'Technology should empower businesses\nto grow faster — not become another\nproblem to manage.'}
              className="font-display text-[clamp(1.6rem,3.6vw,3.6rem)] font-medium leading-[1.02] tracking-[-0.035em]"
            />
          </blockquote>
          <figcaption className="md:col-span-9 md:col-start-2">
            <span className="block font-display text-lg font-medium">{FOUNDER.name}</span>
            <span className="t-label text-ink/50">{FOUNDER.role}</span>
          </figcaption>
        </figure>

        {/* Who / mission / vision / approach */}
        <dl data-pillars className="mt-24 grid gap-px bg-ink/15 md:mt-32 md:grid-cols-2">
          {PILLARS.map((p, i) => (
            <div key={p.k} data-pillar className="bg-paper py-10 md:p-12 md:first:pl-0 md:[&:nth-child(3)]:pl-0">
              <dt className="flex items-center gap-3">
                <span className="t-index text-xs text-ink/40">0{i + 1}</span>
                <span className="t-label text-ink/60">{p.k}</span>
              </dt>
              <dd className="mt-6 max-w-lg font-display text-[clamp(1.25rem,2vw,1.85rem)] leading-[1.2] tracking-[-0.02em] text-pretty">
                {p.v}
              </dd>
            </div>
          ))}
        </dl>

        {/* Why K76 */}
        <div className="mt-24 grid gap-10 md:mt-32 md:grid-cols-12">
          <div className="md:col-span-4">
            <h3 className="t-h3 uppercase">Why K76</h3>
            <p className="mt-4 max-w-xs text-ink/60">{ABOUT.promise}</p>
            <div className="mt-8">
              <Button to="/about" variant="ink" icon={<ArrowUpRight size={16} />}>
                Read our story
              </Button>
            </div>
          </div>
          <ul data-whys className="grid gap-x-10 sm:grid-cols-2 md:col-span-7 md:col-start-6">
            {WHY_K76.map((w, i) => (
              <li key={w.title} data-why className="border-t border-ink/15 py-6">
                <span className="t-index text-xs text-ink/40">({String.fromCharCode(97 + i)})</span>
                <p className="mt-2 font-display text-xl font-medium tracking-[-0.02em]">{w.title}</p>
                <p className="mt-1 text-sm text-ink/60">{w.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
