import type { QuizQuestion, MachineId } from '@/types'
import { v4EngineQuizzes } from './v4-engine'
import { droneQuizzes } from './drone'

export const quizQuestionsByMachine: Record<MachineId, QuizQuestion[]> = {
  'v4-engine': v4EngineQuizzes,
  'drone': droneQuizzes,
  'robot-arm': [],
  'robot-gripper': [],
  'suspension': [],
  'leaf-spring': [],
  'machine-vice': [],
}

export function getQuizQuestions(machineId: MachineId): QuizQuestion[] {
  return quizQuestionsByMachine[machineId] ?? []
}

export { v4EngineQuizzes, droneQuizzes }
