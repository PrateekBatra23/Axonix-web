import JobsBoard from "@/components/JobsBoard";

async function getInitialJobs() {
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/v1/jobs?limit=30`, {
    cache: "no-store",
  });
  if (!res.ok) return { jobs: [], total: 0, has_more: false, last_scrapes: [] };
  return res.json();
}

async function getJobCompanies() {
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/v1/jobs/companies`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export const metadata = {
  title: "Jobs",
  description: "Open roles across leading companies.",
};

export default async function JobsPage() {
  const [initial, companies] = await Promise.all([
    getInitialJobs(),
    getJobCompanies(),
  ]);

  return (
    <main className="max-w-3xl mx-auto px-8 py-12">
      <div className="mb-9">
        <h1 className="text-2xl font-semibold mb-2">Jobs</h1>
        <p className="text-sm text-muted">
          {initial.total} open {initial.total === 1 ? "role" : "roles"}
        </p>
      </div>

      <JobsBoard
        initialJobs={initial.jobs}
        initialTotal={initial.total}
        initialHasMore={initial.has_more}
        lastScrapes={initial.last_scrapes}
        companies={companies}
      />
    </main>
  );
}