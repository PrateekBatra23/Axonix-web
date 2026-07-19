const COMPANY_SLUGS = new Set([
  "openai", "google", "anthropic", "microsoft",
  "nvidia", "meta", "mistral", "huggingface", "apple",
]);

async function getAllStories() {
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/v1/stories`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export const metadata = {
  title: "Topics",
  description: "Browse AI news by topic.",
};

export default async function TopicsPage() {
  const stories = await getAllStories();

  const counts = {};
  const latestByTag = {};

  for (const story of stories) {
    const tags = story.topic_tags.split(",").map((t) => t.trim());
    for (const tag of tags) {
      if (!tag || COMPANY_SLUGS.has(tag.toLowerCase())) continue;
      counts[tag] = (counts[tag] ?? 0) + 1;
      if (!latestByTag[tag] || story.id > latestByTag[tag].id) {
        latestByTag[tag] = story;
      }
    }
  }

  const topics = Object.entries(counts)
    .map(([tag, count]) => ({ tag, count, latest: latestByTag[tag] }))
    .sort((a, b) => a.tag.localeCompare(b.tag));

  return (
    <main className="max-w-5xl mx-auto px-8 py-12">
      <div className="mb-10">
        <p className="text-xs font-mono text-accent tracking-wide mb-3">
          {topics.length} TOPICS
        </p>
        <h1 className="text-2xl font-semibold mb-2">Browse by topic</h1>
        <p className="text-sm text-muted">
          Every subject covered across all digests.
        </p>
      </div>

      {topics.length === 0 ? (
        <p className="text-sm text-muted py-12 text-center">
          No topics yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {topics.map(({ tag, count, latest }) => (
            <a
              key={tag}
              href={`/topics/${tag}`}
              className="bg-card-bg border border-border rounded-lg px-6 py-5 hover:border-accent/60 transition"
            >
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-base font-semibold font-mono">
                  {tag}
                </span>
                <span className="text-xs font-mono text-faint">
                  {count} {count === 1 ? "story" : "stories"}
                </span>
              </div>
              {latest && (
                <p className="text-xs text-muted leading-relaxed line-clamp-2">
                  {latest.headline}
                </p>
              )}
            </a>
          ))}
        </div>
      )}
    </main>
  );
}