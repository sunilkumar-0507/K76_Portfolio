/**
 * The official K76 logo. The pixels come from the original artwork at
 * /public/brand/k76-logo.jpeg, cropped to the tile with transparent corners
 * (k76-mark.webp / .png). Nothing is redrawn.
 */
export const LOGO = {
  original: '/brand/k76-logo.jpeg',
  webp: '/brand/k76-mark.webp',
  png: '/brand/k76-mark.png',
  webpSmall: '/brand/k76-mark-160.webp',
  pngSmall: '/brand/k76-mark-160.png',
} as const

interface BrandMarkProps {
  className?: string
  /** Accessible name; pass '' when the logo is decorative (e.g. next to the company name). */
  title?: string
  /** Use the 160px export for small placements like the nav. */
  small?: boolean
  eager?: boolean
}

export function BrandMark({ className, title = 'K76 Business Solutions logo', small = false, eager = false }: BrandMarkProps) {
  const size = small ? 160 : 388
  return (
    <picture className={className}>
      <source srcSet={small ? LOGO.webpSmall : LOGO.webp} type="image/webp" />
      <img
        src={small ? LOGO.pngSmall : LOGO.png}
        alt={title}
        width={size}
        height={size}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        draggable={false}
        className="block h-full w-full select-none object-contain"
        {...(title ? {} : { 'aria-hidden': true })}
      />
    </picture>
  )
}
