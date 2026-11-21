import { createDrawable, utils } from 'animejs'
import { ArrowUp, ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { drawStrokes, revertAll, travelSignal } from '../../animations/animeAnimations'
import { ScrollTrigger } from '../../animations/gsapConfig'
import { NAV_ITEMS, SOCIALS } from '../../data/navigation'
import { COURSES, VERTICALS } from '../../data/services'
import { useGsap } from '../../hooks/useGsap'
import { scrollToTarget, useLenis } from '../../hooks/useLenis'
import { useSectionNav } from '../../hooks/useSectionNav'
import { OFFICES, SITE } from '../../utils/constants'
import { K76Mark } from './K76Mark'
import { SectionGlitter } from './GlitterField'

export function Footer() {
  const root = useRef<HTMLElement>(null)
  const markRef = useRef<HTMLDivElement>(null)
  const lenis = useLenis()
  const goTo = useSectionNav()
  const year = new Date().getFullYear()

  useGsap(() => {
    const mark = markRef.current
    if (!mark) return
    utils.set(createDrawable(mark.querySelectorAll('[data-stroke]')), { draw: '0 0' })
    let anims: Array<{ revert: () => unknown } | undefined> = []
    const st = ScrollTrigger.create({
      trigger: mark,
      start: 'top 92%',
      once: true,
      onEnter: () => {
        anims = [
          drawStrokes(mark.querySelectorAll('[data-layer="base"] [data-stroke]'), { duration: 1600, staggerMs: 140 }),
          travelSignal(mark.querySelectorAll('[data-layer="signal"] [data-stroke]'), { duration: 4200, delay: 1600 }),
        ]
      },
    })
    return () => {
      st.kill()
      revertAll(anims)
    }
  }, root)

  const solutions = VERTICALS[0].items

  return (
    <footer ref={root} data-nav-theme="dark" className="isolate on-dark grain relative overflow-clip pt-24 md:pt-32">
      <SectionGlitter tone="dark" />
      <div className="wrap relative">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="font-display text-3xl font-medium leading-[1.05] tracking-[-0.04em] md:text-4xl">
              Build smarter.
              <br />
              Market better.
              <br />
              <span className="text-lime">Grow faster.</span>
            </p>
            <p className="mt-6 max-w-xs text-sm text-paper/55">
              Helping ambitious businesses grow through digital marketing, software, branding, automation and AI.
            </p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-4 md:col-span-8">
            <div>
              <h2 className="t-label mb-5 text-paper/40">Navigate</h2>
              <ul className="space-y-2.5 text-[0.95rem]">
                {NAV_ITEMS.map((n) => (
                  <li key={n.section}>
                    {n.route ? (
                      <Link to={n.route} className="hover:text-lime">
                        {n.label}
                      </Link>
                    ) : (
                      <button type="button" onClick={() => goTo(n.section)} className="hover:text-lime">
                        {n.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="t-label mb-5 text-paper/40">Services</h2>
              <ul className="space-y-2.5 text-[0.95rem] text-paper/80">
                {solutions.map((s) => (
                  <li key={s}>
                    <Link to="/services" className="hover:text-lime">
                      {s}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="t-label mb-5 text-paper/40">K76 Learn</h2>
              <ul className="space-y-2.5 text-[0.95rem] text-paper/80">
                {COURSES.map((c) => (
                  <li key={c.title}>
                    <Link to="/services#learn-courses" className="hover:text-lime">
                      {c.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="t-label mb-5 text-paper/40">Contact</h2>
              <ul className="space-y-2.5 text-[0.95rem]">
                <li>
                  <a href={`mailto:${SITE.email}`} className="hover:text-lime">
                    {SITE.email}
                  </a>
                </li>
                <li>
                  <a href={`tel:${SITE.phoneE164}`} className="hover:text-lime">
                    {SITE.phoneDisplay}
                  </a>
                </li>
                <li className="pt-3 text-paper/50">{SITE.hours}</li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-20 grid gap-8 border-t border-paper/10 pt-10 sm:grid-cols-2 lg:grid-cols-3">
          {OFFICES.map((o) => (
            <address key={o.label} className="not-italic">
              <p className="t-label mb-3 text-lime">{o.label}</p>
              <p className="text-sm leading-relaxed text-paper/65">
                {o.lines.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
                {o.city} — {o.postalCode}
              </p>
            </address>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-6">
          <ul className="flex flex-wrap gap-x-6 gap-y-3">
            {SOCIALS.map((s) => (
              <li key={s.key}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 font-display text-sm text-paper/75 hover:text-lime"
                >
                  {s.label}
                  <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => scrollToTarget(lenis, 0)}
            className="group inline-flex items-center gap-3 font-display text-sm text-paper/75 hover:text-paper"
          >
            Back to top
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-paper/20 transition-colors group-hover:border-lime group-hover:bg-lime group-hover:text-ink">
              <ArrowUp size={16} />
            </span>
          </button>
        </div>
      </div>

      {/* Animated K76 graphic */}
      <div ref={markRef} className="relative mt-16 px-[var(--gutter)] md:mt-24" aria-hidden="true">
        <div className="relative mx-auto max-w-[120rem] text-paper/15">
          <div data-layer="base">
            <K76Mark strokeWidth={1.2} className="w-full" title="" />
          </div>
          <div
            data-layer="signal"
            className="absolute inset-0 text-lime [&_path:nth-child(4)]:text-cobalt-soft [&_path:nth-child(n+5)]:text-iris-soft"
          >
            <K76Mark strokeWidth={2} className="w-full" title="" />
          </div>
        </div>
      </div>

      <div className="wrap flex flex-col gap-2 border-t border-paper/10 py-6 text-xs text-paper/45 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {SITE.name}. All rights reserved.
        </p>
        <p>Chennai · Tenkasi — India</p>
      </div>
    </footer>
  )
}
