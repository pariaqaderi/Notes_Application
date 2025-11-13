import { useState, useEffect } from "react";
import type { Note } from "./types";

interface Props {
  note: Note | null;
  onSave: (payload: Partial<Note>) => Promise<void>;
  onCancel: () => void;
}

export const NoteEditor = ({ note, onSave, onCancel }: Props) => {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTitle(note?.title || "");
    setContent(note?.content || "");
    setError(null);
  }, [note]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // prevents form double-submit or page reload
    if (!title.trim()) {
      setError("Title cannot be empty");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await onSave({
        id: note?.id,
        title: title.trim(),
        content: content.trim(),
      });
    } catch (err) {
      console.error("Save failed:", err);
      setError("Failed to save note");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-xl text-green-900 font-semibold">
        {note ? "Edit Note" : "New Note"}
      </h2>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="bg-green-100 rounded-xl px-3 py-2 w-full focus:outline-none focus:ring focus:ring-green-300"
      />

      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="bg-green-100 rounded-xl px-3 py-2 w-full h-48 focus:outline-none focus:ring focus:ring-green-300 resize-none"
      />

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className={`bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full shadow transition ${
            saving ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {saving ? "Saving..." : "Save"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-full shadow transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
