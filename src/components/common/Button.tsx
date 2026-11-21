import { useEffect, useRef } from 'react'
import type { MouseEventHandler, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { gsap, isFinePointer, prefersReducedMotion } from '../../animations/gsapConfig'

type Variant = 'lime' | 'ink' | 'paper' | 'outline' | 'outline-dark'

interface ButtonProps {
  children: ReactNode
  to?: string
  href?: string
  external?: boolean
  onClick?: MouseEventHandler<HTMLElement>
  type?: 'button' | 'submit'
  disabled?: boolean
  variant?: Variant
  size?: 'md' | 'lg'
  icon?: ReactNode
  magnetic?: boolean
  className?: string
  cursor?: string
  ariaLabel?: string
}

const VARIANTS: Record<Variant, string> = {
  lime: 'bg-lime text-ink',
  ink: 'bg-ink text-paper',
  paper: 'bg-paper text-ink',
  outline: 'border border-ink/25 text-ink hover:border-ink',
  'outline-dark': 'border border-paper/25 text-paper hover:border-paper',
}

/** Rolling-label pill with a magnetic pull on fine pointers. */
export function Button({
  children,
  to,
  href,
  external,
  onClick,
  type = 'button',
  disabled,
  variant = 'ink',
  size = 'md',
  icon,
  magnetic = true,
  className = '',
  cursor,
  ariaLabel,
}: ButtonProps) {
  const ref = useRef<HTMLElement | null>(null)
  const innerRef = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    const el = ref.current
    const inner = innerRef.current
    if (!el || !inner || !magnetic || !isFinePointer() || prefersReducedMotion()) return

    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' })
    const ixTo = gsap.quickTo(inner, 'x', { duration: 0.6, ease: 'power3.out' })
    const iyTo = gsap.quickTo(inner, 'y', { duration: 0.6, ease: 'power3.out' })

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      xTo(dx * 0.28)
      yTo(dy * 0.38)
      ixTo(dx * 0.12)
      iyTo(dy * 0.16)
    }
    const leave = () => {
      gsap.to([el, inner], { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' })
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
      gsap.killTweensOf([el, inner])
    }
  }, [magnetic])

  const sizing = size === 'lg' ? 'h-16 px-8 text-base' : 'h-12 px-6 text-sm'
  const classes = [
    'roll-host group relative inline-flex select-none items-center justify-center gap-3 rounded-full font-display font-medium tracking-tight',
    'transition-[background-color,border-color,color,opacity] duration-300',
    'disabled:pointer-events-none disabled:opacity-50',
    sizing,
    VARIANTS[variant],
    className,
  ].join(' ')

  const content = (
    <span ref={innerRef} className="relative inline-flex items-center gap-3">
      <span className="roll">
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
      {icon ? (
        <span className="inline-flex transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          {icon}
        </span>
      ) : null}
    </span>
  )

  const shared = {
    className: classes,
    'data-cursor': cursor ?? 'hover',
    'aria-label': ariaLabel,
    onClick,
  }

  if (to) {
    return (
      <Link to={to} ref={(n) => void (ref.current = n)} {...shared}>
        {content}
      </Link>
    )
  }
  if (href) {
    return (
      <a
        href={href}
        ref={(n) => void (ref.current = n)}
        {...shared}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {content}
      </a>
    )
  }
  return (
    <button type={type} disabled={disabled} ref={(n) => void (ref.current = n)} {...shared}>
      {content}
    </button>
  )
}
