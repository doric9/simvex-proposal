import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ViewerState } from '../types';

interface ViewerStore extends ViewerState {
  setSelectedMachinery: (id: string | null) => void;
  setSelectedPart: (name: string | null) => void;
  setExplodeFactor: (factor: number) => void;
  setCameraPosition: (position: [number, number, number]) => void;
  setZoom: (zoom: number) => void;
  setPhysicsEnabled: (enabled: boolean) => void;
  reset: () => void;
}

const initialState: ViewerState = {
  selectedMachinery: null,
  selectedPart: null,
  explodeFactor: 0,
  cameraPosition: [5, 5, 5],
  zoom: 1,
  physicsEnabled: false,
};

export const useViewerStore = create<ViewerStore>()(
  persist(
    (set) => ({
      ...initialState,
      setSelectedMachinery: (id) => set({ selectedMachinery: id }),
      setSelectedPart: (name) => set({ selectedPart: name }),
      setExplodeFactor: (factor) => set({ explodeFactor: factor }),
      setCameraPosition: (position) => set({ cameraPosition: position }),
      setZoom: (zoom) => set({ zoom }),
      setPhysicsEnabled: (enabled) => set({ physicsEnabled: enabled }),
      reset: () => set(initialState),
    }),
    {
      name: 'simvex-viewer-storage',
    }
  )
);
