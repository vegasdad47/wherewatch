"use client";
import { useState, useEffect } from "react";
import { isNativeApp } from "@/lib/native";

/**
 * Play Billing upgrade button — only visible inside the Android app.
 * Replaces the Stripe checkout button for Play policy compliance.
 */
export function NativeUpgradeButton() {
  const [native, setNative] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => { setNative(isNativeApp()); }, []);

  if (!native) return null;

  function upgrade() {
    setBusy(true);
    (window as any).AndroidApp?.startPlayBilling?.();
    // Reset after a moment — the billing flow takes over the screen
    setTimeout(() => setBusy(false), 2000);
  }

  return (
    <button
      onClick={upgrade}
      disabled={busy}
      className="mt-3 min-h-11 w-full rounded-xl bg-emerald-600 px-5 font-bold text-white hover:bg-emerald-500 disabled:opacity-60"
    >
      {busy ? "Opening Google Play…" : "Upgrade with Google Play"}
    </button>
  );
}
