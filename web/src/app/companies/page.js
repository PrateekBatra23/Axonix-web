async function getCompanies() {
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/v1/companies`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

async function getStoriesForCompany(slug) {
  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/v1/stories?company=${slug}`,
    { cache: "no-store" }
  );
  if (!res.ok) return [];
  return res.json();
}

export const metadata = {
  title: "Companies",
  description: "Browse AI news by company.",
};

export default async function CompaniesPage() {
  const companies = await getCompanies();

  const enriched = await Promise.all(
    companies.map(async (company) => {
      const stories = await getStoriesForCompany(company.slug);
      const sorted = [...stories].sort((a, b) => b.id - a.id);
      return {
        ...company,
        count: stories.length,
        latest: sorted[0] ?? null,
      };
    })
  );

  const sortedCompanies = enriched.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <main className="max-w-5xl mx-auto px-8 py-12">
      <div className="mb-10">
        <p className="text-xs font-mono text-accent tracking-wide mb-3">
          {sortedCompanies.length} TRACKED
        </p>
        <h1 className="text-2xl font-semibold mb-2">Browse by company</h1>
        <p className="text-sm text-muted">
          Every recent development, organized by who's behind it.
        </p>
      </div>

      {sortedCompanies.length === 0 && (
        <p className="text-sm text-muted py-12 text-center">
          No companies to show yet.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sortedCompanies.map((company) => (
          <a
            key={company.slug}
            href={`/companies/${company.slug}`}
            className="bg-card-bg border border-border rounded-lg px-6 py-5 hover:border-accent/60 transition"
          >
            <div className="flex items-center gap-3 mb-2.5">
              <span
                className="w-7 h-7 flex items-center justify-center text-xs font-mono font-bold rounded-sm shrink-0"
                style={{ background: company.theme_bg, color: company.theme_text }}
              >
                {company.name[0]}
              </span>
              <span className="text-base font-semibold flex-1">{company.name}</span>
              <span className="text-xs font-mono text-faint">
                {company.count} {company.count === 1 ? "story" : "stories"}
              </span>
            </div>
            {company.latest ? (
              <p className="text-xs text-muted leading-relaxed line-clamp-2">
                {company.latest.headline}
              </p>
            ) : (
              <p className="text-xs text-faint italic">No coverage yet</p>
            )}
          </a>
        ))}
      </div>
    </main>
  );
}