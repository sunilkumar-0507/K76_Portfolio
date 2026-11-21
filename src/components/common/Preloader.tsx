import { useLayoutEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { gsap, prefersReducedMotion } from '../../animations/gsapConfig'
import { useLenis } from '../../hooks/useLenis'
import { LOGO } from './BrandMark'
import { GlitterField } from './GlitterField'

/**
 * Regions of the ORIGINAL logo artwork (percent of the cropped tile),
 * measured from its pixels. Each layer is the same image, clipped, so the
 * logo assembles from its real pieces — nothing is redrawn.
 */
const SHARDS = {
  green: 'polygon(5.5% 9%, 36% 97.5%, 3% 97.5%, 2.5% 86%)',
  blue: 'polygon(19.8% 49%, 74.5% 97.5%, 33.8% 97.5%)',
  violet: 'polygon(70.8% 3.8%, 88.4% 4.4%, 82% 20.8%, 61.2% 27.6%)',
} as const

const TILE_RADIUS = '13.4%' // 52px corner on the 388px tile

const STAGES = [
  { label: 'Business Solutions', color: 'var(--lime)' },
  { label: 'K76 Learn', color: 'var(--cobalt-soft)' },
  { label: 'K76 Products', color: 'var(--iris-soft)' },
  { label: 'Building what’s next', color: 'var(--paper)' },
]

function Layer({ name, clip, style }: { name: string; clip?: string; style?: CSSProperties }) {
  return (
    <img
      data-layer={name}
      src={LOGO.webp}
      alt=""
      aria-hidden="true"
      draggable={false}
      width={388}
      height={388}
      decoding="sync"
      className="absolute inset-0 h-full w-full select-none"
      style={{ clipPath: clip, WebkitClipPath: clip, ...style }}
    />
  )
}

/**
 * Opening sequence. On a glittering field in the K76 colours, the original
 * logo assembles in 3D from its own pieces — green, then blue, then the dark
 * body — before the whole mark lights up with a specular sweep, the violet
 * shard and a colour glow. A counter tracks real readiness (fonts + load).
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
    document.documentElement.style.overflow = 'hidden'

    const finish = () => {
      document.documentElement.style.overflow = ''
      doneRef.current()
    }

    const q = (s: string) => el.querySelector<HTMLElement>(s)!
    const qa = (s: string) => el.querySelectorAll<HTMLElement>(s)
    const setCount = (v: number) => {
      num.textContent = String(Math.round(v)).padStart(3, '0')
    }

    if (prefersReducedMotion()) {
      setCount(100)
      const t = gsap.to(el, { autoAlpha: 0, duration: 0.4, delay: 0.6, ease: 'power2.out', onComplete: finish })
      return () => {
        t.kill()
        document.documentElement.style.overflow = ''
      }
    }

    // Dev-only: append ?introSlow to the URL to inspect the sequence frame by frame.
    if (import.meta.env.DEV && new URLSearchParams(window.location.search).has('introSlow')) {
      gsap.globalTimeline.timeScale(0.12)
    }

    const ctx = gsap.context(() => {
      const stage = q('[data-stage]')
      const green = q('[data-layer="green"]')
      const blue = q('[data-layer="blue"]')
      const base = q('[data-layer="base"]')
      const violet = q('[data-layer="violet"]')
      const sheen = q('[data-sheen]')
      const reflection = q('[data-reflection]')
      const captions = qa('[data-caption]')

      // Initial states
      gsap.set(q('[data-field]'), { autoAlpha: 0 })
      gsap.set(stage, { rotationY: -32, rotationX: 16, z: -120, transformPerspective: 1400 })
      gsap.set(green, { autoAlpha: 0, x: -220, z: -380, rotationY: -75, rotationZ: -14, filter: 'blur(10px)' })
      gsap.set(blue, { autoAlpha: 0, y: 200, z: -320, rotationX: 70, rotationZ: 12, filter: 'blur(10px)' })
      gsap.set(base, {
        autoAlpha: 0,
        z: -520,
        scale: 0.72,
        filter: 'brightness(0.15) saturate(0) blur(12px)',
      })
      gsap.set(violet, { autoAlpha: 0, x: 90, y: -90, rotationZ: 28, scale: 0.6 })
      gsap.set(sheen, { xPercent: -160 })
      gsap.set(reflection, { autoAlpha: 0 })
      gsap.set(qa('[data-glow]'), { autoAlpha: 0, scale: 0.6 })
      gsap.set(q('[data-ring]'), { autoAlpha: 0, scale: 0.7 })
      gsap.set(captions, { autoAlpha: 0, yPercent: 100 })
      gsap.set(qa('[data-pl-fade]'), { autoAlpha: 0, y: 12 })

      const showCaption = (i: number) => {
        const tl = gsap.timeline()
        captions.forEach((c, n) => {
          if (n !== i) tl.to(c, { autoAlpha: 0, yPercent: -100, duration: 0.35, ease: 'power2.in' }, 0)
        })
        tl.fromTo(captions[i], { autoAlpha: 0, yPercent: 100 }, { autoAlpha: 1, yPercent: 0, duration: 0.55, ease: 'expo.out' }, 0.2)
        return tl
      }

      const intro = gsap.timeline({
        onUpdate() {
          setCount(this.progress() * 92)
        },
      })

      intro
        .to(q('[data-field]'), { autoAlpha: 1, duration: 1.2, ease: 'power2.out' }, 0)
        .to(qa('[data-pl-fade]'), { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.06 }, 0.1)
        // The whole stage slowly turns to face the viewer.
        .to(stage, { rotationY: 0, rotationX: 0, z: 0, duration: 3.4, ease: 'power3.out' }, 0)

        // 1 — green
        .to(green, { autoAlpha: 1, x: 0, z: 0, rotationY: 0, rotationZ: 0, filter: 'blur(0px)', duration: 1.15, ease: 'expo.out' }, 0.25)
        .to(q('[data-glow="green"]'), { autoAlpha: 1, scale: 1, duration: 1.2, ease: 'power2.out' }, 0.3)
        .add(showCaption(0), 0.3)

        // 2 — blue
        .to(blue, { autoAlpha: 1, y: 0, z: 0, rotationX: 0, rotationZ: 0, filter: 'blur(0px)', duration: 1.15, ease: 'expo.out' }, 0.9)
        .to(q('[data-glow="blue"]'), { autoAlpha: 1, scale: 1, duration: 1.2, ease: 'power2.out' }, 0.95)
        .add(showCaption(1), 0.95)

        // 3 — the dark body rises from depth, still unlit
        .to(
          base,
          { autoAlpha: 1, z: 0, scale: 1, filter: 'brightness(0.32) saturate(0) blur(0px)', duration: 1.05, ease: 'expo.out' },
          1.55,
        )
        .to(q('[data-glow="violet"]'), { autoAlpha: 1, scale: 1, duration: 1.2, ease: 'power2.out' }, 1.6)
        .add(showCaption(2), 1.6)

        // 4 — the whole logo lights up
        .to(base, { filter: 'brightness(1) saturate(1) blur(0px)', duration: 0.9, ease: 'power2.out' }, 2.45)
        .to(violet, { autoAlpha: 1, x: 0, y: 0, rotationZ: 0, scale: 1, duration: 0.9, ease: 'back.out(1.6)' }, 2.4)
        .to(sheen, { xPercent: 260, duration: 1.25, ease: 'power2.inOut' }, 2.5)
        .fromTo(
          q('[data-ring]'),
          { autoAlpha: 0.9, scale: 0.85 },
          { autoAlpha: 0, scale: 2.1, duration: 1.4, ease: 'expo.out', immediateRender: false },
          2.55,
        )
        .to(qa('[data-glow]'), { scale: 1.25, duration: 0.6, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 2.5)
        .to(reflection, { autoAlpha: 1, duration: 1, ease: 'power2.out' }, 2.6)
        .add(showCaption(3), 2.6)

      // Idle float while we wait for readiness.
      const float = gsap.to(q('[data-float]'), {
        y: -8,
        rotationY: 6,
        duration: 2.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 3.4,
      })

      const ready = Promise.all([
        document.fonts?.ready ?? Promise.resolve(),
        document.readyState === 'complete'
          ? Promise.resolve()
          : new Promise<void>((r) => window.addEventListener('load', () => r(), { once: true })),
      ])
      const cap = new Promise<void>((r) => setTimeout(r, 5000))
      const sequence = new Promise<void>((r) => intro.eventCallback('onComplete', () => r()))

      Promise.all([sequence, Promise.race([ready, cap])]).then(() => {
        if (!root.current) return
        const progress = { v: 92 }
        gsap
          .timeline({ onComplete: finish })
          .to(progress, { v: 100, duration: 0.45, ease: 'power2.out', onUpdate: () => setCount(progress.v) }, 0.35)
          .add(() => {
            float.kill()
          })
          .to(q('[data-float]'), { z: 260, scale: 1.08, autoAlpha: 0, duration: 0.85, ease: 'expo.in' }, '+=0.1')
          .to(qa('[data-pl-fade], [data-caption]'), { autoAlpha: 0, y: -14, duration: 0.5, ease: 'power2.in', stagger: 0.03 }, '<')
          .to(q('[data-field]'), { autoAlpha: 0, duration: 0.7 }, '<0.2')
          .to(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1, ease: 'expo.inOut' }, '-=0.35')
      })
    }, el)

    return () => {
      ctx.revert()
      document.documentElement.style.overflow = ''
    }
  }, [])

  const tile: CSSProperties = { borderRadius: TILE_RADIUS }

  return (
    <div
      ref={root}
      className="on-dark fixed inset-0 z-[120] overflow-hidden bg-[#0b0b0b]"
      style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      role="status"
      aria-live="polite"
      aria-label="Loading K76 Business Solutions"
    >
      {/* Glitter field in the logo colours */}
      <div data-field className="absolute inset-0">
        <GlitterField density={1.6} intensity={1} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.65)_100%)]" />
      </div>

      <div className="relative flex h-full flex-col justify-between p-[var(--gutter)]">
        <div className="flex items-start justify-between">
          <span data-pl-fade className="t-label text-paper/55">
            K76 Business Solutions
          </span>
          <span data-pl-fade className="t-label hidden text-paper/55 sm:block">
            Est. 2021 — India
          </span>
        </div>

        {/* 3D logo stage */}
        <div className="flex flex-col items-center" style={{ perspective: '1400px' }}>
          <div data-float className="relative" style={{ transformStyle: 'preserve-3d' }}>
            <div data-stage className="relative w-[min(46vw,248px)]" style={{ transformStyle: 'preserve-3d' }}>
              {/* coloured light behind the mark */}
              <div aria-hidden="true" className="pointer-events-none absolute -inset-[70%]">
                <div data-glow="green" className="absolute left-[8%] top-[30%] h-[55%] w-[55%] rounded-full bg-[radial-gradient(circle,rgba(157,195,59,0.55),transparent_65%)] blur-2xl" />
                <div data-glow="blue" className="absolute bottom-[8%] left-[28%] h-[55%] w-[55%] rounded-full bg-[radial-gradient(circle,rgba(46,98,222,0.6),transparent_65%)] blur-2xl" />
                <div data-glow="violet" className="absolute right-[6%] top-[10%] h-[55%] w-[55%] rounded-full bg-[radial-gradient(circle,rgba(130,74,224,0.55),transparent_65%)] blur-2xl" />
              </div>
              <div
                data-ring
                aria-hidden="true"
                className="pointer-events-none absolute inset-[-6%] border border-paper/40"
                style={{ borderRadius: '16%' }}
              />

              <div className="relative aspect-square" style={{ transformStyle: 'preserve-3d' }}>
                <Layer name="base" />
                <Layer name="green" clip={SHARDS.green} />
                <Layer name="blue" clip={SHARDS.blue} />
                <Layer name="violet" clip={SHARDS.violet} />
                {/* specular sweep */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden" style={tile}>
                  <div
                    data-sheen
                    className="absolute -inset-y-1/4 left-0 w-1/2 -skew-x-12 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)] mix-blend-screen"
                  />
                </div>
              </div>

              {/* floor reflection */}
              <div
                data-reflection
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-[104%] aspect-square opacity-25"
                style={{
                  transform: 'scaleY(-1)',
                  maskImage: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent 45%)',
                  WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent 45%)',
                }}
              >
                <img src={LOGO.webp} alt="" className="h-full w-full blur-[1px]" draggable={false} />
              </div>
            </div>
          </div>

          {/* stage captions */}
          <div className="relative mt-[clamp(5rem,14vh,9rem)] h-5 w-72 overflow-hidden text-center">
            {STAGES.map((s) => (
              <span
                key={s.label}
                data-caption
                className="t-label absolute inset-0 flex items-center justify-center gap-2.5"
                style={{ color: s.color }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.color }} />
                {s.label}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-end justify-between">
          <span data-pl-fade className="t-label max-w-[14rem] text-paper/55">
            Software · Marketing · Brand · AI · Learn
          </span>
          <span data-pl-fade className="t-index text-5xl leading-none tracking-tight text-paper sm:text-7xl">
            <span ref={counter}>000</span>
          </span>
        </div>
      </div>
    </div>
  )
}
