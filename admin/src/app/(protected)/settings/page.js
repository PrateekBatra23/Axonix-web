"use client";

import { useEffect, useState } from "react";
import { useCurrentUser } from "@/context/UserContext";
export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [error, setError] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const user = useCurrentUser();
  const canEdit = user?.role === "owner" || user?.role === "admin";
  useEffect(() => {
    fetch("/api/admin/settings?category=threshold")
      .then((res) => res.json())
      .then(setSettings)
      .catch(() => setError(true));
  }, []);

  function startEdit(setting) {
    setEditingKey(setting.key);
    setEditValue(setting.value);
    setSaveError("");
  }

  function cancelEdit() {
    setEditingKey(null);
    setEditValue("");
    setSaveError("");
  }

  async function saveEdit(key) {
    setSaving(true);
    setSaveError("");
    try {
      const res = await fetch(`/api/admin/settings/${key}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: editValue }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 403) {
          setSaveError("You don't have permission to change settings.");
        } else {
          setSaveError(data.detail || "Failed to save.");
        }
        return;
      }
      const updated = await res.json();
      setSettings((prev) => prev.map((s) => (s.key === key ? updated : s)));
      setEditingKey(null);
    } catch {
      setSaveError("Something went wrong — try again.");
    } finally {
      setSaving(false);
    }
  }

  if (error) return <p className="text-sm text-gray-500">Failed to load settings.</p>;
  if (!settings) return <p className="text-sm text-gray-500">Loading…</p>;

  return (
    <div>
      <h1 className="text-xl font-semibold mb-2">Settings</h1>
      <p className="text-sm text-gray-500 mb-8">
        These thresholds directly drive the Home page's health status logic.
      </p>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr className="text-left text-xs text-gray-500">
              <th className="px-4 py-2.5 font-medium">Key</th>
              <th className="px-4 py-2.5 font-medium">Value</th>
              <th className="px-4 py-2.5 font-medium">Type</th>
              <th className="px-4 py-2.5 font-medium">Updated</th>
              <th className="px-4 py-2.5 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {settings.map((setting) => (
              <tr key={setting.id} className="border-b last:border-0">
                <td className="px-4 py-3 font-mono text-xs">{setting.key}</td>
                <td className="px-4 py-3">
                  {editingKey === setting.key ? (
                    <input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="border rounded-md px-2 py-1 text-sm w-24"
                    />
                  ) : (
                    <span className="font-mono">{setting.value}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">{setting.value_type}</td>
                <td className="px-4 py-3 text-xs text-gray-500">
                  {setting.updated_at ? new Date(setting.updated_at).toLocaleString() : "—"}
                </td>
                <td className="px-4 py-3 text-right">
                {editingKey === setting.key ? (
                    <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => saveEdit(setting.key)}
                        disabled={saving}
                        className="text-xs text-blue-600 hover:underline disabled:opacity-50"
                    >
                        {saving ? "Saving…" : "Save"}
                    </button>
                    <button
                        onClick={cancelEdit}
                        className="text-xs text-gray-500 hover:underline"
                    >
                        Cancel
                    </button>
                    </div>
                ) : canEdit ? (
                    <button
                    onClick={() => startEdit(setting)}
                    className="text-xs text-blue-600 hover:underline"
                    >
                    Edit
                    </button>
                ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {saveError && (
        <p className="text-xs text-red-600 mt-3">{saveError}</p>
      )}
    </div>
  );
}