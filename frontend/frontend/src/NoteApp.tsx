import { useState, useEffect } from "react";
import axios from "axios";
import type {Note} from './types'
import { NoteEditor } from "./NoteEditor";
import { NoteList } from "./NoteList";


const API = "http://127.0.0.1:8000/api/notes/";


export const NoteApp = () => {

    const [notes, setNotes] = useState<Note[]>([]);
    const [editing, setEditing] = useState<Note | null>(null);
    const [showEditor, setShowEditor] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    // Fetch all notes from Django backend
    const fetchNotes = async () => {
        try {
        setLoading(true);
        const res = await axios.get(API);
        setNotes(res.data);
        setError(null);
        } catch (err) {
        console.error("Error fetching notes:", err);
        setError("Failed to load notes.");
        } finally {
        setLoading(false);
        }
    };


    useEffect(() => {
        fetchNotes();
    },[]);

    // Create or update a note
    const handleSave = async (payload: Partial<Note>) => {
        try {
        if (editing?.id) {
            await axios.put(`${API}${editing.id}/`, payload);
        } else {  
            await axios.post(API, payload);
        }
        setShowEditor(false);
        setEditing(null);
        fetchNotes();
        } catch (err) {
        console.error("Error saving note:", err);
        alert("Could not save note.");
        }
    };


    // Delete note
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this note?")) return;
    try {
      await axios.delete(`${API}${id}/`);
      fetchNotes();
    } catch (err) {
      console.error("Error deleting note:", err);
      alert("Could not delete note.");
    }
  };


    return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">	
        <h1 className="text-3xl font-bold text-green-900">Notes</h1>
        <button
          type="button"
          className="bg-green-700 hover:bg-green-900 text-white px-4 py-2 rounded-lg shadow"
          onClick={() => {
            setEditing(null); 
            setShowEditor(true);
          }}
        >
          New Note
        </button>
      </div>

      {/* Error & Loading states */}
      {loading && <p className="text-green-900">Loading notes...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Main content: Notes list + Editor */}
      <div className="flex gap-6 flex-1">
        {/* Notes List (Always Visible) */}
        <div className="flex-1 bg-white p-4 rounded-lg shadow overflow-auto">
          <NoteList
            notes={notes}
            onEdit={(note) => {
              setEditing(note);
              setShowEditor(true);
            }}
            onDelete={handleDelete}
          />
        </div>

        {/* Note Editor (Slides in, doesn’t replace the page) */}
        <div
          className={`transition-all duration-300 ${
            showEditor ? "w-1/2 opacity-100" : "w-0 opacity-0 overflow-hidden"
          }`}
        >
          {showEditor && (
            <div className="bg-white p-4 rounded-lg shadow h-full">
              <NoteEditor
                note={editing}
                onSave={handleSave}
                onCancel={() => {
                  setShowEditor(false);
                  setEditing(null);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );

};