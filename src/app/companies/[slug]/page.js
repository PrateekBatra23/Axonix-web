import StorySection from "@/components/StorySection";

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

async function getStoriesByCompany(slug) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/stories?company=${slug}`,
    { cache: "no-store" }
  );
  if (!res.ok) return [];
  return res.json();
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const name = COMPANY_NAMES[slug] ?? slug;
  return {
    title: name,
    description: `Recent AI developments from ${name}.`,
  };
}

export default async function CompanyPage({ params }) {
  const { slug } = await params;
  const name = COMPANY_NAMES[slug] ?? slug;
  const stories = (await getStoriesByCompany(slug)).sort((a, b) => b.id - a.id);

  return (
    <main className="max-w-6xl mx-auto px-8 py-12">
      <div className="flex items-center gap-2 text-xs font-mono mb-6">
        <a href="/companies" className="text-accent">
          companies
        </a>
        <span className="text-faint">/</span>
        <span className="text-muted">{slug}</span>
      </div>

      <div className="mb-9">
        <h1 className="text-2xl font-semibold mb-2">{name}</h1>
        <p className="text-sm text-muted">
          {stories.length} recent{" "}
          {stories.length === 1 ? "story" : "stories"}
        </p>
      </div>

      <StorySection stories={stories} />

      {stories.length === 0 && (
        <p className="text-sm text-muted py-12 text-center">
          No stories from {name} yet.
        </p>
      )}
    </main>
  );
}