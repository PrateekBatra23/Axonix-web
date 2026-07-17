"use client";

import { useState } from "react";

const REASONS = [
  { value: "non_tech_role", label: "Non-tech role" },
  { value: "link_incorrect", label: "Link incorrect" },
  { value: "other", label: "Other" },
];

export default function FlagButton({ jobId }) {
  const [flagged, setFlagged] = useState(false);
  const [showReasons, setShowReasons] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  async function handleFlagClick() {
    if (flagged) return;
    setFlagged(true);
    setShowReasons(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/jobs/${jobId}/flag`, {
        method: "POST",
      });
    } catch {
      // fail silently — flagged state stays true regardless
    }
  }

  async function handleReasonClick(reason) {
    setShowReasons(false);
    setConfirmed(true);
    setTimeout(() => setConfirmed(false), 2000);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/jobs/${jobId}/flag-reason`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
    } catch {
      // fail silently
    }
  }

  return (
    <div className="relative">
      <button
        onClick={handleFlagClick}
        className={`text-sm p-1.5 rounded transition ${
          flagged ? "opacity-100" : "opacity-40 hover:opacity-70"
        }`}
        aria-label="Report this listing"
      >
        🚩
      </button>

      {showReasons && (
        <div className="absolute right-0 top-full mt-1 bg-card-bg border border-border rounded-md p-2 flex flex-col gap-1 z-10 w-40">
          {REASONS.map((r) => (
            <button
              key={r.value}
              onClick={() => handleReasonClick(r.value)}
              className="text-xs text-left px-2 py-1.5 rounded hover:bg-border/40 transition"
            >
              {r.label}
            </button>
          ))}
        </div>
      )}

      {confirmed && (
        <div className="absolute right-0 top-full mt-1 bg-card-bg border border-border rounded-md p-2 flex items-center gap-1.5 z-10">
          <span className="text-xs text-muted">✓ Thanks</span>
        </div>
      )}
    </div>
  );
}