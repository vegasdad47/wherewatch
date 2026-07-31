"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setError("");
    const values = new FormData(event.currentTarget);
    const email = String(values.get("email") || "");
    const password = String(values.get("password") || "");
    if (mode === "signup") {
      const response = await fetch("/api/auth/register", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: values.get("name"), email, password }) });
      const data = await response.json();
      if (!response.ok) { setError(data.error); setBusy(false); return; }
    }
    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.error) { setError("Email or password is incorrect."); setBusy(false); return; }
    router.push("/account"); router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {mode === "signup" && <label className="block text-sm font-medium text-zinc-300">Name<input name="name" autoComplete="name" className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-blue-500" /></label>}
      <label className="block text-sm font-medium text-zinc-300">Email<input required name="email" type="email" autoComplete="email" className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-blue-500" /></label>
      <label className="block text-sm font-medium text-zinc-300">Password<input required minLength={8} name="password" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-blue-500" /></label>
      {error && <p role="alert" className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}
      <button disabled={busy} className="min-h-11 w-full rounded-xl bg-blue-500 px-5 font-bold text-white hover:bg-blue-400 disabled:opacity-60">{busy ? "Please wait…" : mode === "signup" ? "Create free account" : "Sign in"}</button>
    </form>
  );
}
