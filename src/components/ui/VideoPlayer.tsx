import { useState } from 'react'
import { Play } from 'lucide-react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

interface VideoPlayerProps {
  title: string
  poster: string
  src?: string
}

function isSlowConnection(): boolean {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
  return Boolean(connection?.saveData)
}

export function VideoPlayer({ title, poster, src }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()
  const showStaticPosterOnly = !src || prefersReducedMotion || isSlowConnection()

  if (isPlaying && src && !showStaticPosterOnly) {
    return (
      <video
        className="aspect-video w-full rounded-xl2 border border-ink/10 object-cover"
        src={src}
        poster={poster}
        controls
        autoPlay
        muted
        playsInline
        aria-label={title}
      />
    )
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl2 border border-ink/10">
      <img src={poster} alt={title} className="h-full w-full object-cover" loading="lazy" />
      {!showStaticPosterOnly && (
        <button
          type="button"
          onClick={() => setIsPlaying(true)}
          aria-label={`Riproduci ${title}`}
          className="absolute inset-0 flex items-center justify-center bg-black/30 transition hover:bg-black/40"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-ink">
            <Play fill="currentColor" />
          </span>
        </button>
      )}
      {showStaticPosterOnly && (
        <p className="absolute bottom-3 left-3 rounded-full bg-black/50 px-3 py-1 text-xs text-white">
          Showreel — [PLACEHOLDER]
        </p>
      )}
    </div>
  )
}
