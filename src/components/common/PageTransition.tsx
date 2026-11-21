import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

const ease = [0.76, 0, 0.24, 1] as const

/**
 * Route wrapper. A charcoal curtain covers the outgoing page, then lifts off
 * the incoming one. Content fades/rises underneath.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion()

  return (
    <>
      {/* Opacity only: a transform here would break position:fixed pins inside the page. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.6, delay: reduce ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] } }}
        exit={{ opacity: reduce ? 0 : 1, transition: { duration: reduce ? 0.2 : 0.6 } }}
      >
        {children}
      </motion.div>

      {!reduce ? (
        <>
          {/* Lifts away on enter */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-[110] origin-top bg-char"
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0, transition: { duration: 0.8, ease, delay: 0.1 } }}
            exit={{ scaleY: 0 }}
            style={{ transformOrigin: 'top' }}
          />
          {/* Rises up on exit */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-[110] bg-char"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 0 }}
            exit={{ scaleY: 1, transition: { duration: 0.6, ease } }}
            style={{ transformOrigin: 'bottom' }}
          />
        </>
      ) : null}
    </>
  )
}
