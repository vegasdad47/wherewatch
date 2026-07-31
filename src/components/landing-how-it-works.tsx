"use client";

import { useEffect, useRef, useState } from "react";

function SearchIcon() {
  return (
    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ListFilterIcon() {
  return (
    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

const steps = [
  {
    number: "01",
    icon: SearchIcon,
    title: "Search",
    description:
      "Type in any movie or TV show. Our search is fast, smart, and handles typos like a champ.",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  {
    number: "02",
    icon: ListFilterIcon,
    title: "Compare",
    description:
      "See every streaming option at a glance — subscription, rental, purchase, or free. Filter by your services.",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
  },
  {
    number: "03",
    icon: ExternalLinkIcon,
    title: "Watch",
    description:
      "One tap and you're watching. Deep links take you straight to the content on your streaming app.",
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
  },
];

function StepCard({
  step,
  index,
}: {
  step: (typeof steps)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`relative group transition-all duration-700 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Connector line */}
      {index < steps.length - 1 && (
        <div className="hidden lg:block absolute top-12 left-[calc(50%+4rem)] w-[calc(100%-8rem)] h-px">
          <div className="w-full h-full bg-gradient-to-r from-white/10 to-transparent" />
        </div>
      )}

      <div
        className={`relative p-8 rounded-2xl border ${step.borderColor} ${step.bgColor} backdrop-blur-sm transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-lg`}
      >
        {/* Step number */}
        <span className="absolute -top-4 -left-4 text-7xl font-black text-white/[0.06] select-none">
          {step.number}
        </span>

        {/* Icon */}
        <div
          className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-lg`}
        >
          <step.icon />
        </div>

        {/* Content */}
        <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
        <p className="text-zinc-400 leading-relaxed">{step.description}</p>
      </div>
    </div>
  );
}

export default function LandingHowItWorks() {
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
    <section ref={ref} className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="text-blue-400 text-sm font-semibold tracking-wider uppercase">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
            Three steps to your{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              next watch
            </span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            No sign-up. No hassle. Just search, compare, and start streaming in
            seconds.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, i) => (
            <StepCard key={step.title} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
