import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-sm font-bold uppercase tracking-widest text-blue-400">404</p>
      <h1 className="mt-3 text-3xl font-bold text-white">Title not found</h1>
      <p className="mt-3 text-zinc-400">This movie or TV show doesn’t exist, or it may have been removed.</p>
      <Link href="/" className="mt-7 inline-flex min-h-11 items-center rounded-lg bg-blue-500 px-5 font-semibold text-white hover:bg-blue-400">
        Search again
      </Link>
    </div>
  );
}
