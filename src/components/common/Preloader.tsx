import { useLayoutEffect, useRef } from 'react'
import { animate, stagger, utils } from 'animejs'
import { revertAll } from '../../animations/animeAnimations'
import { gsap, prefersReducedMotion } from '../../animations/gsapConfig'
import { useLenis } from '../../hooks/useLenis'
import { BrandMark } from './BrandMark'

const SESSION_KEY = 'k76:intro-seen'

function readSeen() {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === '1'
  } catch {
    return false
  }
}

function writeSeen() {
  try {
    window.sessionStorage.setItem(SESSION_KEY, '1')
  } catch {
    /* storage unavailable — fine */
  }
}

/**
 * Short branded intro: the K76 monogram is drawn stroke by stroke while a
 * counter tracks real readiness (web fonts + window load), then the panel
 * wipes upward to reveal the hero. Repeat visits in a session get a
 * near-instant version.
 */
export function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const counter = useRef<HTMLSpanElement>(null)
  const lenis = useLenis()
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  useLayoutEffect(() => {
    lenis?.stop()
    return () => lenis?.start()
  }, [lenis])

  useLayoutEffect(() => {
    const el = root.current
    const num = counter.current
    if (!el || !num) return
    const reduce = prefersReducedMotion()
    const quick = reduce || readSeen()
    document.documentElement.style.overflow = 'hidden'

    const finish = () => {
      document.documentElement.style.overflow = ''
      writeSeen()
      doneRef.current()
    }

    if (quick) {
      const t = gsap.to(el, { autoAlpha: 0, duration: 0.45, delay: 0.15, ease: 'power2.out', onComplete: finish })
      return () => {
        t.kill()
        document.documentElement.style.overflow = ''
      }
    }

    // Logo assembles: tile scales in, then each colour shard slides into place.
    const shards = el.querySelectorAll<SVGElement>('[data-shard]')
    const offsets = [[-14, -12], [14, -10], [-18, 16], [10, 18], [16, -16], [0, 12]]
    shards.forEach((sh, i) => utils.set(sh, { translateX: offsets[i]?.[0] ?? 0, translateY: offsets[i]?.[1] ?? 0, opacity: 0 }))
    const anims: Array<{ revert: () => unknown } | undefined> = [
      animate(el.querySelector('[data-pl-mark] svg')!, { scale: [0.7, 1], opacity: [0, 1], duration: 900, ease: 'outExpo' }),
      animate(shards, { translateX: 0, translateY: 0, opacity: 1, duration: 900, delay: stagger(110, { start: 250 }), ease: 'outExpo' }),
    ]

    // Readiness: fonts + load event, capped so the intro never drags.
    const ready = Promise.all([
      document.fonts?.ready ?? Promise.resolve(),
      document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise<void>((r) => window.addEventListener('load', () => r(), { once: true })),
    ])
    const cap = new Promise<void>((r) => setTimeout(r, 2600))

    const progress = { v: 0 }
    let cancelled = false
    const counterAnim = animate(progress, {
      v: 86,
      duration: 1300,
      ease: 'outQuart',
      onUpdate: () => {
        num.textContent = String(Math.round(progress.v)).padStart(3, '0')
      },
    })
    anims.push(counterAnim)

    let exit: gsap.core.Timeline | undefined
    Promise.race([ready, cap])
      .then(() => new Promise((r) => setTimeout(r, 1350)))
      .then(() => {
        if (cancelled) return
        counterAnim.pause()
        exit = gsap.timeline({ onComplete: finish })
        exit
          .to(progress, {
            v: 100,
            duration: 0.45,
            ease: 'power2.out',
            onUpdate: () => {
              num.textContent = String(Math.round(progress.v)).padStart(3, '0')
            },
          })
          .to(el.querySelectorAll('[data-pl-fade]'), { yPercent: -120, duration: 0.7, ease: 'expo.in', stagger: 0.05 }, '+=0.1')
          .to(el.querySelector('[data-pl-mark]'), { yPercent: -30, autoAlpha: 0, duration: 0.7, ease: 'expo.in' }, '<')
          .to(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.05, ease: 'expo.inOut' }, '-=0.25')
      })

    return () => {
      cancelled = true
      exit?.kill()
      revertAll(anims)
      document.documentElement.style.overflow = ''
    }
  }, [])

  return (
    <div
      ref={root}
      className="on-dark fixed inset-0 z-[120] flex flex-col justify-between p-[var(--gutter)]"
      style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      role="status"
      aria-live="polite"
      aria-label="Loading K76"
    >
      <div className="flex items-start justify-between overflow-hidden">
        <span data-pl-fade className="t-label text-muted-dark">
          K76 Business Solutions
        </span>
        <span data-pl-fade className="t-label hidden text-muted-dark sm:block">
          Est. 2021 — India
        </span>
      </div>

      <div data-pl-mark className="mx-auto w-[min(42vw,220px)]">
        <BrandMark />
      </div>

      <div className="flex items-end justify-between overflow-hidden">
        <span data-pl-fade className="t-label max-w-[14rem] text-muted-dark">
          Building what’s next
        </span>
        <span data-pl-fade className="t-index text-5xl leading-none tracking-tight text-lime sm:text-7xl">
          <span ref={counter}>000</span>
        </span>
      </div>
    </div>
  )
}
