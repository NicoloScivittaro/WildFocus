export function Logo() {
  return (
    <span className="inline-flex items-center gap-1.5 font-display text-lg text-ink">
      <span className="relative inline-block h-4 w-4 shrink-0" aria-hidden="true">
        <span className="absolute left-0 top-0 h-2.5 w-2.5 border-l-2 border-t-2 border-accent-deep" />
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 border-b-2 border-r-2 border-accent-deep" />
      </span>
      WildFocus
    </span>
  )
}
