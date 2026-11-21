import type { Project } from '../../data/projects'

/**
 * Project visual. Uses the real screenshot when one is configured; otherwise
 * renders an art-directed typographic cover built from the project's facts.
 */
export function ProjectCover({ project, index, sizes = '(min-width: 1024px) 60vw, 100vw' }: { project: Project; index: number; sizes?: string }) {
  if (project.image) {
    return (
      <img
        data-media
        src={project.image.src}
        alt={project.image.alt}
        width={project.image.width}
        height={project.image.height}
        sizes={sizes}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
      />
    )
  }

  const { bg, fg, accent } = project.cover
  const words = project.name.split(' ')

  return (
    <div
      data-media
      role="img"
      aria-label={`${project.name} — ${project.category} project for ${project.client}`}
      className="relative h-full w-full overflow-hidden [container-type:size]"
      style={{ background: bg, color: fg }}
    >
      {/* fine grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `linear-gradient(${fg} 1px, transparent 1px), linear-gradient(90deg, ${fg} 1px, transparent 1px)`,
          backgroundSize: '12.5% 16.666%',
        }}
      />
      <div aria-hidden="true" className="absolute inset-0 flex flex-col justify-between p-[6cqw] sm:p-[4.5cqw]">
        <div className="flex items-start justify-between">
          <span className="t-label opacity-70">{project.client}</span>
          <span className="t-label opacity-70">{project.category}</span>
        </div>

        <div className="relative">
          <span
            className="absolute -top-[18%] right-[6%] aspect-square w-[22%] rounded-full"
            style={{ background: accent, mixBlendMode: bg === '#c8f169' ? 'multiply' : 'normal' }}
          />
          <p className="relative font-display text-[14cqw] font-medium uppercase leading-[0.82] tracking-[-0.06em]">
            {words.map((w, i) => (
              <span key={i} className={`block ${i === 1 ? 'pl-[18%]' : ''}`}>
                {w}
              </span>
            ))}
          </p>
        </div>

        <div className="flex items-end justify-between">
          <span className="t-index text-sm opacity-70">{String(index + 1).padStart(2, '0')}</span>
          <span className="t-label opacity-70">{project.stack.join(' / ')}</span>
        </div>
      </div>
    </div>
  )
}
