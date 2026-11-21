import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { NAV_ITEMS, SOCIALS } from '../../data/navigation'
import { useAppState } from '../../hooks/useAppState'
import { useLenis } from '../../hooks/useLenis'
import { useSectionNav } from '../../hooks/useSectionNav'
import { SITE } from '../../utils/constants'

const ease = [0.76, 0, 0.24, 1] as const

function Logo({ dark }: { dark: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <span className="font-display text-[1.6rem] font-bold leading-none tracking-[-0.06em]">
        K76<span className="text-lime-deep">.</span>
      </span>
      <span
        className={`hidden border-l pl-3 text-[0.68rem] font-medium uppercase leading-[1.15] tracking-[0.14em] md:block ${
          dark ? 'border-paper/20 text-paper/60' : 'border-ink/15 text-ink/55'
        }`}
      >
        Business
        <br />
        Solutions
      </span>
    </span>
  )
}

export function Navbar() {
  const { activeSection, menuOpen, setMenuOpen } = useAppState()
  const { pathname } = useLocation()
  const lenis = useLenis()
  const goTo = useSectionNav()
  const reduce = useReducedMotion()

  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [dark, setDark] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const menuBtnRef = useRef<HTMLButtonElement>(null)
  const firstLinkRef = useRef<HTMLButtonElement>(null)

  // One passive, rAF-throttled listener for scrolled / hide-on-scroll / theme-under-nav.
  useEffect(() => {
    let lastY = window.scrollY
    let ticking = false
    const update = () => {
      ticking = false
      const y = window.scrollY
      setScrolled(y > 24)
      if (Math.abs(y - lastY) > 6) {
        setHidden(y > lastY && y > 480)
        lastY = y
      }
      const probeY = (headerRef.current?.offsetHeight ?? 76) / 2
      const stack = document.elementsFromPoint(window.innerWidth / 2, probeY)
      const host = stack.find((n) => !headerRef.current?.contains(n) && n.closest('[data-nav-theme]'))
      setDark(host?.closest('[data-nav-theme]')?.getAttribute('data-nav-theme') === 'dark')
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }
    update()
    const t = window.setTimeout(update, 900)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [pathname])

  // Menu: lock scroll, Escape to close, manage focus.
  useEffect(() => {
    if (!menuOpen) return
    lenis?.stop()
    document.documentElement.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    const f = window.setTimeout(() => firstLinkRef.current?.focus(), 350)
    const btn = menuBtnRef.current
    return () => {
      lenis?.start()
      document.documentElement.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      window.clearTimeout(f)
      btn?.focus({ preventScroll: true })
    }
  }, [menuOpen, lenis, setMenuOpen])

  useEffect(() => setMenuOpen(false), [pathname, setMenuOpen])

  const isActive = (section: string, route?: string) => {
    if (pathname === '/') return activeSection === section
    return route ? pathname.startsWith(route) : false
  }

  const onDarkBar = dark && !menuOpen
  const barSurface = scrolled
    ? onDarkBar
      ? 'bg-char/80 border-paper/10'
      : 'bg-paper/80 border-ink/10'
    : 'bg-transparent border-transparent'

  return (
    <>
      <motion.header
        ref={headerRef}
        className={`fixed inset-x-0 top-0 z-[70] border-b backdrop-blur-md transition-[background-color,border-color,color,height] duration-500 ${barSurface} ${
          onDarkBar || menuOpen ? 'text-paper' : 'text-ink'
        } ${scrolled ? 'backdrop-blur-md' : 'backdrop-blur-none'}`}
        animate={{ y: hidden && !menuOpen ? '-100%' : '0%' }}
        transition={{ duration: reduce ? 0 : 0.6, ease }}
      >
        <nav
          aria-label="Primary"
          className={`wrap flex items-center justify-between transition-[height] duration-500 ${scrolled ? 'h-16' : 'h-[var(--nav-h)]'}`}
        >
          <Link
            to="/"
            onClick={(e) => {
              if (pathname === '/') {
                e.preventDefault()
                goTo('top')
              }
            }}
            aria-label={`${SITE.name} — home`}
            data-cursor="hover"
          >
            <Logo dark={onDarkBar || menuOpen} />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item, i) => {
              const active = isActive(item.section, item.route)
              return (
                <li key={item.section}>
                  <button
                    type="button"
                    onClick={() => goTo(item.section)}
                    aria-current={active ? 'true' : undefined}
                    className="roll-host relative flex items-center gap-1.5 rounded-full px-3.5 py-2 font-display text-[0.92rem] font-medium tracking-tight"
                  >
                    <span className={`t-index text-[0.6rem] ${onDarkBar ? 'text-paper/40' : 'text-ink/40'}`}>
                      0{i + 1}
                    </span>
                    <span className="roll">
                      <span>{item.label}</span>
                      <span aria-hidden="true">{item.label}</span>
                    </span>
                    {active ? (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute -bottom-0.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-lime"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    ) : null}
                  </button>
                </li>
              )
            })}
            <li className="ml-3">
              <button
                type="button"
                onClick={() => goTo('contact')}
                className="roll-host group inline-flex h-10 items-center gap-2 rounded-full bg-lime px-5 font-display text-sm font-medium text-ink"
              >
                <span className="roll">
                  <span>Start a project</span>
                  <span aria-hidden="true">Start a project</span>
                </span>
                <ArrowUpRight size={16} className="transition-transform duration-500 group-hover:rotate-45" />
              </button>
            </li>
          </ul>

          <button
            ref={menuBtnRef}
            type="button"
            className="group flex items-center gap-3 font-display text-sm font-medium uppercase tracking-[0.14em] lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="relative h-4 overflow-hidden">
              <motion.span className="block" animate={{ y: menuOpen ? '-100%' : '0%' }} transition={{ duration: 0.4, ease }}>
                <span className="block h-4 leading-4">Menu</span>
                <span className="block h-4 leading-4">Close</span>
              </motion.span>
            </span>
            <span className="relative block h-3 w-7" aria-hidden="true">
              <motion.span
                className="absolute left-0 top-0 h-px w-full bg-current"
                animate={menuOpen ? { top: '50%', rotate: 45 } : { top: '0%', rotate: 0 }}
                transition={{ duration: 0.4, ease }}
              />
              <motion.span
                className="absolute bottom-0 left-0 h-px w-full bg-current"
                animate={menuOpen ? { bottom: '50%', rotate: -45, width: '100%' } : { bottom: '0%', rotate: 0, width: '60%' }}
                transition={{ duration: 0.4, ease }}
              />
            </span>
            <span className="sr-only">{menuOpen ? 'Close navigation' : 'Open navigation'}</span>
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="on-dark fixed inset-0 z-[65] flex flex-col overflow-y-auto pt-[calc(var(--nav-h)+2rem)] lg:hidden"
            initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: reduce ? 0 : 0.8, ease } }}
            exit={{ clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: reduce ? 0 : 0.6, ease, delay: 0.1 } }}
          >
            <ul className="wrap flex flex-col">
              {NAV_ITEMS.map((item, i) => {
                const active = isActive(item.section, item.route)
                return (
                  <li key={item.section} className="overflow-hidden border-b border-paper/10">
                    <motion.button
                      ref={i === 0 ? firstLinkRef : undefined}
                      type="button"
                      onClick={() => {
                        setMenuOpen(false)
                        window.setTimeout(() => goTo(item.section), 450)
                      }}
                      className="flex w-full items-baseline gap-4 py-3 text-left"
                      initial={{ y: '110%' }}
                      animate={{ y: '0%', transition: { duration: reduce ? 0 : 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.25 + i * 0.06 } }}
                      exit={{ y: '-110%', transition: { duration: reduce ? 0 : 0.4, ease, delay: i * 0.02 } }}
                    >
                      <span className="t-index w-8 text-xs text-paper/40">0{i + 1}</span>
                      <span
                        className={`font-display text-[clamp(2.4rem,11vw,4.5rem)] font-medium uppercase leading-[0.95] tracking-[-0.05em] ${
                          active ? 'text-lime' : ''
                        }`}
                      >
                        {item.label}
                      </span>
                    </motion.button>
                  </li>
                )
              })}
            </ul>

            <motion.div
              className="wrap mt-auto grid gap-6 pb-10 pt-12 sm:grid-cols-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.6, duration: 0.6 } }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              <div className="space-y-1">
                <p className="t-label text-paper/40">Say hello</p>
                <a href={`mailto:${SITE.email}`} className="block font-display text-xl">
                  {SITE.email}
                </a>
                <a href={`tel:${SITE.phoneE164}`} className="block font-display text-xl">
                  {SITE.phoneDisplay}
                </a>
              </div>
              <div className="flex flex-wrap items-end gap-x-5 gap-y-2 sm:justify-end">
                {SOCIALS.map((s) => (
                  <a
                    key={s.key}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="t-label text-paper/70 hover:text-lime"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
