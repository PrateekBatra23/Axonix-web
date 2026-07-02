import StorySection from "@/components/StorySection";
async function getDigests() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/digests`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

async function getStories() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/stories`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function HomePage() {
  const digests = await getDigests();
  const stories = await getStories();

  const latestDigest = digests[0] ?? null;

  const todayStories = latestDigest
    ? stories
        .filter((s) => s.digest_id === latestDigest.id)
        .sort((a, b) => a.id - b.id)
    : [];

  const featured = todayStories[0] ?? null;
  const rest = todayStories.slice(1);

  return (
    <main className="max-w-6xl mx-auto px-8 py-12">
      <div className="mb-9">
        <h1 className="text-xl font-normal leading-relaxed max-w-xl mb-2">
          Daily AI intelligence, filtered for people who build with this —
          not just read about it.
        </h1>
        <p className="text-sm font-mono text-muted">
          {todayStories.length} stories today
        </p>
      </div>

      {latestDigest && (
        <section className="bg-digest-bg border-l-2 border-accent rounded-lg px-6 py-5 mb-9">
          <p className="text-sm font-mono font-semibold mb-2">
            {latestDigest.publish_date}
          </p>
          <p className="text-base text-foreground/90 leading-relaxed">
            {latestDigest.overall_summary}
          </p>
        </section>
      )}

      {featured && (
        <>
          <p className="text-xs font-mono text-accent mb-3 tracking-wide">
            FEATURED
          </p>
          <article className="border border-accent bg-digest-bg rounded-lg px-8 py-8 mb-10">
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
          </article>
        </>
      )}

      <StorySection stories={rest} />
      <div className="flex justify-center mb-10">
        <a
          href="/digests"
          className="text-sm font-mono border border-border rounded-md px-5 py-2.5 hover:bg-card-bg transition"
        >
          View all digests →
        </a>
      </div>

      <div className="border border-dashed border-border rounded-md px-5 py-4 text-center text-[11px] font-mono text-faint">
        AD SLOT
      </div>
    </main>
  );
}