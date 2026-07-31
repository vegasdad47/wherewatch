"use client";
import { signIn } from "next-auth/react";

export function GoogleSignIn() {
  return <button onClick={() => signIn("google", { redirectTo: "/account" })} className="mt-4 min-h-11 w-full rounded-xl border border-white/15 px-5 font-semibold text-zinc-200 hover:bg-white/5">Continue with Google</button>;
}
