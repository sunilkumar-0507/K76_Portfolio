import { useEffect, useRef } from 'react'

interface GlitterFieldProps {
  className?: string
  /** Particles per 10 000 px² (capped). */
  density?: number
  /** Draw the soft drifting colour glows behind the sparkles. */
  glows?: boolean
  /** Overall opacity of the effect, 0–1. */
  intensity?: number
}

// K76 logo palette + a little white for highlights.
const COLORS: Array<[number, number, number]> = [
  [157, 195, 59], // green
  [72, 120, 232], // blue (lifted for glow on dark)
  [150, 96, 236], // violet
  [245, 243, 237], // white
]

interface Particle {
  x: number
  y: number
  r: number
  c: [number, number, number]
  phase: number
  speed: number
  vx: number
  vy: number
  flare: boolean
}

/**
 * Canvas sparkle field in the K76 colours. Twinkling glitter with occasional
 * star flares and slow drifting colour glows. Pauses when off-screen and renders
 * a single still frame for reduced-motion users.
 */
export function GlitterField({ className = '', density = 1.4, glows = true, intensity = 1 }: GlitterFieldProps) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0
    let h = 0
    let dpr = 1
    let particles: Particle[] = []
    let raf = 0
    let visible = true
    let last = performance.now()

    const blobs = [
      { c: COLORS[0], x: 0.22, y: 0.7, r: 0.55, sx: 0.00007, sy: 0.00005, p: 0 },
      { c: COLORS[1], x: 0.75, y: 0.3, r: 0.6, sx: 0.00005, sy: 0.00008, p: 2 },
      { c: COLORS[2], x: 0.6, y: 0.8, r: 0.5, sx: 0.00006, sy: 0.00006, p: 4 },
    ]

    const seed = () => {
      const count = Math.min(420, Math.round(((w * h) / 10000) * density))
      particles = Array.from({ length: count }, () => {
        const big = Math.random() < 0.08
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: big ? 1.4 + Math.random() * 1.4 : 0.35 + Math.random() * 1.05,
          c: COLORS[Math.random() < 0.3 ? 3 : Math.floor(Math.random() * 3)],
          phase: Math.random() * Math.PI * 2,
          speed: 0.6 + Math.random() * 1.8,
          vx: (Math.random() - 0.5) * 0.006,
          vy: -0.004 - Math.random() * 0.012,
          flare: big,
        }
      })
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = Math.max(1, rect.width)
      h = Math.max(1, rect.height)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
    }

    const draw = (t: number, dt: number) => {
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'

      if (glows) {
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
        if (p.y < -4) p.y = h + 4
        if (p.x < -4) p.x = w + 4
        if (p.x > w + 4) p.x = -4

        const tw = 0.5 + 0.5 * Math.sin(t * 0.001 * p.speed + p.phase)
        const a = (p.flare ? 0.25 + tw * 0.75 : 0.1 + tw * 0.7) * intensity
        const [r, g, b] = p.c

        ctx.fillStyle = `rgba(${r},${g},${b},${a})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()

        if (p.flare && tw > 0.55) {
          // four-point star glint
          const len = p.r * (4 + tw * 6)
          ctx.strokeStyle = `rgba(${r},${g},${b},${a * 0.8})`
          ctx.lineWidth = 0.6
          ctx.beginPath()
          ctx.moveTo(p.x - len, p.y)
          ctx.lineTo(p.x + len, p.y)
          ctx.moveTo(p.x, p.y - len)
          ctx.lineTo(p.x, p.y + len)
          ctx.stroke()
          const halo = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5)
          halo.addColorStop(0, `rgba(${r},${g},${b},${a * 0.45})`)
          halo.addColorStop(1, 'rgba(0,0,0,0)')
          ctx.fillStyle = halo
          ctx.fillRect(p.x - p.r * 5, p.y - p.r * 5, p.r * 10, p.r * 10)
        }
      }
      ctx.globalCompositeOperation = 'source-over'
    }

    const loop = (now: number) => {
      const dt = Math.min(64, now - last)
      last = now
      if (visible) draw(now, dt)
      raf = requestAnimationFrame(loop)
    }

    resize()
    if (reduce) {
      draw(1000, 0)
    } else {
      raf = requestAnimationFrame(loop)
    }

    const ro = new ResizeObserver(() => {
      resize()
      if (reduce) draw(1000, 0)
    })
    ro.observe(canvas)
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    io.observe(canvas)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
    }
  }, [density, glows, intensity])

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none block h-full w-full ${className}`} />
}
