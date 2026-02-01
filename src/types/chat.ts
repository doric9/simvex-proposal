import type { MachineId } from './machine'

export interface ChatMessage {
  id?: number
  machineId: MachineId
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  partContext?: string
}

export interface ChatSession {
  machineId: MachineId
  messages: ChatMessage[]
  lastActivity: Date
}
