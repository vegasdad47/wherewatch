import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AuthForm } from "@/components/auth-form";
import { GoogleSignIn } from "@/components/google-sign-in";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };

export default async function SignInPage() {
  if ((await auth())?.user) redirect("/account");
  return <div className="mx-auto max-w-md px-4 py-16"><div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8"><h1 className="text-3xl font-bold text-white">Welcome back</h1><p className="mb-7 mt-2 text-zinc-400">Sign in to manage your ad-free plan.</p><AuthForm mode="signin" />{process.env.GOOGLE_CLIENT_ID && <GoogleSignIn />}<p className="mt-6 text-center text-sm text-zinc-400">New here? <Link href="/signup" className="text-blue-400 hover:text-blue-300">Create an account</Link></p></div></div>;
}
