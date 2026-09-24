export function Logo() {
  return (
    <span className="logo-mark inline-flex items-center gap-1.5 font-display text-lg text-ink">
      {/* Single accessible name, so splitting "Wild"/"Focus" stays invisible to AT. */}
      <span className="sr-only">WildFocus</span>

      <span aria-hidden="true" className="relative inline-block h-4 w-4 shrink-0">
        <span className="absolute left-0 top-0 h-2.5 w-2.5 border-l-2 border-t-2 border-accent-deep" />
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 border-b-2 border-r-2 border-accent-deep" />
      </span>

      {/*
        The easter egg: on hover "Wild" slips its leash for a few hundred
        milliseconds while "Focus" holds perfectly still. Same idea as the
        site — the wild part resolves into focus.
      */}
      <span aria-hidden="true" className="inline-block">
        <span className="logo-mark-wild inline-block">Wild</span>
        <span className="inline-block">Focus</span>
      </span>
    </span>
  )
}
