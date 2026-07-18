"use client";

import { useState } from "react";
import FlagButton from "@/components/FlagButton";

const ROLE_CATEGORIES = [
  { value: "aiml", label: "AI/ML" },
  { value: "data", label: "Data" },
  { value: "research", label: "Research" },
  { value: "sde", label: "Software Engineering" },
];

const EXPERIENCE_LEVELS = [
  { value: "new-grad", label: "New Grad" },
  { value: "fresher", label: "Fresher" },
  { value: "mid", label: "Mid-Level" },
  { value: "senior", label: "Senior" },
];

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatTimeDisplay(job) {
  const timestamp = job.posted_at || job.scraped_at;
  if (!timestamp) return "";

  const postedDate = new Date(timestamp);
  const now = new Date();
  const diffMs = now - postedDate;
  const label = job.posted_at ? "posted" : "added";

  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return `${label} just now`;
  if (minutes < 60) return `${label} ${minutes}m ago`;

  const hours = Math.floor(diffMs / 3600000);
  if (hours < 12) return `${label} ${hours}h ago`;

  const dayDiff = Math.round((startOfDay(now) - startOfDay(postedDate)) / 86400000);

  if (dayDiff <= 0) return `${label} ${hours}h ago`;
  return `${label} ${dayDiff}d ago`;
}

function isNewJob(job, lastScrapes) {
  if (!lastScrapes || lastScrapes.length === 0) return false;
  return lastScrapes.some((run) => run.run_id === job.pipeline_run_id);
}

function buildParams(filters, offset) {
  const params = new URLSearchParams();
  if (filters.company) params.set("company", filters.company);
  if (filters.role_category) params.set("role_category", filters.role_category);
  if (filters.experience_level) params.set("experience_level", filters.experience_level);
  if (filters.remote) params.set("remote", filters.remote);
  params.set("limit", "30");
  params.set("offset", String(offset));
  return params;
}

export default function JobsBoard({
  initialJobs,
  initialTotal,
  initialHasMore,
  lastScrapes,
  companies,
}) {
  const [jobs, setJobs] = useState(initialJobs);
  const [total, setTotal] = useState(initialTotal);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [filters, setFilters] = useState({
    company: "",
    role_category: "",
    experience_level: "",
    remote: "",
  });

  const sortedCompanies = [...companies].sort((a, b) =>
    a.company.localeCompare(b.company)
  );

  async function applyFilters(newFilters) {
    setLoading(true);
    setError(false);
    setFilters(newFilters);
    try {
      const params = buildParams(newFilters, 0);
      const res = await fetch(`/api/jobs?${params}`);
      if (!res.ok) throw new Error("bad response");
      const data = await res.json();
      setJobs(data.jobs);
      setTotal(data.total);
      setHasMore(data.has_more);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  async function loadMore() {
    setLoading(true);
    setError(false);
    try {
      const params = buildParams(filters, jobs.length);
      const res = await fetch(`/api/jobs?${params}`);
      if (!res.ok) throw new Error("bad response");
      const data = await res.json();
      setJobs((prev) => [...prev, ...data.jobs]);
      setHasMore(data.has_more);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  function handleFilterChange(key, value) {
    applyFilters({ ...filters, [key]: value });
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-3">
        <select
          value={filters.company}
          onChange={(e) => handleFilterChange("company", e.target.value)}
          className="text-xs font-mono border border-border rounded-md px-3 py-2 bg-background"
        >
          <option value="">All companies</option>
          {sortedCompanies.map((c) => (
            <option key={c.company_slug} value={c.company_slug}>
              {c.company} ({c.job_count})
            </option>
          ))}
        </select>

        <select
          value={filters.role_category}
          onChange={(e) => handleFilterChange("role_category", e.target.value)}
          className="text-xs font-mono border border-border rounded-md px-3 py-2 bg-background"
        >
          <option value="">All roles</option>
          {ROLE_CATEGORIES.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>

        <select
          value={filters.experience_level}
          onChange={(e) => handleFilterChange("experience_level", e.target.value)}
          className="text-xs font-mono border border-border rounded-md px-3 py-2 bg-background"
        >
          <option value="">All levels</option>
          {EXPERIENCE_LEVELS.map((l) => (
            <option key={l.value} value={l.value}>{l.label}</option>
          ))}
        </select>

        <select
          value={filters.remote}
          onChange={(e) => handleFilterChange("remote", e.target.value)}
          className="text-xs font-mono border border-border rounded-md px-3 py-2 bg-background"
        >
          <option value="">All jobs</option>
          <option value="true">Remote only</option>
          <option value="false">Not remote</option>
        </select>
      </div>

      <p className="text-xs font-mono text-faint mb-6">
        {total} {total === 1 ? "job" : "jobs"} match{filters.company || filters.role_category || filters.experience_level || filters.remote ? "ing" : ""} this selection
      </p>

      {error && (
        <p className="text-sm text-muted py-4 text-center">
          Couldn&apos;t load jobs right now — try again shortly.
        </p>
      )}

      {loading && jobs.length === 0 && !error && (
        <p className="text-sm text-muted py-12 text-center">Loading…</p>
      )}

      {!loading && !error && jobs.length === 0 && (
        <p className="text-sm text-muted py-12 text-center">
          No roles match these filters.
        </p>
      )}

      <div>
        {jobs.map((job) => (
          <div
            key={job.id}
            className="flex items-start justify-between gap-6 py-5 border-b border-border hover:bg-card-bg transition px-1 -mx-1"
          >
            <a
              href={job.apply_url}
              target="_blank"
              rel="noopener noreferrer"
              className="min-w-0 flex-1"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <h3 className="text-sm font-semibold">{job.title}</h3>
                {isNewJob(job, lastScrapes) && (
                  <span className="text-[9px] font-mono font-semibold text-accent border border-accent rounded px-1.5 py-0.5">
                    NEW
                  </span>
                )}
              </div>
              <p className="text-xs font-mono text-faint mb-2">
                {job.company} · {job.location}{job.remote ? " · Remote" : ""}
              </p>
              {job.experience_level && (
                <span className="text-[10px] font-mono border border-border rounded px-2 py-0.5 text-muted">
                  {job.experience_level}
                </span>
              )}
            </a>

            <div className="flex items-center gap-2 shrink-0 pt-1">
              <span className="text-xs font-mono text-faint">
                {formatTimeDisplay(job)}
              </span>
              <FlagButton jobId={job.id} />
            </div>
          </div>
        ))}
      </div>

      {hasMore && !error && (
        <div className="flex justify-center mt-9">
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