import { useEffect, useRef } from 'react'

export type GlitterTone = 'dark' | 'light'

interface GlitterFieldProps {
  className?: string
  /** 'dark' = glowing sparkles for charcoal backgrounds; 'light' = fine coloured glints for off-white. */
  tone?: GlitterTone
  /** Particles per 10 000 px² (capped). */
  density?: number
  /** Draw the soft drifting colour glows behind the sparkles (dark tone only). */
  glows?: boolean
  /** Overall opacity of the effect, 0–1. */
  intensity?: number
}

type RGB = [number, number, number]

// K76 logo palette, tuned per background.
const DARK_COLORS: RGB[] = [
  [157, 195, 59], // green
  [72, 120, 232], // blue (lifted for glow on dark)
  [150, 96, 236], // violet
  [245, 243, 237], // white
]
const LIGHT_COLORS: RGB[] = [
  [127, 165, 38], // deep green
  [29, 79, 196], // cobalt
  [123, 63, 214], // violet
  [176, 150, 92], // warm metallic fleck
]

interface Particle {
  x: number
  y: number
  r: number
  c: RGB
  phase: number
  speed: number
  vx: number
  vy: number
  flare: boolean
  rot: number
  spin: number
}

/**
 * Canvas glitter in the K76 colours.
 * - dark: additive twinkling sparkles, star flares and drifting colour glows
 * - light: fine diamond glints and slow-turning star twinkles drawn normally,
 *   so an off-white background stays off-white
 * The canvas is sized to its box (callers keep it viewport-sized), pauses and
 * frees its bitmap when off-screen, and draws one still frame for reduced motion.
 */
