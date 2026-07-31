import Link from "next/link";

export function Pagination({ page, totalPages, href }: { page: number; totalPages: number; href: (page: number) => string }) {
  if (totalPages <= 1) return null;
  const last = Math.min(totalPages, 500);
  return (
    <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-3">
      {page > 1 ? <Link className="rounded-lg border border-white/15 px-4 py-3 text-sm font-semibold hover:border-blue-400 hover:text-blue-300" href={href(page - 1)}>← Previous</Link> : <span />}
      <span className="text-sm text-zinc-400">Page {page} of {last}</span>
      {page < last ? <Link className="rounded-lg border border-white/15 px-4 py-3 text-sm font-semibold hover:border-blue-400 hover:text-blue-300" href={href(page + 1)}>Next →</Link> : <span />}
    </nav>
  );
}
