type FocusFrameSize = 'sm' | 'lg'
type FocusFrameTone = 'accent' | 'accent-deep'

const CORNER_SIZE: Record<FocusFrameSize, string> = {
  sm: 'h-3 w-3',
  lg: 'h-8 w-8 md:h-10 md:w-10',
}

const CORNER_COLOR: Record<FocusFrameTone, string> = {
  accent: 'border-accent',
  'accent-deep': 'border-accent-deep',
}

interface FocusFrameProps {
  size?: FocusFrameSize
  tone?: FocusFrameTone
  /** Literal Tailwind inset utility, e.g. "inset-3" or "inset-4 md:inset-5". */
  inset?: string
  className?: string
}

/**
 * WildFocus's signature device: four viewfinder corner marks, echoing a
 * camera autofocus frame. Reused (small) in the logo, (large) around the
 * Hero showreel, and (on hover) on portfolio cards — one motif, three sizes.
 */
export function FocusFrame({ size = 'sm', tone = 'accent', inset = 'inset-3', className = '' }: FocusFrameProps) {
  const cornerSize = CORNER_SIZE[size]
  const cornerColor = CORNER_COLOR[tone]

  return (
    <div className={`pointer-events-none absolute ${inset} ${className}`} aria-hidden="true">
      <span className={`absolute left-0 top-0 border-l-2 border-t-2 ${cornerSize} ${cornerColor}`} />
      <span className={`absolute right-0 top-0 border-r-2 border-t-2 ${cornerSize} ${cornerColor}`} />
      <span className={`absolute bottom-0 left-0 border-b-2 border-l-2 ${cornerSize} ${cornerColor}`} />
      <span className={`absolute bottom-0 right-0 border-b-2 border-r-2 ${cornerSize} ${cornerColor}`} />
    </div>
  )
}
