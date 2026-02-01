import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { MachineId } from '@/types'

interface ViewerState {
  // Current selection
  currentMachine: MachineId | null
  selectedPart: string | null
  hoveredPart: string | null

  // View state
  explodeLevel: number
  isAnimating: boolean
  showLabels: boolean
  showWireframe: boolean

  // Camera
  cameraPosition: [number, number, number]
  cameraTarget: [number, number, number]
  autoRotate: boolean

  // Actions
  setCurrentMachine: (machine: MachineId | null) => void
  setSelectedPart: (part: string | null) => void
  setHoveredPart: (part: string | null) => void
  setExplodeLevel: (level: number) => void
  setIsAnimating: (animating: boolean) => void
  setShowLabels: (show: boolean) => void
  setShowWireframe: (show: boolean) => void
  setCameraPosition: (position: [number, number, number]) => void
  setCameraTarget: (target: [number, number, number]) => void
  setAutoRotate: (rotate: boolean) => void
  resetView: () => void
}

const initialState = {
  currentMachine: null as MachineId | null,
  selectedPart: null as string | null,
  hoveredPart: null as string | null,
  explodeLevel: 0,
  isAnimating: false,
  showLabels: true,
  showWireframe: false,
  cameraPosition: [5, 5, 5] as [number, number, number],
  cameraTarget: [0, 0, 0] as [number, number, number],
  autoRotate: false,
}

export const useViewerStore = create<ViewerState>()(
  persist(
    (set) => ({
      ...initialState,

      setCurrentMachine: (machine) =>
        set({
          currentMachine: machine,
          selectedPart: null,
          hoveredPart: null,
          explodeLevel: 0,
        }),

      setSelectedPart: (part) => set({ selectedPart: part }),

      setHoveredPart: (part) => set({ hoveredPart: part }),

      setExplodeLevel: (level) => set({ explodeLevel: Math.max(0, Math.min(1, level)) }),

      setIsAnimating: (animating) => set({ isAnimating: animating }),

      setShowLabels: (show) => set({ showLabels: show }),

      setShowWireframe: (show) => set({ showWireframe: show }),

      setCameraPosition: (position) => set({ cameraPosition: position }),

      setCameraTarget: (target) => set({ cameraTarget: target }),

      setAutoRotate: (rotate) => set({ autoRotate: rotate }),

      resetView: () =>
        set({
          selectedPart: null,
          hoveredPart: null,
          explodeLevel: 0,
          cameraPosition: [5, 5, 5],
          cameraTarget: [0, 0, 0],
          autoRotate: false,
        }),
    }),
    {
      name: 'simvex-viewer',
      partialize: (state) => ({
        showLabels: state.showLabels,
        autoRotate: state.autoRotate,
      }),
    }
  )
)
