import { useEffect, useRef } from 'react'
import { drawStrokes, popIn, revertAll } from '../../animations/animeAnimations'
import type { VerticalGlyph as GlyphKind } from '../../data/services'

/**
 * Custom visual representation for each vertical. Re-plays its Anime.js
 * build-up every time it becomes active.
 */
export function VerticalGlyph({ kind, active = true, className = '' }: { kind: GlyphKind; active?: boolean; className?: string }) {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = ref.current
    if (!svg || !active) return
    const anims = [
      popIn(svg.querySelectorAll('[data-tile]'), { from: kind === 'grid' ? 'random' : 'first' }),
      drawStrokes(svg.querySelectorAll('[data-stroke]'), { duration: 1200, staggerMs: 70, delay: 200 }),
    ]
    return () => revertAll(anims)
  }, [kind, active])

  return (
    <svg ref={ref} viewBox="0 0 240 240" className={className} aria-hidden="true" fill="none">
      {kind === 'grid' ? <GridGlyph /> : kind === 'steps' ? <StepsGlyph /> : <ModulesGlyph />}
    </svg>
  )
}

/** Business Solutions — modular blocks assembling into one system */
function GridGlyph() {
  const lit = new Set([0, 6, 7, 12, 18, 19, 24])
  return (
    <g>
      {Array.from({ length: 25 }, (_, i) => {
        const x = (i % 5) * 46 + 7
        const y = Math.floor(i / 5) * 46 + 7
        return (
          <rect
            key={i}
            data-tile
            x={x}
            y={y}
            width="40"
            height="40"
            style={{ transformOrigin: `${x + 20}px ${y + 20}px` }}
            fill={lit.has(i) ? 'var(--glyph-accent, var(--lime))' : 'transparent'}
            stroke={lit.has(i) ? 'none' : 'currentColor'}
            strokeOpacity="0.35"
          />
        )
      })}
      <path data-stroke d="M27 27 L119 119 L211 211" stroke="var(--glyph-line, var(--paper))" strokeWidth="1.5" />
    </g>
  )
}

/** K76 Learn — ascending steps, a growth path drawn across the tops */
function StepsGlyph() {
  const bars = [30, 52, 74, 98, 124, 152, 182]
  return (
    <g>
      {bars.map((h, i) => {
        const x = 10 + i * 32
        const y = 226 - h
        return (
          <rect
            key={i}
            data-tile
            x={x}
            y={y}
            width="24"
            height={h}
            style={{ transformOrigin: `${x + 12}px 226px` }}
            fill={i === bars.length - 1 ? 'var(--glyph-accent, var(--lime))' : 'transparent'}
            stroke={i === bars.length - 1 ? 'none' : 'currentColor'}
            strokeOpacity="0.4"
          />
        )
      })}
      <path
        data-stroke
        d={`M22 ${226 - bars[0] - 12} ${bars.map((h, i) => `L${22 + i * 32} ${226 - h - 12}`).join(' ')}`}
        stroke="var(--glyph-line, var(--paper))"
        strokeWidth="1.5"
      />
      <path data-stroke d="M4 230 H236" stroke="currentColor" strokeOpacity="0.5" />
    </g>
  )
}

/** K76 Products — nodes wired to a core module */
function ModulesGlyph() {
  const nodes = [
    [40, 40],
    [120, 24],
    [200, 40],
    [216, 120],
    [200, 200],
    [120, 216],
    [40, 200],
    [24, 120],
  ]
  return (
    <g>
      {nodes.map(([x, y], i) => (
        <path key={`l${i}`} data-stroke d={`M120 120 L${x} ${y}`} stroke="currentColor" strokeOpacity="0.45" />
      ))}
      <path data-stroke d={`M${nodes.map(([x, y]) => `${x} ${y}`).join(' L')} Z`} stroke="currentColor" strokeOpacity="0.25" strokeDasharray="3 5" />
      {nodes.map(([x, y], i) => (
        <circle
          key={`n${i}`}
          data-tile
          cx={x}
          cy={y}
          r="9"
          style={{ transformOrigin: `${x}px ${y}px` }}
          fill={i % 3 === 0 ? 'var(--glyph-accent, var(--lime))' : 'var(--char)'}
          stroke="currentColor"
          strokeOpacity="0.6"
        />
      ))}
      <rect data-tile x="92" y="92" width="56" height="56" style={{ transformOrigin: '120px 120px' }} fill="var(--glyph-accent, var(--lime))" />
    </g>
  )
}
