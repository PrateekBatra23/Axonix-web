"use client";

import { useEffect, useState } from "react";

function formatDuration(seconds) {
  if (seconds == null) return "—";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

function statusColor(status) {
  if (status === "success") return "bg-green-100 text-green-800";
  if (status === "failed") return "bg-red-100 text-red-800";
  return "bg-yellow-100 text-yellow-800";
}

export default function ScrapeRunsPage() {
  const [runs, setRuns] = useState(null);
  const [error, setError] = useState(false);
  const [pipelineFilter, setPipelineFilter] = useState("");

  useEffect(() => {
    const params = new URLSearchParams({ limit: "50" });
    if (pipelineFilter) params.set("pipeline_name", pipelineFilter);

    fetch(`/api/admin/scrape-runs?${params}`)
      .then((res) => res.json())
      .then(setRuns)
      .catch(() => setError(true));
  }, [pipelineFilter]);

  if (error) return <p className="text-sm text-gray-500">Failed to load scrape runs.</p>;
  if (!runs) return <p className="text-sm text-gray-500">Loading…</p>;

  const pipelineNames = [...new Set(runs.map((r) => r.pipeline_name))];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Pipeline Runs</h1>
        <select
          value={pipelineFilter}
          onChange={(e) => setPipelineFilter(e.target.value)}
          className="text-xs border rounded-md px-3 py-1.5"
        >
          <option value="">All pipelines</option>
          {pipelineNames.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>

      {runs.length === 0 && (
        <p className="text-sm text-gray-500 py-12 text-center">No Pipeline runs recorded yet.</p>
      )}

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr className="text-left text-xs text-gray-500">
              <th className="px-4 py-2.5 font-medium">Pipeline</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5 font-medium">Started</th>
              <th className="px-4 py-2.5 font-medium">Duration</th>
              <th className="px-4 py-2.5 font-medium">Companies</th>
              <th className="px-4 py-2.5 font-medium">Jobs Found</th>
              <th className="px-4 py-2.5 font-medium">Jobs Failed</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((run) => (
              <tr key={run.id} className="border-b last:border-0">
                <td className="px-4 py-3 font-mono text-xs">{run.pipeline_name}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(run.status)}`}>
                    {run.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-600">
                  {new Date(run.started_at).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-xs text-gray-600">
                  {formatDuration(run.duration_seconds)}
                </td>
                <td className="px-4 py-3 text-xs text-gray-600">
                  {run.companies_scraped ?? "—"}
                  {run.companies_with_active_jobs != null && (
                    <span className="text-gray-400"> ({run.companies_with_active_jobs} active)</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-gray-600">{run.jobs_found ?? "—"}</td>
                <td className="px-4 py-3 text-xs">
                  {run.jobs_failed > 0 ? (
                    <span className="text-red-600 font-medium">{run.jobs_failed}</span>
                  ) : (
                    <span className="text-gray-400">0</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}