import type { MachineId } from './machine'

export type QuestionType = 'multiple-choice' | 'true-false' | 'identify-part'

export interface QuizQuestion {
  id: string
  machineId: MachineId
  type: QuestionType
  question: string
  questionKo: string
  options?: string[]
  optionsKo?: string[]
  correctAnswer: number | string
  explanation: string
  explanationKo: string
  partId?: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface QuizResult {
  id?: number
  machineId: MachineId
  score: number
  totalQuestions: number
  answers: Record<string, { selected: number | string; correct: boolean }>
  completedAt: Date
  timeSpent: number
}

export interface QuizState {
  currentQuestionIndex: number
  questions: QuizQuestion[]
  answers: Record<string, number | string>
  startTime: Date | null
  isComplete: boolean
}
