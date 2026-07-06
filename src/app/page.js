import StorySection from "@/components/StorySection";

async function getDigests() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/digests`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

async function getStoriesForDigest(digestId) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/stories?digest_id=${digestId}`,
    { cache: "no-store" }
  );
  if (!res.ok) return [];
  return res.json();
}

export default async function HomePage() {
  const digests = await getDigests();
  const sortedDigests = [...digests].sort(
    (a, b) => new Date(b.publish_date) - new Date(a.publish_date)
  );

  const latestDigest = sortedDigests[0] ?? null;
  const earlierDigests = sortedDigests.slice(1, 3);

  const todayStories = latestDigest
    ? (await getStoriesForDigest(latestDigest.id)).sort((a, b) => a.id - b.id)
    : [];

  const featured = todayStories[0] ?? null;
  const rest = todayStories.slice(1);

  return (
    <>
      <div className="border-b border-border bg-card-bg">
        <div className="max-w-7xl mx-auto px-6 py-2.5 text-center">
          <p className="text-xs font-mono text-muted">
            🚧 Site under construction — some data shown may be
            placeholder/test content and shouldn&apos;t be taken as real news.
          </p>
        </div>
      </div>

      {/* Hero band — dark, matches header */}
      <div
        className="relative overflow-hidden"
        style={{ background: "var(--header-bg)" }}
      >
        <div
          className="absolute -top-[40%] -right-[10%] w-[70%] h-[220%] rotate-[18deg]"
          style={{ background: "rgba(255,255,255,0.025)" }}
        />
        <div className="relative px-10 py-24">
          {latestDigest && (
            <p className="text-xs font-mono text-accent tracking-wide mb-3">
              {latestDigest.publish_date}
            </p>
          )}
          <h1
            className="text-4xl font-bold leading-tight mb-4 max-w-4xl"
            style={{ color: "var(--header-text)" }}
          >
            Daily AI intelligence, filtered for people who build with this —
            not just read about it.
          </h1>
          {latestDigest && (
            <p
              className="text-base leading-relaxed max-w-2xl"
              style={{ color: "var(--header-muted)" }}
            >
              {latestDigest.overall_summary}
            </p>
          )}
        </div>
      </div>

      {/* Featured band — bold color block, tokens ready for per-company override later */}
      {featured && (
        <div style={{ background: "var(--featured-bg)" }}>
          <div className="max-w-7xl mx-auto px-6 py-11">
            <a
              href={`/stories/${featured.slug}`}
              className={`grid gap-7 items-start hover:opacity-90 transition ${
                featured.img_url ? "grid-cols-1 sm:grid-cols-[280px_1fr]" : "grid-cols-1"
              }`}
            >
              {featured.img_url && (
                <img
                  src={featured.img_url}
                  alt=""
                  loading="lazy"
                  className="w-full aspect-[4/3] object-cover rounded-lg"
                  style={{ background: "var(--featured-image-bg)" }}
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              )}
              <div>
                <span
                  className="inline-block text-[10px] font-mono font-semibold tracking-wide px-2.5 py-1 rounded mb-3"
                  style={{
                    background: "var(--featured-badge-bg)",
                    color: "var(--featured-badge-text)",
                  }}
                >
                  FEATURED
                </span>
                <h2
                  className="text-xl font-semibold mb-2.5 leading-snug"
                  style={{ color: "var(--featured-text)" }}
                >
                  {featured.headline}
                </h2>
                <p
                  className="text-sm leading-relaxed mb-2.5 max-w-2xl"
                  style={{ color: "var(--featured-muted)" }}
                >
                  {featured.summary}
                </p>
                <p
                  className="text-xs font-mono"
                  style={{ color: "var(--featured-faint)" }}
                >
                  {featured.source}
                </p>
              </div>
            </a>
          </div>
        </div>
      )}

      {/* Main content — plain white, no tint */}
      <main className="max-w-7xl mx-auto px-6 py-11 grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-11">
        <div>
          <StorySection stories={rest} />

          {earlierDigests.length > 0 && (
            <div className="border-t border-border mt-10 pt-7">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-semibold uppercase tracking-wide">
                  Earlier digests
                </p>
                <a
                  href="/digests"
                  className="text-xs font-mono text-accent"
                >
                  view all →
                </a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {earlierDigests.map((digest) => (
                  <a
                    key={digest.id}
                    href={`/digests/${digest.slug}`}
                    className="border border-border rounded-lg px-4 py-3.5 hover:bg-card-bg transition"
                  >
                    <p className="text-xs font-semibold font-mono mb-1.5">
                      {digest.publish_date} · {digest.story_count}{" "}
                      {digest.story_count === 1 ? "story" : "stories"}
                    </p>
                    <p className="text-xs text-muted leading-relaxed line-clamp-2">
                      {digest.overall_summary}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-center mt-9">
            <a
              href="/digests"
              className="text-sm font-mono border border-border rounded-md px-5 py-2.5 hover:bg-card-bg transition"
            >
              View all digests →
            </a>
          </div>
        </div>

        <aside>
          <div className="sticky top-20 border border-dashed border-border rounded-md px-4 py-8 text-center">
            <p className="text-[11px] font-mono text-faint">AD SLOT</p>
          </div>
        </aside>
      </main>
    </>
  );
}