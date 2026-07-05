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
    <main className="max-w-6xl mx-auto px-8 py-12">
      <a href="/digests" className="text-xs font-mono text-accent mb-6 inline-block">
        ← digests
      </a>

      <h1 className="text-sm font-mono font-semibold mb-4">
        {digest.publish_date}
      </h1>

      <p className="text-base text-foreground/90 leading-relaxed max-w-2xl mb-10">
        {digest.overall_summary}
      </p>

      {featured && (
        <>
          <p className="text-xs font-mono text-accent mb-3 tracking-wide">
            FEATURED
          </p>
          <a
          href={`/stories/${featured.slug}`}
  className="block border border-accent bg-digest-bg rounded-lg px-8 py-8 mb-10 hover:border-accent transition"
>
  <div className="flex flex-wrap gap-1.5 mb-3">
    {featured.topic_tags.split(",").map((tag) => (
      <span
        key={tag}
        className="text-[10px] font-mono border border-border rounded px-2 py-0.5 text-muted"
      >
        {tag.trim()}
      </span>
    ))}
  </div>
  <h2 className="text-2xl font-semibold mb-3 leading-snug">
    {featured.headline}
  </h2>
  <p className="text-muted leading-relaxed mb-4">
    {featured.summary}
  </p>
  <p className="text-xs font-mono text-faint">{featured.source}</p>
</a>
        </>
      )}

      <StorySection stories={rest} />

      {digestStories.length === 0 && (
        <p className="text-sm text-muted py-12 text-center">
          No stories in this digest yet.
        </p>
      )}
    </main>
  );
}