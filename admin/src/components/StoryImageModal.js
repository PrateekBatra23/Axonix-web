"use client";

import { useEffect, useState } from "react";

export default function StoryImageModal({ story, currentImageId, onClose, onUpdated }) {
  const [images, setImages] = useState(null);
  const [selectedId, setSelectedId] = useState(currentImageId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/images")
      .then((res) => res.json())
      .then(setImages)
      .catch(() => setError("Failed to load images."));
  }, []);

  const selectedImage = images?.find((i) => i.id === Number(selectedId));

  async function handleUpdate() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/stories/${story.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_id: selectedId === "" ? null : Number(selectedId) }),
      });
      if (!res.ok) {
        setError("Failed to update story.");
        return;
      }
      onUpdated(selectedId === "" ? null : Number(selectedId));
      onClose();
    } catch {
      setError("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-xl shadow-2xl w-full max-w-md p-6">
        <h2 className="text-sm font-semibold mb-1">Change story image</h2>
        <p className="text-xs text-gray-500 mb-4 truncate">{story.headline}</p>

        <div className="mb-4">
          <div className="w-full aspect-video rounded-lg overflow-hidden bg-gray-100 border">
            {selectedImage ? (
              <img src={selectedImage.url} alt="" className="w-full h-full object-cover" />
            ) : selectedId === "" ? (
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                No image
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                Loading preview…
              </div>
            )}
          </div>
        </div>

        <label className="text-xs text-gray-500 block mb-1.5">Image</label>
        <select
          value={selectedId ?? ""}
          onChange={(e) => setSelectedId(e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-sm mb-4 bg-white"
        >
          <option value="">— No image —</option>
          {images?.map((img) => (
            <option key={img.id} value={img.id}>
              #{img.id} — {img.url.split("/").pop()}
            </option>
          ))}
        </select>

        {error && <p className="text-xs text-red-600 mb-3">{error}</p>}

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="text-sm text-gray-600 hover:underline"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={saving}
            className="text-sm bg-gray-900 text-white rounded-md px-4 py-2 hover:bg-gray-800 transition disabled:opacity-50"
          >
            {saving ? "Updating…" : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}