"use client";

import { useEffect, useState } from "react";
import { useCurrentUser } from "@/context/UserContext";

const ROLES = ["owner", "admin", "read_only"];

export default function UsersPage() {
  const user = useCurrentUser();
  const isOwner = user?.role === "owner";

  const [users, setUsers] = useState(null);
  const [error, setError] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("read_only");
  const [actionError, setActionError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editRole, setEditRole] = useState("");
  const [editActive, setEditActive] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  function loadUsers() {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then(setUsers)
      .catch(() => setError(true));
  }

  async function handleCreate() {
    setActionError("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail, password: newPassword, role: newRole }),
      });
      if (!res.ok) {
        setActionError(res.status === 409 ? "A user with this email already exists." : "Failed to create user.");
        return;
      }
      setNewEmail("");
      setNewPassword("");
      setNewRole("read_only");
      setCreating(false);
      loadUsers();
    } catch {
      setActionError("Something went wrong.");
    }
  }

  function startEdit(u) {
    setEditingId(u.id);
    setEditRole(u.role);
    setEditActive(u.is_active);
    setActionError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setActionError("");
  }

  async function saveEdit(id) {
    setActionError("");
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: editRole, is_active: editActive }),
      });
      if (!res.ok) {
        setActionError("Failed to update user.");
        return;
      }
      const updated = await res.json();
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
      setEditingId(null);
    } catch {
      setActionError("Something went wrong.");
    }
  }

  if (!isOwner) {
    return <p className="text-sm text-gray-500">Only owners can access user management.</p>;
  }

  if (error) return <p className="text-sm text-gray-500">Failed to load users.</p>;
  if (!users) return <p className="text-sm text-gray-500">Loading…</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Users</h1>
          <p className="text-sm text-gray-500 mt-1">{users.length} total</p>
        </div>
        <button
          onClick={() => { setCreating(!creating); setActionError(""); }}
          className="text-sm border rounded-md px-4 py-2 hover:bg-gray-50 transition"
        >
          {creating ? "Cancel" : "+ New User"}
        </button>
      </div>

      {creating && (
        <div className="border rounded-lg p-5 mb-6 bg-gray-50">
          <div className="grid grid-cols-3 gap-3 mb-4">
            <input
              placeholder="Email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            />
            <input
              placeholder="Temporary password"
              type="text"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            />
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleCreate}
            disabled={!newEmail || !newPassword}
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
              <th className="px-4 py-2.5 font-medium">Email</th>
              <th className="px-4 py-2.5 font-medium">Role</th>
              <th className="px-4 py-2.5 font-medium">Active</th>
              <th className="px-4 py-2.5 font-medium">Last Login</th>
              <th className="px-4 py-2.5 font-medium">Created</th>
              <th className="px-4 py-2.5 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const isEditing = editingId === u.id;
              return (
                <tr key={u.id} className="border-b last:border-0">
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <select
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                        className="border rounded-md px-2 py-1 text-xs"
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded-full">{u.role}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input
                        type="checkbox"
                        checked={editActive}
                        onChange={(e) => setEditActive(e.target.checked)}
                      />
                    ) : (
                      <span className={`inline-block w-2 h-2 rounded-full ${u.is_active ? "bg-green-500" : "bg-gray-300"}`} />
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {u.last_login_at ? new Date(u.last_login_at).toLocaleString() : "Never"}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {isEditing ? (
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => saveEdit(u.id)} className="text-xs text-blue-600 hover:underline">
                          Save
                        </button>
                        <button onClick={cancelEdit} className="text-xs text-gray-500 hover:underline">
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => startEdit(u)} className="text-xs text-blue-600 hover:underline">
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}