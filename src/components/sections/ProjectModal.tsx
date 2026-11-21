import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { Project } from '../../data/projects'
import { useLenis } from '../../hooks/useLenis'
import { Button } from '../common/Button'
import { ProjectCover } from './ProjectCover'

const ease = [0.76, 0, 0.24, 1] as const

export function ProjectModal({ project, index, onClose }: { project: Project | null; index: number; onClose: () => void }) {
  const lenis = useLenis()
  const reduce = useReducedMotion()
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!project) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    lenis?.stop()
    document.documentElement.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const t = window.setTimeout(() => closeRef.current?.focus(), 50)
    return () => {
      lenis?.start()
      document.documentElement.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      window.clearTimeout(t)
      previouslyFocused?.focus({ preventScroll: true })
    }
  }, [project, lenis, onClose])

  return (
    <AnimatePresence>
      {project ? (
        <motion.div
          className="fixed inset-0 z-[90] flex items-end justify-center md:items-center md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { delay: 0.15 } }}
        >
          <button type="button" aria-label="Close project" className="absolute inset-0 bg-char/80 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            className="relative flex max-h-[92svh] w-full max-w-6xl flex-col overflow-hidden bg-paper text-ink md:flex-row"
            data-lenis-prevent
            initial={reduce ? { opacity: 0 } : { y: '100%' }}
            animate={reduce ? { opacity: 1 } : { y: '0%', transition: { duration: 0.8, ease } }}
            exit={reduce ? { opacity: 0 } : { y: '100%', transition: { duration: 0.55, ease } }}
          >
            <div className="relative aspect-[4/3] w-full shrink-0 md:aspect-auto md:w-[58%]">
              <ProjectCover project={project} index={index} sizes="(min-width: 768px) 58vw, 100vw" />
            </div>
            <div className="flex flex-1 flex-col overflow-y-auto p-6 md:p-10">
              <div className="flex items-start justify-between gap-6">
                <span className="t-label text-ink/50">
                  {String(index + 1).padStart(2, '0')} — {project.category}
                </span>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={onClose}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink/20 transition-colors hover:bg-ink hover:text-paper"
                  aria-label="Close project details"
                >
                  <X size={18} />
                </button>
              </div>
              <h3 id="project-modal-title" className="t-h3 mt-6 uppercase">
                {project.name}
              </h3>
              <p className="mt-2 font-display text-ink/60">for {project.client}</p>
              <p className="mt-8 text-ink/75">{project.description}</p>

              <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-ink/15 pt-6 text-sm">
                <div>
                  <dt className="t-label mb-2 text-ink/45">Client</dt>
                  <dd>{project.client}</dd>
                </div>
                <div>
                  <dt className="t-label mb-2 text-ink/45">Category</dt>
                  <dd>{project.category}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="t-label mb-2 text-ink/45">Stack</dt>
                  <dd className="flex flex-wrap gap-2">
                    {project.stack.map((s) => (
                      <span key={s} className="rounded-full border border-ink/20 px-3 py-1">
                        {s}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>

              <div className="mt-auto flex flex-wrap gap-3 pt-10">
                {project.liveUrl ? (
                  <Button href={project.liveUrl} external variant="ink" icon={<ArrowUpRight size={16} />}>
                    Visit live site
                  </Button>
                ) : null}
                <Button to="/contact" variant="outline">
                  Start a similar project
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
