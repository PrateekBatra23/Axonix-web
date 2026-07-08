const COMPANY_LOGO_SLUGS = new Set([
  "openai", "google", "anthropic", "microsoft",
  "nvidia", "meta", "mistral", "huggingface", "apple",
]);

export function getStoryImage(story) {
  if (story.img_url) return story.img_url;

  if (story.company_slug && COMPANY_LOGO_SLUGS.has(story.company_slug)) {
    return `/logos/${story.company_slug}.svg`;
  }

  const pool = (story.id % 50) + 1;
  return `/tech-photos/tech-${pool}.jpg`;
}

export function handleImageError(e, story) {
  if (!e.target.dataset.fallback) {
    e.target.dataset.fallback = "true";
    const pool = (story.id % 50) + 1;
    e.target.src = `/tech-photos/tech-${pool}.jpg`;
  } else {
    e.target.style.display = "none";
  }
}