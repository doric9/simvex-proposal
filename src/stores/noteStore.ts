import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Note } from '../types';

interface NoteStore {
  notes: Note[];
  addNote: (machineryId: string, content: string) => void;
  updateNote: (id: string, content: string) => void;
  deleteNote: (id: string) => void;
  getNotesByMachinery: (machineryId: string) => Note[];
}

export const useNoteStore = create<NoteStore>()(
  persist(
    (set, get) => ({
      notes: [],
      addNote: (machineryId, content) => {
        const newNote: Note = {
          id: Date.now().toString(),
          machineryId,
          content,
          timestamp: Date.now(),
        };
        set((state) => ({ notes: [...state.notes, newNote] }));
      },
      updateNote: (id, content) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id ? { ...note, content, timestamp: Date.now() } : note
          ),
        }));
      },
      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
        }));
      },
      getNotesByMachinery: (machineryId) => {
        return get().notes.filter((note) => note.machineryId === machineryId);
      },
    }),
    {
      name: 'simvex-notes-storage',
    }
  )
);
