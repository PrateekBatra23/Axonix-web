const COMPANY_NAMES = {
  openai: "OpenAI",
  google: "Google",
  anthropic: "Anthropic",
  microsoft: "Microsoft",
  nvidia: "NVIDIA",
  meta: "Meta",
  mistral: "Mistral AI",
  huggingface: "Hugging Face",
  apple: "Apple",
};

async function getAllStories() {
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/v1/stories`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export const metadata = {
  title: "Companies",
  description: "Browse AI news by company.",
};

export default async function CompaniesPage() {
  const stories = await getAllStories();

  const counts = {};
  let latestByCompany = {};
  for (const story of stories) {
    if (!story.company_slug) continue;
    counts[story.company_slug] = (counts[story.company_slug] ?? 0) + 1;
    if (
      !latestByCompany[story.company_slug] ||
      story.id > latestByCompany[story.company_slug].id
    ) {
      latestByCompany[story.company_slug] = story;
    }
  }

    const companies = Object.entries(COMPANY_NAMES)
    .map(([slug, name]) => ({
      slug,
      name,
      count: counts[slug] ?? 0,
      latest: latestByCompany[slug] ?? null,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <main className="max-w-5xl mx-auto px-8 py-12">
      <div className="mb-10">
        <p className="text-xs font-mono text-accent tracking-wide mb-3">
          {companies.filter((c) => c.count > 0).length} TRACKED
        </p>
        <h1 className="text-2xl font-semibold mb-2">Browse by company</h1>
        <p className="text-sm text-muted">
          Every recent development, organized by who's behind it.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {companies.map((company) => (
          <a
            key={company.slug}
            href={`/companies/${company.slug}`}
            className="bg-card-bg border border-border rounded-lg px-6 py-5 hover:border-accent/60 transition"
          >
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-base font-semibold">{company.name}</span>
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