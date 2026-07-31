import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[#0a0a0f] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <h3 className="text-sm font-bold text-white">WhereWatch</h3>
            <p className="mt-2 text-sm text-zinc-500">
              Find where to stream any movie or TV show across 30+ services.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Legal</h3>
            <ul className="mt-2 space-y-1.5">
              <li>
                <Link href="/privacy" className="text-sm text-zinc-500 hover:text-zinc-300 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-zinc-500 hover:text-zinc-300 transition">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Data</h3>
            <ul className="mt-2 space-y-1.5">
              <li>
                <a
                  href="https://www.themoviedb.org/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-zinc-500 hover:text-zinc-300 transition"
                >
                  Powered by TMDB
                </a>
              </li>
              <li>
                <a
                  href="https://www.justwatch.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-zinc-500 hover:text-zinc-300 transition"
                >
                  Availability via JustWatch
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-white/5 pt-6 text-center text-xs text-zinc-600">
          &copy; {new Date().getFullYear()} No Rug Labs. All movie and TV show data provided by TMDB.
        </div>
      </div>
    </footer>
  );
}
