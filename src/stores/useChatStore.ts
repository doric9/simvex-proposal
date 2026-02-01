import { create } from 'zustand'
import type { ChatMessage, MachineId } from '@/types'
import * as db from '@/lib/db'

interface ChatState {
  messages: ChatMessage[]
  isLoading: boolean
  isStreaming: boolean
  error: string | null
  currentMachine: MachineId | null

  // Actions
  loadChatHistory: (machineId: MachineId) => Promise<void>
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => Promise<void>
  clearHistory: (machineId: MachineId) => Promise<void>
  setIsStreaming: (streaming: boolean) => void
  setError: (error: string | null) => void
  setCurrentMachine: (machineId: MachineId | null) => void
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isLoading: false,
  isStreaming: false,
  error: null,
  currentMachine: null,

  loadChatHistory: async (machineId) => {
    set({ isLoading: true, currentMachine: machineId })
    try {
      const messages = await db.getChatHistory(machineId)
      set({ messages, isLoading: false })
    } catch (error) {
      console.error('Failed to load chat history:', error)
      set({ isLoading: false, error: 'Failed to load chat history' })
    }
  },

  addMessage: async (messageData) => {
    const message: ChatMessage = {
      ...messageData,
      timestamp: new Date(),
    }

    // Optimistically add to state
    set((state) => ({
      messages: [...state.messages, message],
    }))

    // Persist to database
    try {
      const id = await db.saveChatMessage(message)
      set((state) => ({
        messages: state.messages.map((m) =>
          m === message ? { ...m, id } : m
        ),
      }))
    } catch (error) {
      console.error('Failed to save message:', error)
    }
  },

  clearHistory: async (machineId) => {
    try {
      await db.clearChatHistory(machineId)
      if (get().currentMachine === machineId) {
        set({ messages: [] })
      }
    } catch (error) {
      console.error('Failed to clear chat history:', error)
    }
  },

  setIsStreaming: (streaming) => set({ isStreaming: streaming }),

  setError: (error) => set({ error }),

  setCurrentMachine: (machineId) => {
    if (machineId && machineId !== get().currentMachine) {
      get().loadChatHistory(machineId)
    } else if (!machineId) {
      set({ currentMachine: null, messages: [] })
    }
  },
}))
