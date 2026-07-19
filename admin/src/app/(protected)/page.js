"use client";

import { useEffect, useState } from "react";

const STATUS_LINKS = {
  scraper: "/scrape-runs",
  flags: "/flags",
  jobs_content: "/content-stats",
  news_digest: "/content-stats",
};

export default function SummaryPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/admin/summary")
      .then((res) => res.json())
      .then(setData)
      .catch(() => setError(true));
  }, []);

  if (error) return <p className="text-sm text-gray-500">Failed to load summary.</p>;
  if (!data) return <p className="text-sm text-gray-500">Loading…</p>;

  return (
    <div>
      <h1 className="text-xl font-semibold mb-8">System Summary</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.subsystems.map((s) => (
          <a
            key={s.name}
            href={STATUS_LINKS[s.name] || "/"}
            className="border rounded-lg p-5 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  s.status === "green" ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm font-semibold capitalize">
                {s.name.replace(/_/g, " ")}
              </span>
            </div>
            <p className="text-xs text-gray-500">{s.detail}</p>
          </a>
        ))}
      </div>
      <p className="text-[10px] font-mono text-gray-400 mt-6">
        Checked at {new Date(data.checked_at).toLocaleString()}
      </p>
    </div>
  );
}