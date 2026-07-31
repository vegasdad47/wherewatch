export function CardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[2/3] rounded-xl bg-zinc-900" />
      <div className="mt-3 h-5 w-3/4 rounded bg-zinc-900" />
      <div className="mt-2 h-4 w-1/3 rounded bg-zinc-900" />
    </div>
  );
}

export function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 md:grid-cols-[260px_1fr]">
        <div className="aspect-[2/3] rounded-2xl bg-zinc-900" />
        <div className="space-y-5 py-4">
          <div className="h-10 w-3/4 rounded bg-zinc-900" />
          <div className="h-5 w-1/2 rounded bg-zinc-900" />
          <div className="h-28 rounded bg-zinc-900" />
          <div className="h-36 rounded bg-zinc-900" />
        </div>
      </div>
    </div>
  );
}
