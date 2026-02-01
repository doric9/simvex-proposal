# SIMVEX Implementation Plan

## Project Overview

**SIMVEX** is a web-based 3D mechanical parts viewer for engineering education. This MVP enables students to interactively explore mechanical systems through 3D visualization, AI-assisted learning, quizzes, and note-taking.

---

## 1. Technology Stack Analysis

### 1.1 Frontend Framework Comparison

| Criteria | React + Vite | Next.js | Vue 3 + Vite | SvelteKit |
|----------|-------------|---------|--------------|-----------|
| **Learning Curve** | Medium | Medium-High | Medium | Low-Medium |
| **3D Integration** | Excellent (react-three-fiber) | Excellent | Good | Limited ecosystem |
| **Performance** | Excellent | Excellent | Excellent | Excellent |
| **Ecosystem** | Massive | Massive | Large | Growing |
| **Build Speed** | Very Fast | Fast | Very Fast | Very Fast |
| **SSR/SSG** | Manual setup | Built-in | Manual setup | Built-in |
| **TypeScript** | Excellent | Excellent | Excellent | Excellent |

**Recommendation: React + Vite**
- Best 3D ecosystem with `react-three-fiber` (R3F) - the de facto standard for React + Three.js
- Massive component library ecosystem (shadcn/ui, Radix)
- Fast development iteration with Vite
- No SSR complexity needed for this MVP (client-side 3D rendering)

---

### 1.2 3D Rendering Library Comparison

| Criteria | Three.js + R3F | Babylon.js | PlayCanvas | Model-Viewer |
|----------|----------------|------------|------------|--------------|
| **GLB Support** | Excellent | Excellent | Good | Excellent |
| **React Integration** | Native (R3F) | Wrapper needed | Limited | Web Component |
| **Animation System** | Full control | Full control | Limited | Basic |
| **Assembly/Disassembly** | Full control | Full control | Limited | None |
| **Learning Resources** | Extensive | Good | Limited | Good |
| **Performance** | Excellent | Excellent | Excellent | Good |
| **File Size** | ~150KB | ~600KB | ~300KB | ~100KB |

**Recommendation: Three.js with react-three-fiber (R3F)**
- Native React integration with declarative syntax
- Full control for assembly/disassembly animations
- Extensive documentation and community
- `@react-three/drei` provides pre-built helpers (OrbitControls, loaders, etc.)

---

### 1.3 UI Component Library Comparison

| Criteria | shadcn/ui | Material UI | Chakra UI | Ant Design |
|----------|-----------|-------------|-----------|------------|
| **Customization** | Full ownership | Theme-based | Theme-based | Theme-based |
| **Bundle Size** | Copy what you need | Large | Medium | Large |
| **Design Quality** | Modern, minimal | Material | Modern | Enterprise |
| **Accessibility** | Excellent (Radix) | Good | Excellent | Good |
| **Learning Curve** | Low | Medium | Low | Medium |

**Recommendation: shadcn/ui**
- Copy-paste components (no dependency lock-in)
- Built on Radix UI primitives (accessibility)
- Tailwind CSS based (utility-first, easy customization)
- Modern, clean aesthetic suitable for educational platforms

---

### 1.4 State Management Comparison

| Criteria | Zustand | Redux Toolkit | Jotai | React Context |
|----------|---------|---------------|-------|---------------|
| **Boilerplate** | Minimal | Medium | Minimal | Minimal |
| **DevTools** | Good | Excellent | Good | Limited |
| **Performance** | Excellent | Good | Excellent | Can cause re-renders |
| **Learning Curve** | Very Low | Medium | Low | Low |
| **Persistence** | Easy (middleware) | Middleware | Easy | Manual |

**Recommendation: Zustand**
- Minimal boilerplate, excellent performance
- Built-in persistence middleware for localStorage
- Perfect for medium complexity apps
- Works great with React Three Fiber

---

### 1.5 AI Integration Comparison

| Criteria | OpenAI API Direct | Vercel AI SDK | LangChain.js |
|----------|-------------------|---------------|--------------|
| **Streaming** | Manual | Built-in | Built-in |
| **React Hooks** | Manual | Built-in | Manual |
| **Complexity** | Low | Low | High |
| **Flexibility** | High | Medium | Very High |

