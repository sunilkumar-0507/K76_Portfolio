/**
 * Corner composition built from the K76 logo's three shards (green, cobalt,
 * violet). Purely decorative; sits in the bottom-left of opening sections.
 */
export function BrandShards({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 600 280"
      preserveAspectRatio="xMinYMax meet"
      className={`pointer-events-none select-none ${className}`}
    >
      <defs>
        <linearGradient id="shard-violet" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8b4bf2" />
          <stop offset="1" stopColor="#7b35e8" />
        </linearGradient>
        <linearGradient id="shard-cobalt" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2a62e0" />
          <stop offset="1" stopColor="#1d4fc4" />
        </linearGradient>
        <linearGradient id="shard-lime" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#b6e04a" />
          <stop offset="1" stopColor="#8dbb2c" />
        </linearGradient>
      </defs>
      <path data-shard d="M330 280 L420 226 Q432 219 446 224 L600 280 Z" fill="url(#shard-violet)" />
      <path data-shard d="M0 280 L0 188 L112 150 L430 280 Z" fill="url(#shard-cobalt)" />
      <path data-shard d="M0 0 L170 280 L0 280 Z" fill="url(#shard-lime)" />
    </svg>
  )
}
