import { notFound } from "next/navigation";
import StorySection from "@/components/StorySection";
import FeaturedStory from "@/components/FeaturedStory";

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
          <a href="/digests" className="text-xs font-mono text-accent mb-4 inline-block">
            ← digests
          </a>
          <p className="text-xs font-mono text-accent tracking-wide mb-3">
            {digest.publish_date}
          </p>
          <h1
            className="text-4xl font-bold leading-tight mb-4"
            style={{ color: "var(--header-text)" }}
          >
            Daily briefing
          </h1>
          <p
            className="text-base leading-relaxed max-w-2xl"
            style={{ color: "var(--header-muted)" }}
          >
            {digest.overall_summary}
          </p>
        </div>
      </div>

      {/* Featured band — same bold treatment as homepage */}
      <FeaturedStory story={featured} />

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