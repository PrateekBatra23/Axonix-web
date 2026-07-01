async function getLatestDigest() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/digests`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  const digests = await res.json();
  return digests[0] ?? null;
}

async function getStories() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/stories`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function HomePage() {
  const digest = await getLatestDigest();
  const stories = await getStories();

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Axonix</h1>
        <p className="text-sm text-gray-400 mt-1">
          AI intelligence, delivered daily
        </p>
      </header>

      {digest && (
        <section className="mb-10 border-b border-gray-800 pb-8">
          <h2 className="text-xl font-semibold mb-2">
            {digest.publish_date}
          </h2>
          <p className="text-gray-300">{digest.overall_summary}</p>
        </section>
      )}

      <section>
        <h2 className="text-lg font-semibold mb-4">Latest Stories</h2>
        <div className="space-y-6">
          {stories.map((story) => (
            <article key={story.id} className="border-b border-gray-800 pb-6">
              <h3 className="text-lg font-medium">{story.headline}</h3>
              <p className="text-sm text-gray-400 mt-1">{story.source}</p>
              <p className="text-gray-300 mt-2">{story.summary}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}