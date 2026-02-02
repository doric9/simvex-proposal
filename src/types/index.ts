// TypeScript Types
export interface MachineryPart {
  name: string;
  file: string;
  material?: string;
  role?: string;
  parent?: string;
}

export interface Machinery {
  id: string;
  name: string;
  description: string;
  theory: string;
  thumbnail: string;
  parts: MachineryPart[];
}

export interface ViewerState {
  selectedMachinery: string | null;
  selectedPart: string | null;
  explodeFactor: number;
  cameraPosition: [number, number, number];
  zoom: number;
  physicsEnabled: boolean;
}

export interface Note {
  id: string;
  machineryId: string;
  content: string;
  timestamp: number;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface QuizQuestion {
  id: string;
  machineryId: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface FlowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    note?: string;
    attachments?: string[];
  };
}