export function GlitterField({ className = '', tone = 'dark', density = 1.4, glows = true, intensity = 1 }: GlitterFieldProps) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const dark = tone === 'dark'
    const COLORS = dark ? DARK_COLORS : LIGHT_COLORS
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0
    let h = 0
    let particles: Particle[] = []
    let raf = 0
    let visible = false
    let last = performance.now()

    const blobs = [
      { c: COLORS[0], x: 0.22, y: 0.7, r: 0.55, sx: 0.00007, sy: 0.00005, p: 0 },
      { c: COLORS[1], x: 0.75, y: 0.3, r: 0.6, sx: 0.00005, sy: 0.00008, p: 2 },
      { c: COLORS[2], x: 0.6, y: 0.8, r: 0.5, sx: 0.00006, sy: 0.00006, p: 4 },
    ]

    const seed = () => {
      const count = Math.min(dark ? 380 : 220, Math.round(((w * h) / 10000) * density))
      particles = Array.from({ length: count }, () => {
        const big = Math.random() < (dark ? 0.08 : 0.12)
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: big ? 1.4 + Math.random() * 1.6 : 0.4 + Math.random() * 1.1,
          c: dark
            ? COLORS[Math.random() < 0.3 ? 3 : Math.floor(Math.random() * 3)]
            : COLORS[Math.random() < 0.2 ? 3 : Math.floor(Math.random() * 3)],
          phase: Math.random() * Math.PI * 2,
          speed: 0.5 + Math.random() * 1.6,
          vx: (Math.random() - 0.5) * 0.006,
          vy: -0.003 - Math.random() * (dark ? 0.012 : 0.007),
          flare: big,
          rot: Math.random() * Math.PI,
          spin: (Math.random() - 0.5) * 0.0012,
        }
      })
    }

    const allocate = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      w = Math.max(1, rect.width)
      h = Math.max(1, rect.height)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (!particles.length) seed()
    }

    const release = () => {
      // Free the bitmap while off-screen; particles are kept.
      canvas.width = 1
      canvas.height = 1
    }

    const drawStar = (p: Particle, a: number, len: number) => {
      const [r, g, b] = p.c
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot)
      ctx.strokeStyle = `rgba(${r},${g},${b},${a})`
      ctx.lineWidth = dark ? 0.6 : 0.8
      ctx.beginPath()
      ctx.moveTo(-len, 0)
      ctx.lineTo(len, 0)
      ctx.moveTo(0, -len)
      ctx.lineTo(0, len)
      ctx.stroke()
      ctx.restore()
    }

    const draw = (t: number, dt: number) => {
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = dark ? 'lighter' : 'source-over'

      if (dark && glows) {
        for (const b of blobs) {
          const cx = (b.x + Math.sin(t * b.sx * 6 + b.p) * 0.08) * w
          const cy = (b.y + Math.cos(t * b.sy * 6 + b.p) * 0.08) * h
          const rad = b.r * Math.max(w, h)
          const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad)
          g.addColorStop(0, `rgba(${b.c[0]},${b.c[1]},${b.c[2]},${0.16 * intensity})`)
          g.addColorStop(1, 'rgba(0,0,0,0)')
          ctx.fillStyle = g
          ctx.fillRect(0, 0, w, h)
        }
      }

      for (const p of particles) {
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.rot += p.spin * dt
        if (p.y < -6) p.y = h + 6
        if (p.x < -6) p.x = w + 6
        if (p.x > w + 6) p.x = -6

        const tw = 0.5 + 0.5 * Math.sin(t * 0.001 * p.speed + p.phase)
        const [r, g, b] = p.c

        if (dark) {
          const a = (p.flare ? 0.25 + tw * 0.75 : 0.1 + tw * 0.7) * intensity
          ctx.fillStyle = `rgba(${r},${g},${b},${a})`
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
          ctx.fill()
          if (p.flare && tw > 0.55) {
            drawStar(p, a * 0.8, p.r * (4 + tw * 6))
            const halo = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5)
            halo.addColorStop(0, `rgba(${r},${g},${b},${a * 0.45})`)
            halo.addColorStop(1, 'rgba(0,0,0,0)')
            ctx.fillStyle = halo
            ctx.fillRect(p.x - p.r * 5, p.y - p.r * 5, p.r * 10, p.r * 10)
          }
        } else {
          // Light: a tiny turning diamond that catches the light, plus star glints.
          const a = (p.flare ? 0.08 + tw * 0.5 : 0.05 + tw * 0.38) * intensity
          const s = p.r * (0.8 + tw * 0.6)
          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate(p.rot)
          ctx.fillStyle = `rgba(${r},${g},${b},${a})`
          ctx.beginPath()
          ctx.moveTo(0, -s * 1.6)
          ctx.lineTo(s, 0)
          ctx.lineTo(0, s * 1.6)
          ctx.lineTo(-s, 0)
          ctx.closePath()
          ctx.fill()
          ctx.restore()
          if (p.flare && tw > 0.6) drawStar(p, a * 0.9, p.r * (3 + tw * 5))
        }
      }
      ctx.globalCompositeOperation = 'source-over'
    }

    const loop = (now: number) => {
      const dt = Math.min(64, now - last)
      last = now
      draw(now, dt)
      raf = requestAnimationFrame(loop)
    }

    const start = () => {
      allocate()
      if (reduce) {
        draw(1000, 0)
        return
      }
      cancelAnimationFrame(raf)
      last = performance.now()
      raf = requestAnimationFrame(loop)
    }

    const stop = () => {
      cancelAnimationFrame(raf)
      release()
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        const next = entry.isIntersecting
        if (next === visible) return
        visible = next
        if (visible) start()
        else stop()
      },
      { rootMargin: '120px 0px' },
    )
    io.observe(canvas)

    let resizeTimer = 0
    const ro = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        if (!visible) return
        particles = []
        allocate()
        if (reduce) draw(1000, 0)
      }, 120)
    })
    ro.observe(canvas)

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(resizeTimer)
      io.disconnect()
      ro.disconnect()
    }
  }, [tone, density, glows, intensity])

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none block h-full w-full ${className}`} />
}

/**
 * Section backdrop: a viewport-sized glitter canvas that stays pinned while
 * its section scrolls past (so the canvas never grows to the section's full
 * height). Sits behind content — the parent section needs `relative isolate`.
 */
export function SectionGlitter({ tone = 'dark', density, intensity }: { tone?: GlitterTone; density?: number; intensity?: number }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-clip">
      <div className="sticky top-0 h-[100svh] w-full">
        <GlitterField
          tone={tone}
          density={density ?? (tone === 'dark' ? 1.1 : 0.7)}
          intensity={intensity ?? (tone === 'dark' ? 0.85 : 1)}
          glows={tone === 'dark'}
        />
      </div>
    </div>
  )
}
