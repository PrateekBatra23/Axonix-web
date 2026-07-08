"use client";

import { resolveStoryVisual, handlePhotoError } from "@/lib/imageFallback";

const COMPANY_COLORS = {
  openai: { bg: "#0d3d33", text: "#7ec4b0" },
  google: { bg: "#1a2e42", text: "#7ba3c9" },
  anthropic: { bg: "#3d2210", text: "#d99a5f" },
  microsoft: { bg: "#1a1f42", text: "#8a97d9" },
  nvidia: { bg: "#0c2a1a", text: "#6fbf7a" },
  meta: { bg: "#1a2340", text: "#8fa3e0" },
  mistral: { bg: "#3d2410", text: "#e0965f" },
  huggingface: { bg: "#3d3510", text: "#e0c95f" },
  apple: { bg: "#1f1f1f", text: "#b8b8b8" },
};

export default function StoryVisual({
  story,
  className,
  letterClassName = "text-lg",
  showCredit = false,
}) {
  const visual = resolveStoryVisual(story);

  if (visual.type === "photo") {
    const img = (
      <img
        src={visual.src}
        alt=""
        loading="lazy"
        className={className}
        onError={(e) => handlePhotoError(e, story)}
      />
    );

    if (showCredit && visual.credit) {
      return (
        <div>
          {img}
          <p className="text-[10px] font-mono text-faint mt-1.5">
            Photo: {visual.credit}
          </p>
        </div>
      );
    }

    return img;
  }

  if (visual.type === "monogram") {
    if (visual.variant === "company") {
      const colors = COMPANY_COLORS[story.company_slug] ?? {
        bg: "var(--card-bg)",
        text: "var(--accent)",
      };
      return (
        <div className={`${className} flex items-center justify-center`} style={{ background: colors.bg }}>
          <span className={`font-mono font-bold ${letterClassName}`} style={{ color: colors.text }}>
            {visual.letter}
          </span>
        </div>
      );
    }

    return (
      <div className={`${className} flex items-center justify-center bg-card-bg border border-border`}>
        <span className={`font-mono font-semibold text-muted ${letterClassName}`}>
          {visual.letter}
        </span>
      </div>
    );
  }

  return null;
}