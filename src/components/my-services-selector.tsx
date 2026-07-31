"use client";

import { useMyServices } from "@/hooks/use-my-services";

export function MyServicesSelector() {
  const { selected, toggle, clearAll, selectAll, loaded, providers } = useMyServices();

  if (!loaded) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <div className="h-5 w-32 animate-pulse rounded bg-white/10" />
        <div className="mt-3 flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-8 w-24 animate-pulse rounded-full bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-300">My services</h3>
        <div className="flex gap-2">
          <button
            onClick={selectAll}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition"
          >
            Select all
          </button>
          <button
            onClick={clearAll}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition"
          >
            Clear
          </button>
        </div>
      </div>
      <p className="mt-1 text-xs text-zinc-500">
        {selected.length === 0
          ? "Showing all services. Pick yours to filter."
          : `Filtering to ${selected.length} service${selected.length === 1 ? "" : "s"}.`}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {providers.map((provider) => {
          const isSelected = selected.includes(provider.id);
          return (
            <button
              key={provider.id}
              onClick={() => toggle(provider.id)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                isSelected
                  ? "bg-white/15 text-white ring-1 ring-white/20"
                  : "bg-white/[0.04] text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.07]"
              }`}
            >
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: isSelected ? provider.color : "transparent" }}
              />
              {provider.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
