"use client";
import { useState, useEffect } from "react";
import { isNativeApp } from "@/lib/native";

export function BillingButton({ action, children }: { action: "checkout" | "portal"; children: React.ReactNode }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [native, setNative] = useState(false);

  useEffect(() => { setNative(isNativeApp()); }, []);

  async function go() {
    if (native) {
      // In the Android app, use Play Billing instead of Stripe
      (window as any).AndroidApp?.startPlayBilling?.();
      return;
    }
    setBusy(true); setError("");
    try {
      const response = await fetch(`/api/stripe/${action}`, { method: "POST" });
      const data = await response.json();
      if (response.ok && data.url) window.location.href = data.url;
      else { setError(data.error ?? "Something went wrong."); setBusy(false); }
    } catch (err) {
      setError("Network error. Please try again.");
      setBusy(false);
    }
  }

  // Hide Stripe buttons entirely in the native app (Play policy compliance)
  if (native) return null;

  return <div><button onClick={go} disabled={busy} className="min-h-11 rounded-xl bg-blue-500 px-5 font-bold text-white hover:bg-blue-400 disabled:opacity-60">{busy ? "Loading…" : children}</button>{error && <p className="mt-2 text-sm text-red-300">{error}</p>}</div>;
}
