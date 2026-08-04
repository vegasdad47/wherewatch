"use client";

import { useEffect, useRef, useState } from "react";

const faqs = [
  {
    question: "What is WhereWatch?",
    answer:
      "WhereWatch is a streaming search engine that helps you find where to watch any movie or TV show across 30+ streaming services. Instead of checking Netflix, Hulu, Prime Video, and every other app individually, just search once on WhereWatch and see all your options in one place — subscription, rental, purchase, or free.",
  },
  {
    question: "Is WhereWatch really free?",
    answer:
      "Yes! The core search experience is completely free — no account required, no credit card, no catch. We offer an optional Premium tier ($3/month) that adds features like unlimited watchlist, ad-free browsing, and priority support, but you can search and discover content forever without paying a cent.",
  },
  {
    question: "Is WhereWatch really free?",
    answer:
      "WhereWatch focuses on speed and simplicity. We offer a cleaner interface, faster search, and unique features like the My Services filter that lets you see only results from services you actually have. Plus, our deep links take you directly into the streaming app — one tap and you're watching.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "Nope! You can start searching immediately without signing up. If you want to use the watchlist feature or sync across devices, you'll need a free account — but it's completely optional.",
  },
  {
    question: "Which countries is WhereWatch available in?",
    answer:
      "WhereWatch currently supports the United States, Canada, United Kingdom, Australia, and New Zealand. We're actively working on expanding to more countries. Streaming availability varies by region, and we show accurate results based on your selected country.",
  },
  {
    question: "How accurate is the streaming availability data?",
    answer:
      "We update our streaming data daily using a combination of official APIs and our own monitoring systems. While we strive for accuracy, streaming catalogs change frequently. If you spot something wrong, let us know and we'll fix it fast.",
  },
  {
    question: "Can I filter by specific streaming services?",
    answer:
      "Absolutely! The My Services feature lets you select which streaming services you have, and we'll only show you results available on those platforms. No more seeing great movies that are only on services you don't subscribe to.",
  },
  {
    question: "Does WhereWatch have a mobile app?",
    answer:
      "WhereWatch is a progressive web app (PWA) that works great on mobile browsers. You can add it to your home screen for a native app-like experience. Native iOS and Android apps are on our roadmap.",
  },
];

function FAQItem({
  faq,
  index,
  isOpen,
  onToggle,
}: {
  faq: (typeof faqs)[0];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
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
      className={`border border-white/10 rounded-xl overflow-hidden transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 75}ms` }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.03] transition-colors duration-200"
      >
        <span className="text-white font-medium pr-4">{faq.question}</span>
        <span
          className={`text-zinc-400 flex-shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="px-5 pb-5 text-zinc-400 leading-relaxed text-sm">
          {faq.answer}
        </p>
      </div>
    </div>
  );
}

export default function LandingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
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
      <div className="max-w-3xl mx-auto">
        {/* Section header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="text-blue-400 text-sm font-semibold tracking-wider uppercase">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
            Got questions?{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              We&apos;ve got answers.
            </span>
          </h2>
        </div>

        {/* FAQ items */}
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem
              key={faq.question}
              faq={faq}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>

        {/* Still have questions */}
        <div
          className={`text-center mt-12 p-8 rounded-2xl bg-white/[0.04] border border-white/10 transition-all duration-700 delay-500 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-zinc-300 mb-4">
            Still have questions? We&apos;re here to help.
          </p>
          <a
            href="mailto:hello@wherewatch.app"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all duration-200 shadow-lg shadow-blue-500/25"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
}
