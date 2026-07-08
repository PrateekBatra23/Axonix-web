"use client";

import { getStoryImage, handleImageError } from "@/lib/imageFallback";

export default function StoryImage({ story }) {
  return (
    <img
      src={getStoryImage(story)}
      alt=""
      loading="lazy"
      className="w-full aspect-[16/9] object-cover rounded-lg mb-8"
      style={{ background: "var(--card-bg)" }}
      onError={(e) => handleImageError(e, story)}
    />
  );
}