**Recommendation: Vercel AI SDK**
- Excellent React hooks (`useChat`, `useCompletion`)
- Built-in streaming support
- Type-safe, minimal setup
- Edge-runtime compatible

---

### 1.6 Data Persistence Strategy

For MVP (browser-based storage):

| Storage Type | Use Case | Limit |
|--------------|----------|-------|
| **localStorage** | User settings, UI preferences | 5-10MB |
| **IndexedDB** | Notes, chat history, quiz results | 50MB+ |
| **Dexie.js** | IndexedDB wrapper (recommended) | - |

**Recommendation: Dexie.js for IndexedDB**
- Promise-based API
- TypeScript support
- React hooks available (`dexie-react-hooks`)
- Handles complex queries and relationships

---

### 1.7 PDF Generation Comparison

| Criteria | jsPDF + html2canvas | React-PDF | Puppeteer |
|----------|---------------------|-----------|-----------|
| **Client-side** | Yes | Yes | No (server) |
| **3D Capture** | Via canvas | Manual | Full page |
| **Styling Control** | Limited | Full | Full |
| **Complexity** | Low | Medium | High |

**Recommendation: jsPDF + html2canvas**
- Fully client-side (no server needed)
- Can capture Three.js canvas
- Simple API for MVP scope

---

## 2. Recommended Technology Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                        SIMVEX Tech Stack                        │
├─────────────────────────────────────────────────────────────────┤
│  Frontend Framework    │  React 18 + Vite + TypeScript          │
│  3D Rendering          │  Three.js + react-three-fiber + drei   │
│  UI Components         │  shadcn/ui + Tailwind CSS              │
│  State Management      │  Zustand (with persist middleware)     │
│  AI Integration        │  Vercel AI SDK + OpenAI API            │
│  Data Persistence      │  Dexie.js (IndexedDB)                  │
│  PDF Generation        │  jsPDF + html2canvas                   │
│  Icons                 │  Lucide React                          │
│  Animations            │  Framer Motion                         │
│  Code Quality          │  ESLint + Prettier + TypeScript        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Project Architecture

### 3.1 Directory Structure

