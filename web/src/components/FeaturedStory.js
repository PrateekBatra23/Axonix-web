"use client";

const FALLBACK_THEMES = [
  { banner: "#1c3a3a", text: "#d4e8e4", box: "#2d5654" },
  { banner: "#3a2f1c", text: "#e8dcc4", box: "#5a4a2d" },
  { banner: "#2a1c3a", text: "#ddd0e8", box: "#4a3457" },
  { banner: "#1c2a3a", text: "#d0dde8", box: "#345477" },
  { banner: "#3a1c24", text: "#e8d0d4", box: "#5a2d38" },
  { banner: "#243a1c", text: "#dae8d0", box: "#3d5a2d" },
];

function pickTheme(id) {
  return FALLBACK_THEMES[id % FALLBACK_THEMES.length];
}

export default function FeaturedStory({ story }) {
  if (!story) return null;

  const fallback = pickTheme(story.id);

  const bg = story.theme_bg || fallback.banner;
  const text = story.theme_text || fallback.text;
  const badgeBg = text;
  const badgeText = bg;
  const imageBoxColor = story.theme_bg ? fallback.box : fallback.box;

  const letter = (story.company || story.source || "?")[0].toUpperCase();

  return (
    <div style={{ background: bg }}>
      <div className="max-w-7xl mx-auto px-6 py-11">
        <a
          href={`/stories/${story.slug}`}
          className="grid grid-cols-1 sm:grid-cols-[280px_1fr] gap-7 items-start hover:opacity-90 transition"
        >
          {story.image_url ? (
            <img
              src={story.image_url}
              alt=""
              loading="lazy"
              className="w-full aspect-[4/3] object-cover rounded-lg"
              onError={(e) => { e.target.style.display = "none"; }}
            />
          ) : (
            <div
              className="w-full aspect-[4/3] rounded-lg flex items-center justify-center"
              style={{ background: imageBoxColor }}
            >
              <span className="text-6xl font-mono font-bold" style={{ color: text }}>
                {letter}
              </span>
            </div>
          )}

          <div>
            <span
              className="inline-block text-[10px] font-mono font-semibold tracking-wide px-2.5 py-1 rounded mb-3"
              style={{ background: badgeBg, color: badgeText }}
            >
              FEATURED
            </span>
            <h2 className="text-xl font-semibold mb-2.5 leading-snug" style={{ color: text }}>
              {story.headline}
            </h2>
            <p className="text-sm leading-relaxed mb-2.5 max-w-2xl opacity-80" style={{ color: text }}>
              {story.summary}
            </p>
            <p className="text-xs font-mono opacity-60" style={{ color: text }}>
              {story.source}
            </p>
          </div>
        </a>
      </div>
    </div>
  );
}