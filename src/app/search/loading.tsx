import { GridSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 h-9 w-72 animate-pulse rounded bg-zinc-900" />
      <GridSkeleton />
    </div>
  );
}
