export default function PageLoading() {
  return (
    <div className="max-w-3xl mx-auto px-8 py-24 flex flex-col items-center justify-center">
      <div className="w-6 h-6 border-2 border-border border-t-accent rounded-full animate-spin mb-4" />
      <p className="text-xs font-mono text-faint">Loading…</p>
    </div>
  );
}