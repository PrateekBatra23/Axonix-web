import manifest from "@/data/imageManifest.json";

const COMPANY_NAMES = {
  openai: "OpenAI",
  google: "Google",
  anthropic: "Anthropic",
  microsoft: "Microsoft",
  nvidia: "NVIDIA",
  meta: "Meta",
  mistral: "Mistral AI",
  huggingface: "Hugging Face",
  apple: "Apple",
};

const CATEGORIES = ["hardware", "software", "research", "enterprise", "network", "general"];

export function resolveStoryVisual(story) {
  if (story.img_url) {
    return { type: "photo", src: story.img_url, credit: null };
  }

  if (story.company_slug && COMPANY_NAMES[story.company_slug]) {
    return {
      type: "monogram",
      variant: "company",
      letter: COMPANY_NAMES[story.company_slug][0],
    };
  }

  const category = CATEGORIES.includes(story.image_category)
    ? story.image_category
    : "general";
  const files = manifest[category]?.length ? manifest[category] : manifest.general;

  if (files && files.length > 0) {
    const index = story.id % files.length;
    return {
      type: "photo",
      src: `/tech-photos/${category}/${files[index]}`,
      credit: "Pexels",
    };
  }

  if (story.source) {
    return {
      type: "monogram",
      variant: "generic",
      letter: story.source[0].toUpperCase(),
    };
  }

  return { type: "none" };
}

export function handlePhotoError(e, story) {
  if (!e.target.dataset.fallback) {
    e.target.dataset.fallback = "true";
    const files = manifest.general;
    if (files && files.length > 0) {
      const index = story.id % files.length;
      e.target.src = `/tech-photos/general/${files[index]}`;
      return;
    }
  }
  e.target.style.display = "none";
}