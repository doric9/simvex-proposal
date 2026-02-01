import Dexie, { type Table } from 'dexie'
import type { Note } from '@/types/note'
import type { ChatMessage } from '@/types/chat'
import type { QuizResult } from '@/types/quiz'
import type { MachineId } from '@/types/machine'

export interface UserProgress {
  machineId: MachineId
  viewedParts: string[]
  lastAccessed: Date
  timeSpent: number
}

export interface UserSettings {
  id: string
  theme: 'light' | 'dark' | 'system'
  language: 'en' | 'ko'
  cameraSpeed: number
  showLabels: boolean
}

class SimvexDB extends Dexie {
  notes!: Table<Note>
  chatMessages!: Table<ChatMessage>
  quizResults!: Table<QuizResult>
  progress!: Table<UserProgress>
  settings!: Table<UserSettings>

  constructor() {
    super('simvex')

    this.version(1).stores({
      notes: '++id, machineId, partId, createdAt, updatedAt',
      chatMessages: '++id, machineId, timestamp',
      quizResults: '++id, machineId, completedAt',
      progress: 'machineId, lastAccessed',
      settings: 'id',
    })
  }
}

export const db = new SimvexDB()

// Helper functions
export async function getNotesByMachine(machineId: MachineId): Promise<Note[]> {
  return db.notes.where('machineId').equals(machineId).toArray()
}

export async function getNotesByPart(machineId: MachineId, partId: string): Promise<Note[]> {
  return db.notes
    .where({ machineId, partId })
    .toArray()
}

export async function saveNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
  const now = new Date()
  return db.notes.add({
    ...note,
    createdAt: now,
    updatedAt: now,
  })
}

export async function updateNote(id: number, updates: Partial<Note>): Promise<number> {
  return db.notes.update(id, {
    ...updates,
    updatedAt: new Date(),
  })
}

export async function deleteNote(id: number): Promise<void> {
  return db.notes.delete(id)
}

export async function getChatHistory(machineId: MachineId): Promise<ChatMessage[]> {
  return db.chatMessages
    .where('machineId')
    .equals(machineId)
    .sortBy('timestamp')
}

export async function saveChatMessage(message: Omit<ChatMessage, 'id'>): Promise<number> {
  return db.chatMessages.add(message)
}

export async function clearChatHistory(machineId: MachineId): Promise<number> {
  return db.chatMessages.where('machineId').equals(machineId).delete()
}

export async function getQuizResults(machineId?: MachineId): Promise<QuizResult[]> {
  if (machineId) {
    return db.quizResults.where('machineId').equals(machineId).toArray()
  }
  return db.quizResults.toArray()
}

export async function saveQuizResult(result: Omit<QuizResult, 'id'>): Promise<number> {
  return db.quizResults.add(result)
}

export async function getProgress(machineId: MachineId): Promise<UserProgress | undefined> {
  return db.progress.get(machineId)
}

export async function updateProgress(progress: UserProgress): Promise<void> {
  await db.progress.put(progress)
}

export async function getSettings(): Promise<UserSettings> {
  const settings = await db.settings.get('default')
  return settings ?? {
    id: 'default',
    theme: 'light',
    language: 'ko',
    cameraSpeed: 1,
    showLabels: true,
  }
}

export async function updateSettings(settings: Partial<UserSettings>): Promise<void> {
  const current = await getSettings()
  await db.settings.put({ ...current, ...settings, id: 'default' })
}
