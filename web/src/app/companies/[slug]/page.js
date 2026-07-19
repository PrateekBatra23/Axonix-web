import { notFound } from "next/navigation";
import StorySection from "@/components/StorySection";

async function getCompany(slug) {
  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/v1/companies/${slug}`,
    { cache: "no-store" }
  );
  if (!res.ok) return null;
  return res.json();
}

async function getStoriesByCompany(slug) {
  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/v1/stories?company=${slug}`,
    { cache: "no-store" }
  );
  if (!res.ok) return [];
  return res.json();
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const company = await getCompany(slug);
  if (!company) return { title: "Company not found" };
  return {
    title: company.name,
    description: `Recent AI developments from ${company.name}.`,
  };
}

export default async function CompanyPage({ params }) {
  const { slug } = await params;
  const company = await getCompany(slug);

  if (!company) notFound();

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

      <div className="mb-9 flex items-center gap-4">
        <span
          className="w-10 h-10 flex items-center justify-center text-base font-mono font-bold rounded-sm shrink-0"
          style={{ background: company.theme_bg, color: company.theme_text }}
        >
          {company.name[0]}
        </span>
        <div>
          <h1 className="text-2xl font-semibold mb-1">{company.name}</h1>
          <p className="text-sm text-muted">
            {stories.length} recent {stories.length === 1 ? "story" : "stories"}
          </p>
        </div>
      </div>

      <StorySection stories={stories} />

      {stories.length === 0 && (
        <p className="text-sm text-muted py-12 text-center">
          No stories from {company.name} yet.
        </p>
      )}
    </main>
  );
}