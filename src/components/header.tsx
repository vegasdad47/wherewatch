import Link from "next/link";
import { SearchForm } from "@/components/search-form";
import { auth } from "@/auth";

export async function Header() {
  const session = await auth();
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0f]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex min-h-11 shrink-0 items-center gap-2 font-bold tracking-tight text-white"
        >
          <span className="grid size-9 place-items-center rounded-lg bg-blue-500 text-lg shadow-lg shadow-blue-500/20">
            🎬
          </span>
          <span>Streaming Finder</span>
        </Link>
        <Link href="/browse" className="hidden min-h-11 items-center text-sm font-semibold text-zinc-300 hover:text-blue-400 md:flex">Browse</Link>
        <div className="w-full sm:ml-auto sm:max-w-xl">
          <SearchForm />
        </div>
        <Link href={session?.user ? "/account" : "/signin"} className="flex min-h-11 shrink-0 items-center justify-center rounded-lg border border-white/10 px-4 text-sm font-semibold text-zinc-200 hover:border-blue-400/50 hover:text-blue-300">
          {session?.user ? (session.user.tier === "premium" ? "Premium" : "Account") : "Sign in"}
        </Link>
      </div>
    </header>
  );
}
