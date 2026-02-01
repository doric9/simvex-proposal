import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type SidePanelTab = 'info' | 'notes' | 'chat'
type Language = 'en' | 'ko'
type Theme = 'light' | 'dark' | 'system'

interface UIState {
  // Panel state
  sidePanelOpen: boolean
  sidePanelTab: SidePanelTab
  sidePanelWidth: number

  // Modals
  quizModalOpen: boolean
  settingsModalOpen: boolean
  exportModalOpen: boolean
  workflowModalOpen: boolean

  // Preferences
  language: Language
  theme: Theme

  // Actions
  setSidePanelOpen: (open: boolean) => void
  setSidePanelTab: (tab: SidePanelTab) => void
  setSidePanelWidth: (width: number) => void
  setQuizModalOpen: (open: boolean) => void
  setSettingsModalOpen: (open: boolean) => void
  setExportModalOpen: (open: boolean) => void
  setWorkflowModalOpen: (open: boolean) => void
  setLanguage: (language: Language) => void
  setTheme: (theme: Theme) => void
  toggleSidePanel: () => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Panel state
      sidePanelOpen: true,
      sidePanelTab: 'info',
      sidePanelWidth: 380,

      // Modals
      quizModalOpen: false,
      settingsModalOpen: false,
      exportModalOpen: false,
      workflowModalOpen: false,

      // Preferences
      language: 'ko',
      theme: 'light',

      // Actions
      setSidePanelOpen: (open) => set({ sidePanelOpen: open }),

      setSidePanelTab: (tab) => set({ sidePanelTab: tab, sidePanelOpen: true }),

      setSidePanelWidth: (width) =>
        set({ sidePanelWidth: Math.max(300, Math.min(600, width)) }),

      setQuizModalOpen: (open) => set({ quizModalOpen: open }),

      setSettingsModalOpen: (open) => set({ settingsModalOpen: open }),

      setExportModalOpen: (open) => set({ exportModalOpen: open }),

      setWorkflowModalOpen: (open) => set({ workflowModalOpen: open }),

      setLanguage: (language) => set({ language }),

      setTheme: (theme) => set({ theme }),

      toggleSidePanel: () => set({ sidePanelOpen: !get().sidePanelOpen }),
    }),
    {
      name: 'simvex-ui',
      partialize: (state) => ({
        sidePanelWidth: state.sidePanelWidth,
        language: state.language,
        theme: state.theme,
      }),
    }
  )
)
