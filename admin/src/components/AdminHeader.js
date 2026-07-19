"use client";

import { useRouter } from "next/navigation";

export default function AdminHeader({ user }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/session", { method: "DELETE" });
    router.push("/login");
  }

  return (
    <header className="flex items-center justify-end gap-4 px-8 py-4 border-b text-xs">
      <span className="font-mono text-gray-500">
        {user?.email} · {user?.role}
      </span>
      <button
        onClick={handleLogout}
        className="text-gray-500 hover:text-black transition"
      >
        Log out
      </button>
    </header>
  );
}