"use client";

import { useEffect, useRef, useState } from "react";

const freeFeatures = [
  "Search across 30+ streaming services",
  "Trending movies & TV shows",
  "Browse by genre",
  "My Services filter",
  "Deep links to streaming apps",
  "Basic support",
];

const premiumFeatures = [
  "Everything in Free",
  "Unlimited watchlist",
  "Ad-free experience",
  "Custom service filters",
  "Priority support",
  "Early access to new features",
  "Watchlist sync across devices",
];

export default function LandingPricing() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-24 px-4 bg-white/[0.03]">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="text-blue-400 text-sm font-semibold tracking-wider uppercase">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
            Free to use.{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Premium when you need more.
            </span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Start searching immediately — no credit card required. Upgrade for
            extra features when you&apos;re ready.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free tier */}
          <div
            className={`relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 transition-all duration-500 hover:border-white/20 ${
              visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-500 to-zinc-600 flex items-center justify-center">
                <span className="text-white text-lg">⚡</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Free</h3>
                <p className="text-zinc-500 text-sm">Forever free</p>
              </div>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold text-white">$0</span>
              <span className="text-zinc-500 ml-2">/ month</span>
            </div>

            <ul className="space-y-3 mb-8">
              {freeFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <span className="text-emerald-400 flex-shrink-0 mt-0.5">✓</span>
                  <span className="text-zinc-300 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <a
              href="/search"
              className="block w-full text-center py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white font-medium transition-all duration-200 border border-white/10"
            >
              Start Searching
            </a>
          </div>

          {/* Premium tier */}
          <div
            className={`relative rounded-2xl border border-blue-500/30 bg-gradient-to-b from-blue-950/50 to-white/[0.04] backdrop-blur-sm p-8 transition-all duration-500 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 ${
              visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            {/* Popular badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-semibold shadow-lg">
              Most Popular
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-white text-lg">👑</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Premium</h3>
                <p className="text-zinc-500 text-sm">For power users</p>
              </div>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold text-white">$3</span>
              <span className="text-zinc-500 ml-2">/ month</span>
            </div>

            <ul className="space-y-3 mb-8">
              {premiumFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <span className="text-blue-400 flex-shrink-0 mt-0.5">✓</span>
                  <span className="text-zinc-300 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <a
              href="/signup"
              className="block w-full text-center py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
            >
              Get Premium
            </a>
          </div>
        </div>

        {/* Bottom note */}
        <p
          className={`text-center text-zinc-500 text-sm mt-8 transition-all duration-700 delay-500 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          All prices in USD. Cancel anytime. No long-term contracts.
        </p>
      </div>
    </section>
  );
}
