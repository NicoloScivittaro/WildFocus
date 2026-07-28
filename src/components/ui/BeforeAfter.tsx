import { useState } from 'react'
import type { ProjectBeforeAfter } from '@/types/content'

interface BeforeAfterProps {
  data: ProjectBeforeAfter
}

export function BeforeAfter({ data }: BeforeAfterProps) {
  const [revealPercent, setRevealPercent] = useState(50)

  return (
    <div className="rounded-xl2 border border-ink/10 bg-surface p-4">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-ink/10 bg-zinc-900">
        <div className="absolute inset-0 flex items-center justify-center px-4 text-center text-sm text-white/70">
          Dopo — {data.after}
        </div>
        <div
          className="absolute inset-y-0 left-0 flex items-center overflow-hidden border-r-2 border-accent bg-black px-4 text-sm text-white/70"
          style={{ width: `${revealPercent}%` }}
        >
          <span className="whitespace-nowrap">Prima — {data.before}</span>
        </div>
      </div>

      <label className="mt-4 block text-sm text-ink-muted" htmlFor="before-after-slider">
        Trascina per confrontare prima e dopo
      </label>
      <input
        id="before-after-slider"
        type="range"
        min={0}
        max={100}
        value={revealPercent}
        aria-valuetext={`${revealPercent}% prima`}
        onChange={(event) => setRevealPercent(Number(event.target.value))}
        className="mt-2 w-full accent-accent"
      />
      <p className="mt-3 text-sm text-ink-muted">{data.note}</p>
    </div>
  )
}
