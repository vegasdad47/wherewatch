"use client";
import { useEffect } from "react";

declare global { interface Window { adsbygoogle?: Record<string, unknown>[] } }

export function AdUnit({ placement }: { placement: "banner" | "native" }) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const slot = placement === "banner" ? process.env.NEXT_PUBLIC_ADSENSE_BANNER_SLOT : process.env.NEXT_PUBLIC_ADSENSE_NATIVE_SLOT;
  useEffect(() => {
    if (client && slot) try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch { /* Ad blockers can prevent initialization. */ }
  }, [client, slot]);
  if (!client || !slot) return <aside aria-label="Advertisement" className={`${placement === "banner" ? "min-h-24" : "min-h-32"} my-8 grid place-items-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] text-xs uppercase tracking-widest text-zinc-600`}>Advertisement</aside>;
  return <aside aria-label="Advertisement" className="my-8 overflow-hidden text-center"><ins className="adsbygoogle block" data-ad-client={client} data-ad-slot={slot} data-ad-format={placement === "banner" ? "auto" : "fluid"} data-full-width-responsive="true" /></aside>;
}
