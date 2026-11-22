import { ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'
import { gsap, MQ } from '../animations/gsapConfig'
import { riseIn } from '../animations/scrollAnimations'
import { Button } from '../components/common/Button'
import { Footer } from '../components/common/Footer'
import { PageHeader } from '../components/common/PageHeader'
import { PageTransition } from '../components/common/PageTransition'
import { SectionLabel } from '../components/common/SectionLabel'
import { organizationJsonLd, Seo } from '../components/common/Seo'
import { ABOUT, FIGURES, FOUNDER, LEADERSHIP, MILESTONES, VALUES } from '../data/company'
import { useGsap } from '../hooks/useGsap'
import { SITE } from '../utils/constants'

const aboutJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  url: `${SITE.url}/about`,
  name: 'About K76 Business Solutions',
  mainEntity: {
    '@id': `${SITE.url}/#organization`,
    founder: { '@type': 'Person', name: FOUNDER.name, jobTitle: FOUNDER.role },
  },
}

export default function AboutPage() {
  const root = useRef<HTMLDivElement>(null)

  useGsap(() => {
    const el = root.current!
    el.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((g) => riseIn(g.querySelectorAll('[data-reveal]'), g))

    const mm = gsap.matchMedia()
    mm.add(MQ.motion, () => {
      const line = el.querySelector('[data-mile-line]')
      if (line)
        gsap.fromTo(
          line,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: { trigger: el.querySelector('[data-milestones]'), start: 'top 75%', end: 'bottom 60%', scrub: 0.5 },
          },
        )
    })
    return () => mm.revert()
  }, root)

  return (
    <PageTransition>
      <Seo
        title="About K76 — Our story, mission and team"
        description="K76 Business Solutions was founded in 2021 to give ambitious brands one partner across marketing, software, branding and AI. Meet the team and the milestones."
        path="/about"
        jsonLd={[organizationJsonLd, aboutJsonLd]}
      />
      <main id="main" ref={root}>
        <PageHeader
          index="A"
          label="About K76"
          title={'Builders,\nmarketers,\noperators.'}
          intro="K76 Business Solutions exists to give ambitious brands a single partner across marketing, software, branding and AI — so growth stops being a multi-vendor maze."
          aside={`Since ${SITE.founded} · Chennai & Tenkasi`}
        />

        <section data-nav-theme="light" className="relative isolate bg-paper pb-[var(--section-y)]" aria-labelledby="story-title">
          <div data-reveal-group className="wrap grid gap-12 border-t border-ink/15 pt-16 md:grid-cols-12">
            <div data-reveal className="md:col-span-4">
              <SectionLabel index="01" label="Our story" />
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <h2 id="story-title" data-reveal className="font-display text-[clamp(1.6rem,3vw,2.8rem)] font-medium leading-[1.08] tracking-[-0.03em]">
                From a small marketing studio to a multi-vertical ecosystem.
              </h2>
              <p data-reveal className="mt-8 text-ink/70">
                {ABOUT.origin}
              </p>
              <p data-reveal className="mt-5 text-ink/70">
                {ABOUT.today}
              </p>
            </div>
          </div>

          <dl data-reveal-group className="wrap mt-20 grid grid-cols-2 gap-y-10 md:grid-cols-4">
            {FIGURES.map((f) => (
              <div key={f.label} data-reveal className="border-l border-ink/15 pl-5">
                <dd className="font-display text-[clamp(2.6rem,5vw,4.5rem)] font-medium leading-none tracking-[-0.05em]">{f.value}</dd>
                <dt className="t-label mt-3 text-ink/50">{f.label}</dt>
              </div>
            ))}
          </dl>
        </section>

        {/* Mission / vision / promise */}
        <section data-nav-theme="dark" className="relative isolate on-dark grain section" aria-labelledby="mvp-title">
          <div className="wrap">
            <SectionLabel index="02" label="What drives us" tone="dark" className="mb-10" />
            <h2 id="mvp-title" className="sr-only">
              Mission, vision and promise
            </h2>
            <div data-reveal-group className="grid gap-px bg-paper/10 md:grid-cols-3">
              {[
                { k: 'Mission', v: ABOUT.mission },
                { k: 'Vision', v: ABOUT.vision },
                { k: 'Promise', v: ABOUT.promise },
              ].map((x) => (
                <div key={x.k} data-reveal className="bg-char py-10 md:p-10">
                  <p className="t-label text-lime">{x.k}</p>
                  <p className="mt-8 font-display text-[clamp(1.4rem,2.2vw,2.1rem)] font-medium leading-[1.12] tracking-[-0.025em]">{x.v}</p>
                </div>
              ))}
            </div>

            <figure className="mt-24 max-w-5xl md:mt-32">
              <blockquote className="font-display text-[clamp(1.8rem,4vw,4rem)] font-medium leading-[1.02] tracking-[-0.035em]">
                “{FOUNDER.quote}”
              </blockquote>
              <figcaption className="mt-8">
                <span className="block font-display text-lg">{FOUNDER.name}</span>
                <span className="t-label text-paper/50">{FOUNDER.role}</span>
              </figcaption>
            </figure>
          </div>
        </section>

        {/* Values */}
        <section data-nav-theme="light" className="relative isolate section bg-paper" aria-labelledby="values-title">
          <div className="wrap grid gap-14 md:grid-cols-12">
            <div className="md:col-span-4">
              <SectionLabel index="03" label="Core values" className="mb-10" />
              <h2 id="values-title" className="t-h2 uppercase">
                How we work.
              </h2>
            </div>
            <ul data-reveal-group className="md:col-span-7 md:col-start-6">
              {VALUES.map((v, i) => (
                <li key={v.title} data-reveal className="grid gap-2 border-t border-ink/15 py-8 sm:grid-cols-12 last:border-b">
                  <span className="t-index text-xs text-ink/40 sm:col-span-1">0{i + 1}</span>
                  <h3 className="font-display text-2xl font-medium tracking-[-0.025em] sm:col-span-5">{v.title}</h3>
                  <p className="text-ink/65 sm:col-span-6">{v.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Leadership */}
        <section data-nav-theme="light" className="relative isolate section bg-paper-2" aria-labelledby="team-title">
          <div className="wrap">
            <SectionLabel index="04" label="Leadership" className="mb-10" />
            <h2 id="team-title" className="t-h2 max-w-[16ch] uppercase">
              The people behind K76.
            </h2>
            <p className="mt-8 max-w-xl text-ink/65">
              Our leadership combines technology, creativity and business strategy to help brands scale with confidence.
            </p>
            <ul data-reveal-group className="mt-16">
              {LEADERSHIP.map((p, i) => (
                <li
                  key={p.name}
                  data-reveal
                  className="group grid items-baseline gap-2 border-t border-ink/15 py-6 transition-colors duration-500 last:border-b hover:bg-ink hover:text-paper sm:grid-cols-12 sm:px-4"
                >
                  <span className="t-index text-xs text-ink/40 group-hover:text-lime sm:col-span-1">0{i + 1}</span>
                  <span className="font-display text-[clamp(1.6rem,3.4vw,3.2rem)] font-medium uppercase leading-none tracking-[-0.045em] sm:col-span-7">
                    {p.name}
                  </span>
                  <span className="t-label text-ink/55 group-hover:text-paper/70 sm:col-span-4 sm:text-right">{p.role}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Milestones */}
        <section data-nav-theme="light" className="relative isolate section overflow-clip bg-paper" aria-labelledby="milestones-title">
          <div className="wrap">
            <SectionLabel index="05" label="Milestones" className="mb-10" />
            <h2 id="milestones-title" className="t-h2 uppercase">
              Five years of compounding.
            </h2>
            <div data-milestones className="relative mt-20">
              <span aria-hidden="true" className="absolute left-0 right-0 top-[0.55rem] hidden h-px bg-ink/15 md:block">
                <span data-mile-line className="absolute inset-0 origin-left bg-ink" />
              </span>
              <ol data-reveal-group className="grid gap-12 md:grid-cols-5 md:gap-8">
                {MILESTONES.map((m) => (
                  <li key={m.year} data-reveal className="relative border-l border-ink/15 pl-6 md:border-l-0 md:pl-0">
                    <span aria-hidden="true" className="absolute -left-[5px] top-1.5 h-[9px] w-[9px] rounded-full bg-lime-deep md:static md:mb-8 md:block md:h-[18px] md:w-[18px] md:border-4 md:border-paper md:bg-ink" />
                    <p className="t-index font-display text-4xl font-medium tracking-[-0.05em]">{m.year}</p>
                    <h3 className="mt-3 font-display text-lg font-medium">{m.title}</h3>
                    <p className="mt-2 text-sm text-ink/60">{m.body}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div className="mt-20 flex flex-wrap gap-3">
              <Button to="/contact" variant="ink" icon={<ArrowUpRight size={16} />}>
                Work with us
              </Button>
              <Button href="https://k76.in/careers" external variant="outline">
                Join the team
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  )
}
