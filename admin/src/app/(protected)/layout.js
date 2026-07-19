"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import IconRail, { NAV_GROUPS, USERS_GROUP } from "@/components/IconRail";
import Sidebar from "@/components/Sidebar";
import AdminHeader from "@/components/AdminHeader";

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState("checking");
  const [user, setUser] = useState(null);
  const [selectedKey, setSelectedKey] = useState("home");

  const groups = user?.role === "owner" ? [...NAV_GROUPS, USERS_GROUP] : NAV_GROUPS;

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) throw new Error("not authenticated");
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setStatus("ready");
      })
      .catch(() => {
        router.push("/login");
      });
  }, [pathname, router]);

  useEffect(() => {
    const match = groups.find((g) => g.items.some((item) => item.href === pathname));
    if (match) setSelectedKey(match.key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  async function handleLogout() {
    await fetch("/api/auth/session", { method: "DELETE" });
    router.push("/login");
  }

  if (status === "checking") {
    return <div className="py-24 text-center text-sm text-gray-500">Checking session…</div>;
  }

  const selectedGroup = groups.find((g) => g.key === selectedKey) ?? groups[0];

 return (
  <div className="flex min-h-screen">
    <IconRail
      groups={groups}
      selectedKey={selectedKey}
      onSelect={setSelectedKey}
      user={user}
      onLogout={handleLogout}
    />
    <div className="flex-1 flex flex-col">
      <AdminHeader user={user} />
      <div className="flex flex-1">
        <Sidebar items={selectedGroup.items} />
        <main className="flex-1 px-8 py-10 overflow-x-auto">
          {children}
        </main>
      </div>
    </div>
  </div>
);
}