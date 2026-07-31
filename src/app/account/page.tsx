import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { BillingButton } from "@/components/billing-button";
import { NativeUpgradeButton } from "@/components/native-upgrade-button";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Your account", robots: { index: false, follow: false } };

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ checkout?: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/signin");
  const { checkout } = await searchParams;
  const premium = session.user.tier === "premium";
  return <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6"><h1 className="text-3xl font-black text-white">Your account</h1>{checkout === "success" && <p className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-emerald-300">Payment received. Premium activates as soon as Stripe confirms your subscription.</p>}<div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6"><p className="text-sm text-zinc-400">Signed in as</p><p className="mt-1 font-semibold text-white">{session.user.email}</p><div className="mt-6 flex items-center justify-between border-t border-white/10 pt-6"><div><h2 className="text-xl font-bold text-white">{premium ? "Premium" : "Free plan"}</h2><p className="mt-1 text-zinc-400">{premium ? "Ad-free viewing, everywhere." : "Browse everything with supported ads."}</p></div><span className={`rounded-full px-3 py-1 text-sm font-bold ${premium ? "bg-blue-500/15 text-blue-300" : "bg-white/10 text-zinc-300"}`}>{session.user.tier}</span></div><div className="mt-7">{premium ? <BillingButton action="portal">Manage billing</BillingButton> : <><BillingButton action="checkout">Upgrade to ad-free</BillingButton><NativeUpgradeButton /></>}</div></div><form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }} className="mt-6"><button className="min-h-11 text-sm font-semibold text-zinc-400 hover:text-white">Sign out</button></form></div>;
}
