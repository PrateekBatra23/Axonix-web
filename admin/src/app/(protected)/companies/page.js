"use client";

import { useEffect, useState } from "react";
import { useCurrentUser } from "@/context/UserContext";

const emptyForm = {
  name: "",
  theme_bg: "",
  theme_text: "",
  tracked: true,
  exclusive: false,
  page_visible: false,
};

export default function CompaniesPage() {
  const user = useCurrentUser();
  const canWrite = user?.role === "owner" || user?.role === "admin";
  const isOwner = user?.role === "owner";

  const [companies, setCompanies] = useState(null);
  const [error, setError] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState(emptyForm);
  const [actionError, setActionError] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    loadCompanies();
  }, []);

  function loadCompanies() {
    fetch("/api/admin/companies")
      .then((res) => res.json())
      .then(setCompanies)
      .catch(() => setError(true));
  }

  function startEdit(company) {
    setEditingId(company.id);
    setEditForm({
      name: company.name,
      theme_bg: company.theme_bg || "",
      theme_text: company.theme_text || "",
      tracked: company.tracked,
      exclusive: company.exclusive,
      page_visible: company.page_visible,
    });
    setActionError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setActionError("");
  }

  async function saveEdit(id) {
    setActionError("");
    try {
      const res = await fetch(`/api/admin/companies/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setActionError(data.detail || "Failed to save.");
        return;
      }
      const updated = await res.json();
      setCompanies((prev) => prev.map((c) => (c.id === id ? updated : c)));
      setEditingId(null);
    } catch {
      setActionError("Something went wrong.");
    }
  }

  async function handleCreate() {
    setActionError("");
    try {
      const res = await fetch("/api/admin/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setActionError(res.status === 409 ? "A company with this name already exists." : (data.detail || "Failed to create."));
        return;
      }
      setCreateForm(emptyForm);
      setCreating(false);
      loadCompanies();
    } catch {
      setActionError("Something went wrong.");
    }
  }

  async function handleDelete(id) {
    setActionError("");
    try {
      const res = await fetch(`/api/admin/companies/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setActionError(data.detail || "Failed to delete.");
        setDeleteConfirmId(null);
        return;
      }
      setCompanies((prev) => prev.filter((c) => c.id !== id));
      setDeleteConfirmId(null);
    } catch {
      setActionError("Something went wrong.");
    }
  }

  if (error) return <p className="text-sm text-gray-500">Failed to load companies.</p>;
  if (!companies) return <p className="text-sm text-gray-500">Loading…</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Companies</h1>
          <p className="text-sm text-gray-500 mt-1">{companies.length} total</p>
        </div>
        {canWrite && (
          <button
            onClick={() => { setCreating(!creating); setActionError(""); }}
            className="text-sm border rounded-md px-4 py-2 hover:bg-gray-50 transition"
          >
            {creating ? "Cancel" : "+ New Company"}
          </button>
        )}
      </div>

      {creating && (
        <div className="border rounded-lg p-5 mb-6 bg-gray-50">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              placeholder="Name"
              value={createForm.name}
              onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
              className="border rounded-md px-3 py-2 text-sm"
            />
            <div className="flex gap-2">
              <input
                type="color"
                value={createForm.theme_bg || "#000000"}
                onChange={(e) => setCreateForm({ ...createForm, theme_bg: e.target.value })}
                className="w-10 h-10 border rounded-md"
              />
              <input
                type="color"
                value={createForm.theme_text || "#ffffff"}
                onChange={(e) => setCreateForm({ ...createForm, theme_text: e.target.value })}
                className="w-10 h-10 border rounded-md"
              />
            </div>
          </div>
          <div className="flex gap-5 mb-4 text-sm">
            <label className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={createForm.tracked}
                onChange={(e) => setCreateForm({ ...createForm, tracked: e.target.checked })}
              />
              Tracked
            </label>
            <label className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={createForm.exclusive}
                onChange={(e) => setCreateForm({ ...createForm, exclusive: e.target.checked })}
              />
              Exclusive
            </label>
            <label className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={createForm.page_visible}
                onChange={(e) => setCreateForm({ ...createForm, page_visible: e.target.checked })}
              />
              Page Visible
            </label>
          </div>
          <button
            onClick={handleCreate}
            disabled={!createForm.name}
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
              <th className="px-4 py-2.5 font-medium">Theme</th>
              <th className="px-4 py-2.5 font-medium">Name</th>
              <th className="px-4 py-2.5 font-medium">Slug</th>
              <th className="px-4 py-2.5 font-medium">Tracked</th>
              <th className="px-4 py-2.5 font-medium">Exclusive</th>
              <th className="px-4 py-2.5 font-medium">Page Visible</th>
              {canWrite && <th className="px-4 py-2.5 font-medium"></th>}
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => {
              const isEditing = editingId === company.id;
              return (
                <tr key={company.id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <div className="flex gap-1.5">
                        <input
                          type="color"
                          value={editForm.theme_bg || "#000000"}
                          onChange={(e) => setEditForm({ ...editForm, theme_bg: e.target.value })}
                          className="w-7 h-7 border rounded"
                        />
                        <input
                          type="color"
                          value={editForm.theme_text || "#ffffff"}
                          onChange={(e) => setEditForm({ ...editForm, theme_text: e.target.value })}
                          className="w-7 h-7 border rounded"
                        />
                      </div>
                    ) : (
                      <span
                        className="inline-flex items-center justify-center w-7 h-7 rounded text-xs font-mono font-bold"
                        style={{
                          background: company.theme_bg || "#e5e7eb",
                          color: company.theme_text || "#6b7280",
                        }}
                      >
                        {company.name[0]}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="border rounded-md px-2 py-1 text-sm w-32"
                      />
                    ) : (
                      company.name
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{company.slug}</td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input
                        type="checkbox"
                        checked={editForm.tracked}
                        onChange={(e) => setEditForm({ ...editForm, tracked: e.target.checked })}
                      />
                    ) : (
                      <StatusDot on={company.tracked} />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input
                        type="checkbox"
                        checked={editForm.exclusive}
                        onChange={(e) => setEditForm({ ...editForm, exclusive: e.target.checked })}
                      />
                    ) : (
                      <StatusDot on={company.exclusive} />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input
                        type="checkbox"
                        checked={editForm.page_visible}
                        onChange={(e) => setEditForm({ ...editForm, page_visible: e.target.checked })}
                      />
                    ) : (
                      <StatusDot on={company.page_visible} />
                    )}
                  </td>
                  {canWrite && (
                    <td className="px-4 py-3 text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => saveEdit(company.id)} className="text-xs text-blue-600 hover:underline">
                            Save
                          </button>
                          <button onClick={cancelEdit} className="text-xs text-gray-500 hover:underline">
                            Cancel
                          </button>
                        </div>
                      ) : deleteConfirmId === company.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs text-red-600">Delete?</span>
                          <button onClick={() => handleDelete(company.id)} className="text-xs text-red-600 font-medium hover:underline">
                            Confirm
                          </button>
                          <button onClick={() => setDeleteConfirmId(null)} className="text-xs text-gray-500 hover:underline">
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-3">
                          <button onClick={() => startEdit(company)} className="text-xs text-blue-600 hover:underline">
                            Edit
                          </button>
                          {isOwner && company.slug !== "untracked" && (
                            <button onClick={() => setDeleteConfirmId(company.id)} className="text-xs text-red-600 hover:underline">
                              Delete
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusDot({ on }) {
  return (
    <span className={`inline-block w-2 h-2 rounded-full ${on ? "bg-green-500" : "bg-gray-300"}`} />
  );
}