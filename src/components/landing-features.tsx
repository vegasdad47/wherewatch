"use client";

import { useEffect, useRef, useState } from "react";

function SlidersIcon() {
  return (
    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  );
}

function TrendingUpIcon() {
  return (
    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function UserXIcon() {
  return (
    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="17" y1="8" x2="22" y2="13" />
      <line x1="22" y1="8" x2="17" y2="13" />
    </svg>
  );
}

const features = [
  {
    icon: SlidersIcon,
    title: "My Services Filter",
    description:
      "Only see results from the streaming services you actually subscribe to. No more scrolling through services you don't have.",
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
  },
  {
    icon: TrendingUpIcon,
    title: "Trending Now",
    description:
      "Discover what everyone's watching right now. Updated daily with the hottest movies and shows across all platforms.",
    color: "from-rose-500 to-pink-500",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/20",
  },
  {
    icon: GridIcon,
    title: "Browse by Genre",
    description:
      "Dive into Action, Comedy, Drama, Horror, Sci-Fi, and more. Find exactly what matches your mood.",
    color: "from-emerald-500 to-green-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
  },
  {
    icon: BookmarkIcon,
    title: "Watchlist",
    description:
      "Save movies and shows for later. Your watchlist syncs across devices so you never lose track of what to watch next.",
    color: "from-violet-500 to-purple-500",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500/20",
  },
  {
    icon: LinkIcon,
    title: "Deep Links",
    description:
      "One tap and you're watching. We link directly into Netflix, Prime Video, Hulu, and every other streaming app.",
    color: "from-cyan-500 to-blue-500",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20",
  },
  {
    icon: UserXIcon,
    title: "No Account Required",
    description:
      "Start searching immediately. No sign-up, no email, no credit card. Just type and go — it's that simple.",
    color: "from-zinc-400 to-zinc-500",
    bgColor: "bg-zinc-500/10",
    borderColor: "border-zinc-500/20",
  },
];

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
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
    <div
      ref={ref}
      className={`group relative p-6 rounded-2xl border ${feature.borderColor} ${feature.bgColor} backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:shadow-lg ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Icon */}
      <div
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
      >
        <feature.icon />
      </div>

      {/* Content */}
      <h3 className="text-lg font-semibold text-white mb-2">
        {feature.title}
      </h3>
      <p className="text-zinc-400 text-sm leading-relaxed">
        {feature.description}
      </p>

      {/* Hover glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-5`}
        />
      </div>
    </div>
  );
}

export default function LandingFeatures() {
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
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="text-blue-400 text-sm font-semibold tracking-wider uppercase">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              find your next watch
            </span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Built for streamers who are tired of checking six different apps to
            find where something is playing.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
