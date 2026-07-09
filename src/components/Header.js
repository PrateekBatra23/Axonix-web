"use client";

import Link from "next/link";
import { useState, useRef } from "react";

const COMPANIES = [
  { slug: "openai", name: "OpenAI" },
  { slug: "google", name: "Google" },
  { slug: "anthropic", name: "Anthropic" },
  { slug: "microsoft", name: "Microsoft" },
  { slug: "nvidia", name: "NVIDIA" },
  { slug: "meta", name: "Meta" },
  { slug: "mistral", name: "Mistral AI" },
  { slug: "huggingface", name: "Hugging Face" },
  { slug: "apple", name: "Apple" },
];

export default function Header() {
  const [showCompanies, setShowCompanies] = useState(false);
  const closeTimer = useRef(null);

  function openMenu() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setShowCompanies(true);
  }

  function scheduleClose() {
    closeTimer.current = setTimeout(() => setShowCompanies(false), 150);
  }

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{ background: "var(--header-bg)", borderColor: "var(--header-border)" }}
    >
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-tight" style={{ color: "var(--header-text)" }}>
          TBDName
        </Link>

        <div className="flex items-center gap-7 text-sm font-mono" style={{ color: "var(--header-muted)" }}>
          <Link href="/digests" className="hover:text-white transition">Digests</Link>
          <Link href="/topics" className="hover:text-white transition">Topics</Link>

          <div
            className="relative"
            onMouseEnter={openMenu}
            onMouseLeave={scheduleClose}
          >
            <Link href="/companies" className="hover:text-white transition">
              Companies
            </Link>

            {showCompanies && (
  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[720px]">
    <div className="shadow-2xl">
      <div className="flex">
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 px-8 py-8 w-[380px] shrink-0 bg-card-bg border-l border-t border-r border-border">
          {COMPANIES.map((c) => (
            <a
              key={c.slug}
              href={`/companies/${c.slug}`}
              className="flex items-center gap-2.5 text-sm text-foreground/80 hover:text-accent transition"
            >
              <span className="w-5 h-5 flex items-center justify-center text-[10px] font-mono font-semibold border border-border rounded-sm shrink-0">
                {c.name[0]}
              </span>
              {c.name}
            </a>
          ))}
        </div>
        <div
          className="px-8 py-8 flex-1 flex flex-col justify-center"
          style={{ background: "var(--featured-bg)" }}
        >
          <p className="text-[10px] font-mono tracking-wide mb-3 uppercase" style={{ color: "var(--featured-faint)" }}>
            Companies
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--featured-muted)" }}>
            Track the latest models, releases, and updates —
            organized by the company shipping them.
          </p>
        </div>
      </div>
        <a
        href="/companies"
        className="flex items-center justify-between px-8 py-3.5 bg-card-bg border border-border hover:bg-border/30 transition"
      >
        <span className="text-xs font-mono text-muted">
          {COMPANIES.length} companies tracked
        </span>
        <span className="text-xs font-mono text-accent">
          See all companies →
        </span>
      </a>
    </div>
  </div>
)}
          </div>

          <Link href="/jobs" className="flex items-center gap-1.5 hover:text-white transition">
            Jobs
            <span className="text-[10px] font-mono border border-header-muted/40 rounded px-1.5 py-0.5">
              SOON
            </span>
          </Link>
          <a
            href="https://github.prateekbatra.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            Built by Prateek Batra
          </a>
        </div>
      </nav>
    </header>
  );
}