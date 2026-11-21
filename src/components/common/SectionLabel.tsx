interface SectionLabelProps {
  index: string
  label: string
  className?: string
  tone?: 'light' | 'dark'
}

/** Editorial section marker: (03) ——— Selected work */
export function SectionLabel({ index, label, className = '', tone = 'light' }: SectionLabelProps) {
  const muted = tone === 'dark' ? 'text-paper/45' : 'text-ink/45'
  const line = tone === 'dark' ? 'bg-paper/20' : 'bg-ink/20'
  return (
    <div data-label className={`flex items-center gap-4 ${className}`}>
      <span className={`t-index text-xs ${muted}`}>({index})</span>
      <span className={`h-px w-12 ${line}`} aria-hidden="true" />
      <span className={`t-label ${tone === 'dark' ? 'text-paper/80' : 'text-ink/80'}`}>{label}</span>
    </div>
  )
}