```
simvex/
├── public/
│   └── models/                    # 3D GLB files (organized by system)
│       ├── v4-engine/
│       ├── drone/
│       ├── robot-arm/
│       ├── robot-gripper/
│       ├── suspension/
│       ├── leaf-spring/
│       └── machine-vice/
├── src/
│   ├── app/                       # App entry and routing
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   ├── layout/                # Header, Sidebar, Layout
│   │   ├── viewer/                # 3D viewer components
│   │   │   ├── Scene.tsx
│   │   │   ├── ModelLoader.tsx
│   │   │   ├── PartHighlighter.tsx
│   │   │   ├── AssemblyControls.tsx
│   │   │   └── CameraControls.tsx
│   │   ├── panels/                # Side panels
│   │   │   ├── PartInfoPanel.tsx
│   │   │   ├── NotesPanel.tsx
│   │   │   ├── ChatPanel.tsx
│   │   │   └── WorkflowPanel.tsx
│   │   ├── quiz/                  # Quiz components
│   │   │   ├── QuizContainer.tsx
│   │   │   ├── QuizQuestion.tsx
│   │   │   └── QuizResults.tsx
│   │   └── export/                # PDF export
│   │       └── PDFExporter.tsx
│   ├── stores/                    # Zustand stores
│   │   ├── useViewerStore.ts      # 3D viewer state
│   │   ├── useNotesStore.ts       # Notes persistence
│   │   ├── useChatStore.ts        # AI chat history
│   │   ├── useQuizStore.ts        # Quiz state & results
│   │   └── useUIStore.ts          # UI preferences
│   ├── hooks/                     # Custom hooks
│   │   ├── useModel.ts            # 3D model loading
│   │   ├── useAssembly.ts         # Assembly/disassembly logic
│   │   ├── usePartSelection.ts    # Part click handling
│   │   └── useAIChat.ts           # AI chat integration
│   ├── lib/                       # Utilities
│   │   ├── db.ts                  # Dexie database setup
│   │   ├── pdf.ts                 # PDF generation
│   │   ├── ai.ts                  # AI configuration
│   │   └── utils.ts               # General utilities
│   ├── data/                      # Static data
│   │   ├── machines.ts            # Machine definitions
│   │   ├── parts/                 # Part metadata by machine
│   │   │   ├── v4-engine.ts
│   │   │   ├── drone.ts
│   │   │   └── ...
│   │   └── quizzes/               # Quiz question banks
│   │       ├── v4-engine.ts
│   │       └── ...
│   ├── types/                     # TypeScript types
│   │   ├── machine.ts
│   │   ├── part.ts
│   │   ├── quiz.ts
│   │   └── chat.ts
│   └── styles/
│       └── globals.css            # Tailwind + custom styles
├── docs/                          # Original planning docs
├── .env.local                     # API keys (gitignored)
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

### 3.2 Component Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              App Layout                                  │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                         Header                                    │   │
│  │  [Logo] [Machine Selector Buttons] [Quiz] [Export PDF] [Settings]│   │
│  └──────────────────────────────────────────────────────────────────┘   │
│  ┌────────────────────────────────┬─────────────────────────────────┐   │
│  │                                │                                  │   │
│  │        3D Viewer               │         Side Panel               │   │
│  │                                │   ┌──────────────────────────┐   │   │
│  │   ┌──────────────────────┐     │   │  Tabs: Info|Notes|Chat   │   │   │
│  │   │                      │     │   ├──────────────────────────┤   │   │
│  │   │    Three.js Canvas   │     │   │                          │   │   │
│  │   │                      │     │   │   [Tab Content Area]     │   │   │
│  │   │                      │     │   │                          │   │   │
│  │   └──────────────────────┘     │   │                          │   │   │
│  │                                │   │                          │   │   │
│  │   [Assembly Controls]          │   └──────────────────────────┘   │   │
│  │   [Explode] [Reset] [Zoom]     │                                  │   │
│  │                                │                                  │   │
│  └────────────────────────────────┴─────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Core Feature Implementation

### 4.1 3D Viewer System

```typescript
// Viewer state management
interface ViewerState {
  currentMachine: MachineId | null;
  selectedPart: string | null;
  explodeLevel: number;           // 0 = assembled, 1 = fully exploded
  highlightedParts: string[];
  cameraPosition: [number, number, number];
  isAnimating: boolean;
}

// Assembly/Disassembly approach
// - Each part has a "home" position and an "exploded" position
// - Interpolate between positions based on explodeLevel
// - Use spring animations (react-spring) for smooth transitions
```

**Key Implementation Details:**
1. **Model Loading**: Use `useGLTF` from drei with Suspense
2. **Part Selection**: Raycasting on mesh click
3. **Explode Animation**: Lerp between assembled/exploded transforms
4. **Camera Controls**: OrbitControls with zoom limits (center-based)
5. **Part Highlighting**: Emissive material change on hover/select

### 4.2 Part Information System

```typescript
interface PartInfo {
  id: string;
  name: string;
  nameKo: string;              // Korean name
  description: string;
  material: string;
  function: string;            // Role in the system
  assemblyOrder: number;       // For workflow diagram
  relatedParts: string[];      // Connected components
}
```

### 4.3 AI Chat System

```typescript
// System prompt for educational context
const SYSTEM_PROMPT = `You are SIMVEX AI, an educational assistant
specializing in mechanical engineering. You help students understand:
- Mechanical part functions and relationships
- Assembly/disassembly sequences
- Material properties and engineering principles

Current context:
- Machine: {machineName}
- Selected Part: {partName}
- Part Info: {partDescription}

Provide clear, educational explanations suitable for engineering students.
Answer in the same language the user asks in.`;
```

### 4.4 Quiz System

```typescript
interface QuizQuestion {
  id: string;
  machineId: MachineId;
  type: 'multiple-choice' | 'true-false' | 'identify-part';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  partId?: string;             // For part identification questions
}

// Quiz generation
// - Pull from question bank per machine
// - Randomize order and option positions
// - Track results in IndexedDB
```

### 4.5 Notes System

```typescript
interface Note {
  id: string;
  machineId: MachineId;
  partId?: string;
  content: string;
  timestamp: Date;
  tags?: string[];
}

