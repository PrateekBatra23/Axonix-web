async function getDigests() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/digests`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const day = date.toLocaleDateString("en-US", { day: "2-digit" });
  const month = date.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  const year = date.getFullYear();
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
  return { formatted: `${day} ${month} ${year}`, weekday };
}

export const metadata = {
  title: "Digests",
  description: "Every daily AI digest, archived and searchable.",
};

export default async function DigestsPage() {
  const digests = await getDigests();

  const sorted = [...digests].sort(
    (a, b) => new Date(b.publish_date) - new Date(a.publish_date)
  );

  return (
    <main className="max-w-3xl mx-auto px-8 py-12">
      <div className="mb-9">
        <h1 className="text-2xl font-semibold mb-2">Digests</h1>
        <p className="text-sm text-muted">
          Every daily briefing, archived and searchable.
        </p>
      </div>

      <div>
        {sorted.map((digest) => {
          const { formatted, weekday } = formatDate(digest.publish_date);

          return (
            <a
              key={digest.id}
              href={`/digests/${digest.slug}`}
              className="flex gap-7 py-5 border-b border-border hover:bg-card-bg transition px-1 -mx-1"
            >
              <div className="min-w-[130px] shrink-0">
                <p className="text-sm font-semibold font-mono mb-0.5">
                  {formatted}
                </p>
                <p className="text-xs text-faint">{weekday}</p>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted leading-relaxed mb-2 line-clamp-2">
                  {digest.overall_summary}
                </p>
                <span className="text-xs font-mono text-faint">
                  {digest.story_count}{" "}
                  {digest.story_count === 1 ? "story" : "stories"}
                </span>
              </div>
              <div className="flex items-center shrink-0 text-faint">→</div>
            </a>
          );
        })}
      </div>

      {sorted.length === 0 && (
        <p className="text-sm text-muted py-12 text-center">
          No digests yet.
        </p>
      )}

      {sorted.length > 0 && (
        <div className="flex justify-center mt-8">
          <button className="text-sm font-mono border border-border rounded-md px-5 py-2.5 hover:bg-card-bg transition">
            Load more
          </button>
        </div>
      )}
    </main>
  );
}