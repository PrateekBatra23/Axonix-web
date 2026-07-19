"use client";

import { useEffect, useState } from "react";

export default function FlagsPage() {
  const [flags, setFlags] = useState(null);
  const [error, setError] = useState(false);
  const [jobDetails, setJobDetails] = useState({});
  const [expandedDetails, setExpandedDetails] = useState(null);
  const [expandedReasons, setExpandedReasons] = useState(null);
  const [reasonData, setReasonData] = useState({});

  useEffect(() => {
    fetch("/api/admin/flags?min_flags=1")
      .then((res) => res.json())
      .then(async (data) => {
        setFlags(data);
        const details = {};
        await Promise.all(
          data.map(async (f) => {
            try {
              const res = await fetch(`/api/jobs/${f.job_id}`);
              if (res.ok) details[f.job_id] = await res.json();
            } catch {
              // leave missing, render fallback
            }
          })
        );
        setJobDetails(details);
      })
      .catch(() => setError(true));
  }, []);

  function toggleDetails(jobId) {
    setExpandedDetails(expandedDetails === jobId ? null : jobId);
  }

  async function toggleReasons(jobId) {
    if (expandedReasons === jobId) {
      setExpandedReasons(null);
      return;
    }
    setExpandedReasons(jobId);
    if (!reasonData[jobId]) {
      try {
        const res = await fetch(`/api/admin/jobs/${jobId}/flags`);
        if (!res.ok) {
          setReasonData((prev) => ({ ...prev, [jobId]: { total_flags: 0, reasons: {} } }));
          return;
        }
        const data = await res.json();
        setReasonData((prev) => ({ ...prev, [jobId]: data }));
      } catch {
        setReasonData((prev) => ({ ...prev, [jobId]: { total_flags: 0, reasons: {} } }));
      }
    }
  }

  if (error) return <p className="text-sm text-gray-500">Failed to load flagged jobs.</p>;
  if (!flags) return <p className="text-sm text-gray-500">Loading…</p>;

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Flagged Jobs</h1>

      {flags.length === 0 && (
        <p className="text-sm text-gray-500 py-12 text-center">
          No jobs currently flagged for review.
        </p>
      )}

      <div className="flex flex-col gap-2">
        {flags.map((flag) => {
          const job = jobDetails[flag.job_id];
          const detailsOpen = expandedDetails === flag.job_id;
          const reasonsOpen = expandedReasons === flag.job_id;
          const reasons = reasonData[flag.job_id];

          return (
            <div key={flag.job_id} className="border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium">
                    {job ? job.title : `Job #${flag.job_id}`}
                  </p>
                  {job && (
                    <p className="text-xs text-gray-500">
                      {job.company} · {job.location}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                    {flag.flag_count} {flag.flag_count === 1 ? "flag" : "flags"}
                  </span>
                  <button
                    onClick={() => toggleDetails(flag.job_id)}
                    className="text-xs border rounded-md px-2.5 py-1 hover:bg-gray-50 transition"
                  >
                    {detailsOpen ? "Hide details" : "Job details"}
                  </button>
                  <button
                    onClick={() => toggleReasons(flag.job_id)}
                    className="text-xs border rounded-md px-2.5 py-1 hover:bg-gray-50 transition"
                  >
                    {reasonsOpen ? "Hide reasons" : "Reasons"}
                  </button>
                </div>
              </div>

              {detailsOpen && (
                <div className="px-4 py-3 border-t bg-gray-50 text-xs">
                  {!job ? (
                    <p className="text-gray-500">Job details unavailable.</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                      <div><span className="text-gray-500">Title:</span> {job.title}</div>
                      <div><span className="text-gray-500">Company:</span> {job.company}</div>
                      <div><span className="text-gray-500">Location:</span> {job.location}</div>
                      <div><span className="text-gray-500">Remote:</span> {job.remote ? "Yes" : "No"}</div>
                      <div><span className="text-gray-500">Employment type:</span> {job.employment_type}</div>
                      <div><span className="text-gray-500">Experience level:</span> {job.experience_level || "—"}</div>
                      <div><span className="text-gray-500">Role category:</span> {job.role_category || "—"}</div>
                      <div><span className="text-gray-500">Source:</span> {job.source}</div>
                      <div><span className="text-gray-500">Posted:</span> {job.posted_at ? new Date(job.posted_at).toLocaleString() : "—"}</div>
                      <div><span className="text-gray-500">Scraped:</span> {new Date(job.scraped_at).toLocaleString()}</div>
                      <div><span className="text-gray-500">Active:</span> {job.is_active ? "Yes" : "No"}</div>
                      <div><span className="text-gray-500">Tags:</span> {job.tags || "—"}</div>
                      <div className="col-span-2">
                        <a
                          href={job.apply_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {job.apply_url} ↗
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {reasonsOpen && (
                <div className="px-4 py-3 border-t bg-gray-50 text-xs">
                  {!reasons ? (
                    <p className="text-gray-500">Loading reasons…</p>
                  ) : (
                    <>
                      <p className="text-gray-500 mb-2">
                        {reasons.total_flags ?? 0} total flags,{" "}
                        {Object.values(reasons.reasons ?? {}).reduce((a, b) => a + b, 0)} with a
                        reason submitted
                      </p>
                      <div className="flex flex-col gap-1">
                        {Object.entries(reasons.reasons ?? {}).map(([reason, count]) => (
                          <div key={reason} className="flex justify-between">
                            <span className="text-gray-600">{reason.replace(/_/g, " ")}</span>
                            <span className="font-mono">{count}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}