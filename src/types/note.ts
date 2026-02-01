import type { MachineId } from './machine'

export interface Note {
  id?: number
  machineId: MachineId
  partId?: string
  title: string
  content: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface NoteFilter {
  machineId?: MachineId
  partId?: string
  searchTerm?: string
  tags?: string[]
}
