"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ items }) {
  const pathname = usePathname();

  return (
    <aside className="w-52 shrink-0 border-r bg-gray-50 flex flex-col">
      <div className="px-5 py-5 border-b">
        <p className="text-sm font-semibold">Avonzi Admin</p>
      </div>
      <nav className="flex-1 flex flex-col gap-0.5 px-3 py-4">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3 py-2 rounded-md text-sm transition ${
              pathname === item.href
                ? "bg-gray-200 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}