const BASE_URL = "https://avonzi.prateekbatra.dev";
async function getDigests() {
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/v1/digests`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

async function getStories() {
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/v1/stories`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

const COMPANY_SLUGS = [
  "openai", "google", "anthropic", "microsoft",
  "nvidia", "meta", "mistral", "huggingface", "apple",
];

export default async function sitemap() {
  const digests = await getDigests();
  const stories = await getStories();

  const topicSet = new Set();
  for (const story of stories) {
    story.topic_tags.split(",").forEach((tag) => {
      const trimmed = tag.trim();
      if (trimmed) topicSet.add(trimmed);
    });
  }

  const staticRoutes = [
    { url: `${BASE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/digests`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/topics`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/companies`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/jobs`, changeFrequency: "weekly", priority: 0.5 },
  ];

  const digestRoutes = digests.map((digest) => ({
    url: `${BASE_URL}/digests/${digest.slug}`,
    lastModified: digest.publish_date,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const storyRoutes = stories.map((story) => ({
    url: `${BASE_URL}/stories/${story.slug}`,
    lastModified: story.published_date,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const topicRoutes = Array.from(topicSet).map((tag) => ({
    url: `${BASE_URL}/topics/${tag}`,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  const companyRoutes = COMPANY_SLUGS.map((slug) => ({
    url: `${BASE_URL}/companies/${slug}`,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [
    ...staticRoutes,
    ...digestRoutes,
    ...storyRoutes,
    ...topicRoutes,
    ...companyRoutes,
  ];
}