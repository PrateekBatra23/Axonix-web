import { notFound } from "next/navigation";
import StoryImage from "@/components/StoryImage";
async function getStory(slug) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/stories/${slug}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const story = await getStory(slug);
  if (!story) return { title: "Story not found" };
  return {
    title: story.headline,
    description: story.summary,
    openGraph: {
      title: story.headline,
      description: story.summary,
      type: "article",
    },
  };
}

export default async function StoryDetailPage({ params }) {
  const { slug } = await params;
  const story = await getStory(slug);
  if (!story) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: story.headline,
    description: story.summary,
    datePublished: story.published_date,
    author: {
      "@type": "Organization",
      name: story.source,
    },
    publisher: {
      "@type": "Organization",
      name: "Axonix",
    },
  };

  return (
    <main className="max-w-3xl mx-auto px-8 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="flex items-center gap-2 text-xs font-mono mb-7">
        <a href="/digests" className="text-accent">
          digests
        </a>
        <span className="text-faint">/</span>
        <a href={`/digests/${story.digest_slug}`} className="text-muted">
          {story.digest_publish_date}
        </a>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-5">
        {story.topic_tags.split(",").map((tag) => (
          <span
            key={tag}
            className="text-[11px] font-mono border border-border rounded px-2.5 py-0.5 text-muted"
          >
            {tag.trim()}
          </span>
        ))}
      </div>

      <h1 className="text-2xl font-semibold mb-5 leading-snug">
        {story.headline}
      </h1>
      <StoryImage story={story} />
      <div className="flex items-center gap-3.5 mb-8 pb-6 border-b border-border">
        <span className="text-sm font-mono font-semibold">{story.source}</span>
        <span className="text-faint">·</span>
        <span className="text-xs font-mono text-faint">
          {story.published_date}
        </span>
        <span className="text-faint">·</span>
        <span className="text-xs font-mono text-faint italic">
          Summarized by Claude
        </span>
      </div>

      <p className="text-base leading-[1.8] text-foreground/90 mb-8">
        {story.summary}
      </p>

      {story.link && (
        <a
          href={story.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 border border-border rounded-md px-4 py-2.5 text-sm font-mono hover:bg-card-bg transition"
        >
          Read original source ↗
        </a>
      )}

      <a
        href={`/digests/${story.digest_slug}`}
        className="flex items-center justify-between mt-10 px-5 py-4 rounded-lg border-l-2 border-accent bg-digest-bg"
      >
        <span className="text-sm">
          Part of the{" "}
          <span className="font-semibold">{story.digest_publish_date}</span>{" "}
          digest
        </span>
        <span className="text-faint">→</span>
      </a>
    </main>
  );
}