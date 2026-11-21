import type { CSSProperties, ElementType } from 'react'

interface SplitTextProps {
  text: string
  as?: ElementType
  /** Granularity of the animated unit */
  by?: 'line' | 'word' | 'char'
  /** Wrap each line in an overflow mask (needed for slide-up reveals) */
  mask?: boolean
  className?: string
  lineClassName?: string
  style?: CSSProperties
  id?: string
}

/**
 * Splits text into lines (on "\n"), words and characters as real React
 * elements so GSAP can animate them without a runtime DOM splitter.
 * Screen readers get the plain sentence; visual fragments are aria-hidden.
 */
export function SplitText({
  text,
  as: Tag = 'p',
  by = 'line',
  mask = true,
  className,
  lineClassName,
  style,
  id,
}: SplitTextProps) {
  const lines = text.split('\n')
  const plain = lines.join(' ')

  return (
    <Tag className={className} style={style} data-split-id={id}>
      <span className="sr-only" id={id}>
        {plain}
      </span>
      <span aria-hidden="true" className="block">
        {lines.map((line, li) => {
          const lineCls = [mask ? 'split-line' : 'block', lineClassName].filter(Boolean).join(' ')
          if (by === 'line') {
            return (
              <span key={li} className={lineCls}>
                <span className="split-inner block">{line}</span>
              </span>
            )
          }
          const words = line.split(' ')
          return (
            <span key={li} className={lineCls}>
              {words.map((word, wi) => (
                <span key={wi}>
                  {by === 'word' ? (
                    <span className="split-word split-inner">{word}</span>
                  ) : (
                    <span className="split-word">
                      {Array.from(word).map((ch, ci) => (
                        <span key={ci} className="split-char split-inner">
                          {ch}
                        </span>
                      ))}
                    </span>
                  )}
                  {wi < words.length - 1 ? ' ' : null}
                </span>
              ))}
            </span>
          )
        })}
      </span>
    </Tag>
  )
}
