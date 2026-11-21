import { ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'
import { riseIn } from '../animations/scrollAnimations'
import { Button } from '../components/common/Button'
import { Footer } from '../components/common/Footer'
import { PageHeader } from '../components/common/PageHeader'
import { PageTransition } from '../components/common/PageTransition'
import { SectionLabel } from '../components/common/SectionLabel'
import { organizationJsonLd, Seo } from '../components/common/Seo'
import { Process } from '../components/sections/Process'
import { VerticalGlyph } from '../components/sections/VerticalGlyph'
import { COURSES, INDUSTRIES, LEARN_PILLARS, PRACTICES, VERTICALS } from '../data/services'
import { useGsap } from '../hooks/useGsap'
import { SITE } from '../utils/constants'

const servicesJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'K76 Business Solutions services',
  itemListElement: PRACTICES.map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'Service',
      name: p.title,
      description: p.line,
      provider: { '@id': `${SITE.url}/#organization` },
      areaServed: 'IN',
    },
  })),
}

export default function ServicesPage() {
  const root = useRef<HTMLDivElement>(null)

  useGsap(() => {
    const el = root.current!
    el.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((g) => riseIn(g.querySelectorAll('[data-reveal]'), g))
  }, root)

  return (
    <PageTransition>
      <Seo
        title="Services — Software, Marketing, Branding & AI"
        description="Websites, e-commerce, CRM & ERP, custom software, performance marketing, brand identity and AI automation — plus K76 Learn training programmes and K76 Products."
        path="/services"
        jsonLd={[organizationJsonLd, servicesJsonLd]}
      />
      <main id="main" ref={root}>
        <PageHeader
          index="S"
          label="Capabilities"
          title={'Every growth\nlever. One team.'}
          intro="From the first ad campaign to a custom ERP and an AI workflow, K76 ships the full stack of growth services under one roof."
          aside="Business Solutions · K76 Learn · K76 Products"
        />

        {/* Practices */}
        <section data-nav-theme="dark" className="on-dark grain section" aria-labelledby="practices-title">
          <div className="wrap">
            <SectionLabel index="01" label="Business Solutions" tone="dark" className="mb-10" />
            <h2 id="practices-title" className="t-h2 max-w-[14ch] uppercase">
              Five practices, one brief.
            </h2>
            <div className="mt-20 divide-y divide-paper/10 border-y border-paper/10">
              {PRACTICES.map((p, i) => (
                <article key={p.title} data-reveal-group className="grid gap-6 py-12 md:grid-cols-12 md:py-16">
                  <span data-reveal className="t-index text-sm text-lime md:col-span-1">
                    0{i + 1}
                  </span>
                  <div data-reveal className="md:col-span-5">
                    <h3 className="t-h3 uppercase">{p.title}</h3>
                    <p className="mt-4 max-w-sm text-paper/60">{p.line}</p>
                  </div>
                  <ul data-reveal className="grid gap-x-8 gap-y-3 sm:grid-cols-2 md:col-span-6">
                    {p.items.map((item) => (
                      <li key={item} className="flex items-center gap-3 border-b border-paper/10 pb-3 font-display text-lg tracking-[-0.01em]">
                        <span className="h-1.5 w-1.5 shrink-0 bg-lime" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* K76 Learn */}
        <section id="learn-courses" data-nav-theme="light" className="section scroll-mt-20 bg-paper" aria-labelledby="learn-title">
          <div className="wrap">
            <div className="grid gap-10 md:grid-cols-12 md:items-end">
              <div className="md:col-span-8">
                <SectionLabel index="02" label="K76 Learn" className="mb-10" />
                <h2 id="learn-title" className="t-h2 uppercase">
                  Career-focused training, real placements.
                </h2>
              </div>
              <div className="h-40 w-40 text-ink md:col-span-3 md:col-start-10 md:justify-self-end">
                <VerticalGlyph kind="steps" className="h-full w-full [--glyph-line:var(--ink)]" />
              </div>
            </div>
            <p className="mt-10 max-w-2xl text-ink/65">{VERTICALS[1].summary} New cohorts every month.</p>

            <div data-reveal-group className="mt-16 grid gap-px bg-ink/15 sm:grid-cols-2 lg:grid-cols-3">
              {COURSES.map((c) => (
                <article key={c.title} data-reveal className="group flex min-h-64 flex-col bg-paper p-8 transition-colors duration-500 hover:bg-ink hover:text-paper">
                  <span className="t-label text-ink/45 group-hover:text-lime">{c.weeks} weeks</span>
                  <h3 className="mt-auto font-display text-3xl font-medium uppercase leading-none tracking-[-0.04em]">{c.title}</h3>
                  <p className="mt-3 text-sm text-ink/60 group-hover:text-paper/65">{c.topics}</p>
                </article>
              ))}
            </div>

            <div data-reveal-group className="mt-16 grid gap-10 md:grid-cols-12">
              <h3 data-reveal className="t-label text-ink/50 md:col-span-3">
                More than a course
              </h3>
              <ul data-reveal className="grid gap-x-10 sm:grid-cols-2 md:col-span-8 md:col-start-5">
                {LEARN_PILLARS.map((p) => (
                  <li key={p} className="border-t border-ink/15 py-4 font-display text-lg">
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-12">
              <Button to="/contact" variant="ink" icon={<ArrowUpRight size={16} />}>
                Enquire about a cohort
              </Button>
            </div>
          </div>
        </section>

        {/* K76 Products */}
        <section data-nav-theme="light" className="section bg-paper-2" aria-labelledby="products-title">
          <div className="wrap grid gap-14 md:grid-cols-12">
            <div className="md:col-span-5">
              <SectionLabel index="03" label="K76 Products" className="mb-10" />
              <h2 id="products-title" className="t-h2 uppercase">
                Software we own.
              </h2>
              <p className="mt-8 max-w-md text-ink/65">{VERTICALS[2].summary}</p>
            </div>
            <ul data-reveal-group className="md:col-span-6 md:col-start-7">
              {VERTICALS[2].items.map((item, i) => (
                <li key={item} data-reveal className="flex items-baseline gap-6 border-t border-ink/15 py-6 last:border-b">
                  <span className="t-index text-xs text-ink/40">0{i + 1}</span>
                  <span className="font-display text-[clamp(1.4rem,2.6vw,2.4rem)] font-medium uppercase leading-none tracking-[-0.035em]">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Industries */}
        <section data-nav-theme="light" className="bg-paper py-20 md:py-28" aria-labelledby="industries-title">
          <div className="wrap">
            <h2 id="industries-title" className="t-label text-ink/50">
              Industries we serve
            </h2>
          </div>
          <div className="marquee mt-8 overflow-hidden border-y border-ink/10 py-6" aria-hidden="true">
            <div className="marquee-track flex w-max">
              {[0, 1].map((d) => (
                <ul key={d} className="flex shrink-0 items-center">
                  {INDUSTRIES.map((ind) => (
                    <li key={ind} className="flex items-center font-display text-[clamp(2rem,5vw,4.5rem)] font-medium uppercase tracking-[-0.04em]">
                      <span className="px-8">{ind}</span>
                      <span className="h-3 w-3 rounded-full bg-lime-deep" />
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
          <p className="sr-only">{INDUSTRIES.join(', ')}</p>
        </section>

        <Process />

        <section data-nav-theme="light" className="section bg-paper">
          <div className="wrap flex flex-col items-start gap-10 md:flex-row md:items-end md:justify-between">
            <h2 className="t-h2 max-w-[12ch] uppercase">Have a project in mind?</h2>
            <Button to="/contact" variant="lime" size="lg" icon={<ArrowUpRight size={18} />}>
              Start a project
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  )
}
