import { create } from 'zustand'
import type { QuizQuestion, QuizResult, QuizState, MachineId } from '@/types'
import { shuffleArray } from '@/lib/utils'
import * as db from '@/lib/db'

interface QuizStoreState {
  // Quiz session
  quiz: QuizState | null
  results: QuizResult[]
  isLoadingResults: boolean

  // Actions
  startQuiz: (machineId: MachineId, questions: QuizQuestion[], count?: number) => void
  answerQuestion: (questionId: string, answer: number | string) => void
  nextQuestion: () => void
  previousQuestion: () => void
  goToQuestion: (index: number) => void
  submitQuiz: () => Promise<QuizResult | null>
  resetQuiz: () => void
  loadResults: (machineId?: MachineId) => Promise<void>
  getCurrentQuestion: () => QuizQuestion | null
  getProgress: () => { current: number; total: number; answered: number }
  calculateScore: () => { score: number; total: number; percentage: number }
}

export const useQuizStore = create<QuizStoreState>((set, get) => ({
  quiz: null,
  results: [],
  isLoadingResults: false,

  startQuiz: (_machineId, questions, count = 10) => {
    const shuffled = shuffleArray(questions)
    const selected = shuffled.slice(0, Math.min(count, shuffled.length))

    set({
      quiz: {
        currentQuestionIndex: 0,
        questions: selected,
        answers: {},
        startTime: new Date(),
        isComplete: false,
      },
    })
  },

  answerQuestion: (questionId, answer) => {
    set((state) => {
      if (!state.quiz) return state
      return {
        quiz: {
          ...state.quiz,
          answers: {
            ...state.quiz.answers,
            [questionId]: answer,
          },
        },
      }
    })
  },

  nextQuestion: () => {
    set((state) => {
      if (!state.quiz) return state
      const nextIndex = Math.min(
        state.quiz.currentQuestionIndex + 1,
        state.quiz.questions.length - 1
      )
      return {
        quiz: {
          ...state.quiz,
          currentQuestionIndex: nextIndex,
        },
      }
    })
  },

  previousQuestion: () => {
    set((state) => {
      if (!state.quiz) return state
      const prevIndex = Math.max(state.quiz.currentQuestionIndex - 1, 0)
      return {
        quiz: {
          ...state.quiz,
          currentQuestionIndex: prevIndex,
        },
      }
    })
  },

  goToQuestion: (index) => {
    set((state) => {
      if (!state.quiz) return state
      const safeIndex = Math.max(
        0,
        Math.min(index, state.quiz.questions.length - 1)
      )
      return {
        quiz: {
          ...state.quiz,
          currentQuestionIndex: safeIndex,
        },
      }
    })
  },

  submitQuiz: async () => {
    const { quiz } = get()
    if (!quiz || quiz.questions.length === 0) return null

    const machineId = quiz.questions[0]!.machineId
    const endTime = new Date()
    const timeSpent = quiz.startTime
      ? Math.floor((endTime.getTime() - quiz.startTime.getTime()) / 1000)
      : 0

    // Calculate results
    const answerResults: Record<string, { selected: number | string; correct: boolean }> = {}
    let correctCount = 0

    quiz.questions.forEach((question) => {
      const selected = quiz.answers[question.id]
      const isCorrect = selected === question.correctAnswer
      if (isCorrect) correctCount++
      answerResults[question.id] = {
        selected: selected ?? '',
        correct: isCorrect,
      }
    })

    const result: QuizResult = {
      machineId,
      score: correctCount,
      totalQuestions: quiz.questions.length,
      answers: answerResults,
      completedAt: endTime,
      timeSpent,
    }

    // Save to database
    try {
      const id = await db.saveQuizResult(result)
      result.id = id
      set((state) => ({
        quiz: state.quiz ? { ...state.quiz, isComplete: true } : null,
        results: [result, ...state.results],
      }))
      return result
    } catch (error) {
      console.error('Failed to save quiz result:', error)
      return null
    }
  },

  resetQuiz: () => set({ quiz: null }),

  loadResults: async (machineId) => {
    set({ isLoadingResults: true })
    try {
      const results = await db.getQuizResults(machineId)
      set({ results, isLoadingResults: false })
    } catch (error) {
      console.error('Failed to load quiz results:', error)
      set({ isLoadingResults: false })
    }
  },

  getCurrentQuestion: () => {
    const { quiz } = get()
    if (!quiz) return null
    return quiz.questions[quiz.currentQuestionIndex] ?? null
  },

  getProgress: () => {
    const { quiz } = get()
    if (!quiz) return { current: 0, total: 0, answered: 0 }
    return {
      current: quiz.currentQuestionIndex + 1,
      total: quiz.questions.length,
      answered: Object.keys(quiz.answers).length,
    }
  },

  calculateScore: () => {
    const { quiz } = get()
    if (!quiz) return { score: 0, total: 0, percentage: 0 }

    let correct = 0
    quiz.questions.forEach((question) => {
      if (quiz.answers[question.id] === question.correctAnswer) {
        correct++
      }
    })

    return {
      score: correct,
      total: quiz.questions.length,
      percentage: Math.round((correct / quiz.questions.length) * 100),
    }
  },
}))
