export function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-gray-200 dark:bg-white/10 ${className}`}
      aria-hidden="true"
    />
  )
}

export function SessionSkeleton() {
  return (
    <div className="space-y-1 p-2" aria-label="Cargando conversaciones">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-2 px-3 py-2.5">
          <Skeleton className="w-3 h-3 shrink-0" />
          <Skeleton className="h-3 flex-1" />
        </div>
      ))}
    </div>
  )
}

export function ResourceCardSkeleton() {
  return (
    <div className="card space-y-3" aria-hidden="true">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-3 w-full" />
    </div>
  )
}
