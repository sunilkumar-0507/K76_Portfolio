import { ArrowUpRight, Plus } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { gsap, MQ } from '../../animations/gsapConfig'
import { clipReveal, revealSplit } from '../../animations/scrollAnimations'
import { PROJECTS } from '../../data/projects'
import { useGsap } from '../../hooks/useGsap'
import { SectionLabel } from '../common/SectionLabel'
import { SplitText } from '../common/SplitText'
import { ProjectCover } from './ProjectCover'
import { ProjectModal } from './ProjectModal'

export function Portfolio() {
  const root = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const close = useCallback(() => setOpenIndex(null), [])

  useGsap(() => {
    const el = root.current!
    const pin = pinRef.current!
    const track = trackRef.current!
    revealSplit(el.querySelector('[data-work-title]')!, { stagger: 0.08 })

    const mm = gsap.matchMedia()

    // Desktop: pinned horizontal showcase driven by vertical scroll.
    mm.add(MQ.desktop, () => {
      const distance = () => track.scrollWidth - window.innerWidth
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: pin,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      })

      gsap.to(el.querySelector('[data-work-progress]'), {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: pin, start: 'top top', end: () => `+=${distance()}`, scrub: true },
      })

      track.querySelectorAll<HTMLElement>('[data-project]').forEach((card) => {
        const frame = card.querySelector('[data-frame]')!
        const media = card.querySelector('[data-media]')
        gsap.fromTo(
          frame,
          { clipPath: 'inset(12% 10% 12% 10%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            ease: 'none',
            scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 95%', end: 'left 35%', scrub: true },
          },
        )
        if (media) {
          gsap.fromTo(
            media,
            { scale: 1.12, xPercent: -3 },
            {
              scale: 1,
              xPercent: 3,
              ease: 'none',
              scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
            },
          )
        }
        gsap.from(card.querySelectorAll('[data-meta]'), {
          yPercent: 100,
          autoAlpha: 0,
          stagger: 0.06,
          duration: 1,
          scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 70%', toggleActions: 'play none none reverse' },
        })
      })
    })

    // Tablet / mobile: vertical stack with clip reveals.
    mm.add(MQ.belowDesktop, () => {
      track.querySelectorAll<HTMLElement>('[data-frame]').forEach((f) => clipReveal(f))
      track.querySelectorAll<HTMLElement>('[data-project]').forEach((card) => {
        gsap.from(card.querySelectorAll('[data-meta]'), {
          y: 30,
          autoAlpha: 0,
          stagger: 0.06,
          scrollTrigger: { trigger: card, start: 'top 70%', once: true },
        })
      })
    })

    return () => mm.revert()
  }, root)

  return (
    <section id="work" ref={root} data-nav-theme="light" aria-labelledby="work-title" className="relative bg-paper">
      <div className="wrap pb-14 pt-[var(--section-y)] md:pb-20">
        <SectionLabel index="03" label="Selected work" className="mb-10" />
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div data-work-title className="md:col-span-8">
            <SplitText as="h2" id="work-title" by="line" text={'Selected\nprojects.'} className="t-h2 uppercase" />
          </div>
          <div className="md:col-span-4 md:justify-self-end">
            <p className="max-w-xs text-ink/60">
              Recent engagements across websites, apps and growth marketing — for businesses in Tamil Nadu and beyond.
            </p>
            <p className="t-index mt-4 text-sm text-ink/45">({String(PROJECTS.length).padStart(2, '0')} projects)</p>
          </div>
        </div>
      </div>

      <div ref={pinRef} className="relative lg:flex lg:h-[100svh] lg:flex-col lg:justify-center lg:overflow-hidden">
        <div
          ref={trackRef}
          className="wrap flex flex-col gap-20 pb-[var(--section-y)] lg:w-max lg:max-w-none lg:flex-row lg:items-center lg:gap-[5vw] lg:pb-0 lg:pr-[12vw]"
        >
          {PROJECTS.map((p, i) => (
            <article
              key={p.slug}
              data-project
              className={`group flex flex-col gap-6 lg:w-[58vw] lg:max-w-[1100px] ${i % 2 === 1 ? 'lg:flex-col-reverse lg:pt-[6vh]' : 'lg:pb-[6vh]'}`}
              aria-labelledby={`project-${p.slug}`}
            >
              <button
                type="button"
                data-frame
                data-cursor="View"
                onClick={() => setOpenIndex(i)}
                className="relative block aspect-[4/3] w-full overflow-hidden text-left lg:aspect-[16/10] lg:h-auto lg:max-h-[58vh]"
                aria-label={`View project: ${p.name}`}
              >
                <ProjectCover project={p} index={i} />
                <span className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-paper text-ink lg:hidden">
                  <Plus size={18} />
                </span>
              </button>

              <div className="grid gap-4 md:grid-cols-12 md:items-start">
                <div className="overflow-hidden md:col-span-1">
                  <p data-meta className="t-index text-sm text-ink/45">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                </div>
                <div className="md:col-span-6">
                  <div className="overflow-hidden">
                    <p data-meta className="t-label text-ink/50">
                      {p.category} — {p.client}
                    </p>
                  </div>
                  <div className="overflow-hidden">
                    <h3 data-meta id={`project-${p.slug}`} className="t-h3 mt-2 uppercase">
                      {p.name}
                    </h3>
                  </div>
                </div>
                <div className="md:col-span-5">
                  <div className="overflow-hidden">
                    <p data-meta className="text-sm text-ink/65">
                      {p.description}
                    </p>
                  </div>
                  <div className="overflow-hidden">
                    <div data-meta className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                      <span className="t-label text-ink/45">{p.stack.join(' · ')}</span>
                      <button
                        type="button"
                        onClick={() => setOpenIndex(i)}
                        className="group/btn inline-flex items-center gap-1.5 font-display text-sm font-medium underline decoration-ink/25 underline-offset-4 hover:decoration-ink"
                      >
                        View project
                        <Plus size={14} className="transition-transform duration-300 group-hover/btn:rotate-90" />
                      </button>
                      {p.liveUrl ? (
                        <a
                          href={p.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-display text-sm font-medium underline decoration-ink/25 underline-offset-4 hover:decoration-ink"
                        >
                          Live site <ArrowUpRight size={14} />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Horizontal progress — desktop only */}
        <div className="wrap absolute inset-x-0 bottom-8 hidden items-center gap-6 lg:flex" aria-hidden="true">
          <span className="t-label text-ink/45">Scroll to explore</span>
          <span className="relative h-px flex-1 bg-ink/15">
            <span data-work-progress className="absolute inset-0 origin-left scale-x-0 bg-ink" />
          </span>
          <span className="t-index text-xs text-ink/45">{String(PROJECTS.length).padStart(2, '0')}</span>
        </div>
      </div>

      <ProjectModal project={openIndex === null ? null : PROJECTS[openIndex]} index={openIndex ?? 0} onClose={close} />
    </section>
  )
}
