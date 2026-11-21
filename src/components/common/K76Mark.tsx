interface K76MarkProps {
  className?: string
  strokeWidth?: number
  title?: string
}

/**
 * Stroke-built K76 monogram. Every stroke is a separate <path> so Anime.js
 * can draw them one after another (`[data-stroke]`).
 */
export function K76Mark({ className, strokeWidth = 6, title = 'K76' }: K76MarkProps) {
  return (
    <svg
      viewBox="0 0 300 124"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="square"
      strokeLinejoin="miter"
      role="img"
      aria-label={title}
    >
      {/* K */}
      <path data-stroke d="M14 8 V116" />
      <path data-stroke d="M14 74 L82 8" />
      <path data-stroke d="M38 51 L90 116" />
      {/* 7 */}
      <path data-stroke d="M112 8 H186 L134 116" />
      {/* 6 */}
      <path data-stroke d="M276 14 C236 16 210 40 206 82" />
      <path data-stroke d="M241 50 a33 33 0 1 1 -0.1 0 Z" />
    </svg>
  )
}
