"use client";

import { getStoryImage, handleImageError } from "@/lib/imageFallback";

export default function FeaturedStory({ story }) {
  if (!story) return null;

  return (
    <div style={{ background: "var(--featured-bg)" }}>
      <div className="max-w-7xl mx-auto px-6 py-11">
        <a
          href={`/stories/${story.slug}`}
          className="grid grid-cols-1 sm:grid-cols-[280px_1fr] gap-7 items-start hover:opacity-90 transition"
        >
          <img
            src={getStoryImage(story)}
            alt=""
            loading="lazy"
            className="w-full aspect-[4/3] object-cover rounded-lg"
            style={{ background: "var(--featured-image-bg)" }}
            onError={(e) => handleImageError(e, story)}
          />
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
              {story.headline}
            </h2>
            <p
              className="text-sm leading-relaxed mb-2.5 max-w-2xl"
              style={{ color: "var(--featured-muted)" }}
            >
              {story.summary}
            </p>
            <p className="text-xs font-mono" style={{ color: "var(--featured-faint)" }}>
              {story.source}
            </p>
          </div>
        </a>
      </div>
    </div>
  );
}