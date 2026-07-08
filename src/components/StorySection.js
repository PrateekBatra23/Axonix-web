"use client";

import { useState } from "react";
import StoryVisual from "@/components/StoryVisual";

export default function StorySection({ stories }) {
  const [view, setView] = useState("grid");

  if (stories.length === 0) return null;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold">Also today</h2>
        <div className="flex items-center gap-1 border border-border rounded-md p-1">
          <button
            onClick={() => setView("grid")}
            className={`text-xs font-mono px-2.5 py-1 rounded ${
              view === "grid" ? "bg-card-bg" : "text-muted"
            }`}
          >
            grid
          </button>
          <button
            onClick={() => setView("list")}
            className={`text-xs font-mono px-2.5 py-1 rounded ${
              view === "list" ? "bg-card-bg" : "text-muted"
            }`}
          >
            list
          </button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {stories.map((story) => (
            <a
              key={story.id}
              href={`/stories/${story.slug}`}
              className="flex gap-3.5 pb-4 border-b border-border hover:opacity-80 transition"
            >
              <StoryVisual
                  story={story}
                  className="w-[60px] h-[60px] object-cover rounded-md shrink-0"
                  letterClassName="text-xl"
                />
              <div className="min-w-0">
                <h3 className="text-sm font-semibold mb-1.5 leading-snug">
                  {story.headline}
                </h3>
                <p className="text-xs text-muted leading-relaxed mb-1.5 line-clamp-2">
                  {story.summary}
                </p>
                <p className="text-[11px] font-mono text-faint">
                  {story.source}
                </p>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div>
          {stories.map((story, i) => (
            <a
              key={story.id}
              href={`/stories/${story.slug}`}
              className="flex gap-5 py-4 border-b border-border hover:bg-card-bg transition px-1 -mx-1"
            >
              <span className="text-xs font-mono text-faint pt-0.5 min-w-[22px]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-4 mb-1.5">
                  <h3 className="text-sm font-semibold">{story.headline}</h3>
                  <span className="text-xs font-mono text-faint shrink-0">
                    {story.published_date}
                  </span>
                </div>
                <p className="text-xs text-muted leading-relaxed mb-2 max-w-2xl line-clamp-2">
                  {story.summary}
                </p>
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono font-semibold text-faint">
                    {story.source}
                  </span>
                  <span className="text-xs text-faint">·</span>
                  <div className="flex gap-1.5">
                    {story.topic_tags.split(",").map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono border border-border rounded px-2 py-0.5 text-muted"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </>
  );
}