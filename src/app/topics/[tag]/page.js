import StorySection from "@/components/StorySection";

async function getStoriesByTag(tag) {
  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/v1/stories?tag=${tag}`,
    { cache: "no-store" }
  );
  if (!res.ok) return [];
  return res.json();
}

export async function generateMetadata({ params }) {
  const { tag } = await params;
  return {
    title: tag,
    description: `AI stories tagged ${tag}, most recent first.`,
  };
}

export default async function TopicPage({ params }) {
  const { tag } = await params;
  const stories = (await getStoriesByTag(tag)).sort((a, b) => b.id - a.id);

  return (
    <main className="max-w-6xl mx-auto px-8 py-12">
      <div className="flex items-center gap-2 text-xs font-mono mb-6">
        <a href="/topics" className="text-accent">
          topics
        </a>
        <span className="text-faint">/</span>
        <span className="text-muted">{tag}</span>
      </div>

      <div className="mb-9">
        <h1 className="text-2xl font-semibold mb-2">{tag}</h1>
        <p className="text-sm text-muted">
          {stories.length} {stories.length === 1 ? "story" : "stories"}{" "}
          tagged {tag}, most recent first
        </p>
      </div>

      <StorySection stories={stories} />

      {stories.length === 0 && (
        <p className="text-sm text-muted py-12 text-center">
          No stories tagged &ldquo;{tag}&rdquo; yet.
        </p>
      )}
    </main>
  );
}