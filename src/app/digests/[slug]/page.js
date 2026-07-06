import { notFound } from "next/navigation";
import StorySection from "@/components/StorySection";

async function getDigest(slug) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/digests/${slug}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
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

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const digest = await getDigest(slug);
  if (!digest) return { title: "Digest not found" };
  return {
    title: digest.publish_date,
    description: digest.overall_summary,
  };
}

export default async function DigestDetailPage({ params }) {
  const { slug } = await params;
  const digest = await getDigest(slug);
  if (!digest) notFound();

  const digestStories = (await getStoriesForDigest(digest.id)).sort(
    (a, b) => a.id - b.id
  );

  const featured = digestStories[0] ?? null;
  const rest = digestStories.slice(1);

  return (
    <>
      {/* Hero band — dark, matches header, same as homepage */}
      <div
        className="relative overflow-hidden"
        style={{ background: "var(--header-bg)" }}
      >
        <div
          className="absolute -top-[40%] -right-[10%] w-[70%] h-[220%] rotate-[18deg]"
          style={{ background: "rgba(255,255,255,0.025)" }}
        />
        <div className="relative px-10 py-16">
          <a
            href="/digests"
            className="text-xs font-mono text-accent mb-4 inline-block"
          >
            ← digests
          </a>
          <p className="text-xs font-mono text-accent tracking-wide mb-3">
            {digest.publish_date}
          </p>
          <h1
            className="text-4xl font-bold leading-tight mb-4 max-w-4xl"
            style={{ color: "var(--header-text)" }}
          >
            {digest.overall_summary}
          </h1>
        </div>
      </div>

      {/* Featured band — same bold treatment as homepage */}
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

      {/* Main content — plain white */}
      <main className="max-w-7xl mx-auto px-6 py-11">
        <StorySection stories={rest} />

        {digestStories.length === 0 && (
          <p className="text-sm text-muted py-12 text-center">
            No stories in this digest yet.
          </p>
        )}
      </main>
    </>
  );
}