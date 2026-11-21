import { ArrowUpRight, Mail, MessageCircle, Phone } from 'lucide-react'
import { useRef } from 'react'
import { revealSplit, riseIn } from '../../animations/scrollAnimations'
import { SOCIALS } from '../../data/navigation'
import { useGsap } from '../../hooks/useGsap'
import { OFFICES, SITE, whatsappLink } from '../../utils/constants'
import { SectionLabel } from '../common/SectionLabel'
import { SplitText } from '../common/SplitText'
import { ContactForm } from './ContactForm'
import { SectionGlitter } from '../common/GlitterField'

const CHANNELS = [
  {
    label: 'WhatsApp',
    value: SITE.phoneDisplay,
    href: whatsappLink('Hi K76, I would like to discuss a project.'),
    icon: MessageCircle,
    external: true,
  },
  { label: 'Email', value: SITE.email, href: `mailto:${SITE.email}`, icon: Mail, external: false },
  { label: 'Phone', value: SITE.phoneDisplay, href: `tel:${SITE.phoneE164}`, icon: Phone, external: false },
]

export function Contact({ index = '06', headingLevel = 'h2' }: { index?: string; headingLevel?: 'h1' | 'h2' }) {
  const root = useRef<HTMLElement>(null)

  useGsap(() => {
    const el = root.current!
    revealSplit(el.querySelector('[data-contact-title]')!, { stagger: 0.025, selector: '.split-inner' })
    riseIn(el.querySelectorAll('[data-channel]'), el.querySelector('[data-channels]')!, { stagger: 0.08 })
    riseIn(el.querySelector('form')!, el.querySelector('form')!, { y: 30 })
  }, root)

  return (
    <section id="contact" ref={root} data-nav-theme="dark" aria-labelledby="contact-title" className="isolate on-dark grain section relative">
      <SectionGlitter tone="dark" />
      <div className="wrap">
        <SectionLabel index={index} label="Contact" tone="dark" className="mb-10" />
        <div data-contact-title>
          <SplitText
            as={headingLevel}
            id="contact-title"
            by="char"
            text={"Have an idea?\nLet's make it real."}
            className="t-display t-h1"
            lineClassName="[&:nth-child(2)]:text-lime md:[&:nth-child(2)]:pl-[10vw]"
          />
        </div>

        <div className="mt-20 grid gap-16 md:mt-28 lg:grid-cols-12">
          <aside className="lg:col-span-4" aria-label="Direct contact">
            <p className="max-w-sm text-paper/65">
              Tell us about your business and where you want to go. We reply within one business day.
            </p>

            <ul data-channels className="mt-10">
              {CHANNELS.map((c) => (
                <li key={c.label} data-channel>
                  <a
                    href={c.href}
                    {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="group flex items-center gap-5 border-t border-paper/10 py-5 transition-colors hover:text-lime"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-paper/20 transition-colors group-hover:border-lime group-hover:bg-lime group-hover:text-ink">
                      <c.icon size={18} aria-hidden="true" />
                    </span>
                    <span className="flex-1">
                      <span className="t-label block text-paper/45">{c.label}</span>
                      <span className="mt-1 block font-display text-lg tracking-[-0.01em]">{c.value}</span>
                    </span>
                    <ArrowUpRight size={18} className="opacity-40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-10 border-t border-paper/10 pt-8">
              <p className="t-label text-paper/45">Hours</p>
              <p className="mt-2 font-display">{SITE.hours}</p>
            </div>

            <div className="mt-8 space-y-5">
              {OFFICES.map((o) => (
                <address key={o.label} className="not-italic">
                  <p className="t-label text-paper/45">{o.label}</p>
                  <p className="mt-1 text-sm text-paper/70">
                    {o.lines.join(', ')}, {o.city} — {o.postalCode}
                  </p>
                </address>
              ))}
            </div>

            <ul className="mt-10 flex flex-wrap gap-x-5 gap-y-2" aria-label="Social media">
              {SOCIALS.map((s) => (
                <li key={s.key}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="t-label text-paper/70 hover:text-lime">
                    {s.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          <div className="lg:col-span-7 lg:col-start-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  )
}
