import DigestsList from "@/components/DigestsList";

async function getInitialDigests() {
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/v1/digests?limit=30`, {
    cache: "no-store",
  });
  if (!res.ok) return { digests: [], total: 0, has_more: false };
  return res.json();
}

export const metadata = {
  title: "Digests",
  description: "Every daily AI digest, archived and searchable.",
};

export default async function DigestsPage() {
  const initial = await getInitialDigests();

  return (
    <main className="max-w-3xl mx-auto px-8 py-12">
      <div className="mb-9">
        <h1 className="text-2xl font-semibold mb-2">Digests</h1>
        <p className="text-sm text-muted">
          Every daily briefing, archived and searchable.
        </p>
      </div>

      <DigestsList
        initialDigests={initial.digests}
        initialTotal={initial.total}
        initialHasMore={initial.has_more}
      />
    </main>
  );
}