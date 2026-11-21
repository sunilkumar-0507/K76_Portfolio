import { gsap, ScrollTrigger } from './gsapConfig'

type Targets = gsap.TweenTarget

/**
 * Masked line / char / word reveal for markup produced by <SplitText>.
 * Inner elements slide up from beneath their `.split-line` mask.
 */
export function revealSplit(
  scope: Element,
  opts: { selector?: string; stagger?: number; delay?: number; start?: string; trigger?: Element } = {},
) {
  const targets = scope.querySelectorAll(opts.selector ?? '.split-inner')
  if (!targets.length) return
  return gsap.from(targets, {
    yPercent: 110,
    rotate: 2,
    duration: 1.1,
    stagger: opts.stagger ?? 0.06,
    delay: opts.delay ?? 0,
    ease: 'expo.out',
    scrollTrigger: {
      trigger: opts.trigger ?? scope,
      start: opts.start ?? 'top 85%',
      once: true,
    },
  })
}

/** Fade-and-rise for blocks; staggered when several targets are passed. */
export function riseIn(targets: Targets, trigger: Element, opts: { stagger?: number; y?: number; start?: string } = {}) {
  return gsap.from(targets, {
    y: opts.y ?? 40,
    autoAlpha: 0,
    duration: 1,
    stagger: opts.stagger ?? 0.08,
    ease: 'expo.out',
    scrollTrigger: { trigger, start: opts.start ?? 'top 82%', once: true },
  })
}

/** Image reveal: clip-path wipe from bottom while the image settles from a slight zoom. */
export function clipReveal(frame: Element, opts: { start?: string; direction?: 'up' | 'left' } = {}) {
  const media = frame.querySelector('img, [data-media]')
  const from = opts.direction === 'left' ? 'inset(0% 100% 0% 0%)' : 'inset(100% 0% 0% 0%)'
  const tl = gsap.timeline({
    scrollTrigger: { trigger: frame, start: opts.start ?? 'top 80%', once: true },
  })
  tl.fromTo(frame, { clipPath: from }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut' })
  if (media) tl.fromTo(media, { scale: 1.25 }, { scale: 1, duration: 1.8, ease: 'expo.out' }, 0)
  return tl
}

/** Scrubbed vertical parallax. `speed` is a percentage of the element height. */
export function parallax(target: Element, speed = 12, trigger?: Element) {
  return gsap.fromTo(
    target,
    { yPercent: -speed },
    {
      yPercent: speed,
      ease: 'none',
      scrollTrigger: { trigger: trigger ?? target, start: 'top bottom', end: 'bottom top', scrub: true },
    },
  )
}

/** Word-by-word opacity scrub for large statements. */
export function scrubWords(scope: Element, opts: { start?: string; end?: string } = {}) {
  const words = scope.querySelectorAll('.split-word')
  if (!words.length) return
  return gsap.fromTo(
    words,
    { opacity: 0.12 },
    {
      opacity: 1,
      ease: 'none',
      stagger: 0.1,
      scrollTrigger: {
        trigger: scope,
        start: opts.start ?? 'top 78%',
        end: opts.end ?? 'bottom 45%',
        scrub: 0.6,
      },
    },
  )
}

export const refreshScroll = () => {
  // Wait a frame so layout (fonts, images) has settled.
  requestAnimationFrame(() => ScrollTrigger.refresh())
}
