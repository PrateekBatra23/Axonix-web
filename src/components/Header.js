"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [dark, setDark] = useState(true);

  function toggleTheme() {
    document.documentElement.classList.toggle("dark");
    setDark((prev) => !prev);
  }

  return (
    <header className="border-b border-border sticky top-0 bg-background z-50">
      <nav className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="border border-border rounded-md p-1.5 flex items-center justify-center"
            aria-label="Toggle theme"
          >
            {dark ? "N" : "D"}
          </button>
          <Link href="/" className="font-bold text-lg tracking-tight">
            AXONIX
          </Link>
        </div>

        <div className="flex items-center gap-7 text-sm font-mono text-muted">
          <Link href="/digests" className="hover:text-foreground transition">
            Digests
          </Link>
          <Link href="/topics" className="hover:text-foreground transition">
            Topics
          </Link>
          <Link href="/jobs" className="flex items-center gap-1.5 hover:text-foreground transition">
            Jobs
            <span className="text-[10px] font-mono border border-border rounded px-1.5 py-0.5">
              SOON
            </span>
          </Link>
          <a
            href="https://prateekbatra.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition"
          >
            Built by Prateek Batra
          </a>
        </div>
      </nav>
    </header>
  );
}