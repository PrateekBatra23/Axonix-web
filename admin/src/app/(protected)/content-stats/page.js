"use client";

import { useEffect, useState } from "react";

export default function ContentStatsPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/admin/content-stats")
      .then((res) => res.json())
      .then(setStats)
      .catch(() => setError(true));
  }, []);

  if (error) return <p className="text-sm text-gray-500">Failed to load content stats.</p>;
  if (!stats) return <p className="text-sm text-gray-500">Loading…</p>;

  const cards = [
    { label: "Total Digests", value: stats.total_digests },
    { label: "Total Stories", value: stats.total_stories },
    { label: "Total Jobs", value: stats.total_jobs },
    { label: "Active Jobs", value: stats.active_jobs },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold mb-8">Content Stats</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="border rounded-lg p-5">
            <p className="text-2xl font-semibold mb-1">{card.value}</p>
            <p className="text-xs text-gray-500">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}