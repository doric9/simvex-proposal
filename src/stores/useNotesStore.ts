import { create } from 'zustand'
import type { Note, MachineId } from '@/types'
import * as db from '@/lib/db'

interface NotesState {
  notes: Note[]
  currentNote: Note | null
  isLoading: boolean
  isSaving: boolean
  searchTerm: string
  filterMachine: MachineId | null
  filterPart: string | null

  // Actions
  loadNotes: (machineId?: MachineId) => Promise<void>
  createNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateNote: (id: number, updates: Partial<Note>) => Promise<void>
  deleteNote: (id: number) => Promise<void>
  setCurrentNote: (note: Note | null) => void
  setSearchTerm: (term: string) => void
  setFilterMachine: (machineId: MachineId | null) => void
  setFilterPart: (partId: string | null) => void
  getFilteredNotes: () => Note[]
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  currentNote: null,
  isLoading: false,
  isSaving: false,
  searchTerm: '',
  filterMachine: null,
  filterPart: null,

  loadNotes: async (machineId) => {
    set({ isLoading: true })
    try {
      const notes = machineId
        ? await db.getNotesByMachine(machineId)
        : await db.db.notes.toArray()
      set({ notes, isLoading: false })
    } catch (error) {
      console.error('Failed to load notes:', error)
      set({ isLoading: false })
    }
  },

  createNote: async (noteData) => {
    set({ isSaving: true })
    try {
      const id = await db.saveNote(noteData)
      const now = new Date()
      const newNote: Note = {
        ...noteData,
        id,
        createdAt: now,
        updatedAt: now,
      }
      set((state) => ({
        notes: [newNote, ...state.notes],
        currentNote: newNote,
        isSaving: false,
      }))
    } catch (error) {
      console.error('Failed to create note:', error)
      set({ isSaving: false })
    }
  },

  updateNote: async (id, updates) => {
    set({ isSaving: true })
    try {
      await db.updateNote(id, updates)
      set((state) => ({
        notes: state.notes.map((note) =>
          note.id === id
            ? { ...note, ...updates, updatedAt: new Date() }
            : note
        ),
        currentNote:
          state.currentNote?.id === id
            ? { ...state.currentNote, ...updates, updatedAt: new Date() }
            : state.currentNote,
        isSaving: false,
      }))
    } catch (error) {
      console.error('Failed to update note:', error)
      set({ isSaving: false })
    }
  },

  deleteNote: async (id) => {
    try {
      await db.deleteNote(id)
      set((state) => ({
        notes: state.notes.filter((note) => note.id !== id),
        currentNote: state.currentNote?.id === id ? null : state.currentNote,
      }))
    } catch (error) {
      console.error('Failed to delete note:', error)
    }
  },

  setCurrentNote: (note) => set({ currentNote: note }),

  setSearchTerm: (term) => set({ searchTerm: term }),

  setFilterMachine: (machineId) => set({ filterMachine: machineId }),

  setFilterPart: (partId) => set({ filterPart: partId }),

  getFilteredNotes: () => {
    const { notes, searchTerm, filterMachine, filterPart } = get()

    return notes.filter((note) => {
      if (filterMachine && note.machineId !== filterMachine) return false
      if (filterPart && note.partId !== filterPart) return false
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        return (
          note.title.toLowerCase().includes(search) ||
          note.content.toLowerCase().includes(search) ||
          note.tags.some((tag) => tag.toLowerCase().includes(search))
        )
      }
      return true
    })
  },
}))
