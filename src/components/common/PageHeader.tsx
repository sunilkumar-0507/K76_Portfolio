import { useRef } from 'react'
import { gsap, prefersReducedMotion } from '../../animations/gsapConfig'
import { useGsap } from '../../hooks/useGsap'
import { SectionLabel } from './SectionLabel'
import { SplitText } from './SplitText'
import { SectionGlitter } from './GlitterField'

interface PageHeaderProps {
  index: string
  label: string
  title: string
  intro: string
  aside?: string
}

/** Opening block for inner pages — oversized split title with a masked reveal. */
export function PageHeader({ index, label, title, intro, aside }: PageHeaderProps) {
  const root = useRef<HTMLElement>(null)

  useGsap(() => {
    if (prefersReducedMotion()) return
    const el = root.current!
    const tl = gsap.timeline({ delay: 0.75 })
    tl.from(el.querySelectorAll('.split-inner'), { yPercent: 115, rotate: 4, duration: 1.3, stagger: 0.025 })
      .from(el.querySelectorAll('[data-ph-fade]'), { autoAlpha: 0, y: 20, duration: 1, stagger: 0.08 }, 0.4)
  }, root)

  return (
    <header ref={root} data-nav-theme="light" className="isolate grain relative bg-paper pb-20 pt-[calc(var(--nav-h)+5rem)] md:pb-28 md:pt-[calc(var(--nav-h)+8rem)]">
      <SectionGlitter tone="light" />
      <div className="wrap">
        <div data-ph-fade>
          <SectionLabel index={index} label={label} className="mb-10" />
        </div>
        <SplitText as="h1" by="char" text={title} className="t-display t-h1" />
        <div className="mt-14 grid gap-8 md:mt-20 md:grid-cols-12">
          <p data-ph-fade className="t-lead max-w-xl text-pretty text-ink/70 md:col-span-6">
            {intro}
          </p>
          {aside ? (
            <p data-ph-fade className="t-label text-ink/45 md:col-span-3 md:col-start-10 md:text-right">
              {aside}
            </p>
          ) : null}
        </div>
      </div>
    </header>
  )
}
