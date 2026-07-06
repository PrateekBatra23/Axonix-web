"use client";

import Link from "next/link";
import { useState } from "react";

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

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        background: "var(--header-bg)",
        borderColor: "var(--header-border)",
      }}
    >
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-bold text-lg tracking-tight"
          style={{ color: "var(--header-text)" }}
        >
          AXONIX
        </Link>

        <div
          className="flex items-center gap-7 text-sm font-mono"
          style={{ color: "var(--header-muted)" }}
        >
          <Link href="/digests" className="hover:text-white transition">
            Digests
          </Link>
          <Link href="/topics" className="hover:text-white transition">
            Topics
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setShowCompanies(true)}
            onMouseLeave={() => setShowCompanies(false)}
          >
            <Link href="/companies" className="hover:text-white transition">
              Companies
            </Link>

            {showCompanies && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[560px] bg-card-bg border border-border rounded-xl overflow-hidden">
                <div className="flex">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3 px-6 py-6 w-[280px] shrink-0">
                    {COMPANIES.map((c) => (
                      <a
                        key={c.slug}
                        href={`/companies/${c.slug}`}
                        className="text-sm text-foreground hover:text-accent transition"
                      >
                        {c.name}
                      </a>
                    ))}
                  </div>
                  <div className="w-px bg-border my-6" />
                  <div className="px-6 py-6 flex-1 flex items-center">
                    <p className="text-sm text-muted leading-relaxed">
                      Track the latest models, releases, and updates —
                      organized by the company shipping them.
                    </p>
                  </div>
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
            href="https://prateekbatra.dev"
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