// Features:
// - Auto-save with debounce
// - Filter by machine/part
// - Search functionality
// - Export with PDF
```

### 4.6 PDF Export

```typescript
// PDF Contents:
// 1. Title page with machine name
// 2. 3D model screenshot (current view)
// 3. Assembly workflow diagram
// 4. Part information table
// 5. User notes
// 6. Quiz results (if taken)

// Implementation:
// - Capture Three.js canvas with toDataURL()
// - Use jsPDF for document generation
// - Include workflow diagram images from assets
```

---

## 5. Data Schema

### 5.1 IndexedDB Schema (Dexie)

```typescript
// db.ts
import Dexie, { Table } from 'dexie';

interface Note {
  id?: number;
  machineId: string;
  partId?: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ChatMessage {
  id?: number;
  machineId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface QuizResult {
  id?: number;
  machineId: string;
  score: number;
  totalQuestions: number;
  answers: Record<string, boolean>;
  completedAt: Date;
}

interface UserProgress {
  machineId: string;
  viewedParts: string[];
  lastAccessed: Date;
  timeSpent: number;           // seconds
}

class SimvexDB extends Dexie {
  notes!: Table<Note>;
  chatMessages!: Table<ChatMessage>;
  quizResults!: Table<QuizResult>;
  progress!: Table<UserProgress>;

  constructor() {
    super('simvex');
    this.version(1).stores({
      notes: '++id, machineId, partId, createdAt',
      chatMessages: '++id, machineId, timestamp',
      quizResults: '++id, machineId, completedAt',
      progress: 'machineId, lastAccessed'
    });
  }
}

export const db = new SimvexDB();
```

---

## 6. Implementation Phases

### Phase 1: Foundation (Days 1-2)
- [ ] Project scaffolding (Vite + React + TypeScript)
- [ ] Install and configure dependencies
- [ ] Set up shadcn/ui and Tailwind
- [ ] Create base layout (Header, Main, Sidebar)
- [ ] Set up Zustand stores with persistence
- [ ] Configure Dexie database
- [ ] Organize 3D assets in public folder

### Phase 2: 3D Viewer Core (Days 3-4)
- [ ] Implement basic Three.js scene with R3F
- [ ] Create model loader for GLB files
- [ ] Implement camera controls (OrbitControls)
- [ ] Add part selection (raycasting)
- [ ] Implement part highlighting
- [ ] Create machine selector UI
- [ ] Basic responsive layout

### Phase 3: Assembly/Disassembly (Day 5)
- [ ] Define part positions (assembled/exploded)
- [ ] Implement explode slider/animation
- [ ] Add smooth transitions with react-spring
- [ ] Create assembly sequence animation
- [ ] Implement per-part explode capability

### Phase 4: Information & Notes (Day 6)
- [ ] Create Part Info panel component
- [ ] Display part metadata on selection
- [ ] Implement Notes panel with editor
- [ ] Add auto-save functionality
- [ ] Notes filtering by machine/part

### Phase 5: AI Integration (Day 7)
- [ ] Set up Vercel AI SDK
- [ ] Create chat UI component
- [ ] Implement context-aware prompting
- [ ] Add streaming responses
- [ ] Persist chat history

### Phase 6: Quiz System (Day 8)
- [ ] Create quiz question bank (4+ machines)
- [ ] Implement quiz UI components
- [ ] Add randomization logic
- [ ] Create results display
- [ ] Save quiz history

### Phase 7: Export & Polish (Day 9)
- [ ] Implement PDF generation
- [ ] Add 3D canvas capture
- [ ] Include workflow diagrams
- [ ] Compile notes into export
- [ ] UI polish and animations

### Phase 8: Testing & Refinement (Day 10)
- [ ] Cross-browser testing
- [ ] Performance optimization
- [ ] Bug fixes
- [ ] Final UI adjustments
- [ ] Documentation

---

## 7. Machine Implementation Priority

Based on asset complexity and educational value:

| Priority | Machine | Parts | Rationale |
|----------|---------|-------|-----------|
| 1 | V4 Engine | 8 | Classic mechanical system, high educational value |
| 2 | Robot Gripper | 11 | Good gear/linkage demonstration |
| 3 | Drone | 18 | Modern, engaging, clear assembly |
| 4 | Machine Vice | 12 | Simple mechanics, clear function |
| 5 | Robot Arm | 9 | Complex kinematics (stretch goal) |
| 6 | Suspension | 6 | Spring systems (stretch goal) |
| 7 | Leaf Spring | 11 | Advanced topic (stretch goal) |

**MVP Target: Machines 1-4 fully implemented**

---

## 8. API & Environment Configuration

```env
# .env.local
VITE_OPENAI_API_KEY=your_key_here
VITE_OPENAI_MODEL=gpt-4o-mini
VITE_APP_NAME=SIMVEX
```

**Note**: For production, API calls should route through a backend proxy to protect API keys. For MVP hackathon, client-side calls with exposed keys may be acceptable per organizer guidelines.

---

## 9. Performance Considerations

### 3D Optimization
- Use `DRACOLoader` for compressed GLB files if needed
- Implement level-of-detail (LOD) for complex models
- Use `instancedMesh` for repeated geometries
- Lazy load models (only current machine)

### UI Optimization
- Code split by route/feature
- Lazy load heavy components (PDF, Quiz)
- Debounce frequent state updates (notes, camera)
- Use React.memo for 3D components

### Bundle Size Targets
- Initial load: < 500KB (excluding 3D models)
- 3D models: Load on demand
- Time to interactive: < 3 seconds

---

## 10. Scalability Considerations

### Adding New Machines
1. Add GLB files to `public/models/{machine-name}/`
2. Create part metadata in `src/data/parts/{machine-name}.ts`
3. Add quiz questions in `src/data/quizzes/{machine-name}.ts`
4. Register machine in `src/data/machines.ts`
5. Add workflow diagram to assets

### Future Enhancements (Post-MVP)
- User authentication system
- Cloud sync for notes/progress
- Collaborative learning features
- AR/VR viewing modes
- More AI features (voice, image recognition)
- Instructor dashboard
- Multiple language support
- Mobile app (React Native + Three.js)

---

## 11. Dependencies

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@react-three/fiber": "^8.17.0",
    "@react-three/drei": "^9.114.0",
    "three": "^0.169.0",
    "@types/three": "^0.169.0",
    "zustand": "^5.0.0",
    "dexie": "^4.0.8",
    "dexie-react-hooks": "^1.1.7",
    "ai": "^3.4.0",
    "openai": "^4.68.0",
    "jspdf": "^2.5.2",
    "html2canvas": "^1.4.1",
    "framer-motion": "^11.11.0",
    "@radix-ui/react-tabs": "^1.1.0",
    "@radix-ui/react-dialog": "^1.1.0",
    "@radix-ui/react-slider": "^1.2.0",
    "lucide-react": "^0.453.0",
    "tailwindcss": "^3.4.14",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.4"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.2",
    "vite": "^5.4.10",
    "typescript": "^5.6.3",
    "eslint": "^9.13.0",
    "@typescript-eslint/eslint-plugin": "^8.10.0",
    "prettier": "^3.3.3",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47"
  }
}
```

---

## 12. Success Metrics

### Technical Metrics
- [ ] 4+ machines fully functional
- [ ] All 3D interactions smooth (60fps)
- [ ] AI responses < 3s latency
- [ ] PDF export functional
- [ ] Zero critical bugs

### User Experience Metrics
- [ ] Intuitive machine selection
- [ ] Clear part information display
- [ ] Responsive on 1280px+ screens
- [ ] Accessible keyboard navigation
- [ ] Consistent visual design

---

## Summary

This implementation plan provides a solid foundation for building SIMVEX as a scalable, maintainable educational platform. The chosen technology stack (React + Vite + R3F + shadcn/ui + Zustand) offers:

1. **Developer Experience**: Fast builds, type safety, excellent tooling
2. **User Experience**: Smooth 3D interactions, modern UI, responsive design
3. **Scalability**: Easy to add machines, features, and future enhancements
4. **Maintainability**: Clear architecture, separation of concerns, typed data

The phased approach ensures core functionality is delivered first, with refinements added progressively within the 10-day timeframe.
