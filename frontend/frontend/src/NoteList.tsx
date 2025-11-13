import type { Note } from "./types";

interface Props {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (id: number) => void;
}

export const NoteList = ({ notes, onEdit, onDelete }: Props) => {
  if (notes.length === 0) {
    return <p className="text-green-900">No notes yet. Create a new one!</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {notes.map((note) => (
        <div
          key={note.id}
          className="flex justify-between items-start w-full max-w-full p-4 bg-white rounded shadow"
        >
          {/* LEFT SIDE — text area */}
          <div className="flex-1 flex flex-col gap-1 text-left min-w-0">
            <h3 className="text-lg font-semibold text-green-900 break-words">
              {note.title}
            </h3>
            <p className="text-gray-600 mt-1 whitespace-pre-wrap break-words">
              {note.content}
            </p>
          </div>

          {/* RIGHT SIDE — buttons */}
          <div className="flex flex-col gap-2 flex-shrink-0 ml-4">
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full shadow"
              onClick={() => onEdit(note)}
            >
              Edit
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full shadow"
              onClick={() => onDelete(note.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
