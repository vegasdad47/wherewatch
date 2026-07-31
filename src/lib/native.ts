"use client";

/**
 * Detect if the app is running inside the WhereWatch Android WebView.
 * The Android app injects window.AndroidApp before page load.
 */
export function isNativeApp(): boolean {
  if (typeof window === "undefined") return false;
  return !!(window as any).AndroidApp?.isNative?.();
}
