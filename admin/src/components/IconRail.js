"use client";

export const NAV_GROUPS = [
  {
    key: "home",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 11l9-8 9 8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 10v10h14V10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    items: [{ href: "/", label: "Home" }],
  },
  {
    key: "pipeline",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 12h4l2-7 4 14 2-7h6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    items: [
      { href: "/pipeline-runs", label: "Scrape Runs" },
      { href: "/content-stats", label: "Content Stats" },
      { href: "/run-pipeline", label: "Run Pipeline" },
    ],
  },
  {
    key: "moderation",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M5 3v18" strokeLinecap="round" />
        <path d="M5 4h13l-3 4 3 4H5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    items: [{ href: "/flags", label: "Flagged Jobs" }],
  },
  {
    key: "content",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5-11 11" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    items: [
      { href: "/companies", label: "Companies" },
      { href: "/image-categories", label: "Image Categories" },
      { href: "/images", label: "Images" },
    ],
  },
  {
    key: "settings",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
    items: [{ href: "/settings", label: "Settings" }],
  },
];

export const USERS_GROUP = {
  key: "access",
  icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" strokeLinecap="round" />
    </svg>
  ),
  items: [{ href: "/users", label: "Users" }],
};

export default function IconRail({ groups, selectedKey, onSelect, user, onLogout }) {
  return (
    <div className="w-14 shrink-0 border-r bg-gray-900 flex flex-col items-center py-4">
      <div className="flex-1 flex flex-col gap-2">
        {groups.map((group) => (
          <button
            key={group.key}
            onClick={() => onSelect(group.key)}
            className={`w-10 h-10 flex items-center justify-center rounded-md transition ${
              selectedKey === group.key
                ? "bg-white text-gray-900"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
            title={group.items[0].label}
          >
            {group.icon}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center gap-2 pt-4 border-t border-gray-800 w-full">
        <div
          className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-mono text-white"
          title={`${user?.email} (${user?.role})`}
        >
          {user?.email?.[0]?.toUpperCase() ?? "?"}
        </div>
        <button
          onClick={onLogout}
          title="Log out"
          className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 17l5-5-5-5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}