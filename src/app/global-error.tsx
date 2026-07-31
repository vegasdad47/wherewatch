"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0a0a0f] text-white antialiased">
        <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-4 text-center">
          <div className="text-5xl">🎬</div>
          <h1 className="mt-6 text-3xl font-black sm:text-4xl">
            Something went wrong
          </h1>
          <p className="mt-4 max-w-md text-zinc-400">
            We hit a snag loading this page. It might be a temporary issue — give it another try.
          </p>
          <div className="mt-8 flex gap-4">
            <button
              onClick={reset}
              className="inline-flex min-h-11 items-center rounded-lg bg-blue-500 px-5 font-semibold hover:bg-blue-400"
            >
              Try again
            </button>
            <Link
              href="/"
              className="inline-flex min-h-11 items-center rounded-lg border border-white/10 bg-white/[0.06] px-5 font-semibold hover:bg-white/10"
            >
              Go home
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
