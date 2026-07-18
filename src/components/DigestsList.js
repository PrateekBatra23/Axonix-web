"use client";

import { useState } from "react";

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const day = date.toLocaleDateString("en-US", { day: "2-digit" });
  const month = date.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  const year = date.getFullYear();
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
  return { formatted: `${day} ${month} ${year}`, weekday };
}

export default function DigestsList({ initialDigests, initialTotal, initialHasMore }) {
  const [digests, setDigests] = useState(initialDigests);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);

  async function loadMore() {
    setLoading(true);
    try {
      const res = await fetch(`/api/digests?limit=30&offset=${digests.length}`);
      const data = await res.json();
      setDigests((prev) => [...prev, ...data.digests]);
      setHasMore(data.has_more);
    } catch {
      // fail quietly
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div>
        {digests.map((digest) => {
          const { formatted, weekday } = formatDate(digest.publish_date);
          return (
            <a
              key={digest.id}
              href={`/digests/${digest.slug}`}
              className="flex gap-7 py-5 border-b border-border hover:bg-card-bg transition px-1 -mx-1"
            >
              <div className="min-w-[130px] shrink-0">
                <p className="text-sm font-semibold font-mono mb-0.5">{formatted}</p>
                <p className="text-xs text-faint">{weekday}</p>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted leading-relaxed mb-2 line-clamp-2">
                  {digest.overall_summary}
                </p>
                <span className="text-xs font-mono text-faint">
                  {digest.story_count} {digest.story_count === 1 ? "story" : "stories"}
                </span>
              </div>
              <div className="flex items-center shrink-0 text-faint">→</div>
            </a>
          );
        })}
      </div>

      {digests.length === 0 && (
        <p className="text-sm text-muted py-12 text-center">No digests yet.</p>
      )}

      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            disabled={loading}
            className="text-sm font-mono border border-border rounded-md px-5 py-2.5 hover:bg-card-bg transition disabled:opacity-50"
          >
            {loading ? "Loading…" : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}