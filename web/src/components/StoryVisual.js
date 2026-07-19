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

export default function StoryVisual({ story, className, letterClassName = "text-lg" }) {
  if (story.image_url) {
    return (
      <img
        src={story.image_url}
        alt=""
        loading="lazy"
        className={className}
        onError={(e) => { e.target.style.display = "none"; }}
      />
    );
  }

  const fallback = pickTheme(story.id);
  const bg = fallback.box;
  const text = story.theme_text || fallback.text;
  const letter = (story.company || story.source || "?")[0].toUpperCase();

  return (
    <div className={`${className} flex items-center justify-center`} style={{ background: bg }}>
      <span className={`font-mono font-bold ${letterClassName}`} style={{ color: text }}>
        {letter}
      </span>
    </div>
  );
}