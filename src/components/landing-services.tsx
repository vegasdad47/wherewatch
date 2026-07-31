"use client";

import { useEffect, useRef, useState } from "react";

const services = [
  { name: "Netflix", color: "#E50914" },
  { name: "Prime Video", color: "#00A8E1" },
  { name: "Hulu", color: "#1CE783" },
  { name: "Disney+", color: "#113CCF" },
  { name: "Max", color: "#002BE7" },
  { name: "Apple TV+", color: "#FFFFFF" },
  { name: "Peacock", color: "#00D2C3" },
  { name: "Paramount+", color: "#0064FF" },
  { name: "YouTube", color: "#FF0000" },
  { name: "Tubi", color: "#FF5C00" },
  { name: "Pluto TV", color: "#FFC907" },
  { name: "Roku Channel", color: "#662D91" },
];

export default function LandingServices() {
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
    <section ref={ref} className="py-16 px-4 border-y border-white/10">
      <div
        className={`max-w-6xl mx-auto transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <p className="text-center text-zinc-500 text-sm font-medium mb-10 tracking-wide uppercase">
          Tracking 30+ streaming services including
        </p>

        {/* Logo grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-6 items-center justify-items-center">
          {services.map((service, i) => (
            <div
              key={service.name}
              className="group flex flex-col items-center gap-2 transition-all duration-500"
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              {/* Logo placeholder — in production, use actual SVG logos */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                style={{
                  backgroundColor: `${service.color}15`,
                  border: `1px solid ${service.color}30`,
                  color: service.color,
                }}
              >
                {service.name.charAt(0)}
              </div>
              <span className="text-xs text-zinc-500 group-hover:text-zinc-300 transition-colors duration-300">
                {service.name}
              </span>
            </div>
          ))}
        </div>

        {/* "And more" indicator */}
        <div className="text-center mt-10">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] border border-white/10 text-zinc-400 text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            And 18+ more services
          </span>
        </div>
      </div>
    </section>
  );
}
