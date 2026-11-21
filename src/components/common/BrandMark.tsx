import { useId } from 'react'

/**
 * Flat vector rendition of the K76 app-icon logo: charcoal tile, light
 * panel, green / cobalt / violet shards and the "76" numerals.
 * Shards carry `data-shard` so they can be animated individually.
 * BrandMarkShapes is the raw artwork in a 0–100 space, for embedding in other SVGs.
 */
export function BrandMarkShapes({ clipId }: { clipId: string }) {
  return (
    <>
      <defs>
        <clipPath id={clipId}>
          <rect width="100" height="100" rx="20" />
        </clipPath>
      </defs>
      <rect width="100" height="100" rx="20" fill="#161616" />
      <g clipPath={`url(#${clipId})`}>
        <polygon data-shard points="34,0 100,0 100,100 64,100 30,46" fill="#f2f1ec" />
        <rect data-shard x="34" y="7" width="40" height="15" fill="#161616" />
        <polygon data-shard points="0,10 15,10 42,100 0,100" fill="var(--lime, #9dc33b)" />
        <polygon data-shard points="30,46 66,100 38,100" fill="var(--cobalt, #1d4fc4)" />
        <polygon data-shard points="64,0 90,0 74,30 60,24" fill="var(--iris, #7b3fd6)" />
        <text
          data-shard
          x="66"
          y="91"
          textAnchor="middle"
          fontFamily="Space Grotesk, Arial, sans-serif"
          fontWeight="700"
          fontSize="50"
          letterSpacing="-3"
          fill="#161616"
        >
          76
        </text>
      </g>
    </>
  )
}

export function BrandMark({ className, title = 'K76' }: { className?: string; title?: string }) {
  const clip = `k76-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      {...(title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true })}
    >
      <BrandMarkShapes clipId={clip} />
      <rect x="0.75" y="0.75" width="98.5" height="98.5" rx="19.5" fill="none" stroke="#ffffff" strokeOpacity="0.18" strokeWidth="1.5" />
    </svg>
  )
}
