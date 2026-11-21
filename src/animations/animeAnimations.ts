import { animate, createDrawable, stagger, utils } from 'animejs'
import type { JSAnimation, TargetsParam } from 'animejs'
import { prefersReducedMotion } from './gsapConfig'

/**
 * Anime.js handles SVG drawing, typographic micro-interactions and
 * decorative loops. Every helper returns the animation(s) so callers can
 * revert them on unmount.
 */

export type Revertible = { revert: () => unknown }

export const revertAll = (list: Array<Revertible | undefined | null>) => {
  list.forEach((a) => a?.revert())
}

/** Draw SVG strokes from 0 → full length. */
export function drawStrokes(
  selector: TargetsParam,
  opts: { duration?: number; delay?: number; staggerMs?: number; ease?: string } = {},
): JSAnimation | undefined {
  const drawables = createDrawable(selector)
  if (!drawables.length) return
  if (prefersReducedMotion()) {
    utils.set(drawables, { draw: '0 1' })
    return
  }
  return animate(drawables, {
    draw: ['0 0', '0 1'],
    duration: opts.duration ?? 1400,
    delay: stagger(opts.staggerMs ?? 90, { start: opts.delay ?? 0 }),
    ease: opts.ease ?? 'inOutQuart',
  })
}

/** A short segment travelling along a path, forever — used for "signal" lines. */
export function travelSignal(selector: TargetsParam, opts: { duration?: number; delay?: number } = {}) {
  const drawables = createDrawable(selector)
  if (!drawables.length || prefersReducedMotion()) return
  return animate(drawables, {
    draw: ['0 0', '0 0.12', '0.88 1', '1 1'],
    duration: opts.duration ?? 3200,
    delay: stagger(600, { start: opts.delay ?? 0 }),
    loop: true,
    ease: 'inOutSine',
  })
}

/** Slow continuous rotation for decorative geometry. */
export function spin(target: TargetsParam, duration = 60000, reverse = false) {
  if (prefersReducedMotion()) return
  return animate(target, {
    rotate: reverse ? '-=360' : '+=360',
    duration,
    loop: true,
    ease: 'linear',
  })
}

/** Gentle breathing scale/opacity for markers. */
export function pulse(target: TargetsParam, opts: { scale?: number; duration?: number } = {}) {
  if (prefersReducedMotion()) return
  return animate(target, {
    scale: [1, opts.scale ?? 1.6],
    opacity: [1, 0],
    duration: opts.duration ?? 1800,
    loop: true,
    ease: 'outQuad',
    delay: stagger(300),
  })
}

/** Characters jump in sequence — hover micro-interaction for short labels. */
export function charWave(selector: TargetsParam) {
  if (prefersReducedMotion()) return
  return animate(selector, {
    translateY: [{ to: '-0.18em', duration: 220 }, { to: 0, duration: 420 }],
    delay: stagger(28),
    ease: 'outQuad',
  })
}

/** Stagger-in for SVG shapes (grid tiles, nodes). */
export function popIn(selector: TargetsParam, opts: { delay?: number; from?: 'first' | 'center' | 'random' } = {}) {
  if (prefersReducedMotion()) {
    utils.set(selector, { opacity: 1, scale: 1 })
    return
  }
  return animate(selector, {
    opacity: [0, 1],
    scale: [0.4, 1],
    duration: 700,
    delay: stagger(45, { from: opts.from ?? 'first', start: opts.delay ?? 0 }),
    ease: 'outBack(1.6)',
  })
}

/** Animated numeric counter. Writes into `el.textContent`. */
export function countTo(el: HTMLElement, to: number, duration = 1600) {
  const state = { v: 0 }
  if (prefersReducedMotion()) {
    el.textContent = String(to)
    return
  }
  return animate(state, {
    v: to,
    duration,
    ease: 'outExpo',
    modifier: utils.round(0),
    onUpdate: () => {
      el.textContent = String(state.v)
    },
  })
}
