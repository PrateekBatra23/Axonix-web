"use client";

import { useEffect, useState } from "react";
import { useCurrentUser } from "@/context/UserContext";

export default function ImageCategoriesPage() {
  const user = useCurrentUser();
  const canWrite = user?.role === "owner" || user?.role === "admin";

  const [categories, setCategories] = useState(null);
  const [error, setError] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [actionError, setActionError] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  function loadCategories() {
    fetch("/api/admin/image-categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch(() => setError(true));
  }

  async function handleCreate() {
    setActionError("");
    try {
      const res = await fetch("/api/admin/image-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: newKey, label: newLabel }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setActionError(data.detail || "Failed to create.");
        return;
      }
      setNewKey("");
      setNewLabel("");
      setCreating(false);
      loadCategories();
    } catch {
      setActionError("Something went wrong.");
    }
  }

  async function handleDelete(id) {
    setActionError("");
    try {
      const res = await fetch(`/api/admin/image-categories/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setActionError(
          res.status === 400
            ? "This category still has images assigned — reassign or delete those first."
            : data.detail || "Failed to delete."
        );
        setDeleteConfirmId(null);
        return;
      }
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setDeleteConfirmId(null);
    } catch {
      setActionError("Something went wrong.");
    }
  }

  if (error) return <p className="text-sm text-gray-500">Failed to load image categories.</p>;
  if (!categories) return <p className="text-sm text-gray-500">Loading…</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Image Categories</h1>
          <p className="text-sm text-gray-500 mt-1">{categories.length} total</p>
        </div>
        {canWrite && (
          <button
            onClick={() => { setCreating(!creating); setActionError(""); }}
            className="text-sm border rounded-md px-4 py-2 hover:bg-gray-50 transition"
          >
            {creating ? "Cancel" : "+ New Category"}
          </button>
        )}
      </div>

      {creating && (
        <div className="border rounded-lg p-5 mb-6 bg-gray-50 flex gap-3 items-end">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Key</label>
            <input
              placeholder="hardware"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Label</label>
            <input
              placeholder="Hardware"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            />
          </div>
          <button
            onClick={handleCreate}
            disabled={!newKey || !newLabel}
            className="text-sm bg-gray-900 text-white rounded-md px-4 py-2 hover:bg-gray-800 transition disabled:opacity-50"
          >
            Create
          </button>
        </div>
      )}

      {actionError && <p className="text-xs text-red-600 mb-4">{actionError}</p>}

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr className="text-left text-xs text-gray-500">
              <th className="px-4 py-2.5 font-medium">Key</th>
              <th className="px-4 py-2.5 font-medium">Label</th>
              {canWrite && <th className="px-4 py-2.5 font-medium"></th>}
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b last:border-0">
                <td className="px-4 py-3 font-mono text-xs">{cat.key}</td>
                <td className="px-4 py-3">{cat.label}</td>
                {canWrite && (
                  <td className="px-4 py-3 text-right">
                    {deleteConfirmId === cat.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-xs text-red-600">Delete?</span>
                        <button onClick={() => handleDelete(cat.id)} className="text-xs text-red-600 font-medium hover:underline">
                          Confirm
                        </button>
                        <button onClick={() => setDeleteConfirmId(null)} className="text-xs text-gray-500 hover:underline">
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteConfirmId(cat.id)} className="text-xs text-red-600 hover:underline">
                        Delete
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}