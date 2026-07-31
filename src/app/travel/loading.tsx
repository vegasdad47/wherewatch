export default function TravelLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Hero skeleton */}
      <section className="rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10 px-6 py-16 sm:px-10 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-block h-7 w-32 animate-pulse rounded-full bg-white/10" />
          <div className="mx-auto mt-6 h-10 w-64 animate-pulse rounded-lg bg-white/10" />
          <div className="mx-auto mt-4 h-6 w-96 animate-pulse rounded-lg bg-white/10" />
        </div>
      </section>

      {/* Content skeleton */}
      <section className="mt-10">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div>
            <div className="h-7 w-48 animate-pulse rounded-lg bg-white/10" />
            <div className="mt-1 h-4 w-64 animate-pulse rounded-lg bg-white/10" />
          </div>
          <div className="h-10 w-44 animate-pulse rounded-lg bg-white/10" />
        </div>

        {/* Grid skeletons */}
        {[1, 2, 3].map((section) => (
          <div key={section} className="mt-10">
            <div className="h-6 w-72 animate-pulse rounded-lg bg-white/10" />
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[2/3] animate-pulse rounded-xl bg-white/[0.06]"
                />
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
