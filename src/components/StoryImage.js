"use client";

import StoryVisual from "@/components/StoryVisual";

export default function StoryImage({ story }) {
  return (
    <StoryVisual
      story={story}
      className="w-full aspect-[16/9] object-cover rounded-lg"
      letterClassName="text-8xl"
      showCredit
    />
  );
}