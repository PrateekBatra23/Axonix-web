"use client";

import { useEffect, useState } from "react";
import { useCurrentUser } from "@/context/UserContext";
import StoryImageModal from "@/components/StoryImageModal";

export default function ImagesPage() {
  const user = useCurrentUser();
  const canWrite = user?.role === "owner" || user?.role === "admin";

  const [images, setImages] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(false);
  const [filterCompany, setFilterCompany] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [creating, setCreating] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newCompanyId, setNewCompanyId] = useState("");
  const [newCategoryId, setNewCategoryId] = useState("");
  const [actionError, setActionError] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [storiesFor, setStoriesFor] = useState(null);
  const [storiesData, setStoriesData] = useState({});
  const [modalStory, setModalStory] = useState(null);
  const [removeConfirmId, setRemoveConfirmId] = useState(null);

  useEffect(() => {
    fetch("/api/admin/companies").then((res) => res.json()).then(setCompanies).catch(() => {});
    fetch("/api/admin/image-categories").then((res) => res.json()).then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    loadImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterCompany, filterCategory]);

  function loadImages() {
    const params = new URLSearchParams();
    if (filterCompany) params.set("company_id", filterCompany);
    if (filterCategory) params.set("image_category_id", filterCategory);
    fetch(`/api/admin/images?${params}`)
      .then((res) => res.json())
      .then(setImages)
      .catch(() => setError(true));
  }

  function companyName(id) {
    return companies.find((c) => c.id === id)?.name || `#${id}`;
  }

  function categoryLabel(id) {
    return categories.find((c) => c.id === id)?.label || `#${id}`;
  }

  async function handleCreate() {
    setActionError("");
    try {
      const res = await fetch("/api/admin/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: newUrl,
          company_id: Number(newCompanyId),
          image_category_id: Number(newCategoryId),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setActionError(data.detail || "Failed to create.");
        return;
      }
      setNewUrl("");
      setNewCompanyId("");
      setNewCategoryId("");
      setCreating(false);
      loadImages();
    } catch {
      setActionError("Something went wrong.");
    }
  }

  async function handleDelete(id) {
    setActionError("");
    try {
      const res = await fetch(`/api/admin/images/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setActionError(data.detail || "Failed to delete.");
        setDeleteConfirmId(null);
        return;
      }
      setImages((prev) => prev.filter((img) => img.id !== id));
      setDeleteConfirmId(null);
    } catch {
      setActionError("Something went wrong.");
    }
  }

  function startEdit(img) {
    setEditingId(img.id);
    setEditForm({ company_id: img.company_id, image_category_id: img.image_category_id, url: img.url });
    setActionError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setActionError("");
  }

  async function saveEdit(id) {
    setActionError("");
    try {
      const res = await fetch(`/api/admin/images/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_id: Number(editForm.company_id),
          image_category_id: Number(editForm.image_category_id),
          url: editForm.url,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setActionError(data.detail || "Failed to save.");
        return;
      }
      const updated = await res.json();
      setImages((prev) => prev.map((img) => (img.id === id ? updated : img)));
      setEditingId(null);
    } catch {
      setActionError("Something went wrong.");
    }
  }

  async function toggleStories(imageId) {
    if (storiesFor === imageId) {
      setStoriesFor(null);
      return;
    }
    setStoriesFor(imageId);
    if (!storiesData[imageId]) {
      try {
        const res = await fetch(`/api/admin/images/${imageId}/stories`);
        const data = await res.json();
        setStoriesData((prev) => ({ ...prev, [imageId]: data }));
      } catch {
        setStoriesData((prev) => ({ ...prev, [imageId]: [] }));
      }
    }
  }

  async function clearStoryImage(storyId, imageId) {
    try {
      const res = await fetch(`/api/admin/stories/${storyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_id: null }),
      });
      if (!res.ok) {
        setActionError("Failed to remove image from story.");
        return;
      }
      setImages((prev) =>
        prev.map((i) => (i.id === imageId ? { ...i, usage_count: Math.max(0, i.usage_count - 1) } : i))
      );
      setStoriesData((prev) => ({
        ...prev,
        [imageId]: prev[imageId].filter((s) => s.id !== storyId),
      }));
    } catch {
      setActionError("Something went wrong.");
    }
  }

  if (error) return <p className="text-sm text-gray-500">Failed to load images.</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Images</h1>
          <p className="text-sm text-gray-500 mt-1">{images ? images.length : "—"} total</p>
        </div>
        {canWrite && (
          <button
            onClick={() => { setCreating(!creating); setActionError(""); }}
            className="text-sm border rounded-md px-4 py-2 hover:bg-gray-50 transition"
          >
            {creating ? "Cancel" : "+ New Image"}
          </button>
        )}
      </div>

      <div className="flex gap-3 mb-6">
        <select
          value={filterCompany}
          onChange={(e) => setFilterCompany(e.target.value)}
          className="text-xs border rounded-md px-3 py-1.5"
        >
          <option value="">All companies</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="text-xs border rounded-md px-3 py-1.5"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
      </div>

      {creating && (
        <div className="border rounded-lg p-5 mb-6 bg-gray-50">
          <div className="mb-3">
            <label className="text-xs text-gray-500 block mb-1">Image URL</label>
            <input
              placeholder="https://..."
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm w-full"
            />
          </div>
          <div className="flex gap-3 mb-4">
            <select
              value={newCompanyId}
              onChange={(e) => setNewCompanyId(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm flex-1"
            >
              <option value="">Select company…</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <select
              value={newCategoryId}
              onChange={(e) => setNewCategoryId(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm flex-1"
            >
              <option value="">Select category…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleCreate}
            disabled={!newUrl || !newCompanyId || !newCategoryId}
            className="text-sm bg-gray-900 text-white rounded-md px-4 py-2 hover:bg-gray-800 transition disabled:opacity-50"
          >
            Create
          </button>
        </div>
      )}

      {actionError && <p className="text-xs text-red-600 mb-4">{actionError}</p>}

      {!images ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : images.length === 0 ? (
        <p className="text-sm text-gray-500 py-12 text-center">No images match these filters.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {images.map((img) => {
            const isEditing = editingId === img.id;
            const showStories = storiesFor === img.id;
            const stories = storiesData[img.id];

            return (
              <div key={img.id} className="border rounded-lg overflow-hidden">
                <img src={img.url} alt="" className="w-full aspect-video object-cover bg-gray-100" />
                <div className="p-3">
                  {isEditing ? (
                    <div className="flex flex-col gap-2 mb-2">
                      <select
                        value={editForm.company_id}
                        onChange={(e) => setEditForm({ ...editForm, company_id: e.target.value })}
                        className="border rounded-md px-2 py-1 text-xs"
                      >
                        {companies.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                      <select
                        value={editForm.image_category_id}
                        onChange={(e) => setEditForm({ ...editForm, image_category_id: e.target.value })}
                        className="border rounded-md px-2 py-1 text-xs"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <>
                      <p className="text-xs font-medium truncate">{companyName(img.company_id)}</p>
                      <p className="text-xs text-gray-500 mb-1.5">{categoryLabel(img.image_category_id)}</p>
                    </>
                  )}

                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                        img.usage_count > 0 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {img.usage_count > 0 ? `used by ${img.usage_count}` : "unused"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    {isEditing ? (
                      <>
                        <button onClick={() => saveEdit(img.id)} className="text-xs text-blue-600 hover:underline">
                          Save
                        </button>
                        <button onClick={cancelEdit} className="text-xs text-gray-500 hover:underline">
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        {canWrite && (
                          <button onClick={() => startEdit(img)} className="text-xs text-blue-600 hover:underline">
                            Edit
                          </button>
                        )}
                        <button onClick={() => toggleStories(img.id)} className="text-xs text-gray-600 hover:underline">
                          {showStories ? "Hide stories" : "View stories"}
                        </button>
                        {canWrite && (
                          deleteConfirmId === img.id ? (
                            <div className="flex items-center gap-2">
                              <button onClick={() => handleDelete(img.id)} className="text-xs text-red-600 font-medium hover:underline">
                                Confirm
                              </button>
                              <button onClick={() => setDeleteConfirmId(null)} className="text-xs text-gray-500 hover:underline">
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => setDeleteConfirmId(img.id)} className="text-xs text-red-600 hover:underline">
                              Delete
                            </button>
                          )
                        )}
                      </>
                    )}
                  </div>

                  {showStories && (
                    <div className="mt-3 pt-3 border-t">
                      {!stories ? (
                        <p className="text-xs text-gray-500">Loading…</p>
                      ) : stories.length === 0 ? (
                        <p className="text-xs text-gray-500">Not used by any stories.</p>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {stories.map((s) => (
                            <div key={s.id} className="flex items-center justify-between gap-2">
                                <a
                                href={`https://avonzi.prateekbatra.dev/stories/${s.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:underline truncate flex-1"
                                >
                                {s.headline}
                                </a>
                                {canWrite && (
                                <div className="flex items-center gap-2 shrink-0">
                                    {removeConfirmId === s.id ? (
                                    <>
                                        <span className="text-xs text-red-600">Remove?</span>
                                        <button
                                        onClick={() => { clearStoryImage(s.id, img.id); setRemoveConfirmId(null); }}
                                        className="text-xs text-red-600 font-medium hover:underline"
                                        >
                                        Confirm
                                        </button>
                                        <button
                                        onClick={() => setRemoveConfirmId(null)}
                                        className="text-xs text-gray-500 hover:underline"
                                        >
                                        Cancel
                                        </button>
                                    </>
                                    ) : (
                                    <>
                                        <button
                                        onClick={() => setModalStory({ story: s, imageId: img.id })}
                                        className="text-xs text-gray-600 hover:underline"
                                        >
                                        Edit
                                        </button>
                                        <button
                                        onClick={() => setRemoveConfirmId(s.id)}
                                        className="text-xs text-red-600 hover:underline"
                                        >
                                        Remove
                                        </button>
                                    </>
                                    )}
                                </div>
                                )}
                            </div>
                            ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalStory && (
        <StoryImageModal
          story={modalStory.story}
          currentImageId={modalStory.imageId}
          onClose={() => setModalStory(null)}
          onUpdated={(newImageId) => {
            const oldImageId = modalStory.imageId;
            if (newImageId !== oldImageId) {
              setImages((prev) =>
                prev.map((i) => {
                  if (i.id === oldImageId) return { ...i, usage_count: Math.max(0, i.usage_count - 1) };
                  if (i.id === newImageId) return { ...i, usage_count: (i.usage_count || 0) + 1 };
                  return i;
                })
              );
              setStoriesData((prev) => ({
                ...prev,
                [oldImageId]: prev[oldImageId]?.filter((s) => s.id !== modalStory.story.id) ?? [],
                [newImageId]: undefined,
              }));
            }
          }}
        />
      )}
    </div>
  );
}