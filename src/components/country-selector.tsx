"use client";

import { useState, useRef, useEffect, useCallback } from "react";

export interface Country {
  code: string;
  name: string;
  flag: string;
}

export const COUNTRIES: Country[] = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", flag: "🇰🇷" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "PL", name: "Poland", flag: "🇵🇱" },
  { code: "SE", name: "Sweden", flag: "🇸🇪" },
  { code: "NO", name: "Norway", flag: "🇳🇴" },
  { code: "DK", name: "Denmark", flag: "🇩🇰" },
  { code: "FI", name: "Finland", flag: "🇫🇮" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿" },
];

const STORAGE_KEY = "wherewatch-country";

function getStoredCountry(): string {
  if (typeof window === "undefined") return "US";
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && COUNTRIES.some((c) => c.code === stored)) return stored;
  } catch {
    // localStorage unavailable
  }
  return "US";
}

function storeCountry(code: string) {
  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch {
    // localStorage unavailable
  }
}

export function getCountryByCode(code: string): Country {
  return COUNTRIES.find((c) => c.code === code) ?? COUNTRIES[0];
}

export function CountrySelector({
  selected,
  onChange,
  compact = false,
}: {
  selected: string;
  onChange: (code: string) => void;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const current = getCountryByCode(selected);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Focus input when opened
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const filtered = query
    ? COUNTRIES.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.code.toLowerCase().includes(query.toLowerCase()),
      )
    : COUNTRIES;

  const handleSelect = useCallback(
    (code: string) => {
      onChange(code);
      storeCountry(code);
      setOpen(false);
      setQuery("");
    },
    [onChange],
  );

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] text-sm font-medium text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.08] ${
          compact ? "px-2 py-1.5" : "px-3 py-2"
        }`}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="text-base leading-none">{current.flag}</span>
        {!compact && <span>{current.name}</span>}
        <svg
          className={`size-3.5 text-zinc-500 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1.5 w-64 rounded-xl border border-white/10 bg-[#14141f] shadow-2xl shadow-black/50 backdrop-blur-xl">
          <div className="border-b border-white/10 p-2">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search countries..."
              className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:border-blue-400/50"
            />
          </div>
          <ul className="max-h-64 overflow-y-auto p-1.5" role="listbox">
            {filtered.map((country) => (
              <li key={country.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected === country.code}
                  onClick={() => handleSelect(country.code)}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition ${
                    selected === country.code
                      ? "bg-blue-500/15 text-blue-300"
                      : "text-zinc-300 hover:bg-white/[0.06]"
                  }`}
                >
                  <span className="text-base leading-none">{country.flag}</span>
                  <span className="flex-1 text-left">{country.name}</span>
                  <span className="text-xs text-zinc-500">{country.code}</span>
                </button>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-3 py-4 text-center text-sm text-zinc-500">
                No countries found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export function useCountry() {
  const [country, setCountry] = useState(getStoredCountry);

  const changeCountry = useCallback((code: string) => {
    setCountry(code);
    storeCountry(code);
  }, []);

  return { country, setCountry: changeCountry };
}
